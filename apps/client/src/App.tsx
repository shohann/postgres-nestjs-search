/* eslint-disable @typescript-eslint/no-explicit-any */

// 

import React, { useState, useRef } from 'react';
import './App.css';

interface SearchResult {
  id: number;
  name: string;
  rating: number;
  category: string;
  zones: string[];
  branches: string[];
  combined_score: number;
  prioritize_rating: null;
}

const App: React.FC = () => {
  const [isListening, setIsListening] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [error, setError] = useState<string>('');
  const recognitionRef = useRef<any>(null);

  const startListening = () => {
    setError('');
    
    // Check if browser supports speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      // @ts-expect-error - SpeechRecognition types not available
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      
      recognitionRef.current.onstart = () => {
        setIsListening(true);
      };
      
      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setSearchText(transcript);
        searchProfessionals(transcript);
      };
      
      recognitionRef.current.onerror = (event: any) => {
        setError('Error occurred in recognition: ' + event.error);
        setIsListening(false);
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
      
      recognitionRef.current.start();
    } else {
      setError('Speech recognition is not supported in this browser.');
    }
  };

  const searchProfessionals = async (query: string) => {
    try {
      console.log(query)
      const response = await fetch(`http://localhost:4000/professionals?search=${encodeURIComponent(query)}`);
      // const response = await fetch(`http://localhost:5000/users?search=${encodeURIComponent(query)}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError('Failed to fetch results');
      console.error('Error fetching data:', err);
    }
  };

  const handleManualSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchText.trim()) {
      searchProfessionals(searchText);
    }
  };

  return (
    <div className="container">
      <h1>Voice Search Assistant</h1>
      
      <form onSubmit={handleSubmit} className="search-form">
        <div className="search-container">
          <input
            type="text"
            value={searchText}
            onChange={handleManualSearch}
            placeholder="Search for professionals..."
            className="search-input"
          />
          <button
            type="button"
            onClick={startListening}
            className={`mic-button ${isListening ? 'listening' : ''}`}
          >
            🎤
          </button>
          <button
            type="submit"
            className="submit-button"
          >
            Search
          </button>
        </div>
      </form>

      {error && <div className="error">{error}</div>}

      <div className="results">
        {results.map((result) => (
          <div key={result.id} className="result-item">
            <h3>{result.name}</h3>
            <p>Rating: {result.rating}</p>
            <p>Category: {result.category}</p>
            <p>Zones: {result.zones.join(', ')}</p>
            <p>Branches: {result.branches.join(', ')}</p>
            <p>Combined Score: {result.combined_score}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;