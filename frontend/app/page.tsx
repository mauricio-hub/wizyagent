'use client';

import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  Loader2,
  X,
  Sparkles,
  ShoppingBag,
  ArrowRightLeft,
  ExternalLink,
  Bot,
  User,
} from 'lucide-react';

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

interface QuickPrompt {
  label: string;
  query: string;
}

const QUICK_PROMPTS: QuickPrompt[] = [
  {
    label: "Women's Ankle Socks",
    query: "Women's Athletic Ankle Socks",
  },
  {
    label: 'JBL GO 2 Speaker',
    query: 'JBL GO 2 Bluetooth Portable Waterproof Speaker',
  },
  {
    label: 'PS5 Digital Edition',
    query: 'Sony PlayStation 5, Digital Edition Video Game Consoles',
  },
];

export default function Home() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState<{ url: string; title: string } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleChat = async (query?: string, displayText?: string) => {
    const message = query || input;
    const userDisplay = displayText ?? message;
    if (!message.trim()) return;

    setInput('');
    setMessages((prev) => [...prev, { type: 'user', content: userDisplay }]);
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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  }, [input]);

  return (
    <div className="fixed inset-0 flex flex-col bg-[#09090b] text-zinc-100 font-sans overflow-hidden">
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-[40%] -left-[20%] h-[70%] w-[70%] rounded-full bg-violet-600/10 blur-[120px]" />
        <div className="absolute -top-[20%] -right-[15%] h-[60%] w-[55%] rounded-full bg-cyan-500/8 blur-[100px]" />
        <div className="absolute -bottom-[30%] left-[20%] h-[50%] w-[50%] rounded-full bg-indigo-600/8 blur-[110px]" />
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.04) 1px, transparent 0)',
            backgroundSize: '32px 32px',
          }}
        />
      </div>

      {/* Sticky header */}
      <header className="relative z-20 shrink-0 border-b border-white/[0.06] bg-[#09090b]/70 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-5 py-3.5 md:px-8 lg:max-w-6xl">
          <div className="flex items-center gap-3">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-500/20">
              <Sparkles className="h-4 w-4 text-white" />
              <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/20" />
            </div>
            <div>
              <h1 className="text-[15px] font-semibold tracking-tight text-white">Wizybot</h1>
              <p className="text-[11px] text-zinc-500">AI Shopping Assistant</p>
            </div>
          </div>
          {messages.length > 0 && (
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-full border border-white/[0.08] bg-white/[0.04] px-2.5 py-1 text-[11px] text-zinc-400"
            >
              {messages.length} messages
            </motion.span>
          )}
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="flex min-h-full flex-col items-center justify-center px-4 pb-36 pt-8">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="w-full max-w-3xl text-center"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.5, type: 'spring', stiffness: 200 }}
                className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/20 to-indigo-600/20 ring-1 ring-white/10"
              >
                <Bot className="h-10 w-10 text-violet-400" />
              </motion.div>

              <h2 className="bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-4xl font-bold tracking-tight text-transparent md:text-5xl">
                What can I help you find?
              </h2>
              <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-zinc-500">
                Ask about products, compare prices, or convert currencies — powered by AI.
              </p>

              <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
                {QUICK_PROMPTS.map((prompt, i) => (
                  <motion.button
                    key={prompt.label}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + i * 0.08, duration: 0.4 }}
                    whileHover={{ scale: 1.02, borderColor: 'rgba(255,255,255,0.15)' }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleChat(prompt.query, prompt.label)}
                    className="rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-[13px] text-zinc-400 transition-colors hover:bg-white/[0.06] hover:text-zinc-200"
                  >
                    {prompt.label}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </div>
        ) : (
          <div className="mx-auto w-full max-w-5xl space-y-8 px-5 py-8 md:px-8 lg:max-w-6xl">
            <AnimatePresence initial={false}>
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className={`flex gap-4 ${msg.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  {/* Avatar */}
                  <div
                    className={`mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                      msg.type === 'user'
                        ? 'bg-zinc-800 ring-1 ring-white/10'
                        : 'bg-gradient-to-br from-violet-500/20 to-indigo-600/20 ring-1 ring-violet-500/20'
                    }`}
                  >
                    {msg.type === 'user' ? (
                      <User className="h-4 w-4 text-zinc-400" />
                    ) : (
                      <Bot className="h-4 w-4 text-violet-400" />
                    )}
                  </div>

                  {/* Bubble */}
                  <div
                    className={`min-w-0 ${
                      msg.type === 'user'
                        ? 'max-w-[min(100%,28rem)]'
                        : 'max-w-[min(100%,calc(100%-3.25rem))] flex-1'
                    }`}
                  >
                    <div
                      className={`rounded-2xl px-5 py-4 ${
                        msg.type === 'user'
                          ? 'bg-white text-zinc-900 shadow-lg shadow-black/20'
                          : 'border border-white/[0.06] bg-white/[0.04] backdrop-blur-sm'
                      }`}
                    >
                      {msg.type === 'user' ? (
                        <p className="text-[15px] leading-relaxed">{msg.content as string}</p>
                      ) : (
                        <>
                          <p className="break-words text-[15px] leading-relaxed text-zinc-200">
                            {(msg.content as ChatResponse).response}
                          </p>

                          {(msg.content as ChatResponse).products &&
                            (msg.content as ChatResponse).products!.length > 0 && (
                              <div className="mt-5 space-y-3">
                                <div className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-zinc-500">
                                  <ShoppingBag className="h-3 w-3" />
                                  Products
                                </div>
                                <div className="grid gap-3 sm:grid-cols-2">
                                  {(msg.content as ChatResponse).products!.map((product, i) => (
                                    <motion.button
                                      key={i}
                                      whileHover={{ scale: 1.01 }}
                                      whileTap={{ scale: 0.99 }}
                                      onClick={() =>
                                        setSelectedImage({
                                          url: product.imageUrl,
                                          title: product.displayTitle,
                                        })
                                      }
                                      className="group flex w-full items-start gap-4 rounded-xl border border-white/[0.06] bg-white/[0.03] p-4 text-left transition-colors hover:border-white/[0.12] hover:bg-white/[0.06]"
                                    >
                                      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-zinc-800">
                                        <img
                                          src={product.imageUrl}
                                          alt={product.displayTitle}
                                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                      </div>
                                      <div className="min-w-0 flex-1">
                                        <p className="line-clamp-2 text-[14px] font-medium leading-snug text-zinc-200">
                                          {product.displayTitle}
                                        </p>
                                        <p className="mt-1.5 text-[14px] font-semibold text-violet-400">
                                          {product.price}
                                        </p>
                                      </div>
                                     
                                    </motion.button>
                                  ))}
                                </div>
                              </div>
                            )}

                          {(msg.content as ChatResponse).conversions &&
                            (msg.content as ChatResponse).conversions!.length > 0 && (
                              <div className="mt-5 space-y-3">
                                <div className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-zinc-500">
                                  <ArrowRightLeft className="h-3 w-3" />
                                  Conversions
                                </div>
                                <div className="grid gap-3 sm:grid-cols-2">
                                  {(msg.content as ChatResponse).conversions!.map((conv, i) => (
                                    <div
                                      key={i}
                                      className="flex items-center gap-3 rounded-xl border border-emerald-500/10 bg-emerald-500/[0.06] px-4 py-3.5"
                                    >
                                      <span className="break-words text-[14px] font-medium text-zinc-300">
                                        {conv.from}
                                      </span>
                                      <ArrowRightLeft className="h-3.5 w-3.5 shrink-0 text-emerald-500/60" />
                                      <span className="break-words text-[14px] font-semibold text-emerald-400">
                                        {conv.to}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                        </>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {loading && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-3"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500/20 to-indigo-600/20 ring-1 ring-violet-500/20">
                  <Bot className="h-4 w-4 text-violet-400" />
                </div>
                <div className="flex items-center gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.04] px-4 py-3 backdrop-blur-sm">
                  <Loader2 className="h-4 w-4 animate-spin text-violet-400" />
                  <div className="flex items-center gap-1">
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        className="h-1.5 w-1.5 rounded-full bg-zinc-500"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3"
                >
                  <p className="text-[13px] text-red-400">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <div ref={messagesEndRef} />
          </div>
        )}
      </main>

      {/* Floating input */}
      <div className="relative z-20 shrink-0 px-5 pb-6 pt-2 md:px-8">
        <div className="pointer-events-none absolute inset-x-0 -top-12 h-12 bg-gradient-to-t from-[#09090b] to-transparent" />
        <div className="mx-auto w-full max-w-5xl lg:max-w-6xl">
          <motion.div
            layout
            className="flex items-end gap-2 rounded-2xl border border-white/[0.08] bg-zinc-900/80 p-2 shadow-2xl shadow-black/40 backdrop-blur-xl ring-1 ring-white/[0.04]"
          >
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about products or prices..."
              rows={1}
              className="max-h-40 min-h-[44px] flex-1 resize-none bg-transparent px-3 py-2.5 text-[14px] text-zinc-100 placeholder-zinc-600 outline-none"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleChat()}
              disabled={loading || !input.trim()}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-lg shadow-violet-500/25 transition-opacity disabled:opacity-30 disabled:shadow-none"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </motion.button>
          </motion.div>
          <p className="mt-2 text-center text-[11px] text-zinc-600">
            Enter to send · Shift + Enter for new line
          </p>
        </div>
      </div>

      {/* Image modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 16 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-sm"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="overflow-hidden rounded-2xl border border-white/10 bg-zinc-900 shadow-2xl">
                <img
                  src={selectedImage.url}
                  alt={selectedImage.title}
                  className="w-full object-cover"
                />
                <div className="border-t border-white/[0.06] px-4 py-3">
                  <p className="text-center text-[13px] font-medium text-zinc-200">
                    {selectedImage.title}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-zinc-800 text-zinc-300 shadow-lg transition-colors hover:bg-zinc-700 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
