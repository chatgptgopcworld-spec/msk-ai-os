---
type: skill
skill: new-computer
system: Sync
trigger: the user wants MSK AI OS on another computer, or asks how to move/copy it
schedule: none
inputs: GitHub access, tools/msk-setup-computer.ps1
outputs: a complete working copy of MSK AI OS on that computer
updated: 2026-10-22
---
# Set up MSK AI OS on another computer

## Steps
1. On the computer that has the latest work: `tools\msk-sync.ps1 -Push`; check every repo says `PUSH OK`.
2. On the new computer: install Git for Windows and sign in to GitHub once.
3. Clone the OS, then let the setup script clone everything else into the right places:
   ```powershell
   git clone https://github.com/chatgptgopcworld-spec/msk-ai-os.git "$([Environment]::GetFolderPath('MyDocuments'))\MSK AI OS"
   powershell -ExecutionPolicy Bypass -File "$([Environment]::GetFolderPath('MyDocuments'))\MSK AI OS\tools\msk-setup-computer.ps1"
   ```
4. Copy `Projects\Pakistan Legal Aid\cases\` by USB (private, never on GitHub).
5. Install Obsidian; open `Documents\MSK AI OS` as a vault (imported projects open as their own vaults).
6. In the Claude desktop app, choose the `MSK AI OS` folder for the task and sign in with the same account.
7. From then on: `-Pull` before work, `-Push` after ([[msk-skill-git-sync]]).

## Rules
- Paths never contain a Windows username; everything is relative to `Documents\MSK AI OS`.
- Don't copy-paste the vault folder between computers that are both in use: that makes two diverging
  copies. Clone from GitHub instead. A plain copy is fine only for a one-way, permanent move.

## Done when
- The setup script shows `[CLONE]` or `[HAVE]` for every repo, Obsidian opens the vault, and `msk-sync.ps1 -Pull` reports `PULL OK`.
