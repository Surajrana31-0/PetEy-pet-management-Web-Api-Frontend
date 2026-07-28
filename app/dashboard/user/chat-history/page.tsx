import { MessageSquare, Sparkles } from 'lucide-react';
import { EmptyState } from '@/components/empty-state';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const SESSIONS = [
  { title: 'Best dog breeds for apartments', date: 'Jan 20, 2026', messages: 8 },
  { title: 'Preparing my home for a cat', date: 'Jan 18, 2026', messages: 12 },
  { title: 'Adoption process questions', date: 'Jan 15, 2026', messages: 5 },
];

export default function ChatHistoryPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <MessageSquare className="h-6 w-6 text-primary" /> Chat History
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">Your previous AI chat sessions.</p>
      </div>

      {SESSIONS.length === 0 ? (
        <EmptyState
          icon={MessageSquare}
          title="No chat history"
          description="Start a conversation with our AI assistant to get personalized pet recommendations."
          action={
            <Button asChild className="gradient-warm text-white">
              <Link href="/ai-matcher">Start Chatting</Link>
            </Button>
          }
        />
      ) : (
        <div className="space-y-3">
          {SESSIONS.map((session) => (
            <Card key={session.title} className="border-border/60 shadow-card transition-all hover:shadow-glow cursor-pointer">
              <CardContent className="flex items-center gap-4 p-5">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl gradient-warm text-white">
                  <Sparkles className="h-6 w-6" />
                </span>
                <div className="flex-1">
                  <h3 className="font-medium">{session.title}</h3>
                  <p className="text-sm text-muted-foreground">{session.date} · {session.messages} messages</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
