const Message = require("../models/Message");
const User = require("../models/User");

exports.createMessage = async (req, res) => {
  try {
    const currentUserId = req.userId;
    const { receiver, content } = req.body;

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

    const populatedMessage = await Message.findById(newMessage._id)
      .populate("sender", "name")
      .populate("receiver", "name");
    res.status(201).json({
      message: "Message envoyé avec succès",
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

    const messages = await Message.find({
      $or: [
        { sender: currentUserId, receiverId },
        { sender: receiverId, receiver: currentUserId },
      ],
    })
      .sort({ createdAt: 1 })
      .populate("sender", "_name")
      .populate("receiver", "name");

    res.status(200).json(messages);
  } catch (error) {
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
