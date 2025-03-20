const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Récupérer le token

  if (!token) {
    return res.status(401).json({ message: "Accès refusé, token manquant" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.UserId = decoded.UserId;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token invalide" });
  }
};
