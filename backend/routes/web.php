<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

Route::get('/debug-db', function () { return 'PWD_LEN: ' . strlen(env('DB_PASSWORD')) . ' CA_EXISTS: ' . (file_exists(base_path('cacert.pem')) ? 'YES' : 'NO') . ' DB_HOST: ' . env('DB_HOST'); });
