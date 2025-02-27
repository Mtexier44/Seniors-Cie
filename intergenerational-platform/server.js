const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const userRoutes = require('./routes/users');
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
  res.send('Bienvenue sur la plateforme d\'entraide intergénérationnelle');
});

app.listen(port, () => {
  console.log(`Le serveur écoute sur le port ${port}`);
});
