import { supabase } from '@/lib/supabase';
import type { Pet, AdoptionApplication, ApplicationData, Favorite, ChatMessage, UserProfile, UserPreferences } from '@/types';

// ─── Pets ──────────────────────────────────────────────────

export async function fetchPets(filters?: {
  species?: string;
  status?: string;
  size?: string;
  gender?: string;
  breed?: string;
  location?: string;
  goodWithKids?: boolean;
  goodWithPets?: boolean;
  minAge?: number;
  maxAge?: number;
  search?: string;
  page?: number;
  limit?: number;
}): Promise<{ pets: Pet[]; total: number }> {
  let query = supabase.from('pets').select('*', { count: 'exact' });

  if (filters?.species) query = query.eq('species', filters.species);
  if (filters?.status) query = query.eq('status', filters.status);
  if (filters?.size) query = query.eq('size', filters.size);
  if (filters?.gender) query = query.eq('gender', filters.gender);
  if (filters?.breed) query = query.ilike('breed', `%${filters.breed}%`);
  if (filters?.location) query = query.ilike('location', `%${filters.location}%`);
  if (filters?.goodWithKids) query = query.eq('good_with_kids', true);
  if (filters?.goodWithPets) query = query.eq('good_with_pets', true);
  if (filters?.minAge !== undefined) query = query.gte('age', filters.minAge);
  if (filters?.maxAge !== undefined) query = query.lte('age', filters.maxAge);
  if (filters?.search) {
    query = query.or(`name.ilike.%${filters.search}%,breed.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
  }

  const page = filters?.page ?? 1;
  const limit = filters?.limit ?? 12;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  query = query.order('created_at', { ascending: false }).range(from, to);

  const { data, error, count } = await query;

  if (error) throw new Error(error.message);

  return { pets: (data as Pet[]) ?? [], total: count ?? 0 };
}

export async function fetchPetById(id: string): Promise<Pet | null> {
  const { data, error } = await supabase.from('pets').select('*').eq('id', id).maybeSingle();
  if (error) throw new Error(error.message);
  return data as Pet | null;
}

export async function fetchFeaturedPets(limit = 6): Promise<Pet[]> {
  const { data, error } = await supabase
    .from('pets')
    .select('*')
    .eq('status', 'AVAILABLE')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw new Error(error.message);
  return (data as Pet[]) ?? [];
}

export async function fetchPetStats(): Promise<{ total: number; available: number; pending: number; adopted: number }> {
  const { count: total } = await supabase.from('pets').select('*', { count: 'exact', head: true });
  const { count: available } = await supabase.from('pets').select('*', { count: 'exact', head: true }).eq('status', 'AVAILABLE');
  const { count: pending } = await supabase.from('pets').select('*', { count: 'exact', head: true }).eq('status', 'PENDING');
  const { count: adopted } = await supabase.from('pets').select('*', { count: 'exact', head: true }).eq('status', 'ADOPTED');

  return {
    total: total ?? 0,
    available: available ?? 0,
    pending: pending ?? 0,
    adopted: adopted ?? 0,
  };
}

export async function createPet(petData: Partial<Pet>): Promise<Pet> {
  const { data, error } = await supabase.from('pets').insert(petData).select().single();
  if (error) throw new Error(error.message);
  return data as Pet;
}

export async function updatePet(id: string, petData: Partial<Pet>): Promise<Pet> {
  const { data, error } = await supabase.from('pets').update(petData).eq('id', id).select().single();
  if (error) throw new Error(error.message);
  return data as Pet;
}

export async function deletePet(id: string): Promise<void> {
  const { error } = await supabase.from('pets').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

// ─── Adoption Applications ──────────────────────────────────

export async function submitApplication(
  petId: string,
  applicationData: ApplicationData
): Promise<AdoptionApplication> {
  const { data, error } = await supabase
    .from('adoption_applications')
    .insert({
      pet_id: petId,
      application_data: applicationData,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as AdoptionApplication;
}

export async function fetchMyApplications(): Promise<AdoptionApplication[]> {
  const { data, error } = await supabase
    .from('adoption_applications')
    .select('*, pet:pets(*)')
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return (data as AdoptionApplication[]) ?? [];
}

export async function fetchAllApplications(statusFilter?: string): Promise<AdoptionApplication[]> {
  let query = supabase
    .from('adoption_applications')
    .select('*, pet:pets(*)')
    .order('created_at', { ascending: false });

  if (statusFilter && statusFilter !== 'all') {
    query = query.eq('status', statusFilter);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data as AdoptionApplication[]) ?? [];
}

export async function updateApplicationStatus(
  id: string,
  status: string,
  adminNotes?: string
): Promise<void> {
  const update: Record<string, unknown> = { status };
  if (adminNotes !== undefined) update.admin_notes = adminNotes;
  if (status === 'approved' || status === 'rejected') update.reviewed_at = new Date().toISOString();
  if (status === 'completed') update.completed_at = new Date().toISOString();

  const { error } = await supabase.from('adoption_applications').update(update).eq('id', id);
  if (error) throw new Error(error.message);
}

// ─── Favorites ──────────────────────────────────────────────

export async function fetchFavorites(): Promise<Favorite[]> {
  const { data, error } = await supabase
    .from('favorites')
    .select('*, pet:pets(*)')
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return (data as Favorite[]) ?? [];
}

export async function fetchFavoritePetIds(): Promise<string[]> {
  const { data, error } = await supabase.from('favorites').select('pet_id');
  if (error) throw new Error(error.message);
  return (data?.map((f: { pet_id: string }) => f.pet_id)) ?? [];
}

export async function addFavorite(petId: string): Promise<void> {
  const { error } = await supabase.from('favorites').insert({ pet_id: petId });
  if (error) throw new Error(error.message);
}

export async function removeFavorite(petId: string): Promise<void> {
  const { error } = await supabase.from('favorites').delete().eq('pet_id', petId);
  if (error) throw new Error(error.message);
}

// ─── Chat Messages ──────────────────────────────────────────

export async function fetchChatHistory(sessionId: string, limit = 30): Promise<ChatMessage[]> {
  const { data, error } = await supabase
    .from('chat_messages')
    .select('*')
    .eq('session_id', sessionId)
    .order('timestamp', { ascending: true })
    .limit(limit);

  if (error) throw new Error(error.message);
  return (data as ChatMessage[]) ?? [];
}

export async function saveChatMessage(
  sessionId: string,
  role: 'user' | 'assistant',
  content: string
): Promise<void> {
  const { error } = await supabase.from('chat_messages').insert({
    session_id: sessionId,
    role,
    content,
  });
  if (error) throw new Error(error.message);
}

// ─── Profile ────────────────────────────────────────────────

export async function updateProfile(
  userId: string,
  updates: Partial<UserProfile>
): Promise<void> {
  const { error } = await supabase.from('profiles').update(updates).eq('id', userId);
  if (error) throw new Error(error.message);
}

export async function updatePreferences(
  userId: string,
  preferences: UserPreferences
): Promise<void> {
  const { error } = await supabase
    .from('profiles')
    .update({ preferences })
    .eq('id', userId);
  if (error) throw new Error(error.message);
}

export async function fetchAllProfiles(): Promise<UserProfile[]> {
  const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return (data as UserProfile[]) ?? [];
}
