import { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface LoginPageProps {
  onAuth: (args: { mode: 'signIn' | 'signUp'; email: string; password: string; fullName?: string }) => Promise<void> | void;
  onNavigate: (page: string) => void;
  isLoading?: boolean;
  error?: string | null;
}

export function LoginPage({ onAuth, onNavigate, isLoading, error }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [honeypot, setHoneypot] = useState(''); // Bot protection honeypot field
  const [formStartTime] = useState(Date.now()); // Track form load time for timing check
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Bot protection: Check honeypot field (should be empty for real users)
    if (honeypot !== '') {
      console.warn('Bot detected: honeypot field filled');
      return; // Silently reject - don't show error to bots
    }

    // Bot protection: Timing check - forms filled too quickly are suspicious
    const formFillTime = Date.now() - formStartTime;
    if (formFillTime < 2000) { // Less than 2 seconds is suspicious
      console.warn('Bot detected: form filled too quickly');
      setAuthError('Please fill out the form completely before submitting.');
      return;
    }

    // Basic validation
    if (!email || !password) {
      setAuthError('Please fill in all required fields.');
      return;
    }

    if (isSignUp && !name) {
      setAuthError('Please enter your full name.');
      return;
    }

    setSuccessMessage(null);
    void onAuth({
      mode: isSignUp ? 'signUp' : 'signIn',
      email,
      password,
      fullName: isSignUp ? name : undefined,
    });
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-20">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md"
      >
        <div className="glass-strong rounded-2xl p-8 shadow-xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-semibold tracking-tighter text-slate-900 mb-2">
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </h1>
            <p className="text-slate-600">
              {isSignUp 
                ? 'Start your global mobility journey today' 
                : 'Sign in to access your dashboard'
              }
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Honeypot field for bot protection - hidden from users */}
            <input
              type="text"
              name="website"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', opacity: 0, pointerEvents: 'none' }}
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
            />
            
            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="rounded-xl border-slate-200"
                  required
                  autoComplete="name"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-xl border-slate-200"
                required
                autoComplete="email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="rounded-xl border-slate-200 pr-10"
                  required
                  autoComplete={isSignUp ? 'new-password' : 'current-password'}
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            {!isSignUp && (
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded border-slate-300" />
                  <span className="text-slate-600">Remember me</span>
                </label>
                <button
                  type="button"
                  className="text-primary hover:text-primary/80 font-medium"
                >
                  Forgot password?
                </button>
              </div>
            )}

            <Button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl h-12 text-base"
            >
              {isLoading ? 'Please wait…' : isSignUp ? 'Create Account' : 'Sign In'}
            </Button>
          </form>

          {successMessage && (
            <div className="mt-4 rounded-xl bg-green-50 text-green-700 px-4 py-3 text-sm">
              {successMessage}
            </div>
          )}

          {error && (
            <div className={`mt-4 rounded-xl px-4 py-3 text-sm ${
              error.includes('Account created successfully') || error.includes('check your email')
                ? 'bg-green-50 text-green-700'
                : 'bg-red-50 text-red-700'
            }`}>
              {error}
            </div>
          )}

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setEmail('');
                  setPassword('');
                  setName('');
                  setHoneypot('');
                  setSuccessMessage(null);
                }}
                className="text-primary hover:text-primary/80 font-semibold"
              >
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </button>
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-200">
            <p className="text-xs text-center text-slate-500">
              By continuing, you agree to Wakapadi's{' '}
              <button
                onClick={() => onNavigate('terms')}
                className="text-primary hover:underline"
              >
                Terms of Service
              </button>{' '}
              and{' '}
              <button
                onClick={() => onNavigate('privacy')}
                className="text-primary hover:underline"
              >
                Privacy Policy
              </button>
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Button
            variant="ghost"
            onClick={() => onNavigate('home')}
            className="text-slate-600 hover:text-slate-900"
          >
            ← Back to Home
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
