const User = require("../models/User");

exports.getUsers = async (req, res) => {
  const users = await User.find();
  res.json(users);
};

exports.createUsers = async (req, res) => {
  console.log(req.body);
  const newUser = new User(req.body);
  await newUser.save();
  res.status(201).json(newUser);
};

exports.updateUsers = async (req, res) => {
  try {
    console.log("Données reçues pour la mise à jour:", req.body);

    const userId = req.userId;
    if (!userId) {
      return res.status(400).json({ message: "Utilisateur non trouvé" });
    }

    const updateData = {};
    Object.keys(req.body).forEach((key) => {
      if (req.body[key] !== "" && req.body[key] !== null) {
        updateData[key] = req.body[key];
      }
    });

    console.log("Données filtrées pour la mise à jour:", updateData);

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    res.json(updatedUser);
  } catch (error) {
    console.error("Erreur de mise à jour de l'utilisateur:", error);
    res
      .status(500)
      .json({ message: "Erreur du serveur", error: error.message });
  }
};

exports.deleteUsers = async (req, res) => {
  try {
    const { id } = req.params;

    const deleteUsers = await User.findByIdAndDelete(id);

    if (!deleteUsers) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    res.json({ message: "Utilisateur supprimé avec succès" });
  } catch (error) {
    console.error("Erreur de suppression de l'utlisateur: ", error);
    res.status(500).json({ message: "Erreur du serveur" });
  }
};

exports.getMe = async (req, res) => {
  try {
    const users = await User.findById(req.userId).select("-password");
    if (!users) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
