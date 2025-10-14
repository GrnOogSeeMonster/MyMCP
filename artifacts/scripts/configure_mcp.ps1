$ErrorActionPreference = 'Stop'
$ts = Get-Date -Format 'yyyyMMdd_HHmmss'

function Merge-ZedConfig {
  param(
    [string]$SnippetPath
  )
  $target = Join-Path $env:USERPROFILE '.config/zed/settings.json'
  $dir = Split-Path $target
  if(-not (Test-Path $dir)) { New-Item -ItemType Directory $dir -Force | Out-Null }
  if(-not (Test-Path $target)) { Set-Content -Path $target -Value '{}' -Encoding UTF8 }
  Copy-Item $target ("$target.bak.$ts") -Force
  $existing = Get-Content $target -Raw | ConvertFrom-Json
  if($null -eq $existing){ $existing = @{} }
  if($existing.PSObject.TypeNames -notcontains 'System.Collections.Hashtable'){ $existing = $existing | ConvertTo-Json -Depth 10 | ConvertFrom-Json }
  $snippet = Get-Content $SnippetPath -Raw | ConvertFrom-Json
  if($null -eq $existing.lsp){ $existing | Add-Member -NotePropertyName lsp -NotePropertyValue (@{}) -Force }
  $snippet.lsp.PSObject.Properties | ForEach-Object { $existing.lsp | Add-Member -NotePropertyName $_.Name -NotePropertyValue $_.Value -Force }
  ($existing | ConvertTo-Json -Depth 10) | Set-Content -Path $target -Encoding UTF8
  return $target
}

function Configure-Neovim {
  param(
    [string]$LuaSnippet
  )
  $nvDir = Join-Path $env:USERPROFILE 'AppData/Local/nvim'
  if(-not (Test-Path $nvDir)) { New-Item -ItemType Directory $nvDir -Force | Out-Null }
  $luaDir = Join-Path $nvDir 'lua'
  if(-not (Test-Path $luaDir)) { New-Item -ItemType Directory $luaDir -Force | Out-Null }
  $dstLua = Join-Path $luaDir 'mcp.lua'
  if(Test-Path $dstLua) { Copy-Item $dstLua ("$dstLua.bak.$ts") -Force }
  Copy-Item $LuaSnippet $dstLua -Force
  $init = Join-Path $nvDir 'init.lua'
  if(-not (Test-Path $init)) { $content = "-- init.lua created by setup`nrequire('mcp')"; Set-Content -Path $init -Value $content -Encoding UTF8 }
  $initText = Get-Content $init -Raw
  if($initText -notmatch "require\('mcp'\)") { Add-Content -Path $init -Value "`n-- MCP setup`nrequire('mcp')" }
  return @{ lua = $dstLua; init = $init }
}

$zed = Merge-ZedConfig -SnippetPath (Join-Path $PSScriptRoot '..' | Join-Path -ChildPath 'configs/zed/zed_mcp_snippet.json')
$nv = Configure-Neovim -LuaSnippet (Join-Path $PSScriptRoot '..' | Join-Path -ChildPath 'configs/neovim/mcp_neovim.lua')

$outDir = Join-Path $PSScriptRoot '..' | Join-Path -ChildPath 'validation'
if(-not (Test-Path $outDir)) { New-Item -ItemType Directory $outDir -Force | Out-Null }
$summary = @{ zed = $zed; neovim = $nv }
($summary | ConvertTo-Json -Depth 6) | Set-Content -Path (Join-Path $outDir 'paths_user_extras.json') -Encoding UTF8
Write-Output ($summary | ConvertTo-Json -Depth 6)


