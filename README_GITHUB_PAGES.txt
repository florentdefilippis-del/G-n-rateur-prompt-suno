Suno GMVP Studio — publication gratuite avec GitHub Pages

Depuis un téléphone Android :
1. Crée/connecte-toi à un compte GitHub.
2. Crée un nouveau dépôt public, par exemple "suno-gmvp-studio".
3. Décompresse ce ZIP.
4. Envoie tous les fichiers dans le dépôt, en conservant ".github/workflows/deploy.yml".
5. Va dans Settings > Pages.
6. Dans "Build and deployment", sélectionne "GitHub Actions".
7. Attends la fin de l'action "Deploy Suno GMVP Studio".
8. GitHub affichera l'adresse HTTPS de l'application.
9. Ouvre cette adresse dans Chrome > ⋮ > "Installer l'application" / "Ajouter à l'écran d'accueil".

Important :
- L'URL doit être en HTTPS pour que le service worker/PWA fonctionne normalement.
- Cette version est la version web mobile du générateur.
- Une clé API OpenAI ne doit jamais être placée dans les fichiers JavaScript publics.
