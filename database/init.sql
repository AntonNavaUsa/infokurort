-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Create indexes after initial data is loaded
-- These will be created by Prisma migrations
