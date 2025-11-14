import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, getRoleDashboard } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Map, User, Building } from 'lucide-react';
import { z } from 'zod';

const emailSchema = z.string().email('Invalid email address').max(255);
const passwordSchema = z.string().min(6, 'Password must be at least 6 characters').max(100);
const nameSchema = z.string().trim().min(1, 'Name is required').max(100);

export default function Auth() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'PLAYER' | 'HOST'>('PLAYER');
  const [loading, setLoading] = useState(false);
  
  const { signUp, signIn, user, profile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Redirect if already logged in
  if (user && profile) {
    navigate(getRoleDashboard(profile.role));
    return null;
  }

  const validateInputs = (): boolean => {
    const emailResult = emailSchema.safeParse(email);
    if (!emailResult.success) {
      toast({
        title: 'Invalid Email',
        description: emailResult.error.errors[0].message,
        variant: 'destructive',
      });
      return false;
    }

    const passwordResult = passwordSchema.safeParse(password);
    if (!passwordResult.success) {
      toast({
        title: 'Invalid Password',
        description: passwordResult.error.errors[0].message,
        variant: 'destructive',
      });
      return false;
    }

    if (isSignUp) {
      const nameResult = nameSchema.safeParse(name);
      if (!nameResult.success) {
        toast({
          title: 'Invalid Name',
          description: nameResult.error.errors[0].message,
          variant: 'destructive',
        });
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateInputs()) {
      return;
    }

    setLoading(true);

    try {
      if (isSignUp) {
        const { error } = await signUp(email, password, name, role);
        
        if (error) {
          if (error.message.includes('already registered')) {
            toast({
              title: 'Account Exists',
              description: 'This email is already registered. Please sign in instead.',
              variant: 'destructive',
            });
          } else {
            toast({
              title: 'Sign Up Failed',
              description: error.message,
              variant: 'destructive',
            });
          }
        } else {
          toast({
            title: 'Welcome!',
            description: 'Your account has been created successfully.',
          });
        }
      } else {
        const { error } = await signIn(email, password);
        
        if (error) {
          toast({
            title: 'Sign In Failed',
            description: 'Invalid email or password.',
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'Welcome back!',
            description: 'You have successfully signed in.',
          });
        }
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted to-background p-4">
      <Card className="w-full max-w-md shadow-medium">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Map className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl">
            {isSignUp ? 'Join HuntQuest' : 'Welcome Back'}
          </CardTitle>
          <CardDescription>
            {isSignUp 
              ? 'Create an account to start your adventure' 
              : 'Sign in to continue your journey'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    maxLength={100}
                  />
                </div>

                <div className="space-y-2">
                  <Label>I want to...</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setRole('PLAYER')}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        role === 'PLAYER'
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <User className="h-6 w-6 mx-auto mb-2 text-primary" />
                      <div className="font-medium text-sm">Play Hunts</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole('HOST')}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        role === 'HOST'
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <Building className="h-6 w-6 mx-auto mb-2 text-primary" />
                      <div className="font-medium text-sm">Host Hunts</div>
                    </button>
                  </div>
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                maxLength={255}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                maxLength={100}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              variant="hero" 
              size="lg"
              disabled={loading}
            >
              {loading ? 'Please wait...' : (isSignUp ? 'Create Account' : 'Sign In')}
            </Button>

            <div className="text-center text-sm">
              {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-primary hover:underline font-medium"
              >
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
