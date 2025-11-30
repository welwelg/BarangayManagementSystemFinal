<?php
namespace App\Http\Controllers\Admin;

use App\Events\MessageSent;
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
        $messages = Message::query()
            ->where(function ($query) {
                $query->where('sender_id', Auth::id())
                    ->orWhere('recipient_id', Auth::id());
            })
            ->with(['sender:id,name,email', 'recipient:id,name,email'])
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        $unreadCount = Message::where('recipient_id', Auth::id())
            ->where('is_read', false)
            ->count();

        return Inertia::render('Admin/Message/Index', [
            'messages'    => $messages,
            'unreadCount' => $unreadCount,
        ]);
    }

    public function create(Request $request)
    {
        // Get all resident users (users without admin role) using Spatie Permission
        $users = User::whereDoesntHave('roles', function ($query) {
            $query->where('name', 'admin');
        })
            ->select('id', 'name', 'email')
            ->orderBy('name')
            ->get();

        $recipientId   = $request->query('recipient_id');
        $recipientName = $request->query('recipient_name');

        return Inertia::render('Admin/Message/Create', [
            'users'         => $users,
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

        if ($validated['recipient_id'] == Auth::id()) {
            return back()->withErrors([
                'recipient_id' => 'You cannot send a message to yourself.',
            ]);
        }

        $message = Message::create([
            'sender_id'    => Auth::id(),
            'recipient_id' => $validated['recipient_id'],
            'body'         => $validated['body'],
            'is_read'      => false,
            'sender_type'  => 'admin',
        ]);

        // Load relationships
        $message->load('sender:id,name,email');

        // Broadcast the event
        // broadcast(new \App\Events\MessageSent($message))->toOthers();
         broadcast(new MessageSent($message))->toOthers();

        return redirect()->route('admin.message.index')
            ->with('flash.message', 'Message sent successfully!');
    }

    public function show(Message $message)
    {
        if ($message->sender_id !== Auth::id() &&
            $message->recipient_id !== Auth::id()) {
            abort(403);
        }

        if ($message->recipient_id === Auth::id() && ! $message->is_read) {
            $message->update(['is_read' => true]);
        }

        $message->load(['sender:id,name,email', 'recipient:id,name,email']);

        // Get conversation history
        $conversation = Message::betweenUsers($message->sender_id, $message->recipient_id)
            ->with(['sender:id,name', 'recipient:id,name'])
            ->orderBy('created_at', 'asc')
            ->get();

        return Inertia::render('Admin/Message/Show', [
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
        if ($message->sender_id !== Auth::id() &&
            $message->recipient_id !== Auth::id()) {
            abort(403);
        }

        $message->delete();

        return back()->with('success', 'Message deleted successfully!');
    }

    // Broadcast message to all users
    public function broadcast(Request $request)
    {
        if ($request->isMethod('get')) {

            $users = User::all();
            return Inertia::render('Admin/Message/Broadcast', [
                'users' => $users,
                'auth'  => [
                    'user' => $request->user(),
                ],
            ]);
        } elseif ($request->isMethod('post')) {
            // Handle POST: Validate and process the broadcast
            $validated = $request->validate([
                'recipient_ids'   => 'required|array|min:1',
                'recipient_ids.*' => 'exists:users,id',
                'body'            => 'required|string|max:5000',
            ]);
            // Get the sender (current authenticated user)
            $sender = $request->user();
            // Send the message to each selected recipient
            foreach ($validated['recipient_ids'] as $recipientId) {
                $message = Message::create([
                    'sender_id'    => $sender->id,
                    'recipient_id' => $recipientId,
                    'body'         => $validated['body'],
                    'is_read'      => false,
                    'sender_type'  => 'admin',
                    'created_at'   => now(),
                    'updated_at'   => now(),
                ]);

                // Load relationships for broadcasting
                $message->load('sender:id,name,email');

                // Broadcast the event to trigger real-time notifications
                broadcast(new \App\Events\MessageSent($message))->toOthers();
            }
            // Redirect with success message
            return redirect()->route('admin.message.index')->with('success', 'Broadcast sent to ' . count($validated['recipient_ids']) . ' users!');
        }
        abort(405);
    }

}
