# SHDH1014 Fundamental Visualisation Skills — Course Website

PolyU CPCE / HKCC · Semester One 2026/2027  
Subject Leader: Woody LEE · Subject Lecturer: CHAN, Long-fung Lazarus

Static site ready for **GitHub Pages**. Lecture HTML (weeks 1–11) is **self-contained** (images embedded as base64). Weeks 12–13 are consultation / final presentation — no lecture decks are published.

## Password gate

The whole site (home + slides) asks for a password before content is shown.

- **Password:** `20261014`
- Unlock lasts for the browser tab session (`sessionStorage`).
- This is **client-side only** (suitable for casual course access, not strong security).

To change the password, edit `PASSWORD_HASH` in [`auth.js`](auth.js):

```bash
python3 -c "import hashlib; print(hashlib.sha256(b'YOUR_PASSWORD').hexdigest())"
```

## Publish with script (Mac)

```bash
cd Github/SSHD1014
./publish.sh
```

Pushes to [2026-1-SSHD1014-FUNDAMENTAL-VISUALISATION-SKILLS-Group-A01-](https://github.com/Lazaruschan/2026-1-SSHD1014-FUNDAMENTAL-VISUALISATION-SKILLS-Group-A01-). Sign in if Git prompts you. Then enable Pages once: **Settings → Pages → main / (root)**.

## Publish on GitHub Pages (simplest)

1. Create a new empty GitHub repository (e.g. `2026-1-SSHD1014-FUNDAMENTAL-VISUALISATION-SKILLS-Group-A01-`).
2. Upload **the contents of this folder** as the repo root (not the parent `Github/` folder).
   - Include: `index.html`, `auth.js`, `.nojekyll`, `assets/`, `slides/`, `README.md`
   - Do **not** upload `node_modules/`
3. In the repo: **Settings → Pages → Build and deployment**
   - Source: **Deploy from a branch**
   - Branch: `main` (or `master`), folder: **/ (root)**
4. Wait a minute, then open `https://<user>.github.io/<repo>/`

`.nojekyll` is included so GitHub Pages serves files as-is (no Jekyll processing).

### Via git (optional)

```bash
cd Github/SSHD1014
git init
git add index.html auth.js .nojekyll .gitignore README.md assets slides
# optional tooling (not required for Pages):
# git add export-slides.sh embed-slide-assets.py package.json package-lock.json
git commit -m "Publish SHDH1014 Fundamental Visualisation Skills course site"
git branch -M main
git remote add origin https://github.com/<USER>/2026-1-SSHD1014-FUNDAMENTAL-VISUALISATION-SKILLS-Group-A01-.git
git push -u origin main
```

Then enable Pages as above.

## Open locally

Open [`index.html`](index.html) in a browser, or:

```bash
cd Github/SSHD1014
python3 -m http.server 8080
```

Visit `http://localhost:8080`.

- Lecture decks: [`slides/week-01.html`](slides/week-01.html) … [`slides/week-11.html`](slides/week-11.html)
- Briefs: [`assets/briefs/`](assets/briefs/)

## Rebuild slides from Marp sources (maintainers)

Requires Node (nvm) and source files under `Notes/Fundamental_Visualisation_Skills_MID/Fundamental_Visualisation_Skills_MID/`.

```bash
cd Github/SSHD1014
npm install
./export-slides.sh
```

This regenerates weeks 1–11, embeds local images into the HTML, and removes any temporary `slides/images` folder.

## Site structure (publish)

```
SSHD1014/
  index.html
  auth.js                 Password gate (required)
  .nojekyll
  .gitignore
  README.md
  assets/briefs/          Assessment PDFs
  slides/
    week-01.html … week-11.html   (self-contained)
```

The reusable blank template for other courses is [`../template.html`](../template.html).
