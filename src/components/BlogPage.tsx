import { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { supabase } from '../lib/supabaseClient';

interface BlogPageProps {
  onNavigate: (page: string, id?: string) => void;
}

export function BlogPage({ onNavigate }: BlogPageProps) {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  };

  type BlogListRow = {
    id: string;
    title: string;
    excerpt: string | null;
    category: string | null;
    read_time: string | null;
    published_at: string | null;
    author: string | null;
    image_url: string | null;
  };

  const [posts, setPosts] = useState<BlogListRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    const run = async () => {
      const { data, error: err } = await supabase
        .from('blog_posts')
        .select('id,title,excerpt,category,read_time,published_at,author,image_url')
        .limit(50);

      if (!mounted) return;
      if (err) {
        setError(err.message);
        setPosts([]);
      } else {
        setPosts((data ?? []) as any);
      }
      setLoading(false);
    };

    void run();
    return () => {
      mounted = false;
    };
  }, []);

  const categories = ['All', 'Work Visas', 'Citizenship', 'Travel', 'Study Visas', 'Investment'];

  const prettyDate = useMemo(() => {
    return (iso: string | null) => {
      if (!iso) return '';
      try {
        return new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
      } catch {
        return iso;
      }
    };
  }, []);

  return (
    <div className="min-h-screen pt-32 bg-white">
      {/* Hero Section */}
      <section className="px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl"
          >
            <h1 className="text-5xl md:text-7xl font-semibold mb-8 tracking-tighter text-slate-900">
              Blog & Stories
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed">
              Expert insights, visa guides, and success stories to help you navigate your global mobility journey
            </p>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="px-4 sm:px-6 lg:px-8 pb-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <Button
                key={category}
                variant={category === 'All' ? 'default' : 'outline'}
                size="sm"
                className={`rounded-xl ${category === 'All' ? 'bg-primary hover:bg-primary/90' : 'border-slate-200'}`}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="px-4 sm:px-6 lg:px-8 pb-32">
        <div className="max-w-7xl mx-auto">
          {error && (
            <div className="mb-8 rounded-xl bg-red-50 text-red-700 px-4 py-3 text-sm">
              {error}
            </div>
          )}
          {loading && (
            <div className="mb-8 text-slate-600">Loading posts…</div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, index) => (
              <motion.div
                key={post.id}
                {...fadeIn}
                transition={{ delay: index * 0.1, duration: 0.6 }}
              >
                <button
                  onClick={() => onNavigate('blog-post', post.id)}
                  className="text-left glass rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 group w-full"
                >
                  <div className="relative h-48 overflow-hidden bg-slate-100">
                    <ImageWithFallback
                      src={post.image_url ?? ''}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-slate-900 px-3 py-1 rounded-full text-xs font-medium">
                      {post.category ?? 'Post'}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-slate-900 mb-3 leading-tight tracking-tight group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-slate-600 mb-4 leading-relaxed line-clamp-2">
                      {post.excerpt ?? ''}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm text-slate-500 pt-4 border-t border-slate-200">
                      <span>{prettyDate(post.published_at)}</span>
                      <span>{post.read_time ?? ''}</span>
                    </div>
                    
                    <div className="text-sm text-slate-600 mt-3">
                      By {post.author ?? 'Wakapadi'}
                    </div>
                  </div>
                </button>
              </motion.div>
            ))}
          </div>

          {/* Load More */}
          <motion.div {...fadeIn} className="text-center mt-12">
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-slate-200 text-slate-900 hover:bg-slate-50 rounded-xl px-8 h-14"
            >
              Load More Articles
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div {...fadeIn}>
            <h2 className="text-4xl font-semibold mb-6 tracking-tighter text-slate-900">
              Stay Updated
            </h2>
            <p className="text-xl text-slate-600 mb-8">
              Get the latest visa news, travel tips, and migration insights delivered to your inbox
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary bg-white"
              />
              <Button className="bg-primary hover:bg-primary/90 text-white rounded-xl px-8">
                Subscribe
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
