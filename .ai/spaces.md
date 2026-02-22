# Shared Spaces Module

**Issue:** #65 — Family/Group Goal Sharing with Public/Private Visibility

## Purpose

Enables collaborative financial planning by letting authenticated users:
- Create **shared spaces** (e.g., "Smith Family Goals")
- Invite members via email with a tokenized invite link
- Share individual goals with a space (visible to all members)
- Keep personal goals private (default)

## Key Files

| File | Description |
|------|-------------|
| `supabase/migrations/002_create_shared_spaces.sql` | DB schema, RLS policies, trigger |
| `lib/supabase/spaces.ts` | CRUD for spaces, memberships, invitations |
| `context/SpacesContext.tsx` | React context + `useSpaces()` hook |
| `components/Spaces/VisibilityToggle.tsx` | Private/Shared toggle UI |
| `components/Spaces/SpaceCard.tsx` | Space list item component |
| `components/Spaces/InviteMemberModal.tsx` | Email invite + shareable link |
| `components/Spaces/MembersList.tsx` | Members with role icons + remove/leave |
| `components/Spaces/CreateSpaceModal.tsx` | Create new space form |
| `components/GoalForm/StepVisibility.tsx` | Step 6 in goal creation wizard |
| `app/spaces/page.tsx` | `/spaces` — list spaces |
| `app/spaces/[id]/page.tsx` | `/spaces/[id]` — space detail |
| `app/spaces/join/[token]/page.tsx` | `/spaces/join/[token]` — accept invitation |

## Database Schema

```sql
-- shared_spaces
id TEXT PRIMARY KEY
name TEXT NOT NULL
description TEXT NOT NULL DEFAULT ''
owner_id UUID NOT NULL REFERENCES auth.users(id)
created_at TIMESTAMPTZ NOT NULL DEFAULT now()

-- space_memberships
space_id TEXT REFERENCES shared_spaces(id)
user_id UUID REFERENCES auth.users(id)
role TEXT CHECK (role IN ('owner', 'member'))
joined_at TIMESTAMPTZ NOT NULL DEFAULT now()
PRIMARY KEY (space_id, user_id)

-- space_invitations
id TEXT PRIMARY KEY
space_id TEXT REFERENCES shared_spaces(id)
invited_email TEXT NOT NULL
invited_by UUID REFERENCES auth.users(id)
token TEXT UNIQUE NOT NULL
status TEXT CHECK (status IN ('pending', 'accepted', 'declined', 'expired'))
created_at TIMESTAMPTZ NOT NULL DEFAULT now()
expires_at TIMESTAMPTZ NOT NULL DEFAULT now() + INTERVAL '7 days'

-- goals additions
visibility TEXT NOT NULL DEFAULT 'private' CHECK (visibility IN ('private', 'shared'))
space_id TEXT REFERENCES shared_spaces(id) ON DELETE SET NULL
```

## TypeScript Types

```typescript
// New union types
type GoalVisibility = 'private' | 'shared';
type SpaceRole = 'owner' | 'member';
type InvitationStatus = 'pending' | 'accepted' | 'declined' | 'expired';

// New interfaces
interface SharedSpace { id, name, description, ownerId, createdAt }
interface SpaceMembership { spaceId, userId, displayName?, role, joinedAt }
interface SpaceInvitation { id, spaceId, invitedEmail, invitedBy, token, status, createdAt, expiresAt }
interface SharedSpaceWithDetails extends SharedSpace { memberships, goals, invitations, isOwner, currentUserRole }

// Goal additions
interface Goal {
  // ... existing fields ...
  visibility: GoalVisibility;  // default 'private'
  spaceId: string | null;       // null for personal goals
}
```

## Usage Examples

### Access spaces state
```typescript
const { spaces, loading, createSpace, inviteMember } = useSpaces();
```

### Create a space
```typescript
const space = await createSpace('Smith Family', 'Our shared financial goals');
```

### Invite a member
```typescript
const invitation = await inviteMember(spaceId, 'partner@example.com');
const inviteLink = `${window.location.origin}/spaces/join/${invitation.token}`;
```

### Accept an invitation
```typescript
const { success, spaceId } = await acceptInvitation(token);
```

### Create a shared goal (in GoalForm wizard step 6)
```typescript
// GoalFormInput now has visibility and spaceId
addGoal({ ...goalData, visibility: 'shared', spaceId: selectedSpaceId });
```

## Access Control (RLS)

| Action | Who can do it |
|--------|--------------|
| View space | Owner + all members |
| Create space | Any authenticated user |
| Update/delete space | Owner only |
| View memberships | Members of that space |
| Add membership | User adding themselves (via invite) |
| Remove membership | Owner (any member) OR self (leave) |
| View invitations | Space members + inviter |
| Create invitation | Space members |
| View shared goals | Goal owner OR space members (if visibility=shared) |
| Update/delete goals | Goal owner only |

## User Flows

### Create a space + invite
1. Navigate to `/spaces` → click "New Space"
2. Fill name and description → create
3. Open space detail → click "Invite"
4. Enter email → get shareable link
5. Share link with family member

### Join via invitation
1. Open `/spaces/join/[token]`
2. If not logged in → prompted to sign in / sign up
3. Click "Accept Invitation"
4. Redirected to space detail page

### Share a goal
1. Create goal wizard → Step 6 (Sharing)
2. Toggle "Shared"
3. Select space from dropdown
4. Complete wizard → goal is visible to all space members

## Dependencies

- `useAuth()` — for current user's ID and sign-in status
- `useSpaces()` — for space list and operations
- `useGoals()` — goals filtered by `spaceId` shown in space detail
- Supabase RLS — enforces all access control server-side
