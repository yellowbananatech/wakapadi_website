import { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import { supabase } from '../lib/supabaseClient';

interface AdminDashboardProps {
  onNavigate: (page: string) => void;
}

export function AdminDashboard({ onNavigate }: AdminDashboardProps) {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  };

  const revenueData = [
    { month: 'Jul', revenue: 42000 },
    { month: 'Aug', revenue: 51000 },
    { month: 'Sep', revenue: 48000 },
    { month: 'Oct', revenue: 63000 },
    { month: 'Nov', revenue: 71000 },
    { month: 'Dec', revenue: 85000 },
    { month: 'Jan', revenue: 92000 }
  ];

  const conversionsData = [
    { month: 'Jul', conversions: 45 },
    { month: 'Aug', conversions: 52 },
    { month: 'Sep', conversions: 48 },
    { month: 'Oct', conversions: 61 },
    { month: 'Nov', conversions: 70 },
    { month: 'Dec', conversions: 78 },
    { month: 'Jan', conversions: 85 }
  ];

  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [totalBookings, setTotalBookings] = useState<number>(0);
  const [totalRevenue, setTotalRevenue] = useState<number>(0);
  const [conversionRate, setConversionRate] = useState<number>(0);

  const money = useMemo(() => new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }), []);

  useEffect(() => {
    let mounted = true;
    const run = async () => {
      const [{ count: usersCount }, { count: bookingsCount }] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('bookings').select('*', { count: 'exact', head: true }),
      ]);

      const { data: paidPayments } = await supabase
        .from('payments')
        .select('amount,status')
        .eq('status', 'paid')
        .limit(1000);

      const revenue = (paidPayments ?? []).reduce((sum: number, p: any) => sum + (p.amount ?? 0), 0);

      const { data: confirmedBookings } = await supabase
        .from('bookings')
        .select('id,status')
        .eq('status', 'confirmed')
        .limit(1000);

      const conv =
        (bookingsCount ?? 0) > 0
          ? Math.round(((confirmedBookings ?? []).length / (bookingsCount ?? 1)) * 100)
          : 0;

      if (!mounted) return;
      setTotalUsers(usersCount ?? 0);
      setTotalBookings(bookingsCount ?? 0);
      setTotalRevenue(revenue);
      setConversionRate(conv);
    };

    void run();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen pt-32 bg-white pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-semibold mb-4 tracking-tighter text-slate-900">
            Admin Dashboard
          </h1>
          <p className="text-xl text-slate-600">
            Manage your business and track performance
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <motion.div {...fadeIn}>
            <div className="glass rounded-2xl p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm text-slate-600">Total Revenue</div>
                <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                  +12%
                </div>
              </div>
              <div className="text-3xl font-semibold text-slate-900 tracking-tight mb-1">
                ${money.format(totalRevenue)}
              </div>
              <div className="text-sm text-slate-500">This month</div>
            </div>
          </motion.div>

          <motion.div {...fadeIn} transition={{ delay: 0.1 }}>
            <div className="glass rounded-2xl p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm text-slate-600">Total Users</div>
                <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                  +8%
                </div>
              </div>
              <div className="text-3xl font-semibold text-slate-900 tracking-tight mb-1">{totalUsers}</div>
              <div className="text-sm text-slate-500">Active clients</div>
            </div>
          </motion.div>

          <motion.div {...fadeIn} transition={{ delay: 0.2 }}>
            <div className="glass rounded-2xl p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm text-slate-600">Bookings</div>
                <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                  +15%
                </div>
              </div>
              <div className="text-3xl font-semibold text-slate-900 tracking-tight mb-1">{totalBookings}</div>
              <div className="text-sm text-slate-500">This month</div>
            </div>
          </motion.div>

          <motion.div {...fadeIn} transition={{ delay: 0.3 }}>
            <div className="glass rounded-2xl p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm text-slate-600">Conversion Rate</div>
                <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                  +22%
                </div>
              </div>
              <div className="text-3xl font-semibold text-slate-900 tracking-tight mb-1">{conversionRate}%</div>
              <div className="text-sm text-slate-500">Lead to booking</div>
            </div>
          </motion.div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <motion.div {...fadeIn}>
            <div className="glass rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-slate-900 tracking-tight mb-6">Revenue Trend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip />
                  <Bar dataKey="revenue" fill="#1e85ca" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div {...fadeIn} transition={{ delay: 0.1 }}>
            <div className="glass rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-slate-900 tracking-tight mb-6">Conversions</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={conversionsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip />
                  <Line type="monotone" dataKey="conversions" stroke="#fecc0c" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* Management Tabs */}
        <Tabs defaultValue="users" className="w-full">
          <TabsList className="glass-strong p-1 rounded-xl mb-8 inline-flex">
            <TabsTrigger value="users" className="rounded-lg px-4 data-[state=active]:bg-white data-[state=active]:shadow-sm">Users</TabsTrigger>
            <TabsTrigger value="blog" className="rounded-lg px-4 data-[state=active]:bg-white data-[state=active]:shadow-sm">Blog</TabsTrigger>
            <TabsTrigger value="packages" className="rounded-lg px-4 data-[state=active]:bg-white data-[state=active]:shadow-sm">Packages</TabsTrigger>
            <TabsTrigger value="comments" className="rounded-lg px-4 data-[state=active]:bg-white data-[state=active]:shadow-sm">Comments</TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users">
            <div className="glass rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-slate-900 tracking-tight">Recent Users</h3>
                <div className="flex items-center gap-2">
                  <Input 
                    placeholder="Search users..." 
                    className="w-64 rounded-xl border-slate-200"
                  />
                  <Button className="bg-primary hover:bg-primary/90 text-white rounded-xl">
                    Add User
                  </Button>
                </div>
              </div>
              <div className="text-center py-12 text-slate-600">
                <p>User management interface</p>
              </div>
            </div>
          </TabsContent>

          {/* Other tabs */}
          <TabsContent value="blog">
            <div className="glass rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-slate-900 tracking-tight">Blog Posts</h3>
                <Button className="bg-primary hover:bg-primary/90 text-white rounded-xl">
                  New Post
                </Button>
              </div>
              <div className="text-center py-12 text-slate-600">
                <p>Blog management interface</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="packages">
            <div className="glass rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-slate-900 tracking-tight">Travel Packages</h3>
                <Button className="bg-primary hover:bg-primary/90 text-white rounded-xl">
                  New Package
                </Button>
              </div>
              <div className="text-center py-12 text-slate-600">
                <p>Package management interface</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="comments">
            <div className="glass rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-slate-900 tracking-tight mb-4">Recent Comments</h3>
              <div className="text-center py-12 text-slate-600">
                <p>No pending comments to moderate</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
