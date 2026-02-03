"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Recipe } from '../types/recipe'; 
import { toggleFavorite, getFavorites } from '../lib/favorites';
import { Heart, ArrowRight, Loader2 } from 'lucide-react'; // Added Loader2

interface RecipeCardProps {
  recipe: Recipe;
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  const [isFav, setIsFav] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false); // Track DB save state

  useEffect(() => {
    setMounted(true);
    // Use an async function inside useEffect to fetch DB favorites
    const checkFavoriteStatus = async () => {
      const favs = await getFavorites();
      setIsFav(favs.some((f: any) => f.id === recipe?.id));
    };
    
    if (recipe?.id) {
      checkFavoriteStatus();
    }
  }, [recipe?.id]);

  const handleFavClick = async (e: React.MouseEvent) => {
    e.preventDefault(); 
    e.stopPropagation(); 
    
    if (isSyncing) return; // Prevent double-clicks

    setIsSyncing(true);
    try {
      await toggleFavorite(recipe); 
      setIsFav(!isFav);
      // Event for Navbar/Favorites page to refresh
      window.dispatchEvent(new Event('favoritesUpdated'));
    } catch (error) {
      console.error("Failed to save favorite:", error);
    } finally {
      setIsSyncing(false);
    }
  };

  if (!mounted) {
    return (
      <div className="skeleton rounded-[2.5rem] h-[380px] w-full border border-[var(--card-border)]" />
    );
  }

  return (
    <div className="group relative bg-[var(--card-bg)] rounded-[2.5rem] border border-[var(--card-border)] overflow-hidden hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-500 hover:-translate-y-2 h-full flex flex-col">
      <Link href={`/recipe/${recipe.id}`} className="flex-1 flex flex-col">
        <div className="relative h-60 overflow-hidden m-3 rounded-[2rem]">
          <img 
            src={recipe.image || 'https://via.placeholder.com/400x300?text=No+Image'} 
            alt={recipe.title} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
            <span className="text-white text-sm font-bold flex items-center gap-2">
              View Recipe <ArrowRight size={16} />
            </span>
          </div>
        </div>
        
        <div className="p-6 pt-2 flex flex-col flex-1">
          <h3 className="font-black text-[var(--foreground)] text-xl leading-tight line-clamp-2 mb-4 group-hover:text-orange-600 transition-colors">
            {recipe.title}
          </h3>
          
          <div className="mt-auto flex items-center justify-between">
            <span className="px-3 py-1 bg-stone-100 dark:bg-stone-800 rounded-full text-[10px] font-bold uppercase tracking-wider text-stone-500">
              AI Verified
            </span>
          </div>
        </div>
      </Link>

      <button 
        onClick={handleFavClick}
        disabled={isSyncing}
        aria-label="Toggle Favorite"
        className={`absolute top-6 right-6 p-3 rounded-2xl shadow-xl backdrop-blur-md transition-all duration-300 z-10 ${
          isFav 
            ? 'bg-orange-600 text-white scale-110' 
            : 'bg-white/80 dark:bg-stone-900/80 text-stone-400 hover:text-orange-600'
        } ${isSyncing ? 'opacity-70 cursor-not-allowed' : ''}`}
      >
        {isSyncing ? (
          <Loader2 size={20} className="animate-spin" />
        ) : (
          <Heart size={20} fill={isFav ? "currentColor" : "none"} strokeWidth={2.5} />
        )}
      </button>
    </div>
  );
}