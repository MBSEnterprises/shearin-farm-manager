# Changelog

## v24 - Restore egg entry editing
- Restored Edit buttons for egg entry rows.
- Editing an egg row now loads the existing date, collected count, broken/discarded count, and notes into the egg form.
- Save Changes updates the existing record instead of creating a duplicate.
- Added Cancel Edit.
- Updated app/cache version to v24.

## v23 - Bulletproof invite auth
- Validates saved Supabase sessions against the server so deleted/unconfirmed users are forced to sign in again.
- Invite links no longer create a new empty personal farm before joining the invited farm.
- After accepting an invite, the app switches directly to the invited farm and loads its data.
- Remembers the selected farm across reloads.

## v22 - Family friendly invites
- Invite links, copy link, and share invitation.
