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

# #region agent log
DEBUG_LOG="/Users/lazarus/Library/CloudStorage/OneDrive-Personal/0. 21_Education/SSHD1014 Fundamental Visualisation Skills/Github/.cursor/debug-aeedf1.log"
_dbg() {
  local hyp="$1" loc="$2" msg="$3" data="$4"
  printf '{"sessionId":"aeedf1","runId":"%s","hypothesisId":"%s","location":"%s","message":"%s","data":%s,"timestamp":%s}\n' \
    "${DEBUG_RUN_ID:-pre-fix}" "$hyp" "$loc" "$msg" "$data" "$(date +%s000)" >> "$DEBUG_LOG" 2>/dev/null || true
}
_dbg "B" "publish.sh:entry" "publish started" "{\"cwd\":\"$ROOT\",\"rebaseMerge\":$([ -d .git/rebase-merge ] && echo true || echo false),\"rebaseApply\":$([ -d .git/rebase-apply ] && echo true || echo false),\"mergeHead\":$([ -f .git/MERGE_HEAD ] && echo true || echo false),\"headRef\":\"$(git symbolic-ref -q HEAD 2>/dev/null || echo detached)\",\"headSha\":\"$(git rev-parse HEAD 2>/dev/null || echo none)\"}"
# #endregion

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

# Block publish while a rebase/merge is unfinished (root cause of stuck publish).
if [[ -d .git/rebase-merge || -d .git/rebase-apply || -f .git/MERGE_HEAD ]]; then
  # #region agent log
  _dbg "B" "publish.sh:guard" "blocked by unfinished rebase/merge" "{\"rebaseMerge\":$([ -d .git/rebase-merge ] && echo true || echo false),\"mergeHead\":$([ -f .git/MERGE_HEAD ] && echo true || echo false)}"
  # #endregion
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

# #region agent log
git fetch "$REMOTE" "$BRANCH" 2>/tmp/publish-fetch-err.$$ || true
REMOTE_SHA="$(git rev-parse "$REMOTE/$BRANCH" 2>/dev/null || echo missing)"
LOCAL_SHA="$(git rev-parse HEAD 2>/dev/null || echo missing)"
AHEAD="$(git rev-list --count "$REMOTE/$BRANCH"..HEAD 2>/dev/null || echo -1)"
BEHIND="$(git rev-list --count HEAD.."$REMOTE/$BRANCH" 2>/dev/null || echo -1)"
MB="$(git merge-base HEAD "$REMOTE/$BRANCH" 2>/dev/null || echo none)"
REMOTE_TIP_MSG="$(git log -1 --pretty=%s "$REMOTE/$BRANCH" 2>/dev/null | sed 's/"/\\"/g' || echo none)"
PUBLISH_ON_REMOTE=false
[[ -n "$(git ls-tree -r --name-only "$REMOTE/$BRANCH" -- publish.sh 2>/dev/null | head -1 || true)" ]] && PUBLISH_ON_REMOTE=true
UNMERGED="$(git ls-files -u 2>/dev/null | wc -l | tr -d ' ')"
_dbg "A" "publish.sh:pre-push" "divergence check" "{\"localSha\":\"$LOCAL_SHA\",\"remoteSha\":\"$REMOTE_SHA\",\"ahead\":$AHEAD,\"behind\":$BEHIND,\"mergeBase\":\"$MB\",\"remoteTipMsg\":\"$REMOTE_TIP_MSG\",\"publishOnRemote\":$PUBLISH_ON_REMOTE,\"unmergedCount\":$UNMERGED}"
_dbg "C" "publish.sh:pre-push" "publish.sh remote presence" "{\"publishOnRemote\":$PUBLISH_ON_REMOTE,\"remoteTipMsg\":\"$REMOTE_TIP_MSG\"}"
_dbg "D" "publish.sh:pre-push" "tracking freshness" "{\"fetchErr\":\"$(tr '\n' ' ' </tmp/publish-fetch-err.$$ 2>/dev/null | sed 's/"/\\"/g')\",\"remoteSha\":\"$REMOTE_SHA\"}"
rm -f /tmp/publish-fetch-err.$$ 2>/dev/null || true
# #endregion

# Integrate remote commits before push (fixes non-fast-forward rejection).
if [[ "$BEHIND" != "0" && "$BEHIND" != "-1" && "$REMOTE_SHA" != "missing" ]]; then
  echo "==> Remote is ahead by $BEHIND commit(s); rebasing onto $REMOTE/$BRANCH"
  # #region agent log
  _dbg "E" "publish.sh:integrate" "rebasing onto remote before push" "{\"behind\":$BEHIND,\"remoteSha\":\"$REMOTE_SHA\"}"
  # #endregion
  git rebase "$REMOTE/$BRANCH"
  # #region agent log
  _dbg "E" "publish.sh:integrate" "rebase finished" "{\"headSha\":\"$(git rev-parse HEAD)\",\"rebaseMerge\":$([ -d .git/rebase-merge ] && echo true || echo false)}"
  # #endregion
else
  # #region agent log
  _dbg "E" "publish.sh:integrate" "no rebase needed" "{\"behind\":$BEHIND}"
  # #endregion
fi

echo "==> Pushing to $REMOTE/$BRANCH"
# #region agent log
set +e
PUSH_OUT="$(git push -u "$REMOTE" "$BRANCH" 2>&1)"
PUSH_RC=$?
set -e
_dbg "A" "publish.sh:push" "push result" "{\"exitCode\":$PUSH_RC,\"output\":\"$(printf '%s' "$PUSH_OUT" | tr '\n' ' ' | sed 's/"/\\"/g')\"}"
if [[ $PUSH_RC -ne 0 ]]; then
  echo "$PUSH_OUT"
  exit "$PUSH_RC"
fi
echo "$PUSH_OUT"
# #endregion

PAGES_URL="https://lazaruschan.github.io/2026-1-SSHD1014-FUNDAMENTAL-VISUALISATION-SKILLS-Group-A03-/"
echo ""
echo "Done."
echo "Enable Pages (once): repo Settings → Pages → Deploy from branch → main / (root)"
echo "Site URL: $PAGES_URL"
echo "Site password: 20261014"
