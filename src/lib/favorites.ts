import { supabase } from './supabase';

// 1. Get all favorites
export const getFavorites = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    // Fallback to local storage if not logged in
    const saved = localStorage.getItem('culinara_favs');
    return saved ? JSON.parse(saved) : [];
  }

  const { data, error } = await supabase
    .from('favorites')
    .select('*')
    .eq('user_id', user.id);

  if (error) {
    console.error('Error fetching favorites:', error);
    return [];
  }

  // Map the DB format back to your Recipe format
  return data.map(f => ({
    id: f.recipe_id,
    title: f.recipe_title,
    image: f.recipe_image
  }));
};

// 2. Toggle Favorite
export const toggleFavorite = async (recipe: any) => {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    alert("Please log in to save favorites to your account!");
    return;
  }

  // Check if it already exists
  const { data: existing } = await supabase
    .from('favorites')
    .select('id')
    .eq('user_id', user.id)
    .eq('recipe_id', recipe.id)
    .single();

  if (existing) {
    // Remove it
    await supabase.from('favorites').delete().eq('id', existing.id);
  } else {
    // Add it
    await supabase.from('favorites').insert([
      { 
        user_id: user.id, 
        recipe_id: recipe.id, 
        recipe_title: recipe.title, 
        recipe_image: recipe.image 
      }
    ]);
  }

  window.dispatchEvent(new Event('favoritesUpdated'));
};