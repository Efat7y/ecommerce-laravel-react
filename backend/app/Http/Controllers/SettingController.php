<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use Illuminate\Http\Request;

class SettingController extends Controller
{
    /**
     * Get all settings as a key-value pair for the frontend
     */
    public function index()
    {
        $settings = Setting::all()->pluck('value', 'key')->toArray();
        
        if (isset($settings['logo']) && $settings['logo']) {
            $path = public_path($settings['logo']);
            if (file_exists($path)) {
                $type = pathinfo($path, PATHINFO_EXTENSION);
                $data = file_get_contents($path);
                $settings['logo_base64'] = 'data:image/' . $type . ';base64,' . base64_encode($data);
            }
        }
        
        return response()->json($settings);
    }

    /**
     * Update settings (Admin only)
     */
    public function update(Request $request)
    {
        $data = $request->all();

        foreach ($data as $key => $value) {
            // Skip calculated fields that shouldn't be in the DB
            if ($key === 'logo_base64' || $value === null) {
                continue;
            }

            // Handle file upload for logo separately if needed
            if ($request->hasFile($key)) {
                $path = $request->file($key)->store('settings', 'public');
                $value = '/storage/' . $path;
            }

            Setting::updateOrCreate(
                ['key' => $key],
                ['value' => $value]
            );
        }

        return response()->json([
            'message' => 'Settings updated successfully.',
            'settings' => Setting::all()->pluck('value', 'key')
        ]);
    }
}
