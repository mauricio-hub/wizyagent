'use client';

import { useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChat = async () => {
    if (!input.trim()) return;

    setLoading(true);
    setError('');
    setResponse('');

    try {
      const result = await axios.post('http://localhost:3001/chat', {
        model: 'gpt-4',
        input,
      });
      setResponse(result.data.response);
    } catch (err) {
      setError('Error calling API. Make sure backend is running.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Wizybot Chat</h1>

        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Say hello in one sentence"
          className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
          rows={3}
        />

        <button
          onClick={handleChat}
          disabled={loading || !input.trim()}
          className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 transition"
        >
          {loading ? 'Loading...' : 'Send'}
        </button>

        {error && (
          <div className="mt-4 p-4 bg-red-50 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {response && (
          <div className="mt-4 p-4 bg-indigo-50 rounded-lg">
            <p className="text-gray-800">{response}</p>
          </div>
        )}
      </div>
    </div>
  );
}
