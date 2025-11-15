<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});
Broadcast::channel('user.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});
Broadcast::channel('messages.{userId}', function ($user, $userId) {
    return (int) $user->id === (int) $userId;
});

// ✅ Presence channel for typing indicator
Broadcast::channel('conversation.{userId1}.{userId2}', function ($user, $userId1, $userId2) {
    $id1 = (int) $userId1;
    $id2 = (int) $userId2;

    // Allow if user is one of the participants
    if ((int) $user->id === $id1 || (int) $user->id === $id2) {
        return [
            'id'   => $user->id,
            'name' => $user->name,
        ];
    }

    return null;
});
