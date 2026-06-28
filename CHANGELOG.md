# Shearin Farm Manager Changelog

## v25 - Eggs On Hand Save Fix
- Fixed Eggs On Hand save error caused by Postgres `ON CONFLICT` requiring a matching unique/exclusion constraint.
- Replaced Eggs On Hand upsert with a safer find-then-update/insert flow.
- Preserved shared farm support and legacy user fallback.
- Updated app/cache version to v25.

## v24 - Restore Egg Entry Edit
- Restored Edit button for egg entries.
- Added edit mode and Cancel Edit for egg entry form.
- Saving during edit updates the original egg record instead of creating a duplicate.
- Updated app/cache version to v24.

## v23 - Bulletproof Invites
- Validates saved sessions before use.
- Deleted/stale accounts are forced through signup/sign-in again.
- Invite links persist through signup/email verification.
- Successful invite joins switch the user directly to the invited farm.
