@echo off
setlocal EnableExtensions EnableDelayedExpansion

REM Publish SSHD1014 course site to GitHub Pages.
REM Repo: https://github.com/Lazaruschan/2026-1-SSHD1014-FUNDAMENTAL-VISUALISATION-SKILLS-Group-A03-
REM
REM Usage: double-click publish.bat, or from this folder run:
REM   publish.bat
REM
REM Use a GitHub Personal Access Token when asked for "Password" (not your account password).
REM After push: Settings - Pages - Deploy from branch - main / (root)

cd /d "%~dp0"
if /i "%~1"=="--no-pause" set "NO_PAUSE=1"

set "REPO_URL=https://github.com/Lazaruschan/2026-1-SSHD1014-FUNDAMENTAL-VISUALISATION-SKILLS-Group-A03-.git"
set "BRANCH=main"
set "REMOTE=origin"
set "PAGES_URL=https://lazaruschan.github.io/2026-1-SSHD1014-FUNDAMENTAL-VISUALISATION-SKILLS-Group-A03-/"

echo ==^> Publishing from: %CD%
echo ==^> Target: %REPO_URL%

where git >nul 2>&1
if errorlevel 1 goto :no_git

if not exist ".git" (
  echo ==^> git init
  git init
  if errorlevel 1 goto :fail
)

if exist ".git\rebase-merge" goto :rebase_busy
if exist ".git\rebase-apply" goto :rebase_busy
if exist ".git\MERGE_HEAD" goto :rebase_busy

REM Keep ignore list current
> ".gitignore" (
echo node_modules/
echo .DS_Store
echo *.log
echo *.rtf
echo start.rtf
echo .env
echo .env.*
echo *token*
echo *secret*
)

del /q /f "start.rtf" "*.rtf" >nul 2>&1

echo ==^> Staging site files only ^(explicit allow-list^)
git add --force -- .gitignore .nojekyll index.html auth.js cart-game.js assets slides publish.sh publish.bat export-slides.sh embed-slide-assets.py package.json package-lock.json
if errorlevel 1 goto :fail
if exist "README.md" git add --force -- README.md

REM Never publish secrets / tooling junk
git rm -r --cached --ignore-unmatch -- node_modules >nul 2>&1
git rm --cached --ignore-unmatch -- start.rtf >nul 2>&1
for %%f in (*.rtf) do git rm --cached --ignore-unmatch -- "%%f" >nul 2>&1

echo ==^> Staged files:
git --no-pager status --short

git diff --cached --quiet
if errorlevel 1 goto :do_commit
git rev-parse HEAD >nul 2>&1
if errorlevel 1 goto :nothing
echo ==^> No new changes; will push existing commits.
goto :after_commit

:do_commit
echo ==^> Committing
git commit -m "Publish SSHD1014 Fundamental Visualisation Skills course website."
if errorlevel 1 goto :fail

:after_commit
git branch -M "%BRANCH%"
if errorlevel 1 goto :fail

git remote get-url "%REMOTE%" >nul 2>&1
if errorlevel 1 (
  echo ==^> Adding remote %REMOTE%
  git remote add "%REMOTE%" "%REPO_URL%"
) else (
  echo ==^> Updating remote %REMOTE%
  git remote set-url "%REMOTE%" "%REPO_URL%"
)
if errorlevel 1 goto :fail

echo ==^> Syncing with %REMOTE%/%BRANCH%
git fetch "%REMOTE%" "%BRANCH%"
if errorlevel 1 goto :fail

set "BEHIND=0"
for /f %%i in ('git rev-list --count "HEAD..%REMOTE%/%BRANCH%" 2^>nul') do set "BEHIND=%%i"
if not "!BEHIND!"=="0" (
  echo ==^> Remote is ahead by !BEHIND! commit^(s^); rebasing onto %REMOTE%/%BRANCH%
  git rebase "%REMOTE%/%BRANCH%"
  if errorlevel 1 goto :fail
)

echo ==^> Pushing to %REMOTE%/%BRANCH%
git push -u "%REMOTE%" "%BRANCH%"
if errorlevel 1 goto :fail

echo.
echo Done.
echo Enable Pages ^(once^): repo Settings -^> Pages -^> Deploy from branch -^> main / ^(root^)
echo Site URL: %PAGES_URL%
echo Site password: 20261014
call :maybe_pause
exit /b 0

:no_git
echo Error: git is not installed. Install Git for Windows first.
call :maybe_pause
exit /b 1

:rebase_busy
echo Error: git rebase/merge in progress. Finish it ^(git rebase --continue^) or abort ^(git rebase --abort^), then re-run.
call :maybe_pause
exit /b 1

:nothing
echo Error: nothing to commit and no previous commits.
call :maybe_pause
exit /b 1

:fail
echo.
echo Publish failed.
call :maybe_pause
exit /b 1

:maybe_pause
if defined NO_PAUSE exit /b 0
echo %cmdcmdline% | findstr /i /c:"%~nx0" >nul
if not errorlevel 1 pause
exit /b 0
