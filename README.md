# CasaQ Sites — Next.js

Frontend public multi-sites pour les agences immobilières CasaQ.  
Consomme l'API Symfony CasaQ pour récupérer les agences, biens, templates et configurations.

Un seul projet Next.js permet de faire tourner plusieurs sites agences avec des domaines différents.

---

## Stack

- **Next.js 16** — framework React avec App Router
- **Tailwind CSS** — styles
- **TypeScript** — typage
- **Hébergement** — Infomaniak Node.js sur `sites.casaq.ch`
- **API** — Symfony CasaQ
- **GitHub** — versioning

---

## Accès serveurs

| Quoi | Détail |
|------|--------|
| Site public | https://sites.casaq.ch |
| Preview Infomaniak | https://upq1pcwwcnq.preview.hosting-ik.com |
| Admin CasaQ | À définir |
| API CasaQ | À définir |
| SSH Infomaniak | `ssh cBQSuYH4PSD_sitecasaq@57-111919.ssh.hosting-ik.com` |
| Dossier serveur | `/sites-casaq` |
| GitHub | https://github.com/PomzedCommunication/sites-casaq |
| Panel Infomaniak | https://manager.infomaniak.com |

---

## Concept

CasaQ Sites est une plateforme multi-tenant.

Quand un visiteur arrive sur un domaine agence, par exemple :

```txt
novimmob.ch
```

Next.js détecte le domaine, appelle l'API CasaQ, récupère la configuration de l'agence et affiche le bon site.

Chaque agence peut avoir :

- son domaine
- son logo
- ses couleurs
- son template
- ses textes
- ses coordonnées
- ses courtiers
- ses biens
- ses pages actives

---

## Démarrer le matin localement

### 1. Vérifier Node.js

```powershell
node --version
npm --version
```

### 2. Ouvrir le projet

```txt
File → Open → C:\projects\sites-casaq
```

### 3. Lancer le projet

```powershell
cd C:\projects\sites-casaq
npm run dev
```

Ouvrir :

```txt
http://localhost:3000
```

---

## Workflow quotidien

### Développer

1. Modifier les fichiers dans PhpStorm
2. Sauvegarder `Ctrl+S`
3. Vérifier sur `http://localhost:3000`
4. Tester le build avant push

```powershell
npm run build
```

### Déployer sur sites.casaq.ch

```powershell
# 1. Committer et pusher depuis le PC local
git add .
git commit -m "description de ce que vous avez fait"
git push origin main
```

```bash
# 2. Se connecter en SSH
ssh cBQSuYH4PSD_sitecasaq@57-111919.ssh.hosting-ik.com

# 3. Puller et builder
cd ~/sites-casaq
git pull origin main
npm ci
npm run build
```

```bash
# Si Git bloque à cause de modifications locales
cd /sites-casaq
git reset --hard
git fetch origin
git reset --hard origin/main
npm ci
npm run build
```

```txt
# 4. Panel Infomaniak
→ manager.infomaniak.com
→ Hébergement
→ Sites
→ sites.casaq.ch
→ Node.js
→ Construction / Application
→ Lancer ou Redémarrer
→ Vérifier sur https://sites.casaq.ch
```

---

## Paramètres Infomaniak

Dossier du projet :

```txt
/sites-casaq
```

Commande de build :

```bash
npm ci && npm run build
```

Commande de démarrage :

```bash
npm run start
```

Version Node.js recommandée :

```txt
Node.js 20 LTS ou Node.js 22 LTS
```

---

## Structure du projet

```txt
sites-casaq/
├── app/
│   ├── api/
│   │   └── health/
│   │       └── route.ts
│   ├── layout.tsx
│   ├── page.tsx
│   ├── biens/
│   │   ├── page.tsx
│   │   └── [reference]/page.tsx
│   ├── agence/page.tsx
│   ├── equipe/page.tsx
│   ├── contact/page.tsx
│   ├── blog/page.tsx
│   └── estimation/page.tsx
├── lib/
│   ├── api.ts
│   ├── config.ts
│   └── seo.ts
├── components/
│   ├── layout/
│   ├── shared/
│   └── templates/
├── public/
├── .env.local
├── next.config.ts
├── tsconfig.json
└── package.json
```

---

## Variables d'environnement

Fichier `.env.local` à la racine, jamais sur GitHub :

```env
CASAQ_API_URL=https://app.casaq.ch
CASAQ_REVALIDATE_SECRET=changer_ce_secret
NEXT_PUBLIC_SITE_URL=https://sites.casaq.ch
```

En local :

```env
CASAQ_API_URL=https://app.casaq.ch
CASAQ_REVALIDATE_SECRET=dev_secret
NEXT_PUBLIC_SITE_URL=http://localhost:3000 
```

---

## Commandes utiles

```powershell
npm run dev      # Démarrer en dev → localhost:3000
npm run build    # Builder pour production
npm run start    # Démarrer en production après build
npm run lint     # Vérifier le code si disponible
npm ci           # Installer proprement les dépendances
```

---

## Pages prévues

| Route | Description |
|------|-------------|
| `/` | Accueil |
| `/biens` | Liste des biens |
| `/biens/[reference]` | Fiche bien |
| `/agence` | Présentation agence |
| `/equipe` | Courtiers |
| `/contact` | Formulaire |
| `/blog` | Optionnel |
| `/estimation` | Optionnel |

---

## API de santé

```txt
/api/health
```

Réponse attendue :

```json
{
  "ok": true,
  "service": "sites-casaq",
  "timestamp": "2025-01-01T00:00:00.000Z"
}
```

---

## Revalidation ISR

Principe :

```txt
Un bien est modifié dans CasaQ
↓
CasaQ envoie un webhook à Next.js
↓
Next.js revalide uniquement la page ou le tag concerné
↓
Le site est mis à jour sans rebuild complet
```

---

## SEO

Chaque site agence doit générer :

- `title`
- `description`
- Open Graph
- JSON-LD Schema.org
- sitemap dynamique
- robots.txt
- URLs propres

Exemple :

```txt
/biens/CQ-2025-0042-appartement-4p-lausanne
```

---

## Ajouter une agence

1. Créer la configuration agence dans CasaQ
2. Définir le domaine
3. Choisir un template
4. Définir couleurs, logo, textes et coordonnées
5. Activer les pages nécessaires
6. Faire pointer le domaine vers `sites.casaq.ch`

Exemple :

```txt
novimmob.ch → sites.casaq.ch
```

---

## Ajouter un template

Créer un fichier :

```txt
components/templates/TemplatePremium.tsx
```

Puis l’ajouter au registry des templates.

---

## En cas de problème

**Le site ne se met pas à jour après deploy :**

```bash
cd /sites-casaq
git status
git pull origin main
npm ci
npm run build
```

Puis relancer depuis le panel Infomaniak.

**Le build échoue :**

Corriger en local, puis :

```powershell
git add .
git commit -m "fix build"
git push origin main
```

Puis sur le serveur :

```bash
cd /sites-casaq
git pull origin main
npm ci
npm run build
```

**Problème de dépendances :**

```bash
rm -rf node_modules
npm ci
npm run build
```

**Problème de cache Next.js :**

```bash
rm -rf .next
npm run build
```

**Port 3000 déjà utilisé en local :**

```powershell
npm run dev -- -p 3001
```

Ouvrir :

```txt
http://localhost:3001
```

---

## Déploiement automatique sans coupure

Objectif final :

```txt
git push origin main
↓
GitHub webhook
↓
préparation d'une nouvelle version
↓
npm ci
↓
npm run build
↓
si build OK : activation
↓
si build KO : ancienne version conservée
```

Structure cible :

```txt
/sites-casaq-current
/sites-casaq-releases/
```

Le site ne doit jamais builder directement dans la version active.

---

## Notes

CasaQ reste la source de vérité pour :

- agences
- biens
- domaines
- couleurs
- logos
- textes
- templates
- pages actives

Next.js génère les sites publics rapides, SEO et personnalisés par agence.