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
    const { id } = req.params;
    const updateUsers = await User.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updateUsers) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    res.json(updateUsers);
  } catch (error) {
    console.error("Erreur de mise à jour de l'utilisateur:", error);
    res.status(500).json({ message: "Erreur du serveur" });
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
    const users = await User.findById(req.UserId).select("-password");
    if (!users) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
