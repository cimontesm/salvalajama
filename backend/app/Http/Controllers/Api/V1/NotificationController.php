<?php

// Cecilia Montes

namespace App\Http\Controllers\Api\V1;

use App\Models\AppNotification;
use Illuminate\Http\Request;

class NotificationController
{
    public function index(Request $request)
    {
        $notifications = AppNotification::where('user_id', $request->user()->id)->latest()->limit(100)->get();
        return response()->json([
            'success' => true,
            'data' => $notifications,
            'unread_count' => $notifications->whereNull('read_at')->count(),
        ]);
    }

    public function read(Request $request, AppNotification $notification)
    {
        abort_unless($notification->user_id === $request->user()->id, 403, 'No tienes permiso para modificar esta notificación.');
        $notification->update(['read_at' => now()]);
        return response()->json(['success' => true, 'data' => $notification]);
    }

    public function readAll(Request $request)
    {
        AppNotification::where('user_id', $request->user()->id)->whereNull('read_at')->update(['read_at' => now()]);
        return response()->json(['success' => true, 'message' => 'Notificaciones marcadas como leídas.']);
    }
}
