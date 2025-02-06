# Plateforme d’Entraide Intergénérationnelle avec Système d’Alerte

## Description

Le projet **Plateforme d’Entraide Intergénérationnelle** permet de connecter des **bénévoles** (jeunes ou adultes) avec des **personnes âgées** ayant besoin d’aide pour des tâches quotidiennes telles que faire les courses, effectuer des tâches ménagères, ou recevoir un accompagnement numérique.

Un **système d’alerte automatique** est intégré pour détecter **une absence de mouvement prolongée** ou **une inactivité dans l’application**, en envoyant une alerte aux **proches ou bénévoles**.

## Fonctionnalités

- **Gestion des utilisateurs** : Création de profils pour les bénévoles et seniors.
- **Planification des services** : Gestion d'un agenda partagé pour les rendez-vous d’aide.
- **Matching des bénévoles** : Proposition de bénévoles en fonction de la proximité géographique, des disponibilités et des compétences.
- **Système de messagerie sécurisé** : Communication entre bénévoles et seniors via chat ou messages vocaux.
- **Notifications et rappels** : Envoi automatique de rappels pour les rendez-vous.
- **Système d’alerte automatique** : Détection d'inactivité prolongée et envoi d'alertes aux proches ou bénévoles.
- **Localisation des bénévoles** : Carte interactive pour trouver les bénévoles disponibles proches de l'utilisateur.
- **Évaluation et confiance** : Les seniors peuvent noter et laisser des avis sur les bénévoles.

## Technologies

- **Backend** : Node.js (Express) / Go / Django
- **Frontend** : React.js / Vue.js (web), Flutter / React Native (mobile)
- **Base de données** : PostgreSQL / MySQL
- **Communication en temps réel** : WebSockets pour la messagerie instantanée et les alertes
- **Geolocalisation** : Google Maps API pour la localisation des bénévoles
- **Capteurs IoT (optionnel)** : Capteurs de mouvement pour la détection d'inactivité (ex : pour la maison des seniors)
- **Système d’alertes** : Notifications en temps réel via SMS / Email / Notifications push

## Fonctionnalités détaillées

### 1. **Gestion des utilisateurs**
Les bénévoles et seniors peuvent s'inscrire, se connecter et gérer leur profil avec des informations de contact, des préférences de service et des disponibilités.

### 2. **Planification des services**
Les seniors peuvent créer des demandes d’aide, et les bénévoles peuvent accepter ou refuser ces demandes. L’application gère également un agenda partagé pour suivre les rendez-vous.

### 3. **Matching des bénévoles**
Un algorithme de matching recommande les bénévoles en fonction de leur proximité géographique, de leurs compétences, de leurs évaluations et de leurs disponibilités.

### 4. **Système de messagerie sécurisé**
Un système de messagerie permet aux seniors et bénévoles de communiquer facilement. Des messages vocaux peuvent être envoyés pour faciliter la communication, en particulier pour les seniors ayant des difficultés à taper sur un clavier.

### 5. **Notifications et rappels**
Les utilisateurs reçoivent des notifications automatiques avant chaque service, ainsi que des rappels en cas de changement de programme. En cas d’absence prolongée d’un senior, une alerte est envoyée à ses proches.

### 6. **Système d’alerte automatique**
Le système détecte l'absence d'activité prolongée dans l'application, qu'il s'agisse d'absence de réponse aux messages ou d'absence de connexion. Si une alerte est déclenchée, elle est envoyée aux proches ou bénévoles pour vérifier que tout va bien.

### 7. **Localisation des bénévoles**
Les bénévoles sont géolocalisés sur une carte interactive, ce qui permet aux seniors de trouver facilement des bénévoles dans leur région.

### 8. **Évaluation des bénévoles**
Les seniors peuvent laisser des évaluations et des avis après chaque intervention. Cela permet de garantir une qualité de service optimale et de renforcer la confiance dans la plateforme.

## Installation

### Prérequis

- Node.js (pour le backend)
- PostgreSQL ou MySQL (pour la base de données)
- React.js / Vue.js (pour le frontend web)
- Flutter / React Native (pour le frontend mobile)
- WebSocket pour la communication en temps réel

### Cloner le projet

1. Clonez le repository avec la commande suivante :
```bash
git clone https://github.com/Mtexier44/Seniors-Cie.git
