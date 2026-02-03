"use client";

import Link from 'next/link';
import { useTheme } from 'next-themes';
import { Sun, Moon, Heart, LogOut } from 'lucide-react';
import { useEffect, useState } from 'react';

interface NavbarProps {
  isLoggedIn: boolean;
  onLogout: () => void;
  favoritesCount: number;
}

export default function Navbar({ isLoggedIn, onLogout, favoritesCount }: NavbarProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch by waiting for mount
  useEffect(() => setMounted(true), []);

  // Handler to trigger the login tab on the home page
  const handleLoginClick = () => {
    // This custom event is caught by the useEffect listener in your page.tsx
    window.dispatchEvent(new Event('openLogin'));
  };

  return (
    <nav className="sticky top-0 z-[100] w-full border-b border-[var(--card-border)] glass transition-all duration-300">
      <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="flex items-center group">
          <span className="text-2xl font-black tracking-tighter text-[var(--foreground)] group-hover:text-orange-600 transition-colors">
            Culinara
          </span>
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-3 md:gap-6">
          
          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2.5 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:scale-110 active:scale-95 transition-all"
            aria-label="Toggle Theme"
          >
            {mounted && (theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />)}
          </button>

          {isLoggedIn ? (
            <div className="flex items-center gap-2 md:gap-4">
              {/* Favorites Link (Heart Icon) */}
              <Link 
                href="/favorites" 
                className="relative p-2.5 text-stone-600 dark:text-stone-400 hover:text-orange-600 transition-colors"
              >
                <Heart 
                  size={22} 
                  fill={favoritesCount > 0 ? "currentColor" : "none"} 
                  className={favoritesCount > 0 ? "text-orange-600" : ""}
                />
                {favoritesCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 bg-orange-600 text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-[var(--background)]">
                    {favoritesCount}
                  </span>
                )}
              </Link>

              {/* Logout Button */}
              <button 
                onClick={onLogout}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all"
              >
                <LogOut size={18} />
                <span className="hidden md:inline">Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              {/* This button now triggers the auth card tab switch on the home page */}
              <button 
                onClick={handleLoginClick}
                className="text-sm font-bold text-stone-600 dark:text-stone-400 px-4 py-2 hover:text-orange-600 transition"
              >
                Login
              </button>
              <button className="bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 px-6 py-2.5 rounded-xl text-sm font-bold hover:opacity-90 transition shadow-lg">
                Join Free
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}