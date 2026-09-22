import re

with open('backend/routes/api.php', 'r', encoding='utf-8') as f:
    content = f.read()

smart_routes_public = """// Smart Calculator Public Routes
Route::get('/smart-calculator/materials', [App\Http\Controllers\SmartCalculatorController::class, 'getMaterials']);
Route::get('/smart-calculator/recipes', [App\Http\Controllers\SmartCalculatorController::class, 'getRecipes']);
"""

smart_routes_admin = """    // Smart Calculator Admin Routes
    Route::post('/smart-calculator/materials', [App\Http\Controllers\SmartCalculatorController::class, 'storeMaterial']);
    Route::put('/smart-calculator/materials/{id}', [App\Http\Controllers\SmartCalculatorController::class, 'updateMaterial']);
    Route::delete('/smart-calculator/materials/{id}', [App\Http\Controllers\SmartCalculatorController::class, 'destroyMaterial']);
    Route::post('/smart-calculator/recipes', [App\Http\Controllers\SmartCalculatorController::class, 'storeRecipe']);
"""

# Insert public routes before Authenticated Routes
content = content.replace(
    "// Authenticated Routes",
    smart_routes_public + "\n// Authenticated Routes"
)

# Insert admin routes inside admin block
content = content.replace(
    "// Admin Specific Routes",
    smart_routes_admin + "\n    // Admin Specific Routes"
)

with open('backend/routes/api.php', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated routes in api.php")
