param(
    [switch]
    $dev
)
& ./start-server.ps1 -dev:$dev;

& ./start-client.ps1;