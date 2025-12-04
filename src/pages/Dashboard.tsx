import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { GlowCard } from '@/components/auth/GlowCard';
import { Button } from '@/components/ui/button';
import { LogOut, Shield, Sparkles } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <AuthLayout title="Dashboard" subtitle="Identity confirmed">
      <GlowCard className="p-10">
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-success/15 border border-success/40 flex items-center justify-center glow-success">
            <Shield className="w-8 h-8 text-success" />
          </div>
          <div>
            <p className="text-sm uppercase tracking-wide text-muted-foreground">Welcome</p>
            <h2 className="text-3xl font-bold text-foreground mt-1 flex items-center justify-center gap-2">
              {user}
              <Sparkles className="w-5 h-5 text-primary" />
            </h2>
            <p className="text-muted-foreground mt-2 max-w-md">
              You’ve cleared every interactive challenge. Explore, relax, or log out securely—your identity is safe here.
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => navigate('/')}
              className="border-border"
            >
              Back to home
            </Button>
            <Button
              onClick={handleLogout}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </GlowCard>
    </AuthLayout>
  );
};

export default Dashboard;
