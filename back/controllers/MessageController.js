const Message = require("../models/Message");
const User = require("../models/User");
const mongoose = require("mongoose");

exports.createMessage = async (req, res) => {
  try {
    const currentUserId = req.userId;
    const { receiver, content } = req.body;

    if (!mongoose.Types.ObjectId.isValid(receiver)) {
      return res.status(400).json({ message: "ID de destinataire invalide" });
    }

    const receiverExists = await User.findById(receiver);
    if (!receiverExists) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    const newMessage = new Message({
      sender: currentUserId,
      receiver,
      content,
    });

    await newMessage.save();
    console.log("Message sauvegardé avec ID:", newMessage._id);

    const populatedMessage = await Message.findById(newMessage._id)
      .populate("sender", "_id firstName lastName email")
      .populate("receiver", "_id firstName lastName email");

    res.status(201).json({
      status: "Message envoyé avec succès",
      message: populatedMessage,
    });
  } catch (error) {
    console.error("Erreur création message:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const currentUserId = req.userId;
    const { receiverId } = req.params;

    console.log("getMessages - currentUserId:", currentUserId);
    console.log("getMessages - receiverId:", receiverId);

    if (!mongoose.Types.ObjectId.isValid(receiverId)) {
      console.log("ID de destinataire invalide:", receiverId);
      return res.status(400).json({ message: "ID de destinataire invalide" });
    }

    // Assurez-vous que currentUserId et receiverId sont des chaînes
    const currentUserIdString = String(currentUserId);
    const receiverIdString = String(receiverId);

    // Utilisez la signature correcte avec une chaîne
    let senderObjId;
    try {
      senderObjId = new mongoose.Types.ObjectId(currentUserIdString);
    } catch (err) {
      console.error("getMessages - Error creating sender ObjectId:", err);
      return res.status(500).json({ message: "Erreur interne du serveur" }); // Gérer l'erreur avec élégance
    }

    let receiverObjId;
    try {
      receiverObjId = new mongoose.Types.ObjectId(receiverIdString);
    } catch (err) {
      console.error("getMessages - Error creating receiver ObjectId:", err);
      return res.status(500).json({ message: "Erreur interne du serveur" }); // Gérer l'erreur avec élégance
    }

    console.log(
      "getMessages - Query (approche 1):",
      JSON.stringify({
        $or: [
          { sender: senderObjId, receiver: receiverObjId },
          { sender: receiverObjId, receiver: senderObjId },
        ],
      })
    );

    const allMessages = await Message.find({
      $or: [
        { sender: senderObjId, receiver: receiverObjId },
        { sender: receiverObjId, receiver: receiverObjId },
      ],
    })
      .sort({ createdAt: 1 })
      .populate("sender", "_id firstName lastName email")
      .populate("receiver", "_id firstName lastName email");

    if (allMessages.length === 0) {
      console.log(
        "getMessages - No messages found with approach 1, trying approach 2..."
      );

      const allUserMessages = await Message.find({
        $or: [{ sender: senderObjId }, { receiver: senderObjId }],
      })
        .populate("sender", "_id firstName lastName email")
        .populate("receiver", "_id firstName lastName email");

      console.log(
        "Messages où l'utilisateur actuel est impliqué:",
        allUserMessages.length
      );

      const conversationMessages = allUserMessages.filter(
        (msg) =>
          (msg.sender._id.toString() === currentUserId &&
            msg.receiver._id.toString() === receiverId) ||
          (msg.sender._id.toString() === receiverId &&
            msg.receiver._id.toString() === currentUserId)
      );

      console.log(
        "Messages après filtrage manuel:",
        conversationMessages.length
      );

      if (conversationMessages.length > 0) {
        return res.status(200).json(conversationMessages);
      }
    }

    console.log("Messages trouvés:", allMessages.length);
    res.status(200).json(allMessages);
  } catch (error) {
    console.error("Erreur récupération messages:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.getMessageById = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id)
      .populate("sender", "name")
      .populate("receiver", "name");

    if (!message) {
      return res.status(404).json({ message: "Message non trouvé" });
    }
    res.status(200).json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.markAsSeen = async (req, res) => {
  try {
    const updatedMessage = await Message.findByIdAndUpdate(
      req.params.id,
      { seen: true },
      { new: true }
    );

    if (!updatedMessage) {
      return res.status(404).json({ message: "Message non trouvé" });
    }

    res
      .status(200)
      .json({ message: "Message marqué comme vu", message: updatedMessage });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteMessage = async (req, res) => {
  try {
    const deletedMessage = await Message.findByIdAndDelete(req.params.id);
    if (!deletedMessage) {
      return res.status(404).json({ message: "Message non trouvé" });
    }
    res.status(200).json({ message: "Message supprimé" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUserConversations = async (req, res) => {
  try {
    console.log("getUserConversations appelé");
    console.log("req.userId:", req.userId);

    // Convertir l'ID en string
    const userIdString = String(req.userId);

    // Créer l'ObjectId avec new
    let userObjId;
    try {
      userObjId = new mongoose.Types.ObjectId(userIdString);
    } catch (err) {
      console.error(
        "getUserConversations - Error creating user ObjectId:",
        err
      );
      return res.status(500).json({ message: "Erreur interne du serveur" });
    }

    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [{ sender: userObjId }, { receiver: userObjId }],
        },
      },
      {
        $group: {
          _id: {
            $cond: {
              if: { $eq: ["$sender", userObjId] },
              then: "$receiver",
              else: "$sender",
            },
          },
          lastMessage: { $last: "$content" },
          lastMessageDate: { $last: "$createdAt" },
          unreadCount: {
            $sum: {
              $cond: {
                if: {
                  $and: [
                    { $eq: ["$receiver", userObjId] },
                    { $eq: ["$seen", false] },
                  ],
                },
                then: 1,
                else: 0,
              },
            },
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $project: {
          _id: 1, // Garder l'ID original
          userId: "$user._id",
          name: { $concat: ["$user.firstName", " ", "$user.lastName"] },
          lastMessage: 1,
          lastMessageDate: 1,
          unreadCount: 1,
          avatar: "$user.avatar",
        },
      },
    ]);

    console.log("Conversations récupérées:", conversations);
    res.json(conversations);
  } catch (error) {
    console.error("Erreur dans getUserConversations:", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};
