'use client';

import { useState } from 'react';
import axios from 'axios';
import { Send, Loader, X } from 'lucide-react';

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

interface Message {
  type: 'user' | 'agent';
  content: ChatResponse | string;
}

export default function Home() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState<{ url: string; title: string } | null>(null);

  const handleChat = async (query?: string) => {
    const message = query || input;
    if (!message.trim()) return;

    setInput('');
    setMessages((prev) => [...prev, { type: 'user', content: message }]);
    setLoading(true);
    setError('');

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const result = await axios.post<ChatResponse>(`${apiUrl}/chat`, {
        input: message,
      });
      setMessages((prev) => [...prev, { type: 'agent', content: result.data }]);
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
    <div className="fixed inset-0 bg-slate-950 flex flex-col">
      {messages.length > 0 && (
        <div className="bg-slate-900 border-b border-slate-800 px-4 md:px-8 py-4">
          <div className="flex items-center gap-3 max-w-3xl mx-auto">
            <div className="text-3xl">🤖</div>
            <div>
              <h1 className="text-xl font-bold text-white">Wizybot</h1>
              <p className="text-xs text-gray-400">AI Shopping Assistant</p>
            </div>
          </div>
        </div>
      )}

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto px-4 md:px-8 py-8">
        <div className="max-w-3xl mx-auto space-y-6 w-full">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center pt-20">
              <div className="text-7xl mb-6">🤖</div>
              <h2 className="text-3xl font-bold text-white mb-3">Wizybot</h2>
              <p className="text-gray-400 text-lg max-w-md">
                Ask about products, prices, or currency conversions
              </p>
            </div>
          ) : (
            messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-3 ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.type === 'agent' && <div className="text-2xl flex-shrink-0">🤖</div>}
                <div
                  className={`max-w-md lg:max-w-lg ${
                    msg.type === 'user'
                      ? 'bg-white text-slate-950 rounded-3xl rounded-tr-none'
                      : 'bg-slate-800 text-gray-100 rounded-3xl rounded-tl-none border border-slate-700'
                  } p-4 space-y-4`}
                >
                  {msg.type === 'user' ? (
                    <p className="text-sm">{msg.content}</p>
                  ) : (
                    <>
                      <p className="text-sm leading-relaxed">{(msg.content as ChatResponse).response}</p>

                      {(msg.content as ChatResponse).products &&
                        (msg.content as ChatResponse).products!.length > 0 && (
                          <div className="pt-3 border-t border-slate-700 space-y-2">
                            {(msg.content as ChatResponse).products!.map((product, i) => (
                              <button
                                key={i}
                                onClick={() =>
                                  setSelectedImage({
                                    url: product.imageUrl,
                                    title: product.displayTitle,
                                  })
                                }
                                className="w-full flex items-center gap-3 bg-slate-700 hover:bg-slate-600 rounded-lg p-3 transition text-left"
                              >
                                <img
                                  src={product.imageUrl}
                                  alt={product.displayTitle}
                                  className="w-16 h-16 object-cover rounded"
                                />
                                <div className="flex-1 min-w-0">
                                  <p className="font-semibold truncate text-gray-100 text-sm">
                                    {product.displayTitle}
                                  </p>
                                  <p className="text-blue-400 font-bold text-sm">{product.price}</p>
                                </div>
                              </button>
                            ))}
                          </div>
                        )}

                      {(msg.content as ChatResponse).conversions &&
                        (msg.content as ChatResponse).conversions!.length > 0 && (
                          <div className="pt-3 border-t border-slate-700 space-y-2">
                            {(msg.content as ChatResponse).conversions!.map((conv, i) => (
                              <p key={i} className="text-sm text-gray-300">
                                <span className="font-semibold text-blue-400">{conv.from}</span> →{' '}
                                <span className="font-semibold text-green-400">{conv.to}</span>
                              </p>
                            ))}
                          </div>
                        )}
                    </>
                  )}
                </div>
              </div>
            ))
          )}
          {loading && (
            <div className="flex justify-start gap-3">
              <div className="text-2xl">🤖</div>
              <div className="bg-slate-800 border border-slate-700 rounded-3xl rounded-tl-none p-4 flex items-center gap-2">
                <Loader className="w-4 h-4 animate-spin text-blue-400" />
                <p className="text-sm text-gray-300">Thinking...</p>
              </div>
            </div>
          )}
          {error && (
            <div className="p-3 bg-red-900 bg-opacity-30 border border-red-700 rounded-lg">
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}
        </div>
      </div>

      {/* Input Area - Fixed at Bottom */}
      <div className="px-4 md:px-8 py-4 bg-slate-950 border-t border-slate-800">
        <div className="flex gap-3 max-w-3xl mx-auto">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about products or prices..."
            className="flex-1 p-4 bg-slate-800 border border-slate-700 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-slate-600 resize-none shadow-lg"
            rows={2}
          />
          <button
            onClick={() => handleChat()}
            disabled={loading || !input.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 rounded-2xl transition flex items-center justify-center shadow-lg font-medium"
          >
            {loading ? (
              <Loader className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="relative max-w-sm w-full">
            <img
              src={selectedImage.url}
              alt={selectedImage.title}
              className="w-full rounded-2xl shadow-2xl"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100"
            >
              <X className="w-5 h-5 text-gray-800" />
            </button>
            <div className="mt-3 text-center">
              <p className="text-white text-sm font-semibold">{selectedImage.title}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
