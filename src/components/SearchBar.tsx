"use client";

interface SearchBarProps {
  query: string;
  setQuery: (val: string) => void;
  onSearch: (e: React.FormEvent) => void;
  loading: boolean;
}

export default function SearchBar({ query, setQuery, onSearch, loading }: SearchBarProps) {
  return (
    <form onSubmit={onSearch} className="flex max-w-2xl mx-auto gap-3 mb-12">
      <div className="relative flex-1">
        <input 
          type="text" 
          value={query}
          placeholder="Search ingredients (e.g. Pasta, Chicken)..." 
          className="w-full p-4 pl-12 rounded-2xl border border-stone-200 outline-none focus:ring-2 focus:ring-orange-500 transition bg-white shadow-sm"
          onChange={(e) => setQuery(e.target.value)}
        />
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400">
          🔍
        </span>
      </div>
      <button 
        type="submit"
        disabled={loading}
        className="bg-orange-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-orange-700 transition disabled:bg-stone-300 shadow-lg shadow-orange-100 flex items-center gap-2"
      >
        {loading ? "Searching..." : "Find Recipes"}
      </button>
    </form>
  );
}