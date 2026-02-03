"use client";

import { useState, useEffect } from 'react';
import { searchRecipes } from '../lib/api';
import RecipeCard from '../components/RecipeCard'; 
import Navbar from '../components/Navbar';
import { Recipe } from '../types/recipe';
import { getFavorites } from '../lib/favorites';
import { Search, Utensils, Sparkles } from 'lucide-react';
// 1. Import Supabase Client
import { supabase } from '../lib/supabase';

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'signup' | 'login'>('signup');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [favCount, setFavCount] = useState(0);

  // 2. Add formData state to track input values
  const [formData, setFormData] = useState({ email: '', password: '', fullName: '' });

  const [query, setQuery] = useState('');
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
    const updateCount = () => {
      const favs = getFavorites();
      setFavCount(favs.length);
    };

    updateCount();
    window.addEventListener('storage', updateCount);
    window.addEventListener('favoritesUpdated', updateCount);
    
    const handleLoginTrigger = () => {
      setIsLoggedIn(false);
      setActiveTab('login');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    window.addEventListener('openLogin', handleLoginTrigger);

    return () => {
      window.removeEventListener('storage', updateCount);
      window.removeEventListener('favoritesUpdated', updateCount);
      window.removeEventListener('openLogin', handleLoginTrigger);
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut(); // Sign out from Supabase
    setIsLoggedIn(false);
    setRecipes([]); 
    setQuery('');   
    setFavCount(0);
  };

  // 3. The New Supabase Auth Handler
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (activeTab === 'signup') {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName, // Stores name in metadata
          }
        }
      });
      
      if (error) alert(error.message);
      else setShowSuccessModal(true);
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });
      
      if (error) alert(error.message);
      else setIsLoggedIn(true);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;
    setLoading(true);
    try {
      const results = await searchRecipes(query);
      setRecipes(results || []);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen selection:bg-orange-500/30">
      <Navbar 
        isLoggedIn={isLoggedIn} 
        onLogout={handleLogout} 
        favoritesCount={favCount} 
      />

      {isLoggedIn ? (
        /* --- VIEW 1: RECIPE FINDER --- */
        <main className="max-w-6xl mx-auto p-6 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <section className="py-16 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 text-orange-600 text-sm font-bold mb-6">
              <Sparkles size={16} /> AI Discovery Active
            </div>
            <h1 className="text-5xl md:text-6xl font-black mb-4 tracking-tighter">
              What's in your <span className="text-orange-600 italic">fridge?</span>
            </h1>
            
            <form onSubmit={handleSearch} className="flex max-w-3xl mx-auto gap-3 mb-20">
              <input 
                type="text" 
                placeholder="Chicken, pasta, garlic..." 
                className="flex-1 p-5 rounded-3xl border border-[var(--card-border)] bg-[var(--card-bg)] shadow-sm outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all text-lg"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button className="bg-orange-600 text-white px-10 py-5 rounded-3xl font-black hover:bg-orange-700 shadow-xl shadow-orange-500/20 active:scale-95 transition-all">
                {loading ? 'Finding...' : 'Search'}
              </button>
            </form>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {recipes.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          </section>
        </main>
      ) : (
        /* --- VIEW 2: LANDING PAGE --- */
        <main className="min-h-[calc(100vh-80px)] flex items-center px-6 overflow-hidden">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center w-full py-12 relative">
            <div className="space-y-8 text-center lg:text-left">
              <h1 className="text-7xl md:text-8xl font-black leading-[0.9] tracking-tighter">
                Cook with <br /><span className="text-orange-600">Confidence.</span>
              </h1>
            </div>

            <div className="bg-[var(--card-bg)] p-10 rounded-[3rem] shadow-2xl border border-[var(--card-border)] max-w-md w-full mx-auto">
              <div className="flex bg-stone-100 dark:bg-stone-800 p-1.5 rounded-[1.5rem] mb-10">
                <button 
                  onClick={() => setActiveTab('signup')} 
                  className={`flex-1 py-4 rounded-[1.25rem] font-black transition-all duration-300 ${activeTab === 'signup' ? 'bg-white dark:bg-stone-900 text-orange-600 shadow-xl' : 'text-stone-400'}`}
                >Sign Up</button>
                <button 
                  onClick={() => setActiveTab('login')} 
                  className={`flex-1 py-4 rounded-[1.25rem] font-black transition-all duration-300 ${activeTab === 'login' ? 'bg-white dark:bg-stone-900 text-orange-600 shadow-xl' : 'text-stone-400'}`}
                >Log In</button>
              </div>

              {/* 4. Update inputs to use setFormData */}
              <form onSubmit={handleAuthSubmit} className="space-y-5">
                {activeTab === 'signup' && (
                  <input 
                    type="text" 
                    placeholder="Full Name" 
                    required 
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    className="w-full p-5 rounded-2xl border border-[var(--card-border)] bg-[var(--background)]" 
                  />
                )}
                <input 
                  type="email" 
                  placeholder="Email Address" 
                  required 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full p-5 rounded-2xl border border-[var(--card-border)] bg-[var(--background)]" 
                />
                <input 
                  type="password" 
                  placeholder="Password" 
                  required 
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full p-5 rounded-2xl border border-[var(--card-border)] bg-[var(--background)]" 
                />
                <button className="w-full bg-orange-600 text-white py-5 rounded-2xl font-black text-xl hover:opacity-90 active:scale-95 shadow-2xl shadow-orange-500/20">
                  {activeTab === 'signup' ? 'Join Culinara' : 'Enter Kitchen'}
                </button>
              </form>
            </div>
          </div>
          
          {/* Registration Success Modal */}
          {showSuccessModal && (
            <div className="fixed inset-0 bg-stone-950/40 backdrop-blur-xl flex items-center justify-center z-[200] p-6 animate-in fade-in duration-300">
              <div className="bg-[var(--card-bg)] p-12 rounded-[3rem] max-w-sm w-full text-center shadow-3xl border border-[var(--card-border)] animate-in zoom-in-95 duration-500">
                <div className="w-24 h-24 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center text-5xl mx-auto mb-8 animate-bounce">✓</div>
                <h2 className="text-3xl font-black text-[var(--foreground)] mb-3 tracking-tighter">Chef Registered!</h2>
                <p className="text-stone-500 mb-10 leading-relaxed font-medium">Verify your email or log in to start your journey.</p>
                <button 
                  onClick={() => { setShowSuccessModal(false); setActiveTab('login'); }}
                  className="w-full bg-orange-600 text-white py-4 rounded-xl font-black text-lg hover:bg-orange-700 transition-all shadow-xl shadow-orange-500/20"
                >
                  Back to Login
                </button>
              </div>
            </div>
          )}
        </main>
      )}
    </div>
  );
}