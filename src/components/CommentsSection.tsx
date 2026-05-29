import { useEffect, useMemo, useState, useCallback } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { supabase } from '../lib/supabaseClient';
import { CloudflareTurnstile } from './CloudflareTurnstile';
type CommentRow = {
  id: string;
  post_id: string;
  user_id: string | null;
  content: string;
  likes: number;
  created_at: string;
};
type ReplyRow = {
  id: string;
  comment_id: string;
  user_id: string | null;
  content: string;
  is_official: boolean;
  likes: number;
  created_at: string;
};

type UiReply = ReplyRow & { authorName: string };
type UiComment = CommentRow & { authorName: string; replies: UiReply[] };

export function CommentsSection({ postId }: { postId: string }) {
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [comments, setComments] = useState<UiComment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

  const handleTurnstileVerify = useCallback((token: string) => {
    setTurnstileToken(token);
  }, []);

  const handleTurnstileExpire = useCallback(() => {
    setTurnstileToken(null);
  }, []);

  const formatAgo = (iso: string) => {
    const date = new Date(iso);
    const diff = Date.now() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 60) return `${minutes} min ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 48) return `${hours} hr ago`;
    const days = Math.floor(hours / 24);
    return `${days} days ago`;
  };

  const commentsCount = useMemo(() => comments.length, [comments.length]);

  const load = async () => {
    setLoading(true);
    setError(null);

    const { data: sessionData } = await supabase.auth.getSession();

    const { data: commentRows, error: commentErr } = await supabase
      .from('comments')
      .select('id,post_id,user_id,content,likes,created_at')
      .eq('post_id', postId)
      .order('created_at', { ascending: false });

    if (commentErr) {
      setError(commentErr.message);
      setComments([]);
      setLoading(false);
      return;
    }

    const commentIds = (commentRows ?? []).map((c) => c.id);
    const { data: replyRows, error: replyErr } = commentIds.length
      ? await supabase
          .from('comment_replies')
          .select('id,comment_id,user_id,content,is_official,likes,created_at')
          .in('comment_id', commentIds)
          .order('created_at', { ascending: true })
      : { data: [], error: null as any };

    if (replyErr) {
      setError(replyErr.message);
      setComments([]);
      setLoading(false);
      return;
    }

    const repliesByCommentId = new Map<string, UiReply[]>();
    (replyRows ?? []).forEach((r: any) => {
      const reply: UiReply = {
        ...(r as ReplyRow),
        authorName: r.is_official
          ? 'Wakapadi Team'
          : r.user_id
            ? (r.user_id === sessionData.session?.user?.id ? 'You' : 'User')
            : 'Guest',
      };
      const arr = repliesByCommentId.get(r.comment_id) ?? [];
      arr.push(reply);
      repliesByCommentId.set(r.comment_id, arr);
    });

    const ui: UiComment[] = (commentRows ?? []).map((c: any) => {
      return {
        ...(c as CommentRow),
        authorName: c.user_id ? (c.user_id === sessionData.session?.user?.id ? 'You' : 'User') : 'Guest',
        replies: repliesByCommentId.get(c.id) ?? [],
      };
    });

    setComments(ui);
    setLoading(false);
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId]);

  const handleSubmitComment = () => {
    const run = async () => {
      setError(null);
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        setError('Please sign in to comment.');
        return;
      }
      if (!turnstileToken) {
        setError('Please complete the security check.');
        return;
      }
      const content = newComment.trim();
      if (!content) return;

      const { error: insertErr } = await supabase
        .from('comments')
        .insert({ post_id: postId, content })
        .select()
        .single();
      if (insertErr) {
        setError(insertErr.message);
        return;
      }
      setNewComment('');
      await load();
    };

    void run();
  };

  const handleSubmitReply = (commentId: string) => {
    const run = async () => {
      setError(null);
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        setError('Please sign in to reply.');
        return;
      }
      const content = replyText.trim();
      if (!content) return;

      // Mark replies from admins as official (best-effort)
      const userId = data.session.user.id;
      const { data: prof } = await supabase.from('profiles').select('is_admin').eq('id', userId).maybeSingle();

      const { error: insertErr } = await supabase
        .from('comment_replies')
        .insert({ comment_id: commentId, content, is_official: Boolean(prof?.is_admin) })
        .select()
        .single();
      if (insertErr) {
        setError(insertErr.message);
        return;
      }

      setReplyText('');
      setReplyingTo(null);
      await load();
    };
    void run();
  };

  return (
    <div className="mt-20">
      <h3 className="text-3xl font-semibold mb-8 tracking-tight text-slate-900">
        Comments ({commentsCount})
      </h3>

      {/* Add Comment Form */}
      <div className="mb-12">
        <Textarea
          placeholder="Share your thoughts or ask a question..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="mb-3 min-h-[100px] rounded-xl border-slate-200"
        />
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <CloudflareTurnstile
            onVerify={handleTurnstileVerify}
            onExpire={handleTurnstileExpire}
            size="compact"
          />
          <Button 
            onClick={handleSubmitComment}
            className="bg-primary hover:bg-primary/90 text-white rounded-xl"
            disabled={loading || !turnstileToken}
          >
            Post Comment
          </Button>
        </div>
      </div>

      {error && (
        <div className="mb-8 rounded-xl bg-red-50 text-red-700 px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-8">
        {loading && (
          <div className="text-slate-600">Loading comments…</div>
        )}
        {comments.map((comment) => (
          <motion.div
            key={comment.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="glass rounded-2xl p-6"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center text-slate-700 font-medium flex-shrink-0">
                {comment.authorName
                  .split(' ')
                  .filter(Boolean)
                  .map((n) => n[0])
                  .join('')}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-slate-900">{comment.authorName}</span>
                  <span className="text-sm text-slate-500">{formatAgo(comment.created_at)}</span>
                </div>
                
                <p className="text-slate-700 mb-4 leading-relaxed">
                  {comment.content}
                </p>
                
                <div className="flex items-center gap-4">
                  <button className="text-sm text-slate-600 hover:text-primary transition-colors">
                    {comment.likes} likes
                  </button>
                  <button 
                    onClick={() => setReplyingTo(comment.id)}
                    className="text-sm text-slate-600 hover:text-primary transition-colors"
                  >
                    Reply
                  </button>
                </div>

                {/* Reply Form */}
                {replyingTo === comment.id && (
                  <div className="mt-4">
                    <Textarea
                      placeholder="Write your reply..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      className="mb-2 min-h-[80px] rounded-xl border-slate-200"
                    />
                    <div className="flex gap-2">
                      <Button 
                        size="sm"
                        onClick={() => handleSubmitReply(comment.id)}
                        className="bg-primary hover:bg-primary/90 text-white rounded-lg"
                      >
                        Reply
                      </Button>
                      <Button 
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setReplyingTo(null);
                          setReplyText('');
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}

                {/* Replies */}
                {comment.replies.length > 0 && (
                  <div className="mt-6 space-y-4 ml-0 pl-6 border-l-2 border-slate-200">
                    {comment.replies.map((reply) => (
                      <div key={reply.id} className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 ${
                          reply.is_official ? 'bg-primary text-white' : 'bg-slate-200 text-slate-700'
                        }`}>
                          {reply.authorName
                            .split(' ')
                            .filter(Boolean)
                            .map((n) => n[0])
                            .join('')}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-slate-900 text-sm">
                              {reply.authorName}
                            </span>
                            {reply.is_official && (
                              <span className="bg-accent/20 text-accent px-2 py-0.5 rounded-full text-xs font-medium">
                                Wakapadi Team
                              </span>
                            )}
                            <span className="text-xs text-slate-500">{formatAgo(reply.created_at)}</span>
                          </div>
                          
                          <p className="text-slate-700 text-sm mb-2 leading-relaxed">
                            {reply.content}
                          </p>
                          
                          <button className="text-xs text-slate-600 hover:text-primary transition-colors">
                            {reply.likes} likes
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
