<?php
namespace App\Http\Controllers\ResidentUser;

use App\Http\Controllers\Controller;
use App\Models\Message;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class MessageController extends Controller
{
    public function index()
    {
        // Include both messages received by the resident and messages sent by the resident
        $messages = Message::where(function ($q) {
                $q->where('recipient_id', Auth::id())
                  ->orWhere('sender_id', Auth::id());
            })
            ->with(['sender:id,name,email', 'recipient:id,name,email'])
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        $unreadCount = Message::where('recipient_id', Auth::id())
            ->where('is_read', false)
            ->count();

        return Inertia::render('ResidentUser/Message/Index', [
            'messages'    => $messages,
            'unreadCount' => $unreadCount,
        ]);
    }

    public function create(Request $request)
    {
                                      // Get admins using Spatie Permission
        $admins = User::role('admin') // Use Spatie's role() method
            ->select('id', 'name', 'email')
            ->orderBy('name')
            ->get();

        $recipientId   = $request->query('recipient_id');
        $recipientName = $request->query('recipient_name');

        return Inertia::render('ResidentUser/Message/Create', [
            'admins'        => $admins,
            'recipientId'   => $recipientId,
            'recipientName' => $recipientName,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'recipient_id' => 'required|exists:users,id',
            'body'         => 'required|string|max:5000',
        ]);

        // Verify recipient is an admin using Spatie Permission
        $recipient = User::findOrFail($validated['recipient_id']);
        if (! $recipient->hasRole('admin')) {
            return back()->withErrors([
                'recipient_id' => 'You can only send messages to administrators.',
            ]);
        }

        $message = Message::create([
            'sender_id'    => Auth::id(),
            'recipient_id' => $validated['recipient_id'],
            'body'         => $validated['body'],
            'is_read'      => false,
            'sender_type'  => 'user',
        ]);

        // Load relationships
        $message->load('sender:id,name,email');

        // Broadcast the event
        broadcast(new \App\Events\MessageSent($message))->toOthers();

        return redirect()->route('residentuser.message.index')
            ->with('flash.message', 'Message sent successfully!');
    }

    public function show(Message $message)
    {
        if ($message->sender_id !== Auth::id
            () &&
            $message->recipient_id !== Auth::id()) {
            abort(403);
        }

        if ($message->recipient_id === Auth::id
            () && ! $message->is_read) {
            $message->update(['is_read' => true]);
        }

        $message->load(['sender:id,name,email', 'recipient:id,name,email']);

        // Get conversation history
        $conversation = Message::betweenUsers($message->sender_id, $message->recipient_id)
            ->with(['sender:id,name', 'recipient:id,name'])
            ->orderBy('created_at', 'asc')
            ->get();

        return Inertia::render('ResidentUser/Message/Show', [
            'message'      => $message,
            'conversation' => $conversation,
        ]);
    }

    public function markAsRead(Message $message)
    {
        if ($message->recipient_id !== Auth::id()) {
            abort(403);
        }

        $message->update(['is_read' => true]);

        return back();
    }

    public function destroy(Message $message)
    {
        if ($message->recipient_id !== Auth::id()) {
            abort(403);
        }

        $message->delete();

        return back()->with('success', 'Message deleted successfully!');
    }
}
