import React, { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { getMoodMatchedMovie } from '../api/gemini';

export default function AiMoodMatcher({ onMovieMatched }) {
  const [mood, setMood] = useState('');
  const [loading, setLoading] = useState(false);

  const handleMatch = async (e) => {
    e.preventDefault();
    
    if (!mood.trim()) {
      return;
    }

    setLoading(true);

    try {
      const movieTitle = await getMoodMatchedMovie(mood);
      
      if (movieTitle) {
        onMovieMatched(movieTitle);
      }
    } catch (error) {
      console.error("Failed to match mood:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleMatch} className="w-full max-w-xl mx-auto mb-8">
      <div className="relative flex items-center">
        <div className="absolute left-3 text-amber-400">
          <Sparkles className="w-5 h-5" />
        </div>
        
        <input
          type="text"
          value={mood}
          onChange={(e) => setMood(e.target.value)}
          placeholder="AI Mood Matcher: e.g., 'Action movies for a rainy day'"
          className="w-full pl-11 pr-32 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 transition-all text-sm"
        />
        
        <button
          type="submit"
          disabled={loading}
          className="absolute right-1.5 px-4 py-2 bg-red-600 text-white rounded-lg text-xs font-medium hover:bg-red-700 transition flex items-center gap-1.5 disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Sparkles className="w-3.5 h-3.5" />
          )}
          {loading ? "Matching..." : "Match"}
        </button>
      </div>
    </form>
  );
}