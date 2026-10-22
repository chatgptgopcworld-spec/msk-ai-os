# msk-first-push.ps1 - one-time finish of the 2026-10-22 changes, then push everything.
# 1) moves Documents\hamzi-lms into Projects\Hamzi Prompts\projects\hamzi-lms (same drive: instant, git intact)
# 2) commits the three hamzi-lms files that were updated for the new location and name
# 3) runs msk-sync.ps1 -Push for every repo
$root = Split-Path $PSScriptRoot -Parent
$docs = [Environment]::GetFolderPath('MyDocuments')
$out  = Join-Path $PSScriptRoot 'msk-first-push-result.txt'
"Run: $(Get-Date -Format s) on $env:COMPUTERNAME" | Set-Content -Encoding utf8 $out
function Log($s) { $s | Tee-Object -FilePath $out -Append }

$old = Join-Path $docs 'hamzi-lms'
$newParent = Join-Path $root 'Projects\Hamzi Prompts\projects'
$new = Join-Path $newParent 'hamzi-lms'
if ((Test-Path $old) -and -not (Test-Path $new)) {
  New-Item -ItemType Directory -Force -Path $newParent | Out-Null
  try { Move-Item -LiteralPath $old -Destination $new -ErrorAction Stop; Log "[MOVED] hamzi-lms -> $new" }
  catch { Log "[MOVE FAILED] close any editor/terminal using hamzi-lms and run again: $($_.Exception.Message)"; exit 1 }
} elseif (Test-Path $new) { Log "[OK] hamzi-lms already at $new" } else { Log "[WARN] hamzi-lms not found" }

if (Test-Path (Join-Path $new '.git')) {
  Get-ChildItem (Join-Path $new '.git') -Filter 'stale-*' -File -ErrorAction SilentlyContinue | Remove-Item -Force -ErrorAction SilentlyContinue
  git -C $new add -- CLAUDE.md AGENTS.md tools/sync-project.ps1
  git -C $new diff --cached --quiet
  if ($LASTEXITCODE -ne 0) {
    git -C $new commit -q -m "docs: repo now inside MSK AI OS at Projects/Hamzi Prompts/projects/hamzi-lms (vault renamed from AI Brain)" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`nClaude-Session: https://claude.ai/code/session_01RXZSwnqu3P8xHZH4zNGC1G"
    Log "[COMMIT] hamzi-lms: location and name update"
  } else { Log "[OK] hamzi-lms: nothing to commit" }
}

# old copies moved into the vault on 2026-10-22: remove the empty leftover folders
foreach ($d in @('Pakistan Laws', '.claude', 'Monetics-LearnCore')) {
  $p = Join-Path $docs $d
  if ((Test-Path $p) -and -not (Get-ChildItem -LiteralPath $p -Force | Select-Object -First 1)) { Remove-Item -LiteralPath $p -Force; Log "[REMOVED] empty Documents\$d" }
  elseif (Test-Path $p) { Log "[KEPT] Documents\$d is not empty; check it by hand" }
}

Log '--- msk-sync -Push ---'
& (Join-Path $PSScriptRoot 'msk-sync.ps1') -Push
Get-Content (Join-Path $PSScriptRoot 'msk-sync-result.txt') | Add-Content -Path $out
