import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Supabase client setup
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-73841e13/health", (c) => {
  return c.json({ status: "ok" });
});

// ============================================
// Authentication Routes
// ============================================

// Sign up route
app.post("/make-server-73841e13/auth/signup", async (c) => {
  try {
    const { email, password, name, isAdmin } = await c.req.json();
    
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name, isAdmin: isAdmin || false },
      email_confirm: true // Auto-confirm since email server not configured
    });

    if (error) {
      console.error('Signup error:', error);
      return c.json({ error: error.message }, 400);
    }

    // Store user profile in KV
    await kv.set(`user:${data.user.id}`, {
      id: data.user.id,
      email,
      name,
      isAdmin: isAdmin || false,
      createdAt: new Date().toISOString()
    });

    return c.json({ user: data.user });
  } catch (error) {
    console.error('Signup error:', error);
    return c.json({ error: 'Failed to create user' }, 500);
  }
});

// ============================================
// Bookings Routes
// ============================================

// Get user bookings
app.get("/make-server-73841e13/bookings", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (!user || error) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const bookings = await kv.getByPrefix(`booking:${user.id}:`);
    return c.json({ bookings });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return c.json({ error: 'Failed to fetch bookings' }, 500);
  }
});

// Create booking
app.post("/make-server-73841e13/bookings", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (!user || error) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const bookingData = await c.req.json();
    const bookingId = `BK-${Date.now()}`;
    
    const booking = {
      id: bookingId,
      userId: user.id,
      ...bookingData,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    await kv.set(`booking:${user.id}:${bookingId}`, booking);
    return c.json({ booking });
  } catch (error) {
    console.error('Error creating booking:', error);
    return c.json({ error: 'Failed to create booking' }, 500);
  }
});

// ============================================
// Documents Routes
// ============================================

// Get user documents
app.get("/make-server-73841e13/documents", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (!user || error) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const documents = await kv.getByPrefix(`document:${user.id}:`);
    return c.json({ documents });
  } catch (error) {
    console.error('Error fetching documents:', error);
    return c.json({ error: 'Failed to fetch documents' }, 500);
  }
});

// Upload document metadata
app.post("/make-server-73841e13/documents", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (!user || error) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { name, type, status } = await c.req.json();
    const documentId = `DOC-${Date.now()}`;
    
    const document = {
      id: documentId,
      userId: user.id,
      name,
      type,
      status: status || 'pending',
      uploadedAt: new Date().toISOString()
    };

    await kv.set(`document:${user.id}:${documentId}`, document);
    return c.json({ document });
  } catch (error) {
    console.error('Error uploading document:', error);
    return c.json({ error: 'Failed to upload document' }, 500);
  }
});

// ============================================
// Blog Routes
// ============================================

// Get all blog posts
app.get("/make-server-73841e13/blog", async (c) => {
  try {
    const posts = await kv.getByPrefix('blog:');
    return c.json({ posts });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return c.json({ error: 'Failed to fetch blog posts' }, 500);
  }
});

// Create blog post (admin only)
app.post("/make-server-73841e13/blog", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (!user || error) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Check if user is admin
    const userProfile = await kv.get(`user:${user.id}`);
    if (!userProfile?.isAdmin) {
      return c.json({ error: 'Forbidden - Admin access required' }, 403);
    }

    const postData = await c.req.json();
    const postId = `POST-${Date.now()}`;
    
    const post = {
      id: postId,
      ...postData,
      authorId: user.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await kv.set(`blog:${postId}`, post);
    return c.json({ post });
  } catch (error) {
    console.error('Error creating blog post:', error);
    return c.json({ error: 'Failed to create blog post' }, 500);
  }
});

// ============================================
// Comments Routes
// ============================================

// Get comments for a post
app.get("/make-server-73841e13/comments/:postId", async (c) => {
  try {
    const postId = c.req.param('postId');
    const comments = await kv.getByPrefix(`comment:${postId}:`);
    return c.json({ comments });
  } catch (error) {
    console.error('Error fetching comments:', error);
    return c.json({ error: 'Failed to fetch comments' }, 500);
  }
});

// Create comment
app.post("/make-server-73841e13/comments", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (!user || error) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { postId, content, parentId } = await c.req.json();
    const commentId = `COMM-${Date.now()}`;
    
    const comment = {
      id: commentId,
      postId,
      userId: user.id,
      content,
      parentId: parentId || null,
      likes: 0,
      createdAt: new Date().toISOString()
    };

    await kv.set(`comment:${postId}:${commentId}`, comment);
    return c.json({ comment });
  } catch (error) {
    console.error('Error creating comment:', error);
    return c.json({ error: 'Failed to create comment' }, 500);
  }
});

// ============================================
// Payments Routes
// ============================================

// Get user payments
app.get("/make-server-73841e13/payments", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (!user || error) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const payments = await kv.getByPrefix(`payment:${user.id}:`);
    return c.json({ payments });
  } catch (error) {
    console.error('Error fetching payments:', error);
    return c.json({ error: 'Failed to fetch payments' }, 500);
  }
});

// Create payment record
app.post("/make-server-73841e13/payments", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (!user || error) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const paymentData = await c.req.json();
    const paymentId = `PAY-${Date.now()}`;
    
    const payment = {
      id: paymentId,
      userId: user.id,
      ...paymentData,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    await kv.set(`payment:${user.id}:${paymentId}`, payment);
    return c.json({ payment });
  } catch (error) {
    console.error('Error creating payment:', error);
    return c.json({ error: 'Failed to create payment' }, 500);
  }
});

// ============================================
// Admin Analytics Routes
// ============================================

// Get admin analytics (admin only)
app.get("/make-server-73841e13/admin/analytics", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (!user || error) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Check if user is admin
    const userProfile = await kv.get(`user:${user.id}`);
    if (!userProfile?.isAdmin) {
      return c.json({ error: 'Forbidden - Admin access required' }, 403);
    }

    // Fetch analytics data
    const allBookings = await kv.getByPrefix('booking:');
    const allPayments = await kv.getByPrefix('payment:');
    const allUsers = await kv.getByPrefix('user:');

    const analytics = {
      totalUsers: allUsers.length,
      totalBookings: allBookings.length,
      totalRevenue: allPayments
        .filter((p: any) => p.status === 'paid')
        .reduce((sum: number, p: any) => sum + (p.amount || 0), 0),
      conversionRate: allBookings.length > 0 
        ? Math.round((allBookings.filter((b: any) => b.status === 'confirmed').length / allBookings.length) * 100)
        : 0
    };

    return c.json({ analytics });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return c.json({ error: 'Failed to fetch analytics' }, 500);
  }
});

Deno.serve(app.fetch);