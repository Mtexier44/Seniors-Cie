const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Accès refusé, token manquant" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Token décodé:", decoded);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token invalide" });
  }
};
