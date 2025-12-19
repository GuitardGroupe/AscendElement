# Déployer Ascend sur Railway

Ce projet est un monorepo contenant deux applications distinctes :
1.  `bot` : Le bot Telegram (Node.js/TypeScript).
2.  `web` : L'application web (Next.js).

Pour déployer correctement sur Railway, vous devez créer **deux services distincts** à partir du même dépôt GitHub.

## Prérequis

1.  Avoir un compte sur [Railway](https://railway.app/).
2.  Avoir connecté votre compte GitHub à Railway.

## Étape 1 : Déployer le Bot

1.  Sur votre Dashboard Railway, cliquez sur **New Project** > **Deploy from GitHub repo**.
2.  Sélectionnez le repo `AscendElement`.
3.  Une fois le service ajouté, cliquez dessus pour aller dans **Settings**.
4.  Dans la section **Service** > **Root Directory**, entrez : `/bot`.
5.  Dans la section **Variables**, ajoutez :
    *   `BOT_TOKEN`: Votre token de bot Telegram (obtenu via @BotFather).
    *   `WEB_APP_URL`: L'URL de votre application web (que nous allons obtenir à l'étape suivante, vous pourrez revenir la mettre à jour).
    *   `NODE_ENV`: `production`
6.  Railway devrait détecter automatiquement le fichier `package.json` dans le dossier `/bot` et lancer la commande de build (`tsc`) et de start (`node dist/index.js`).

## Étape 2 : Déployer l'App Web

1.  Dans le même projet Railway, cliquez sur **+ New** > **GitHub Repo**.
2.  Sélectionnez à nouveau le même repo `AscendElement`.
3.  Cliquez sur ce nouveau service pour aller dans **Settings**.
4.  Dans la section **Service** > **Root Directory**, entrez : `/web`.
5.  Railway devrait détecter automatiquement qu'il s'agit d'une application Next.js et configurer le build.
6.  Une fois déployé, allez dans l'onglet **Settings** > **Networking** et générez un domaine (ex: `ascend-web.up.railway.app`).

## Étape 3 : Finalisation

1.  Copiez l'URL de votre App Web générée à l'étape 2.
2.  Retournez dans le service **Bot** > **Variables**.
3.  Mettez à jour `WEB_APP_URL` avec cette URL.
4.  Redémarrez le service Bot si nécessaire.

## Commandes Utiles

Pour tester localement :
- `npm run dev:bot` : Lance le bot en dev.
- `npm run dev:web` : Lance le site en dev.
