#!/usr/bin/env bash
# Publish SSHD1014 course site to GitHub Pages.
# Repo: https://github.com/Lazaruschan/2026-1-SSHD1014-FUNDAMENTAL-VISUALISATION-SKILLS-Group-A03-
#
# Usage:
#   cd Github/SSHD1014
#   ./publish.sh
#
# Use a GitHub Personal Access Token when asked for "Password" (not your account password).
# After push: Settings → Pages → Deploy from branch → main / (root)

set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT"

REPO_URL="https://github.com/Lazaruschan/2026-1-SSHD1014-FUNDAMENTAL-VISUALISATION-SKILLS-Group-A03-.git"
BRANCH="main"
REMOTE="origin"

echo "==> Publishing from: $ROOT"
echo "==> Target: $REPO_URL"

if ! command -v git >/dev/null 2>&1; then
  echo "Error: git is not installed. Install Xcode CLT or Git first."
  exit 1
fi

if [[ ! -d .git ]]; then
  echo "==> git init"
  git init
fi

# Block publish while a rebase/merge is unfinished.
if [[ -d .git/rebase-merge || -d .git/rebase-apply || -f .git/MERGE_HEAD ]]; then
  echo "Error: git rebase/merge in progress. Finish it (git rebase --continue) or abort (git rebase --abort), then re-run."
  exit 1
fi

# Keep ignore list current
cat > .gitignore <<'EOF'
node_modules/
.DS_Store
*.log
*.rtf
start.rtf
.env
.env.*
*token*
*secret*
EOF

# Remove secret-prone files from disk if present
rm -f start.rtf *.rtf 2>/dev/null || true

echo "==> Staging site files only (explicit allow-list)"
TO_ADD=(
  .gitignore
  .nojekyll
  index.html
  auth.js
  assets
  slides
  publish.sh
  export-slides.sh
  embed-slide-assets.py
  package.json
  package-lock.json
)
# README may be absent if remote deleted it; only stage when present.
[[ -f README.md ]] && TO_ADD+=(README.md)
git add --force "${TO_ADD[@]}"

# Never publish secrets / tooling junk
git rm -r --cached node_modules 2>/dev/null || true
git rm --cached start.rtf 2>/dev/null || true
git rm --cached -f *.rtf 2>/dev/null || true

echo "==> Staged files:"
git status --short | head -80

if git diff --cached --quiet; then
  if ! git rev-parse HEAD >/dev/null 2>&1; then
    echo "Error: nothing to commit and no previous commits."
    exit 1
  fi
  echo "==> No new changes; will push existing commits."
else
  echo "==> Committing"
  git commit -m "$(cat <<'EOF'
Publish SSHD1014 Fundamental Visualisation Skills course website.

EOF
)"
fi

git branch -M "$BRANCH"

if git remote get-url "$REMOTE" >/dev/null 2>&1; then
  echo "==> Updating remote $REMOTE"
  git remote set-url "$REMOTE" "$REPO_URL"
else
  echo "==> Adding remote $REMOTE"
  git remote add "$REMOTE" "$REPO_URL"
fi

echo "==> Syncing with $REMOTE/$BRANCH"
git fetch "$REMOTE" "$BRANCH"
BEHIND="$(git rev-list --count HEAD.."$REMOTE/$BRANCH" 2>/dev/null || echo 0)"
if [[ "$BEHIND" != "0" ]]; then
  echo "==> Remote is ahead by $BEHIND commit(s); rebasing onto $REMOTE/$BRANCH"
  git rebase "$REMOTE/$BRANCH"
fi

echo "==> Pushing to $REMOTE/$BRANCH"
git push -u "$REMOTE" "$BRANCH"

PAGES_URL="https://lazaruschan.github.io/2026-1-SSHD1014-FUNDAMENTAL-VISUALISATION-SKILLS-Group-A03-/"
echo ""
echo "Done."
echo "Enable Pages (once): repo Settings → Pages → Deploy from branch → main / (root)"
echo "Site URL: $PAGES_URL"
echo "Site password: 20261014"
