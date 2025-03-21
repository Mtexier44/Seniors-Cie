const { MongoClient } = require("mongodb");

// URL de connexion MongoDB (remplace par ton propre mot de passe)
const url =
  "mongodb+srv://daph2022:zVCfScwhlHLdlCaH@cluster0.mulcp.mongodb.net";
const client = new MongoClient(url);

// Nom de la base de données
const dbName = "database";

async function main() {
  try {
    // Connexion à la base de données
    await client.connect();
    console.log("✅ Connecté avec succès à MongoDB");

    const db = client.db(dbName);
    const collection = db.collection("users");

    // Données à insérer
    const newUser = {
      firstName: "Joe",
      lastName: "Doe",
      email: "johndoe@example.com",
      birthdate: "1990-05-15",
      sexe: "M",
    };

    // Insertion d'un utilisateur
    const result = await collection.insertOne(newUser);
    console.log("✅ Utilisateur inséré avec ID :", result.insertedId);
  } catch (error) {
    console.error("❌ Erreur lors de l'insertion :", error);
  } finally {
    // Fermeture de la connexion
    await client.close();
    console.log("🔒 Connexion fermée");
  }
}

// Exécuter la fonction
main();
