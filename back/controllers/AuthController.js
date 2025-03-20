const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.signup = async (req, res) => {
  try {
    console.log("Données reçues:", req.body);
    const { firstName, lastName, email, password, role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "L'utilisateur existe déjà" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role,
    });

    await newUser.save();

    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(201).json({
      message: "Utilisateur créé avec succès",
      token,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      console.log("Utilisateur non trouvé pour l'email", email);
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      console.log("Mot de passe incorrect pour l'utilisateur", email);
      return res.status(400).json({ message: "Mot de passe incorrect" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({
      message: "Connexion réussie",
      token,
    });
  } catch (error) {
    console.log("Erreur serveur", error);
    res.status(500).json({ error: error.message });
  }
};

exports.logout = (req, res) => {
  try {
    res.status(200).json({ message: "Déconnexion réussie" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
