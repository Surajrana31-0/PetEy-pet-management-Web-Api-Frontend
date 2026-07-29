# PetEy - Pet Management Web App

A pet adoption and management platform built with Vite, React, TypeScript, Tailwind CSS, and Supabase.

## Features

- **Authentication**: Email/password sign-up and sign-in via Supabase Auth
- **Browse Pets**: View available pets with real photos, search, species filter, and pagination (8 per page)
- **Adoption Flow**: Users can request adoption for any pet and track request status (pending/approved/rejected)
- **Blog**: Featured post layout with card grid and reading modal
- **Admin Dashboard**: Add/edit/delete pets (with image URLs), manage adoption requests, create/edit/delete blog posts
- **User Dashboard**: Browse pets, view adoption history, read blogs

## Tech Stack

- Vite + React 18 + TypeScript
- Tailwind CSS for styling
- Supabase for database, auth, and storage
- Lucide React for icons

## Getting Started

1. Install dependencies: `npm install`
2. Create a `.env` file with your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your-supabase-project-url
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```
3. Run the dev server: `npm run dev`
4. Build for production: `npm run build`

## Database Schema

- `profiles` - User profiles with admin/user roles
- `pets` - Pet listings with image, name, species, breed, age, description, status
- `adoptions` - Adoption requests linking users to pets
- `blogs` - Blog posts with title, excerpt, content, cover image, author

All tables have Row Level Security (RLS) enabled with appropriate policies.

## Making a User Admin

After signing up, manually update the user's role in the `profiles` table:

```sql
UPDATE profiles SET role = 'admin' WHERE email = 'your-email@example.com';
```
