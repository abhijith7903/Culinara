"use client";

import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import RecipeCard from '../../components/RecipeCard';
import { getFavorites } from '../../lib/favorites';
import { Recipe } from '../../types/recipe';

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Recipe[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setFavorites(getFavorites());
    
    const handleUpdate = () => setFavorites(getFavorites());
    window.addEventListener('favoritesUpdated', handleUpdate);
    return () => window.removeEventListener('favoritesUpdated', handleUpdate);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Navbar isLoggedIn={true} onLogout={() => window.location.href = '/'} favoritesCount={favorites.length} />
      
      <main className="max-w-6xl mx-auto p-6 py-12">
        <header className="mb-12">
          <h1 className="text-5xl font-black tracking-tighter">
            Your <span className="text-orange-600 italic">Favorites</span>
          </h1>
          <p className="text-stone-500 mt-2">The recipes you've saved to cook later.</p>
        </header>

        {favorites.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {favorites.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        ) : (
          <div className="text-center py-32 border-4 border-dashed border-[var(--card-border)] rounded-[3.5rem]">
            <p className="text-stone-400 text-xl font-bold italic">No favorites saved yet!</p>
          </div>
        )}
      </main>
    </div>
  );
}