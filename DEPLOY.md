# Guide de Déploiement : Ascend

Ce guide explique comment déployer le projet Ascend (Bot + Web) sur Railway.
Le projet est un Monorepo, nous allons donc créer **deux services distincts** sur Railway, un pour chaque dossier.

## 1. Prépartion

Assurez-vous que vos dernières modifications (incluant les fichiers `railway.json` dans `bot/` et `web/`) sont bien **pushées sur GitHub**.

## 2. Déployer le Bot (Service 1)

1.  Sur Railway, faites **New Project** > **Deploy from GitHub repo**.
2.  Choisissez le repo `AscendElement`.
3.  Une fois le service créé, allez dans **Settings**.
4.  Scrollez jusqu'à la section **Service**.
5.  Changez **Root Directory** pour : `/bot`.
6.  Allez dans l'onglet **Variables** et ajoutez :
    *   `BOT_TOKEN`: Votre token Telegram.
    *   `WEB_APP_URL`: Laissez vide pour l'instant ou mettez `https://google.com` (on le changera après).
7.  Railway va redéployer. Grâce au fichier `bot/railway.json`, il saura exactement quoi faire.

## 3. Déployer le Web (Service 2)

1.  Dans le même projet, cliquez sur le bouton **+ New** > **GitHub Repo**.
2.  Choisissez encore le repo `AscendElement`.
3.  Allez dans les **Settings** de ce nouveau service.
4.  Changez **Root Directory** pour : `/web`.
5.  Railway va redéployer le site.
6.  Allez dans l'onglet **Settings** > **Networking** et cliquez sur **Generate Domain** (ou Custom Domain).
    *   Notez cette URL (ex: `ascend-web.up.railway.app`).

## 4. Connecter les deux

1.  Copiez l'URL générée pour le site Web (avec `https://`).
2.  Retournez sur le service **Bot**.
3.  Dans **Variables**, mettez à jour `WEB_APP_URL` avec l'adresse du site.
4.  Redémarrez le Bot (bouton **Redeploy** ou via le menu commande).

## Dépannage

- Si vous voyez une erreur `npm error No workspaces found`, c'est que le **Root Directory** n'est pas correctement défini sur `/bot` ou `/web`.
- Les fichiers `railway.json` présents dans chaque dossier forcent les commandes `npm install`, `npm run build` et `npm start` à s'exécuter localement dans ces dossiers, ignorant le setup monorepo racine pour simplifier le déploiement.
