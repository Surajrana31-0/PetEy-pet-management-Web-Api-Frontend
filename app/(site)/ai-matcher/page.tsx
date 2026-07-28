'use client';

import { useState } from 'react';
import { Sparkles, Send, Heart, Zap, MessageSquare, ArrowRight, Bot, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

const SUGGESTED_QUESTIONS = [
  'What dog breed is best for apartments?',
  'I work full time — which pet is right for me?',
  'How do I prepare my home for a cat?',
  'What\'s the adoption process like?',
];

const SAMPLE_RESPONSES: Record<string, string> = {
  apartment: 'For apartment living, consider smaller breeds like French Bulldogs, Cavalier King Charles Spaniels, or Greyhounds. They\'re low-energy and adapt well to compact spaces. Cats are also excellent apartment companions!',
  'full time': 'If you work full time, consider an adult cat — they\'re independent and comfortable alone for stretches. For dogs, look at breeds like Basset Hounds or Greyhounds that have lower exercise needs. Consider adopting two pets for companionship!',
  home: 'To prepare for a cat: secure loose wires, remove toxic plants (lilies are deadly!), set up a litter box in a quiet spot, and provide vertical spaces like cat trees. Budget for food, litter, vet visits, and toys.',
  process: 'Our adoption process is simple: 1) Browse available pets, 2) Submit an application, 3) Get matched using our AI compatibility score, 4) Meet the pet, 5) Complete the adoption. Most adoptions complete within 1-2 weeks!',
  default: 'I\'d love to help you find the perfect pet! Tell me about your living situation, activity level, and what you\'re looking for in a companion. I can recommend breeds, estimate compatibility, and guide you through the adoption process.',
};

function getResponse(input: string): string {
  const lower = input.toLowerCase();
  if (lower.includes('apartment') || lower.includes('small space')) return SAMPLE_RESPONSES.apartment;
  if (lower.includes('work') || lower.includes('full time')) return SAMPLE_RESPONSES['full time'];
  if (lower.includes('home') || lower.includes('prepare')) return SAMPLE_RESPONSES.home;
  if (lower.includes('process') || lower.includes('adopt')) return SAMPLE_RESPONSES.process;
  return SAMPLE_RESPONSES.default;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function AIMatcherPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hi! I\'m PetEy AI, your personal pet matching assistant. Tell me about your lifestyle and I\'ll help you find the perfect companion! 🐾' },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    setMessages((prev) => [...prev, { role: 'user', content: text }]);
    setInput('');
    setTyping(true);

    setTimeout(() => {
      setTyping(false);
      setMessages((prev) => [...prev, { role: 'assistant', content: getResponse(text) }]);
    }, 1200);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <Badge variant="secondary" className="mb-4">
          <Sparkles className="mr-1.5 h-3.5 w-3.5 text-primary" /> AI Powered
        </Badge>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-balance">
          AI Pet Matcher
        </h1>
        <p className="mt-4 text-lg text-muted-foreground text-balance">
          Chat with our AI assistant to find your perfect pet companion based on your lifestyle, personality, and preferences.
        </p>
      </div>

      <div className="mx-auto mt-10 max-w-3xl">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            { icon: Zap, title: 'Instant Matching', desc: 'Get recommendations in seconds' },
            { icon: Heart, title: 'Compatibility Score', desc: 'See how well you match' },
            { icon: MessageSquare, title: 'Natural Chat', desc: 'Just talk — no forms needed' },
          ].map((f) => {
            const Icon = f.icon;
            return (
              <Card key={f.title} className="border-border/60 shadow-card">
                <CardContent className="p-5 text-center">
                  <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </span>
                  <h3 className="mt-3 text-sm font-semibold">{f.title}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">{f.desc}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="mt-8 overflow-hidden border-border/60 shadow-card">
          <div className="flex h-[500px] flex-col">
            <div className="flex items-center gap-3 border-b border-border bg-card/50 px-4 py-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full gradient-warm text-white">
                <Bot className="h-5 w-5" />
              </span>
              <div>
                <div className="text-sm font-semibold">PetEy AI</div>
                <div className="flex items-center gap-1 text-xs text-success">
                  <span className="h-2 w-2 rounded-full bg-success" /> Online
                </div>
              </div>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto p-4">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <span
                    className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${
                      msg.role === 'user' ? 'bg-muted' : 'gradient-warm text-white'
                    }`}
                  >
                    {msg.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                  </span>
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
                      msg.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-foreground'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {typing && (
                <div className="flex gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full gradient-warm text-white">
                    <Bot className="h-4 w-4" />
                  </span>
                  <div className="flex items-center gap-1 rounded-2xl bg-muted px-4 py-3">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground" style={{ animationDelay: '0ms' }} />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground" style={{ animationDelay: '150ms' }} />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
            </div>

            {messages.length <= 2 && (
              <div className="border-t border-border p-3">
                <p className="mb-2 text-xs text-muted-foreground">Suggested questions:</p>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTED_QUESTIONS.map((q) => (
                    <button
                      key={q}
                      onClick={() => sendMessage(q)}
                      className="rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center gap-2 border-t border-border p-3">
              <Input
                placeholder="Ask about pets, breeds, adoption…"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)}
                aria-label="Chat message"
              />
              <Button onClick={() => sendMessage(input)} size="icon" className="gradient-warm text-white" aria-label="Send message">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Ready to meet your match?{' '}
            <Link href="/pets" className="inline-flex items-center font-medium text-primary hover:underline">
              Browse available pets <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
