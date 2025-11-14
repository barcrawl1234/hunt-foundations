import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth, getRoleDashboard } from '@/lib/auth';
import { Map, LogOut, User } from 'lucide-react';

export function Navigation() {
  const { user, profile, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <nav className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl">
            <Map className="h-6 w-6 text-primary" />
            <span className="bg-gradient-hero bg-clip-text text-transparent">HuntQuest</span>
          </Link>

          <div className="flex items-center gap-4">
            {user && profile ? (
              <>
                <Link to={getRoleDashboard(profile.role)}>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <User className="h-4 w-4" />
                    {profile.role === 'PLAYER' && 'Player Dashboard'}
                    {profile.role === 'HOST' && 'Host Dashboard'}
                    {profile.role === 'SUPER_ADMIN' && 'Admin Panel'}
                  </Button>
                </Link>
                <Button variant="outline" size="sm" onClick={handleSignOut} className="gap-2">
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </Button>
              </>
            ) : (
              <Link to="/auth">
                <Button variant="default" size="sm">
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
