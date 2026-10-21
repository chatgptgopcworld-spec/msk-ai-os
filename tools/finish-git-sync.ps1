# Replaced on 2026-10-22 by tools\msk-sync.ps1 (multi-computer sync). Kept so old instructions still work:
# it pushes every repo, the same as "msk-sync.ps1 -Push".
& (Join-Path $PSScriptRoot 'msk-sync.ps1') -Push
