# msk-sync.ps1 - keep MSK AI OS in sync across computers through GitHub.
#
#   powershell -ExecutionPolicy Bypass -File tools\msk-sync.ps1 -Pull   # before you start working
#   powershell -ExecutionPolicy Bypass -File tools\msk-sync.ps1 -Push   # when you finish
#   powershell -ExecutionPolicy Bypass -File tools\msk-sync.ps1         # both (pull, then push)
#
# Vault repos (MSK AI OS + the three imported project vaults): uncommitted notes are committed
# automatically on -Push. Code repos (hamzi-lms, soniprompts, ubaidooautomation): only commits you
# already made are pushed; uncommitted code is reported, never committed by this script.
# Personal-data folders stay out of GitHub by .gitignore (e.g. Pakistan Legal Aid/cases).
# Result is written to tools\msk-sync-result.txt.
param([switch]$Pull, [switch]$Push, [string]$Message)
if (-not $Pull -and -not $Push) { $Pull = $true; $Push = $true }
$root = Split-Path $PSScriptRoot -Parent
$out  = Join-Path $PSScriptRoot 'msk-sync-result.txt'
"Run: $(Get-Date -Format s) on $env:COMPUTERNAME  (pull=$Pull push=$Push)" | Set-Content -Encoding utf8 $out
function Log($s) { $s | Tee-Object -FilePath $out -Append }
if (-not (Get-Command git -ErrorAction SilentlyContinue)) { Log 'Git is not installed: https://git-scm.com/download/win'; exit 1 }
if (-not $Message) { $Message = "sync: $env:COMPUTERNAME $(Get-Date -Format 'yyyy-MM-dd HH:mm')" }

$repos = @(
  @{ p = '.';                                                     kind = 'vault' },
  @{ p = 'Projects\AI Brain';                                     kind = 'vault' },
  @{ p = 'Projects\Prompts Website';                              kind = 'vault' },
  @{ p = 'Projects\Ubaid Automation';                             kind = 'vault' },
  @{ p = 'Projects\AI Brain\projects\hamzi-lms';                  kind = 'code'  },
  @{ p = 'Projects\Prompts Website\projects\soniprompts';         kind = 'code'  },
  @{ p = 'Projects\Ubaid Automation\projects\ubaidooautomation';  kind = 'code'  }
)

foreach ($r in $repos) {
  $p = Join-Path $root $r.p
  if (-not (Test-Path (Join-Path $p '.git'))) { Log "[SKIP]        $($r.p): not on this computer"; continue }
  # leftovers from Claude's linked shell, which cannot delete files
  Get-ChildItem (Join-Path $p '.git') -Filter 'stale-*' -File -ErrorAction SilentlyContinue | Remove-Item -Force -ErrorAction SilentlyContinue
  $remote = git -C $p remote get-url origin 2>$null
  if (-not $remote) { Log "[NO REMOTE]   $($r.p): create a private GitHub repo, then run: git -C `"$p`" remote add origin <url>"; continue }
  $branch = git -C $p branch --show-current

  if ($Push -and $r.kind -eq 'vault') {
    git -C $p add -A 2>&1 | Out-Null
    git -C $p diff --cached --quiet
    if ($LASTEXITCODE -ne 0) { git -C $p commit -q -m $Message 2>&1 | Out-Null; Log "[COMMIT]      $($r.p)" }
  }

  git -C $p rev-parse --abbrev-ref '@{u}' 2>$null | Out-Null
  $hasUpstream = ($LASTEXITCODE -eq 0)

  if ($Pull) {
    if ($hasUpstream) {
      $res = git -C $p pull --rebase --autostash 2>&1 | Out-String
      if ($LASTEXITCODE -ne 0) { Log "[PULL FAILED] $($r.p): $($res.Trim())"; continue }
      Log "[PULL OK]     $($r.p) ($branch)"
    } else { Log "[PULL]        $($r.p): no upstream yet (the first push sets it)" }
  }

  if ($Push) {
    if ($r.kind -eq 'code' -and (git -C $p status --porcelain)) { Log "[NOTE]        $($r.p): uncommitted code changes were not pushed (commit them in that repo first)" }
    if ($hasUpstream) { $res = git -C $p push 2>&1 | Out-String } else { $res = git -C $p push -u origin $branch 2>&1 | Out-String }
    if ($LASTEXITCODE -eq 0) { Log "[PUSH OK]     $($r.p) ($branch)" } else { Log "[PUSH FAILED] $($r.p): $($res.Trim())" }
  }
}
Log 'DONE'
