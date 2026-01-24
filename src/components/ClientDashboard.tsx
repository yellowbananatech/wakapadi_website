import { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { supabase } from '../lib/supabaseClient';

interface ClientDashboardProps {
  onNavigate: (page: string) => void;
}

export function ClientDashboard({ onNavigate }: ClientDashboardProps) {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  };

  type BookingRow = {
    id: string;
    service: string;
    status: string;
    progress: number;
    next_step: string | null;
    booked_for: string | null;
    created_at: string;
  };
  type DocumentRow = { id: string; name: string; uploaded_on: string; status: string };
  type PaymentRow = {
    id: string;
    service: string;
    amount: number;
    currency: string;
    status: string;
    paid_at: string | null;
    due_on: string | null;
    created_at: string;
  };

  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [documents, setDocuments] = useState<DocumentRow[]>([]);
  const [payments, setPayments] = useState<PaymentRow[]>([]);
  const [loading, setLoading] = useState(false);

  const fmtDate = useMemo(() => {
    return (iso: string | null) => {
      if (!iso) return '';
      try {
        return new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
      } catch {
        return iso;
      }
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    const run = async () => {
      const { data: b } = await supabase
        .from('bookings')
        .select('id,service,status,progress,next_step,booked_for,created_at')
        .order('created_at', { ascending: false })
        .limit(20);

      const { data: d } = await supabase
        .from('documents')
        .select('id,name,uploaded_on,status')
        .order('uploaded_on', { ascending: false })
        .limit(20);

      const { data: p } = await supabase
        .from('payments')
        .select('id,service,amount,currency,status,paid_at,due_on,created_at')
        .order('created_at', { ascending: false })
        .limit(20);

      if (!mounted) return;
      setBookings((b ?? []) as any);
      setDocuments((d ?? []) as any);
      setPayments((p ?? []) as any);
      setLoading(false);
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
            Welcome back, John
          </h1>
          <p className="text-xl text-slate-600">
            Track your applications and manage your bookings
          </p>
        </motion.div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <motion.div {...fadeIn}>
            <div className="glass rounded-2xl p-6">
              <div className="text-sm text-slate-600 mb-1">Active Bookings</div>
              <div className="text-3xl font-semibold text-slate-900 tracking-tight">{bookings.length}</div>
            </div>
          </motion.div>

          <motion.div {...fadeIn} transition={{ delay: 0.1 }}>
            <div className="glass rounded-2xl p-6">
              <div className="text-sm text-slate-600 mb-1">Pending Docs</div>
              <div className="text-3xl font-semibold text-slate-900 tracking-tight">
                {documents.filter((d) => d.status !== 'approved').length}
              </div>
            </div>
          </motion.div>

          <motion.div {...fadeIn} transition={{ delay: 0.2 }}>
            <div className="glass rounded-2xl p-6">
              <div className="text-sm text-slate-600 mb-1">Total Spent</div>
              <div className="text-3xl font-semibold text-slate-900 tracking-tight">
                ${payments.filter((p) => p.status === 'paid').reduce((sum, p) => sum + (p.amount ?? 0), 0).toLocaleString()}
              </div>
            </div>
          </motion.div>

          <motion.div {...fadeIn} transition={{ delay: 0.3 }}>
            <div className="glass rounded-2xl p-6">
              <div className="text-sm text-slate-600 mb-1">Messages</div>
              <div className="text-3xl font-semibold text-slate-900 tracking-tight">3</div>
            </div>
          </motion.div>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="bookings" className="w-full">
          <TabsList className="glass-strong p-1 rounded-xl mb-8 inline-flex">
            <TabsTrigger value="bookings" className="rounded-lg px-4 data-[state=active]:bg-white data-[state=active]:shadow-sm">Bookings</TabsTrigger>
            <TabsTrigger value="documents" className="rounded-lg px-4 data-[state=active]:bg-white data-[state=active]:shadow-sm">Documents</TabsTrigger>
            <TabsTrigger value="payments" className="rounded-lg px-4 data-[state=active]:bg-white data-[state=active]:shadow-sm">Payments</TabsTrigger>
            <TabsTrigger value="support" className="rounded-lg px-4 data-[state=active]:bg-white data-[state=active]:shadow-sm">Support</TabsTrigger>
          </TabsList>

          {/* Bookings Tab */}
          <TabsContent value="bookings">
            <div className="space-y-6">
              {loading && <div className="text-slate-600">Loading…</div>}
              {bookings.map((booking, index) => (
                <motion.div
                  key={booking.id}
                  {...fadeIn}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="glass rounded-2xl p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-slate-900 tracking-tight mb-1">{booking.service}</h3>
                        <p className="text-sm text-slate-600">ID: {booking.id.slice(0, 8).toUpperCase()}</p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                        booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {booking.status}
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-slate-600">Progress</span>
                          <span className="text-sm font-medium">{booking.progress}%</span>
                        </div>
                        <Progress value={booking.progress} className="h-2" />
                      </div>
                      
                      <div className="text-sm">
                        <span className="text-slate-600">Next Step: </span>
                        <span className="text-slate-900 font-medium">{booking.next_step ?? '—'}</span>
                      </div>

                      <div className="text-sm text-slate-600">
                        {fmtDate(booking.booked_for ?? booking.created_at)}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents">
            <div className="glass rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-slate-900 tracking-tight">Your Documents</h3>
                <Button className="bg-primary hover:bg-primary/90 text-white rounded-xl">
                  Upload Document
                </Button>
              </div>
              <div className="space-y-3">
                {documents.map((doc, index) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
                  >
                    <div>
                      <p className="font-medium text-slate-900">{doc.name}</p>
                      <p className="text-sm text-slate-600">Uploaded {fmtDate(doc.uploaded_on)}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                      doc.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {doc.status}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments">
            <div className="glass rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-slate-900 tracking-tight mb-6">Payment History</h3>
              <div className="space-y-3">
                {payments.map((payment, index) => (
                  <div
                    key={payment.id}
                    className="flex items-center justify-between p-4 bg-slate-50 rounded-xl"
                  >
                    <div>
                      <p className="font-medium text-slate-900">{payment.service}</p>
                      <p className="text-sm text-slate-600">
                        {payment.status === 'paid'
                          ? fmtDate(payment.paid_at ?? payment.created_at)
                          : payment.due_on
                            ? `Due: ${fmtDate(payment.due_on)}`
                            : fmtDate(payment.created_at)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-slate-900">
                        {payment.currency} {payment.amount.toLocaleString()}
                      </p>
                      <div className={`mt-1 px-3 py-1 rounded-full text-sm font-medium inline-block ${
                        payment.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {payment.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {payments.some(p => p.status === 'pending') && (
                <Button className="w-full mt-6 bg-primary hover:bg-primary/90 text-white rounded-xl h-12">
                  Pay Outstanding Balance
                </Button>
              )}
            </div>
          </TabsContent>

          {/* Support Tab */}
          <TabsContent value="support">
            <div className="glass rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-slate-900 tracking-tight mb-4">Contact Support</h3>
              <p className="text-slate-600 mb-6">
                Our team is here to help you with any questions or concerns.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button 
                  onClick={() => onNavigate('contact')}
                  className="glass rounded-xl p-6 text-left hover:shadow-lg transition-all"
                >
                  <div className="font-semibold text-slate-900 mb-1">Live Chat</div>
                  <div className="text-sm text-slate-600">Average response: 5 minutes</div>
                </button>

                <button 
                  onClick={() => window.open('https://selar.com/wakapadixveev', '_blank')}
                  className="glass rounded-xl p-6 text-left hover:shadow-lg transition-all"
                >
                  <div className="font-semibold text-slate-900 mb-1">Start Your Journey</div>
                  <div className="text-sm text-slate-600">Begin your global mobility journey</div>
                </button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
