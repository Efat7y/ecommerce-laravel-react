<?php

putenv('APP_CONFIG_CACHE=/tmp/config.php');
putenv('APP_EVENTS_CACHE=/tmp/events.php');
putenv('APP_PACKAGES_CACHE=/tmp/packages.php');
putenv('APP_SERVICES_CACHE=/tmp/services.php');
putenv('VIEW_COMPILED_PATH=/tmp');
putenv('CACHE_STORE=array');
putenv('SESSION_DRIVER=array');
putenv('LOG_CHANNEL=stderr');
putenv('APP_DEBUG=true');

try {
    require __DIR__ . '/../public/index.php';
} catch (\Throwable $e) {
    echo $e->getMessage();
    echo "\n";
    echo $e->getTraceAsString();
}
