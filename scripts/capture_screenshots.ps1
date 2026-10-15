# StockPilot v1.2 — Windows Chrome / Edge ile ekran goruntuleri
# PowerShell terminalinde, proje klasorunden:
#   powershell -ExecutionPolicy Bypass -File .\scripts\capture_screenshots.ps1 -BaseUrl http://localhost:5174
# On kosul: npm run dev ayri bir terminalde calisiyor olmali.

param(
  [string] $BaseUrl = 'http://localhost:5173',
  [int] $Width = 1600,
  [int] $Height = 1000
)

$ErrorActionPreference = 'Stop'
$BaseUrl = $BaseUrl.TrimEnd('/')

if ($BaseUrl -notmatch '^http://(localhost|127\.0\.0\.1):\d+$') {
  throw 'Guvenlik icin BaseUrl yalnızca http://localhost:PORT veya http://127.0.0.1:PORT olabilir.'
}

$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$destination = Join-Path $repoRoot 'docs\screenshots'
New-Item -ItemType Directory -Force -Path $destination | Out-Null

$candidates = @()
foreach ($program in @('chrome.exe', 'msedge.exe')) {
  $command = Get-Command $program -ErrorAction SilentlyContinue
  if ($command) { $candidates += $command.Source }
}
$candidates += @(
  (Join-Path $env:ProgramFiles 'Google\Chrome\Application\chrome.exe'),
  (Join-Path $env:ProgramFiles 'Microsoft\Edge\Application\msedge.exe'),
  (Join-Path $env:LOCALAPPDATA 'Google\Chrome\Application\chrome.exe')
)
if (${env:ProgramFiles(x86)}) {
  $candidates += (Join-Path ${env:ProgramFiles(x86)} 'Google\Chrome\Application\chrome.exe')
  $candidates += (Join-Path ${env:ProgramFiles(x86)} 'Microsoft\Edge\Application\msedge.exe')
}
$browser = $candidates | Where-Object { $_ -and (Test-Path $_) } | Select-Object -First 1
if (-not $browser) {
  throw 'Chrome veya Edge bulunamadi. docs/screenshots/README.md icindeki manuel yontemi uygula.'
}

try {
  $response = Invoke-WebRequest -Uri "$BaseUrl/" -UseBasicParsing -TimeoutSec 8
  if ($response.StatusCode -ne 200) { throw "HTTP $($response.StatusCode)" }
}
catch {
  throw "Uygulama acik degil: $BaseUrl. Baska bir terminalde npm run dev komutunu calistirip Vite adresini kontrol et."
}

$routes = @(
  @{ route = '/';           file = 'dashboard.png';        label = 'Genel Bakis' },
  @{ route = '/products';   file = 'urunler.png';          label = 'Urunler (v1.2 siralama)' },
  @{ route = '/categories'; file = 'kategoriler.png';      label = 'Kategoriler' },
  @{ route = '/movements';  file = 'stok-hareketleri.png'; label = 'Stok Hareketleri' },
  @{ route = '/settings';   file = 'yedekleme.png';        label = 'Yedekleme ve Ayarlar' }
)

$profile = Join-Path $env:TEMP ('stockpilot-capture-' + [guid]::NewGuid().ToString('N'))
$stage = Join-Path $env:TEMP ('stockpilot-image-stage-' + [guid]::NewGuid().ToString('N'))
New-Item -ItemType Directory -Force -Path $profile | Out-Null
New-Item -ItemType Directory -Force -Path $stage | Out-Null

Write-Host "Tarayici: $browser" -ForegroundColor Cyan
Write-Host 'Gorseller icin AYRI ve TEMIZ tarayici profili kullaniliyor; kisisel stok kayitlari ekrana alinmayacak.' -ForegroundColor Yellow
try {
  foreach ($item in $routes) {
    $out = Join-Path $stage $item.file
    $url = "$BaseUrl$($item.route)"
    Write-Host "Aliniyor: $($item.label) -> $($item.file)"
    # Tek kullanımlık bir tarayıcı profili ile v1.2'nin DEMO kayıtlarını gösterir.
    $arguments = @(
      '--headless=new',
      '--disable-gpu',
      '--no-first-run',
      '--no-default-browser-check',
      '--disable-extensions',
      '--hide-scrollbars',
      "--window-size=$Width,$Height",
      '--force-device-scale-factor=1',
      '--virtual-time-budget=6000',
      "--user-data-dir=$profile",
      "--screenshot=$out",
      $url
    )
    # Start-Process -Wait, Windows'ta GUI uygulamasinin arka plana ayrilmasini engeller.
    $quotedArguments = @($arguments | ForEach-Object {
      if ($_ -match '[\s"]') { '"' + $_.Replace('"', '\"') + '"' } else { $_ }
    })
    $process = Start-Process -FilePath $browser -ArgumentList $quotedArguments -Wait -PassThru -NoNewWindow
    if ($process.ExitCode -ne 0 -and -not (Test-Path $out)) {
      throw "Tarayici ekran goruntusu olusturmadi: $($item.file) (exit $($process.ExitCode))"
    }
    if (-not (Test-Path $out)) {
      throw "Gorsel olusturulamadi: $($item.file)"
    }
    if ((Get-Item $out).Length -lt 10000) {
      throw "Gorsel cok kucuk veya bos gorunuyor: $($item.file)"
    }
  }
  # Tum gorseller olusturulup dogrulanmadan mevcut dosyalara dokunma.
  foreach ($item in $routes) {
    Copy-Item -LiteralPath (Join-Path $stage $item.file) -Destination (Join-Path $destination $item.file) -Force
  }
  Write-Host 'BASARILI: 5 ekran goruntusu docs/screenshots/ dizinine yazildi.' -ForegroundColor Green
  Write-Host 'GitHub push yapmadan once PNG dosyalarini acip dogru v1.2 sayfalari oldugunu kontrol et.' -ForegroundColor Green
}
finally {
  Remove-Item $profile -Recurse -Force -ErrorAction SilentlyContinue
  Remove-Item $stage -Recurse -Force -ErrorAction SilentlyContinue
}
