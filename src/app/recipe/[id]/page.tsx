"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
// Changed from '@/lib/api' to relative path to avoid the alias error
import { getRecipeDetails } from '../../../lib/api'; 

export default function RecipePage() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState<any>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (id) {
      getRecipeDetails(id as string)
        .then(setRecipe)
        .catch((err) => {
          console.error(err);
          setError(true);
        });
    }
  }, [id]);

  if (error) return <div className="p-10 text-center text-red-500">Failed to load recipe. Please try again later.</div>;
  if (!recipe) return <div className="p-10 text-center animate-pulse text-orange-600 font-medium">Loading yummy details...</div>;

  return (
    <main className="max-w-4xl mx-auto p-6 animate-in fade-in duration-500">
      {/* Recipe Image */}
      <img 
        src={recipe.image} 
        alt={recipe.title} 
        className="w-full h-64 md:h-96 object-cover rounded-3xl mb-8 shadow-lg" 
      />
      
      <h1 className="text-4xl font-bold text-stone-900 mb-4">{recipe.title}</h1>
      
      {/* Badges */}
      <div className="flex flex-wrap gap-4 mb-8 text-sm font-medium">
        <span className="bg-orange-100 text-orange-700 px-4 py-2 rounded-full shadow-sm">⏱ {recipe.readyInMinutes} mins</span>
        <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full shadow-sm">🥗 {recipe.servings} servings</span>
        {recipe.vegetarian && <span className="bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full shadow-sm">🌿 Vegetarian</span>}
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Ingredients List */}
        <section>
          <h2 className="text-2xl font-bold mb-6 text-stone-800 border-b pb-2">Ingredients</h2>
          <ul className="space-y-4">
            {recipe.extendedIngredients?.map((ing: any) => (
              <li key={ing.id} className="flex items-start text-stone-600">
                <span className="text-orange-500 mr-2">•</span>
                {ing.original}
              </li>
            ))}
          </ul>
        </section>

        {/* Instructions */}
        <section>
          <h2 className="text-2xl font-bold mb-6 text-stone-800 border-b pb-2">Instructions</h2>
          <div 
            className="prose prose-orange max-w-none text-stone-600 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: recipe.instructions || "No instructions provided for this recipe." }} 
          />
        </section>
      </div>
    </main>
  );
}