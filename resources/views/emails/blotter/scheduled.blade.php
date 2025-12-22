<x-mail::message>
# Hearing Scheduled

Hello {{ $blotter->user->name }},

Your blotter request regarding **"{{ $blotter->type }}"** has been reviewed and approved by the Barangay Admin.

### Hearing Details

<x-mail::panel>
**Date & Time:**
{{ \Carbon\Carbon::parse($blotter->scheduled_at)->format('F j, Y, g:i A') }}

**Venue:**
Barangay Hall
</x-mail::panel>

**Admin Notes/Instructions:**
{{ $blotter->admin_notes ?? 'None provided.' }}

Please ensure you are present at the scheduled time. Failure to appear may result in the dismissal of your complaint.

<x-mail::button :url="route('residentuser.blotter.show', $blotter->id)">
View Report Details
</x-mail::button>

Regards,<br>
{{ config('app.name') }}
</x-mail::message>
