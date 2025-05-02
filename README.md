# 🌱 EcoBuddy – Application Mobile

EcoBuddy est une application mobile éducative qui aide les utilisateurs à mesurer et réduire leur empreinte carbone quotidienne. Développée avec **React Native (via Expo)**, **Zustand** pour la gestion d'état, et **Supabase** pour l'authentification et la persistance des données.
Pour le backend, cherchez le repos Ecobuddy MVP Back

---

## 📦 Stack Technique

- **Expo / React Native** (navigation, UI, animations)
- **Supabase** (authentification & base de données)
- **Zustand** (store local persistant)
- **TypeScript**
- **EAS** (préparation pour le build et le déploiement)

---

## 📁 Architecture

```bash
/ecobuddy
├── /src
│   ├── /components
│   │   ├── Background.tsx         # Background Terre qui tourne + fond
│   │   ├── Banner.tsx             # Banner
│   │   ├── Button.tsx             # Composant bouton réutilisable
│   │   ├── Cloud.tsx              # Nuage animé (utilisé dans le background)
│   │   ├── Menu.tsx               # Situé en bas, lien vers Profil, Défis, Classement
│   │   └── QuestionCard.tsx       # Gestion des swipes pour les questions
│   ├── /data
│   │   ├── questions.ts           # Liste des questions (à mettre en bdd plus tard)
│   ├── /hooks
│   │   ├── useSwipe.ts            # Hook sur le swipe
│   ├── /lib
│   │   ├── supabase.ts            # Gestion du client supabase
│   ├── /navigation
│   │   ├── AppNavigator.tsx       # Configuration de la navigation
│   ├── /screens
│   │   ├── CompleteRegistrationScreen.tsx # Ajouter un mdp à son compte
│   │   ├── LoginScreen.tsx         # Login
│   │   ├── NiveauScreen.tsx        # (Dernier Screen inscription) Screen qui donne le niveau et défis à réaliser
│   │   ├── QuestionnaireScreen.tsx # Écran principal pour le questionnaire (Ecran d'inscription)
│   │   ├── ResultsScreen.tsx       # Écran des résultats
│   │   ├── UserInfoScreen.tsx      # Écran intermédiaire d'inscription
│   │   └── WelcomeScreen.tsx       # (Optionnel) Écran d'accueil ou introduction
│   ├── /store
│   │   ├── userDataStore.ts        # Store Zustand qui gère les data utilisateur, reponses questionnaires ..
│   ├── /utils
│   │   ├── calculateCarbon.ts     # Algorithme de calcul de l'empreinte carbone
│   │   ├── constants.ts           # Facteurs d'émission et autres constantes
│   │   └── types.ts               # Contiens les différents types des objets utilisés
│   ├── /context
│   │   └── AuthContext.tsx        # Gestion de la session Utilisateur
│   ├── /assets
│   │   ├── /images                # Images (logos, icônes, etc.)
│   │   ├── /fonts                 # Polices personnalisées
│   │   └── /translations          # Traductions pour le multilingue
│   ├── /styles
│   │   └── globalStyles.ts        # Styles globaux pour tout le projet
│   ├── App.tsx                    # Point d'entrée principal
├── .env                           # Variables
├── package.json                   # Dépendances et scripts
├── tsconfig.json                  # Configuration TypeScript
├── README.md                      # Documentation
```

---

## ⚙️ Installation & Lancement

### 1. Prérequis

- Node.js
- Expo CLI (`npm install -g expo-cli`)
- Supabase en local (ou distant) déjà configuré

### 2. Cloner & Installer

```bash
git clone https://github.com/ton-org/ecobuddy.git
cd ecobuddy
npm install
```

### 3. Configurer .env

Copie le fichier `.env` :

```bash
cp .env.example .env
```

### 4. Lancer l'app

```bash
npm run web    # ou npm run ios / npm run android
```

---

## 🚀 Build Docker (Web uniquement)

Ce projet peut être dockerisé uniquement en mode web avec Expo :

#### Lancer frontend + backend

```bash
docker-compose up --build
```

## Lancer le serveur API en mode développement

```bash
npm run web
```

---
