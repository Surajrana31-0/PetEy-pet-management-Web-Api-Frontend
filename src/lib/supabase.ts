import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export type Profile = {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'user';
  created_at: string;
};

export type Pet = {
  id: string;
  name: string;
  species: string;
  breed: string;
  age: string;
  gender: string;
  description: string;
  image_url: string;
  status: 'available' | 'adopted' | 'pending';
  created_at: string;
};

export type Adoption = {
  id: string;
  pet_id: string;
  user_id: string;
  status: 'pending' | 'approved' | 'rejected';
  notes: string;
  created_at: string;
  pet?: Pet;
};

export type Blog = {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image_url: string;
  author: string;
  created_at: string;
};
