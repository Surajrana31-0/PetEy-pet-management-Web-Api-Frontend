'use client';

import { PawPrint, Users, TrendingUp, Sparkles, Clock, Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ResponsiveContainer, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, Legend, CartesianGrid,
} from 'recharts';

const GROWTH_DATA = [
  { month: 'Jul', users: 45, adoptions: 3 },
  { month: 'Aug', users: 62, adoptions: 5 },
  { month: 'Sep', users: 78, adoptions: 4 },
  { month: 'Oct', users: 95, adoptions: 7 },
  { month: 'Nov', users: 120, adoptions: 6 },
  { month: 'Dec', users: 156, adoptions: 9 },
];

const STATUS_DATA = [
  { name: 'Available', value: 18, color: 'hsl(var(--success))' },
  { name: 'Pending', value: 4, color: 'hsl(var(--warning))' },
  { name: 'Adopted', value: 12, color: 'hsl(var(--primary))' },
];

const SPECIES_DATA = [
  { name: 'Dogs', count: 16 },
  { name: 'Cats', count: 8 },
];

const STATS = [
  { label: 'Total Pets', value: '24', icon: PawPrint, color: 'bg-primary/10 text-primary' },
  { label: 'Total Users', value: '156', icon: Users, color: 'bg-accent/10 text-accent' },
  { label: 'Adoptions', value: '12', icon: TrendingUp, color: 'bg-success/10 text-success' },
  { label: 'AI Chats', value: '340', icon: Sparkles, color: 'bg-warning/10 text-warning' },
];

export default function AnalyticsPage() {
  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Analytics Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">Platform growth, adoption trends, and AI usage insights.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {STATS.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="border-border/60 shadow-card">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.color}`}>
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="text-2xl font-bold">{stat.value}</span>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 border-border/60 shadow-card">
          <CardHeader>
            <CardTitle>Growth & Adoptions</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={GROWTH_DATA}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorAdoptions" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    background: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '0.5rem',
                  }}
                />
                <Legend />
                <Area type="monotone" dataKey="users" name="Users" stroke="hsl(var(--primary))" fill="url(#colorUsers)" strokeWidth={2} />
                <Area type="monotone" dataKey="adoptions" name="Adoptions" stroke="hsl(var(--accent))" fill="url(#colorAdoptions)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-card">
          <CardHeader>
            <CardTitle>Pet Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={STATUS_DATA} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={3}>
                  {STATUS_DATA.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '0.5rem',
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 border-border/60 shadow-card">
          <CardHeader>
            <CardTitle>Pets by Species</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={SPECIES_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    background: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '0.5rem',
                  }}
                />
                <Bar dataKey="count" name="Count" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
