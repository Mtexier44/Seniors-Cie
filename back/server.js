const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cors = require("cors");
const connectDB = require("./config/db");

const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const serviceRoutes = require("./routes/services");
const reviewRoutes = require("./routes/reviews");
const requestRoutes = require("./routes/requests");
const messageRoutes = require("./routes/messages");

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

connectDB();

app.get("/", (req, res) => {
  res.send("Bienvenue sur la plateforme d'entraide intergénérationnelle");
});

app.use("/api/users", userRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/auth", authRoutes);

app.listen(port, () => {
  console.log(`🚀 Serveur lancé sur le port ${port}`);
});
