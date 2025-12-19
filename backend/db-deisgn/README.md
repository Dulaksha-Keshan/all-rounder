# Database Design

## PostgreSQL (Prisma) - User Service
- User accounts and profiles
- Follow relationships
- User authentication metadata

## MongoDB (Mongoose) - Content Service  
- Posts and media
- Comments
- Likes and reactions

## Design Decisions
- Polyglot persistence: SQL for relational user data, NoSQL for flexible content
- Event-driven sync: Kafka events when user data changes

## Schema Links
- [Prisma Schema](./prisma/schema.prisma)
- [Mongoose Schemas](./mongoose/)