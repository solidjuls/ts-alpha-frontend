# Tournament API Migration Guide

## Overview

This guide helps you migrate from the Next.js API route (`pages/api/game/tournaments.ts`) to the new NestJS backend tournament API.

## API Endpoint Changes

### Old Next.js API
```
GET/POST/PUT/PATCH/DELETE /api/game/tournaments
```

### New NestJS API
```
GET/POST/PUT/PATCH/DELETE /api/tournaments
```

## Method Mapping

### 1. GET Requests

**Get tournaments by status:**
```typescript
// Old way
const response = await fetch('/api/game/tournaments?status=1,2,3');

// New way
import { useTournamentsByStatus } from 'hooks/useTournaments';
const { data: tournaments } = useTournamentsByStatus([1, 2, 3]);

// Or direct service call
import tournamentsService from 'services/tournaments.service';
const tournaments = await tournamentsService.getTournamentsByStatus([1, 2, 3]);
```

**Get tournaments by ID:**
```typescript
// Old way
const response = await fetch('/api/game/tournaments?id=1,2,3');

// New way
const { data: tournaments } = useTournamentsById(['1', '2', '3']);
```

**Get registered players:**
```typescript
// Old way
const response = await fetch('/api/game/tournaments?id=123&players=true');

// New way
const { data: players } = useRegisteredPlayers(123);
```

### 2. POST Requests

**Register for tournament:**
```typescript
// Old way
const response = await fetch('/api/game/tournaments', {
  method: 'POST',
  body: JSON.stringify({ id: 123, userEmail: 'user@example.com' })
});

// New way
const registerMutation = useRegisterForTournament();
registerMutation.mutate({ id: 123, userEmail: 'user@example.com' });
```

**Update tournament status:**
```typescript
// Old way
const response = await fetch('/api/game/tournaments', {
  method: 'POST',
  body: JSON.stringify({ id: 123, status: 2 })
});

// New way
const updateStatusMutation = useUpdateTournamentStatus();
updateStatusMutation.mutate({ id: 123, status: 2 });
```

### 3. PUT Requests

**Update tournament details:**
```typescript
// Old way
const response = await fetch('/api/game/tournaments', {
  method: 'PUT',
  body: JSON.stringify({
    id: 123,
    tournamentName: 'New Name',
    status: 2,
    startingDate: '2024-01-01',
    description: 'Updated description'
  })
});

// New way
const updateMutation = useUpdateTournament();
updateMutation.mutate({
  id: 123,
  tournamentName: 'New Name',
  status: 2,
  startingDate: new Date('2024-01-01'),
  description: 'Updated description'
});
```

### 4. PATCH Requests

**Create tournament:**
```typescript
// Old way
const response = await fetch('/api/game/tournaments', {
  method: 'PATCH',
  body: JSON.stringify({
    name: 'Tournament Name',
    status: 1,
    admins: 123,
    startingDate: '2024-01-01',
    description: 'Description'
  })
});

// New way
const createMutation = useCreateTournament();
createMutation.mutate({
  tournamentName: 'Tournament Name', // Note: changed from 'name' to 'tournamentName'
  status: 1,
  admins: '123', // Note: now string instead of number
  startingDate: new Date('2024-01-01'),
  description: 'Description'
});
```

### 5. DELETE Requests

**Delete tournament:**
```typescript
// Old way
const response = await fetch('/api/game/tournaments?id=123', {
  method: 'DELETE'
});

// New way
const deleteMutation = useDeleteTournament();
deleteMutation.mutate('123');
```

## Key Changes

### 1. Authentication
- **Old**: No authentication required
- **New**: JWT authentication required (except health endpoint)
- All requests now require valid authentication cookies

### 2. Error Handling
- **Old**: Basic try-catch with 500 errors
- **New**: Proper HTTP status codes and structured error responses
- Better error messages and validation

### 3. Data Validation
- **Old**: Basic validation
- **New**: TypeScript DTOs with proper validation
- Structured request/response interfaces

### 4. Response Format
- **Old**: Direct database responses
- **New**: Consistent response format with proper typing

## Migration Steps

### Step 1: Update Imports
Replace old API calls with new service imports:

```typescript
// Remove old direct fetch calls
// Add new imports
import { useTournamentsByStatus, useCreateTournament, etc. } from 'hooks/useTournaments';
import tournamentsService from 'services/tournaments.service';
```

### Step 2: Replace API Calls
Update all tournament-related API calls to use the new hooks or service methods.

### Step 3: Update Error Handling
```typescript
// Old way
try {
  const response = await fetch('/api/game/tournaments');
  const data = await response.json();
} catch (error) {
  console.error('Error:', error);
}

// New way
const { data, error, isLoading } = useTournamentsByStatus([1, 2, 3]);

if (error) {
  console.error('Tournament fetch error:', error);
}
```

### Step 4: Update Authentication
Ensure users are authenticated before making tournament API calls:

```typescript
import { useAuth } from 'hooks/useAuth';

const { user, isAuthenticated } = useAuth();

// Only make tournament calls if authenticated
if (isAuthenticated) {
  const { data } = useTournamentsByStatus([1, 2, 3]);
}
```

### Step 5: Test Migration
1. Test all tournament operations (CRUD)
2. Verify authentication works
3. Check error handling
4. Validate data consistency

## Benefits of Migration

1. **Type Safety**: Full TypeScript support with proper interfaces
2. **Authentication**: Secure JWT-based authentication
3. **Caching**: React Query provides automatic caching and synchronization
4. **Error Handling**: Better error messages and status codes
5. **Scalability**: NestJS backend can be deployed independently
6. **Maintainability**: Cleaner separation of concerns

## Rollback Plan

If issues arise, you can temporarily revert by:
1. Keeping the old `pages/api/game/tournaments.ts` file
2. Updating the service to point back to the old endpoint
3. Removing authentication requirements temporarily

## Testing Checklist

- [ ] Get tournaments by status works
- [ ] Get tournaments by ID works  
- [ ] Get registered players works
- [ ] Create tournament works
- [ ] Update tournament works
- [ ] Update tournament status works
- [ ] Register for tournament works
- [ ] Delete tournament works
- [ ] Authentication is enforced
- [ ] Error handling works properly
- [ ] React Query caching works
- [ ] Loading states work correctly
