param(
    [switch]
    $dev
)
$env:SECRET = "blah";
$env:NODE_ENV = $(if (-not $dev) { "production"} else { "development"})
$env:ENV_TXT = $(Get-Content -Path "./env.sample.txt")
Push-Location ./server;
Write-Host "start server here"
if ($dev.IsPresent) {
    Write-Host "DEV MODE"
    & {
        Start-Process npm -ArgumentList "run tsw" 
        Start-Process npm -ArgumentList "run watch"
    }
}
else {
    Start-Process node -ArgumentList "./dist/index.js" -WindowStyle Minimized;

}
Pop-Location;