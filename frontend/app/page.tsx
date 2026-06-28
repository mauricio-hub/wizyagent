'use client';

import { useState } from 'react';
import axios from 'axios';

interface Product {
  displayTitle: string;
  price: string;
  imageUrl: string;
  url: string;
}

interface Conversion {
  from: string;
  to: string;
}

interface ChatResponse {
  response: string;
  products?: Product[];
  conversions?: Conversion[];
}

export default function Home() {
  const [input, setInput] = useState('');
  const [chatResponse, setChatResponse] = useState<ChatResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChat = async () => {
    if (!input.trim()) return;

    setLoading(true);
    setError('');
    setChatResponse(null);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const result = await axios.post<ChatResponse>(`${apiUrl}/chat`, {
        input,
      });
      setChatResponse(result.data);
      setInput('');
    } catch (err) {
      setError('Error calling API. Make sure backend is running.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleChat();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Wizybot Chat</h1>

        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about products or prices... (Enter to send, Shift+Enter for new line)"
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

        {chatResponse && (
          <div className="mt-6 space-y-6">
            <div className="p-4 bg-indigo-50 rounded-lg">
              <p className="text-gray-800">{chatResponse.response}</p>
            </div>

            {chatResponse.products && chatResponse.products.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">Products</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {chatResponse.products.map((product, idx) => (
                    <a
                      key={idx}
                      href={product.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition"
                    >
                      <img
                        src={product.imageUrl}
                        alt={product.displayTitle}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-3">
                        <h3 className="font-semibold text-gray-800">{product.displayTitle}</h3>
                        <p className="text-indigo-600 font-bold">{product.price}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {chatResponse.conversions && chatResponse.conversions.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">Currency Conversions</h2>
                <div className="space-y-2">
                  {chatResponse.conversions.map((conv, idx) => (
                    <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-gray-700">
                        <span className="font-semibold">{conv.from}</span> = <span className="text-green-600 font-semibold">{conv.to}</span>
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
