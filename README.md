# Projet todoListVue Node.js + Vue.js

Ce projet est une application de type "todo list" utilisant Node.js pour le backend et Vue.js pour le frontend.

## Prérequis

Avant de commencer, assurez-vous d'avoir installé :
- [Node.js](https://nodejs.org/) (version recommandée : LTS)
- [npm](https://www.npmjs.com/)

## Installation

1. Clonez ce dépôt :
   ```sh
   git clone https://github.com/stardread/todoListVue.git
   cd todoListVue
   ```

2. Installez les dépendances du backend :
   ```sh
   cd ./todoListVueBack
   npm install
   ```

3. Installez les dépendances du frontend :
   ```sh
   cd ../todoListVueFront
   npm install
   ```
4. Importer les données dans une base MongoDB nommée "task" grâce au fichier "[todoList.task.json](https://github.com/stardread/todoListVue/blob/main/todoList.task.json)" 

## Démarrage

### Backend

1. Dans le dossier `todoListVueBack`, démarrez le serveur de développement démarrez le serveur :
   ```sh
   npm run dev
   ```

### Frontend

1. Dans le dossier `todoListVueFront`, démarrez le serveur de développement :
   ```sh
   npm run dev
   ```

L'application sera accessible à l'adresse indiquée dans la console (généralement `http://localhost:5173`).

## Technologies utilisées

- **Backend** : Node.js, Express
- **Frontend** : Vue.js, Vite, PrimeVue

