# Portfolio Enzo Morelli

Portfolio professionnel d'Enzo Morelli — étudiant en BUT GEII à l'IUT de Tarbes.

## 🚀 Déploiement sur Vercel

1. Push ce dossier sur GitHub  
2. Importer le repo sur [vercel.com](https://vercel.com)  
3. **Framework Preset** : `Other`  
4. **Root Directory** : `./` (ou le sous-dossier si nécessaire)  
5. Cliquer **Deploy** — c'est tout !

## 📁 Structure

```
portfolio-morelli/
├── index.html        # SPA complète (toutes sections)
├── style.css         # Dark mode, accents rouges
├── script.js         # Canvas, modales, animations
├── vercel.json       # Config déploiement
└── images/
    ├── hero_bg.png
    ├── project_drone.png
    ├── project_robot.png
    └── project_soudure.png
```

## 📸 Remplacer les images

Pour utiliser tes vraies photos depuis le PDF, remplace les fichiers dans `images/` :

| Fichier          | Remplace par                                |
|------------------|---------------------------------------------|
| `project_robot.png`    | Photo du robot mobile (capteurs, roues)   |
| `project_drone.png`    | Photo du drone RYZE Tello                 |
| `project_soudure.png`  | Photo de la carte PCB ou armoire élec.    |

Garde les mêmes noms de fichiers pour ne rien casser.

## 🌐 Sections

- **Accueil** — Hero avec canvas animé, stats, CTA
- **Mon Parcours** — Formation + Expériences en timeline
- **Mes Projets** — 4 cartes interactives avec modales détaillées
- **Compétences** — Hard skills GEII + Soft skills + Centres d'intérêt
- **Contact** — Coordonnées + CTA

## ✏️ Modifier le contenu

Tout le contenu est dans `index.html`. Recherche les sections avec les commentaires `<!-- ===== NOM ===== -->`.
