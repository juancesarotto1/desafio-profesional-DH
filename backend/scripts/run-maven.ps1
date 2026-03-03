<#
    run-maven.ps1
    Uso: .\scripts\run-maven.ps1 -Args "clean package"
    El script comprueba si hay `mvn` en PATH. Si no existe, descarga Apache Maven 3.9.5 en .\.maven\apache-maven-3.9.5,
    lo extrae y ejecuta la copia local. Esto evita tener que instalar Maven globalmente.
#>
param(
    [Parameter(ValueFromRemainingArguments = $true)]
    [string[]]$Args
)

$ErrorActionPreference = 'Stop'
$scriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Definition

function Write-Log($msg){ Write-Host "[run-maven] $msg" }

# Check if mvn is available
$mvnCmd = Get-Command mvn -ErrorAction SilentlyContinue
if ($mvnCmd) {
    Write-Log "Found system mvn: $($mvnCmd.Path). Running with args: $Args"
    & mvn @Args
    exit $LASTEXITCODE
}

# No system mvn -> download a local Maven distribution into .maven
$mavenVersion = '3.9.5'
$mavenDir = Join-Path $scriptRoot "..\.maven\apache-maven-$mavenVersion"
$mavenZip = Join-Path $scriptRoot "..\.maven\apache-maven-$mavenVersion-bin.zip"
$mavenUrl = "https://archive.apache.org/dist/maven/maven-3/$mavenVersion/binaries/apache-maven-$mavenVersion-bin.zip"

if (-Not (Test-Path $mavenDir)) {
    Write-Log "Local Maven not found. Preparing to download Maven $mavenVersion..."
    New-Item -ItemType Directory -Path (Split-Path $mavenZip) -Force | Out-Null

    Write-Log "Downloading $mavenUrl"
    try {
        Invoke-WebRequest -Uri $mavenUrl -OutFile $mavenZip -UseBasicParsing -TimeoutSec 120
    } catch {
        Write-Log "Error descargando Maven: $_"
        exit 1
    }

    Write-Log "Extracting $mavenZip to .maven"
    try {
        Expand-Archive -Path $mavenZip -DestinationPath (Join-Path $scriptRoot "..\.maven") -Force
    } catch {
        Write-Log "Error extrayendo Maven: $_"
        exit 1
    }
}

$mvnExe = Join-Path $mavenDir "bin\mvn.cmd"
if (-Not (Test-Path $mvnExe)) {
    Write-Log "No se encontró mvn.exe en $mvnExe"
    exit 1
}

# Run the local mvn
Write-Log "Running local Maven: $mvnExe with args: $Args"
& $mvnExe @Args
exit $LASTEXITCODE
