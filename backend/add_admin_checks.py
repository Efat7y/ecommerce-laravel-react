import re

with open('backend/app/Http/Controllers/SmartCalculatorController.php', 'r', encoding='utf-8') as f:
    content = f.read()

# Add a simple admin check to the store/update/destroy methods
admin_check = """        if ($request->user()->role !== 'admin' && $request->user()->email !== 'eslamzain8897@gmail.com') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
"""

content = content.replace(
    'public function storeMaterial(Request $request)\n    {\n',
    'public function storeMaterial(Request $request)\n    {\n' + admin_check
)
content = content.replace(
    'public function updateMaterial(Request $request, $id)\n    {\n',
    'public function updateMaterial(Request $request, $id)\n    {\n' + admin_check
)
content = content.replace(
    'public function storeRecipe(Request $request)\n    {\n',
    'public function storeRecipe(Request $request)\n    {\n' + admin_check
)
# For destroyMaterial we need $request
content = content.replace(
    'public function destroyMaterial($id)\n    {',
    'public function destroyMaterial(Request $request, $id)\n    {\n' + admin_check
)
# Make sure to update the destroyMaterial route to expect Request $request in api.php? Actually Laravel dependency injection handles this automatically if we add Request $request as the first parameter.

with open('backend/app/Http/Controllers/SmartCalculatorController.php', 'w', encoding='utf-8') as f:
    f.write(content)

print("Added admin checks to SmartCalculatorController")
