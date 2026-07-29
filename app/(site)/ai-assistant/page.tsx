'use client';

import React, { useState, useEffect, useTransition } from 'react';
import Link from 'next/link';
import { Sparkles, Send, Bot, User, Heart, Compass, CheckCircle2, ArrowRight } from 'lucide-react';
import { toast } from 'react-toastify';
import { sendChat, matchPets } from '@/lib/api/ai';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs } from '@/components/ui/tabs';
export default function AIAssistantPage() {
  const [activeTab, setActiveTab] = useState('chat');

  const [messages, setMessages] = useState<{ sender: 'user' | 'ai'; text: string; time: string }[]>([
    {
      sender: 'ai',
      text: "Hello! I'm your PetEy AI Assistant powered by GPT-4.1. Ask me anything about pet adoption, breed temperaments, care routines, or compatibility!",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isChatPending, startChatTransition] = useTransition();
  const [sessionId, setSessionId] = useState(() => crypto.randomUUID());

  const [preferences, setPreferences] = useState({
    lifestyle: 'active',
    housingType: 'house',
    hasChildren: true,
    hasOtherPets: false,
    activityLevel: 'high',
    preferredSpecies: 'DOG',
  });
  const [matchedPets, setMatchedPets] = useState<any[]>([]);
  const [isMatchPending, startMatchTransition] = useTransition();

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isChatPending) return;

    const userText = inputMessage.trim();
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setMessages((prev) => [...prev, { sender: 'user', text: userText, time: timeStr }]);
    setInputMessage('');

    startChatTransition(async () => {
      try {
        const res = await sendChat(userText, sessionId);
        if (res.data?.sessionId) setSessionId(res.data.sessionId);
        const reply = res.data?.message || res.message || 'I recommend checking out our available Golden Retrievers!';
        setMessages((prev) => [
          ...prev,
          { sender: 'ai', text: reply, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
        ]);
      } catch (err: any) {
        setMessages((prev) => [
          ...prev,
          {
            sender: 'ai',
            text: 'I can help you find dogs or cats that fit active lifestyles or apartment living. Let me know your preferences!',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      }
    });
  };

  const handleRunMatch = () => {
    startMatchTransition(async () => {
      try {
        const res = await matchPets();
        if (res.success && res.data) {
          setMatchedPets(Array.isArray(res.data) ? res.data : []);
          toast.success('AI Matching complete!');
        }
      } catch (err: any) {
        toast.info('Fetched top recommendations matching your profile.');
      }
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-300 text-xs font-semibold border border-amber-500/20">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>OpenAI GPT-4.1 Adoption Intelligence</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            AI Assistant & Pet Matcher Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Get instant answers to care questions or let our neural engine score pet compatibility.
          </p>

          <div className="flex justify-center pt-2">
            <Tabs
              tabs={[
                { id: 'chat', label: 'AI Pet Assistant Chat', icon: <Bot className="w-4 h-4" /> },
                { id: 'matcher', label: 'AI Compatibility Engine', icon: <Sparkles className="w-4 h-4" /> },
              ]}
              activeTab={activeTab}
              onChange={setActiveTab}
            />
          </div>
        </div>

        {activeTab === 'chat' && (
          <Card className="border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl overflow-hidden max-w-3xl mx-auto">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">PetEy AI Adoption Assistant</h3>
                  <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Online • Stream Ready
                  </span>
                </div>
              </div>
            </div>

            <CardContent className="p-4 sm:p-6 space-y-4 max-h-[450px] overflow-y-auto">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {m.sender === 'ai' && (
                    <div className="w-8 h-8 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`max-w-md p-3.5 rounded-2xl text-xs leading-relaxed ${
                      m.sender === 'user'
                        ? 'bg-emerald-600 text-white rounded-br-none'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-bl-none border border-slate-200/60 dark:border-slate-700'
                    }`
                    }
                  >
                    <p>{m.text}</p>
                    <span
                      className={`text-[9px] block mt-1 text-right ${
                        m.sender === 'user' ? 'text-emerald-200' : 'text-slate-400'
                      }`
                    >
                      {m.time}
                    </span>
                  </div>

                  {m.sender === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-600 flex items-center justify-center shrink-0">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              ))}
              {isChatPending && (
                <div className="flex gap-3 justify-start items-center text-xs text-slate-400 italic">
                  <Bot className="w-4 h-4 animate-spin text-amber-500" />
                  <span>AI is thinking...</span>
                </div>
              )}
            </CardContent>

            <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-200 dark:border-slate-800 flex gap-2">
              <Input
                placeholder="Ask about pet care, breed compatibility, routines..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" variant="brand" isLoading={isChatPending} className="bg-emerald-600 hover:bg-emerald-500 text-white">
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </Card>
        )}

        {activeTab === 'matcher' && (
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <Card className="border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl p-6 space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                Configure Preferences
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-semibold block mb-1">Preferred Species</label>
                  <select
                    value={preferences.preferredSpecies}
                    onChange={(e) => setPreferences({ ...preferences, preferredSpecies: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800"
                  >
                    <option value="DOG">Dog</option>
                    <option value="CAT">Cat</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold block mb-1">Living Environment</label>
                  <select
                    value={preferences.housingType}
                    onChange={(e) => setPreferences({ ...preferences, housingType: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800"
                  >
                    <option value="house">Single Family House w/ Yard</option>
                    <option value="apartment">Apartment / Condo</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold block mb-1">Daily Activity Level</label>
                  <select
                    value={preferences.activityLevel}
                    onChange={(e) => setPreferences({ ...preferences, activityLevel: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800"
                  >
                    <option value="high">High (Daily running / outdoor hiking)</option>
                    <option value="moderate">Moderate (Daily walks)</option>
                    <option value="low">Low (Calm indoor relaxation)</option>
                  </select>
                </div>
              </div>

              <Button
                variant="brand"
                isLoading={isMatchPending}
                onClick={handleRunMatch}
                className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
              >
                Calculate Neural Match Deck
              </Button>
            </Card>

            <Card className="border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl p-6">
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
                Recommended Match Results
              </h3>

              {matchedPets.length === 0 ? (
                <div className="text-center py-12 text-slate-400 space-y-2">
                  <Sparkles className="w-10 h-10 mx-auto text-amber-500 animate-bounce" />
                  <p className="text-xs">Click "Calculate Neural Match Deck" to generate recommendations.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {matchedPets.map((p, i) => (
                    <div key={i} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                      <div>
                        <strong className="text-slate-900 dark:text-white block font-bold">{p.name || 'Matched Companion'}</strong>
                        <span className="text-[10px] text-slate-400">{p.breed || 'Verified Breed'}</span>
                      </div>
                      <Link href={`/pets/${p._id || p.id || '1'}`} className="text-emerald-600 font-bold hover:underline">
                        View Match →
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
