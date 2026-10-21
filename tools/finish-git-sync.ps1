# One-off: finish the 2026-10-22 move into MSK AI OS. Commits the hamzi-lms path update,
# pushes every repo touched (including the new MSK AI OS repo, first push sets its upstream), and writes the outcome to finish-git-sync-result.txt.
$docs = [Environment]::GetFolderPath('MyDocuments')
$out  = Join-Path $PSScriptRoot 'finish-git-sync-result.txt'
"Run: $(Get-Date -Format s)" | Set-Content -Encoding utf8 $out
function Log($s) { $s | Tee-Object -FilePath $out -Append }

$hl = Join-Path $docs 'hamzi-lms'
git -C $hl diff --quiet -- CLAUDE.md tools/sync-project.ps1
if ($LASTEXITCODE -ne 0) {
  git -C $hl add -- CLAUDE.md tools/sync-project.ps1
  git -C $hl commit -m "docs: AI Brain vault now at Documents/MSK AI OS/Projects/AI Brain (sync default path updated)" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`nClaude-Session: https://claude.ai/code/session_016BPy7Xtcu79JvKnnHXW5Dr" 2>&1 | ForEach-Object { Log "hamzi-lms commit: $_" }
} else { Log 'hamzi-lms commit: nothing to commit (already done)' }

$repos = @(
  'MSK AI OS',
  'MSK AI OS\Projects\AI Brain',
  'MSK AI OS\Projects\Prompts Website',
  'MSK AI OS\Projects\Ubaid Automation',
  'MSK AI OS\Projects\Ubaid Automation\projects\ubaidooautomation',
  'hamzi-lms'
)
foreach ($r in $repos) {
  $p = Join-Path $docs $r
  git -C $p rev-parse --abbrev-ref --symbolic-full-name '@{u}' 2>$null | Out-Null
  if ($LASTEXITCODE -eq 0) { $res = git -C $p push 2>&1 | Out-String }
  else { $res = git -C $p push -u origin (git -C $p branch --show-current) 2>&1 | Out-String }
  $ok  = $LASTEXITCODE -eq 0
  $st  = (git -C $p status -sb 2>&1 | Select-Object -First 1)
  Log ("[{0}] {1} | {2}" -f ($(if ($ok) {'OK'} else {'FAILED'})), $r, $st)
  if (-not $ok) { Log ("    " + $res.Trim()) }
}
Log 'DONE'
