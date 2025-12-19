# Data Synchronization Strategy

## Problem: Username updates
When a user changes their username, we need to update:
- User Service: `users` table
- Content Service: All `posts` with that userId (doubt)

## Solution: Event-Driven Updates

### Kafka Events:
1. **user.updated** - Published by User Service
```json
   {
     "userId": "uuid",
     "username": "new_username",
     "displayName": "New Display Name",
     "profilePicUrl": "url",
     "timestamp": 1234567890
   }
```

2. **Content Service Consumes:**
   - Updates all posts where userId matches
   - Uses MongoDB bulk update for performance

### Implementation:
```typescript
// Content Service - Kafka Consumer
kafkaConsumer.subscribe({ topic: 'user.updated' });

await kafkaConsumer.run({
  eachMessage: async ({ message }) => {
    const { userId, username, displayName } = JSON.parse(message.value);
    
    // Bulk update all posts
    await Post.updateMany(
      { userId },
      { $set: { username, displayName } }
    );
  }
});
```