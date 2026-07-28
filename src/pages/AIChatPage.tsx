import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Send, Sparkles, MessageCircle, Trash2, PawPrint, Bot } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { fetchChatHistory, saveChatMessage } from '@/lib/api';
import { generateSessionId } from '@/lib/ai';
import type { ChatMessage } from '@/types';
import { cn } from '@/lib/utils';

interface DisplayMessage {
  role: 'user' | 'assistant';
  content: string;
}

const PET_CARE_KNOWLEDGE: Record<string, string[]> = {
  dog: [
    'Dogs need daily exercise — at least 30 minutes for most breeds, more for high-energy ones.',
    'A balanced diet with quality dog food is essential. Consult your vet for breed-specific recommendations.',
    'Regular vet check-ups, vaccinations, and dental care keep your dog healthy.',
    'Socialization from an early age helps dogs become well-adjusted companions.',
  ],
  cat: [
    'Cats need mental stimulation — interactive toys and scratching posts are essential.',
    'A clean litter box in a quiet location helps cats feel secure.',
    'Cats are obligate carnivores — feed them high-protein, quality cat food.',
    'Even indoor cats need regular vet check-ups and vaccinations.',
  ],
  adoption: [
    'Take time to let a new pet adjust — they may need a few weeks to feel at home.',
    'Set up a quiet, comfortable space for your new pet before bringing them home.',
    'Gradually introduce new pets to existing household members and other pets.',
    'Be patient — every pet adjusts at their own pace.',
  ],
  general: [
    'Always research a breed before adopting to understand their needs and temperament.',
    'Consider your lifestyle, living space, and schedule when choosing a pet.',
    'Spaying/neutering helps control pet population and can improve health.',
    'Microchipping your pet increases the chances of reunion if they get lost.',
  ],
};

function generateResponse(message: string): string {
  const lower = message.toLowerCase();

  if (lower.includes('dog') || lower.includes('puppy')) {
    const tips = PET_CARE_KNOWLEDGE.dog;
    if (lower.includes('adopt') || lower.includes('get') || lower.includes('choose')) {
      return `When adopting a dog, consider your living space and activity level. ${tips[0]} ${tips[3]} Would you like me to recommend specific breeds that match your lifestyle?`;
    }
    if (lower.includes('food') || lower.includes('feed') || lower.includes('eat')) {
      return tips[1];
    }
    if (lower.includes('health') || lower.includes('vet') || lower.includes('sick')) {
      return tips[2];
    }
    return `Here are some key things to know about dogs: ${tips.join(' ')}`;
  }

  if (lower.includes('cat') || lower.includes('kitten')) {
    const tips = PET_CARE_KNOWLEDGE.cat;
    if (lower.includes('adopt') || lower.includes('get') || lower.includes('choose')) {
      return `When adopting a cat, consider their personality and your home environment. ${tips[0]} ${tips[1]} Would you like to browse our available cats?`;
    }
    if (lower.includes('food') || lower.includes('feed') || lower.includes('eat')) {
      return tips[2];
    }
    return `Here are some key things to know about cats: ${tips.join(' ')}`;
  }

  if (lower.includes('adopt') || lower.includes('process') || lower.includes('how')) {
    const tips = PET_CARE_KNOWLEDGE.adoption;
    return `The adoption process at PetEy is simple:\n\n1. Browse available pets on our Browse Pets page\n2. Click on a pet you're interested in to view their profile\n3. Click "Start Adoption" and fill out the application\n4. Our team reviews your application\n5. If approved, you complete the adoption!\n\n${tips[0]} ${tips[1]}`;
  }

  if (lower.includes('recommend') || lower.includes('match') || lower.includes('suggest')) {
    return `I'd love to help you find a match! Please visit your Profile page to set your preferences (preferred pet types, size, activity level, etc.), then check out our AI Matching page for personalized recommendations. ${PET_CARE_KNOWLEDGE.general[0]}`;
  }

  if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
    return `Hello! I'm PetEy AI, your pet adoption assistant. I can help you with:\n\n- Choosing the right pet for your lifestyle\n- Understanding the adoption process\n- Pet care tips for dogs and cats\n- Answering general pet questions\n\nWhat would you like to know?`;
  }

  if (lower.includes('thank')) {
    return `You're welcome! If you have more questions, I'm always here. Don't forget to check out our Browse Pets page to see all available pets!`;
  }

  const general = PET_CARE_KNOWLEDGE.general;
  return `That's a great question! ${general[Math.floor(Math.random() * general.length)]}\n\nI can help with questions about dogs, cats, the adoption process, pet care, and more. Could you tell me a bit more about what you're looking for?`;
}

export default function AIChatPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<DisplayMessage[]>([]);
  const [input, setInput] = useState('');
  const [sessionId] = useState(() => generateSessionId());
  const [loading, setLoading] = useState(false);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) return;
    fetchChatHistory(sessionId)
      .then((history) => {
        if (history.length > 0) {
          setMessages(
            history
              .filter((m) => m.role !== 'system')
              .map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content }))
          );
        } else {
          setMessages([
            {
              role: 'assistant',
              content: "Hello! I'm PetEy AI, your pet adoption assistant. I can help you choose the right pet, understand the adoption process, and answer pet care questions. What would you like to know?",
            },
          ]);
        }
        setHistoryLoaded(true);
      })
      .catch(() => {
        setMessages([
          {
            role: 'assistant',
            content: "Hello! I'm PetEy AI, your pet adoption assistant. I can help you choose the right pet, understand the adoption process, and answer pet care questions. What would you like to know?",
          },
        ]);
        setHistoryLoaded(true);
      });
  }, [user, sessionId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function handleSend() {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      await saveChatMessage(sessionId, 'user', userMessage);

      // Simulate AI response with typing delay
      const response = generateResponse(userMessage);

      // Stream the response word by word for a natural feel
      const words = response.split(' ');
      let currentResponse = '';

      for (let i = 0; i < words.length; i++) {
        await new Promise((r) => setTimeout(r, 30));
        currentResponse += (i === 0 ? '' : ' ') + words[i];
        setMessages((prev) => {
          const newMessages = [...prev];
          if (newMessages[newMessages.length - 1]?.role === 'assistant' && newMessages[newMessages.length - 1]?.content === currentResponse.slice(0, -words[i].length - 1).trim()) {
            newMessages[newMessages.length - 1] = { role: 'assistant', content: currentResponse };
          } else if (newMessages[newMessages.length - 1]?.role !== 'assistant' || !newMessages[newMessages.length - 1]?.content.startsWith(words[0])) {
            newMessages.push({ role: 'assistant', content: currentResponse });
          } else {
            newMessages[newMessages.length - 1] = { role: 'assistant', content: currentResponse };
          }
          return newMessages;
        });
      }

      await saveChatMessage(sessionId, 'assistant', response);
    } catch (err) {
      console.error('Chat error:', err);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyPress(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  const suggestions = [
    'What kind of dog is good for apartments?',
    'How does the adoption process work?',
    'What should I know about adopting a cat?',
    'Can you recommend a pet for me?',
  ];

  return (
    <div className="animate-fade-in flex flex-col bg-stone-50" style={{ minHeight: 'calc(100vh - 4rem)' }}>
      <div className="container-app section-padding py-6 flex flex-col flex-1" style={{ maxWidth: '800px' }}>
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 text-white">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-stone-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
              PetEy AI Assistant
            </h1>
            <p className="text-sm text-stone-500">Ask me about pet care, adoption, and recommendations.</p>
          </div>
        </div>

        {/* Messages */}
        <div className="card flex-1 overflow-hidden flex flex-col">
          <div className="flex-1 overflow-y-auto p-6 space-y-4" style={{ maxHeight: '60vh' }}>
            {!historyLoaded ? (
              <div className="flex items-center justify-center py-8">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-stone-200 border-t-teal-600" />
              </div>
            ) : (
              messages.map((msg, i) => (
                <div
                  key={i}
                  className={cn(
                    'flex gap-3 animate-fade-in',
                    msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                  )}
                >
                  <div className={cn(
                    'flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg',
                    msg.role === 'user' ? 'bg-stone-200' : 'bg-gradient-to-br from-teal-500 to-teal-600 text-white'
                  )}>
                    {msg.role === 'user' ? <span className="text-xs font-bold text-stone-600">You</span> : <Bot className="h-4 w-4" />}
                  </div>
                  <div className={cn(
                    'max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap',
                    msg.role === 'user'
                      ? 'bg-teal-600 text-white rounded-tr-sm'
                      : 'bg-stone-100 text-stone-700 rounded-tl-sm'
                  )}>
                    {msg.content}
                  </div>
                </div>
              ))
            )}
            {loading && messages[messages.length - 1]?.role === 'user' && (
              <div className="flex gap-3 animate-fade-in">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-teal-500 to-teal-600 text-white">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="flex items-center gap-1 rounded-2xl bg-stone-100 px-4 py-3">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-stone-400" style={{ animationDelay: '0ms' }} />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-stone-400" style={{ animationDelay: '150ms' }} />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-stone-400" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggestions */}
          {messages.length <= 1 && (
            <div className="border-t border-stone-100 p-4">
              <p className="mb-3 text-xs font-medium text-stone-500">Try asking:</p>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => { setInput(s); }}
                    className="rounded-full border border-stone-200 bg-white px-3 py-1.5 text-xs text-stone-600 transition-all hover:border-teal-300 hover:bg-teal-50 hover:text-teal-700"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="border-t border-stone-200 p-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask me anything about pets..."
                className="input-field"
                disabled={loading}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || loading}
                className="btn-primary px-4"
                title="Send"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between text-xs text-stone-400">
          <span className="flex items-center gap-1.5">
            <MessageCircle className="h-3.5 w-3.5" />
            Session: {sessionId.slice(0, 16)}...
          </span>
          <Link to="/pets" className="flex items-center gap-1.5 hover:text-teal-600">
            <PawPrint className="h-3.5 w-3.5" />
            Browse Pets Instead
          </Link>
        </div>
      </div>
    </div>
  );
}
