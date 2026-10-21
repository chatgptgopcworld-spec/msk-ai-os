# msk-setup-computer.ps1 - set up MSK AI OS on another computer from GitHub.
#
# 1. Install Git for Windows (https://git-scm.com/download/win) and sign in to GitHub once.
# 2. In PowerShell:
#      git clone https://github.com/chatgptgopcworld-spec/msk-ai-os.git "$([Environment]::GetFolderPath('MyDocuments'))\MSK AI OS"
#      powershell -ExecutionPolicy Bypass -File "$([Environment]::GetFolderPath('MyDocuments'))\MSK AI OS\tools\msk-setup-computer.ps1"
# Safe to run again: repos that already exist are pulled instead of cloned.
$root = Join-Path ([Environment]::GetFolderPath('MyDocuments')) 'MSK AI OS'
if (-not (Get-Command git -ErrorAction SilentlyContinue)) { 'Install Git for Windows first: https://git-scm.com/download/win'; exit 1 }
$gh = 'https://github.com/chatgptgopcworld-spec'
$repos = @(
  @{ url = "$gh/msk-ai-os.git";              path = '.';                                                    branch = 'main' },
  @{ url = "$gh/ai-brain-vault.git";         path = 'Projects\Hamzi Prompts';                                    branch = 'master' },
  @{ url = "$gh/prompts-website-vault.git";  path = 'Projects\Prompts Website';                             branch = 'master' },
  @{ url = "$gh/ubaid-automation-vault.git"; path = 'Projects\Ubaid Automation';                            branch = 'master' },
  @{ url = "$gh/hamzipromtps.git";           path = 'Projects\Hamzi Prompts\projects\hamzi-lms';                 branch = 'main' },
  @{ url = "$gh/ubaidooautomation.git";      path = 'Projects\Ubaid Automation\projects\ubaidooautomation'; branch = 'redesign/v2' }
  # soniprompts has no GitHub repo yet: add a line here once it has one.
)
foreach ($r in $repos) {
  $p = if ($r.path -eq '.') { $root } else { Join-Path $root $r.path }
  if (Test-Path (Join-Path $p '.git')) { "[HAVE]  $($r.path) - pulling"; git -C $p pull --rebase --autostash; continue }
  if ((Test-Path $p) -and (Get-ChildItem $p -Force | Select-Object -First 1)) { "[STOP]  $($r.path) exists but is not a git repo; move it away and run again"; continue }
  "[CLONE] $($r.path)"; git clone -b $r.branch $r.url $p
}
$h = Join-Path $root 'Projects\Hamzi Prompts\projects\hamzi-lms'
if (Test-Path (Join-Path $h '.git')) { git -C $h config core.hooksPath .githooks }
''
'Done. Next:'
'- Copy Projects\Pakistan Legal Aid\cases\ from your other computer by USB (private data, never on GitHub).'
'- Install Obsidian and open the "MSK AI OS" folder as a vault.'
'- In the Claude desktop app, choose the "MSK AI OS" folder for your task.'
'- Every time: tools\msk-sync.ps1 -Pull before work, -Push after.'
