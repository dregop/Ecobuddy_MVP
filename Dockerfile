FROM node:23-slim

# Installer Expo CLI globalement
RUN npm install -g expo-cli

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Lancer en mode web
CMD ["npx", "expo", "start", "--web"]
