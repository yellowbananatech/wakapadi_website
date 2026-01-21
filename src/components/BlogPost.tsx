import { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { CommentsSection } from './CommentsSection';
import { ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

interface BlogPostProps {
  onNavigate: (page: string, id?: string) => void;
  postId?: string;
}

type BlogPostRow = {
  id: string;
  title: string;
  category: string | null;
  read_time: string | null;
  published_at: string | null;
  author: string | null;
  author_role: string | null;
  image_url: string | null;
  content_html: string;
};

export function BlogPost({ onNavigate, postId }: BlogPostProps) {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  };

  const [post, setPost] = useState<BlogPostRow | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<Array<Pick<BlogPostRow, 'id' | 'title' | 'category' | 'image_url'>>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const prettyDate = useMemo(() => {
    if (!post?.published_at) return '';
    try {
      return new Date(post.published_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
    } catch {
      return post.published_at;
    }
  }, [post?.published_at]);

  useEffect(() => {
    if (!postId) return;
    let mounted = true;
    setLoading(true);
    setError(null);

    const run = async () => {
      const { data, error: postError } = await supabase
        .from('blog_posts')
        .select('id,title,category,read_time,published_at,author,author_role,image_url,content_html')
        .eq('id', postId)
        .maybeSingle();

      if (!mounted) return;
      if (postError) {
        setError(postError.message);
        setPost(null);
        setLoading(false);
        return;
      }
      if (!data) {
        setError('Post not found');
        setPost(null);
        setLoading(false);
        return;
      }

      setPost(data as BlogPostRow);

      const { data: rel, error: relErr } = await supabase
        .from('blog_posts')
        .select('id,title,category,image_url')
        .neq('id', postId)
        .limit(2);

      if (!mounted) return;
      if (relErr) {
        setRelatedPosts([]);
      } else {
        setRelatedPosts((rel ?? []) as any);
      }

      setLoading(false);
    };

    void run();
    return () => {
      mounted = false;
    };
  }, [postId]);

  return (
    <div className="min-h-screen pt-32 bg-white">
      {/* Back Button */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <Button
          variant="ghost"
          onClick={() => onNavigate('blog')}
          className="text-slate-600 hover:text-primary -ml-2"
        >
          <ArrowLeft className="mr-2" size={18} />
          Back to Blog
        </Button>
      </div>

      {/* Hero Image */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="relative h-96 rounded-2xl overflow-hidden">
          <ImageWithFallback
            src={post?.image_url ?? ''}
            alt={post?.title ?? 'Blog post'}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Article Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Meta Info */}
          <div className="mb-12">
            <div className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-4">
              {post?.category ?? 'Post'}
            </div>
            <h1 className="text-4xl md:text-6xl font-semibold mb-6 leading-tight tracking-tighter text-slate-900">
              {loading ? 'Loading…' : post?.title ?? (error ? 'Unable to load post' : 'Select a post')}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-sm text-slate-600 mb-8">
              <span>{prettyDate}</span>
              <span>{post?.read_time ?? ''}</span>
            </div>

            {/* Author */}
            <div className="flex items-center space-x-4 pb-8 border-b border-slate-200">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary font-semibold">
                {(post?.author ?? 'Wakapadi')
                  .split(' ')
                  .filter(Boolean)
                  .map((n) => n[0])
                  .join('')}
              </div>
              <div>
                <div className="font-semibold text-slate-900">{post?.author ?? 'Wakapadi'}</div>
                <div className="text-sm text-slate-600">{post?.author_role ?? ''}</div>
              </div>
            </div>
          </div>

          {/* Article Content */}
          <div 
            className="prose prose-lg max-w-none mb-12"
            dangerouslySetInnerHTML={{ __html: post?.content_html ?? '' }}
          />

          {error && (
            <div className="mb-12 rounded-xl bg-red-50 text-red-700 px-4 py-3 text-sm">
              {error}
            </div>
          )}

          {/* CTA Box */}
          <div className="glass-strong rounded-2xl p-8 text-center mb-12">
            <h3 className="text-2xl font-semibold mb-3 tracking-tight text-slate-900">
              Need Help With Your Application?
            </h3>
            <p className="text-slate-600 mb-6 text-lg">
              Book a strategy call with our experts and get personalized guidance
            </p>
            <Button
              size="lg"
              onClick={() => onNavigate('booking')}
              className="bg-primary hover:bg-primary/90 text-white rounded-xl px-8 h-14"
            >
              Book Strategy Call
            </Button>
          </div>

          {/* Comments Section */}
          {postId && <CommentsSection postId={postId} />}

          {/* Related Posts */}
          <div className="mt-20">
            <h3 className="text-3xl font-semibold mb-8 tracking-tight text-slate-900">
              Related Articles
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedPosts.map((relatedPost, index) => (
                <motion.div
                  key={relatedPost.id}
                  {...fadeIn}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                >
                  <button
                    onClick={() => onNavigate('blog-post', relatedPost.id)}
                    className="text-left glass rounded-2xl overflow-hidden hover:shadow-lg transition-all group w-full"
                  >
                    <div className="relative h-40 overflow-hidden">
                      <ImageWithFallback
                        src={(relatedPost as any).image_url ?? ''}
                        alt={relatedPost.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-slate-900 px-3 py-1 rounded-full text-xs font-medium">
                        {relatedPost.category}
                      </div>
                    </div>
                    <div className="p-4">
                      <h4 className="font-semibold text-slate-900 group-hover:text-primary transition-colors tracking-tight">
                        {relatedPost.title}
                      </h4>
                    </div>
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </article>
    </div>
  );
}
