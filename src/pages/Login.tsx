import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { UsernameInput } from '@/components/auth/UsernameInput';
import { LoadChallengesButton } from '@/components/auth/LoadChallengesButton';
import { ChallengeVerifier } from '@/components/auth/ChallengeVerifier';
import { SuccessScreen } from '@/components/auth/SuccessScreen';
import { GlowCard } from '@/components/auth/GlowCard';
import { LoginStep, RegistrationData } from '@/types/auth';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Home } from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useEffect } from 'react';

const Login = () => {
  const navigate = useNavigate();
  const { login, user } = useAuth();
  const [step, setStep] = useState<LoginStep>('username');
  const [username, setUsername] = useState('');
  const [userData, setUserData] = useState<RegistrationData | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(false);

  const handleUsernameSubmit = (name: string) => {
    setIsLoadingUser(true);
    api.fetchChallenges(name)
      .then((data) => {
        setUsername(data.username || name);
        setUserData({
          username: data.username,
          selectedChallenges: data.selectedChallenges,
          challengeConfigs: data.challengeConfigs,
        });
        setStep('load-challenges');
      })
      .catch((error: any) => {
        toast({
          title: 'User not found',
          description: error?.message || 'We could not load your challenges.',
          variant: 'destructive',
        });
        setUserData(null);
      })
      .finally(() => setIsLoadingUser(false));
  };

  const handleLoadChallenges = () => {
    setStep('solve-challenges');
  };

  const handleSuccess = () => {
    login(username);
    setStep('success');
  };

  const handleContinue = () => {
    navigate('/dashboard');
  };

  useEffect(() => {
    // If already logged in, skip to dashboard
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const goBack = () => {
    switch (step) {
      case 'load-challenges':
        setStep('username');
        setUserData(null);
        break;
      case 'solve-challenges':
        setStep('load-challenges');
        break;
      default:
        break;
    }
  };

  const getSubtitle = () => {
    switch (step) {
      case 'username':
        return 'Enter your identity';
      case 'load-challenges':
        return `Welcome back, ${username}`;
      case 'solve-challenges':
        return 'Prove your identity';
      case 'success':
        return 'Access granted';
      default:
        return '';
    }
  };

  return (
    <AuthLayout title="Login" subtitle={getSubtitle()}>
      <div className="flex justify-between mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="text-muted-foreground hover:text-foreground"
        >
          <Home className="w-4 h-4 mr-2" />
          Home
        </Button>

        {(step === 'load-challenges' || step === 'solve-challenges') && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Button
              variant="ghost"
              onClick={goBack}
              className="text-muted-foreground hover:text-foreground"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </motion.div>
        )}
      </div>

      <AnimatePresence mode="wait">
        {step === 'username' && (
          <motion.div
            key="username"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <UsernameInput 
              onSubmit={handleUsernameSubmit} 
              isLogin 
              onCheckUsername={async (name) => ({
                exists: await api.checkUserExists(name),
              })}
            />
            {isLoadingUser && (
              <p className="text-center text-muted-foreground text-sm mt-3">
                Loading your challenges...
              </p>
            )}
            <div className="mt-6 text-center">
              <p className="text-muted-foreground text-sm">
                Don't have an account?{' '}
                <button
                  onClick={() => navigate('/register')}
                  className="text-primary hover:underline"
                >
                  Register here
                </button>
              </p>
            </div>
          </motion.div>
        )}

        {step === 'load-challenges' && (
          <motion.div
            key="load"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <GlowCard>
              <LoadChallengesButton onLoad={handleLoadChallenges} />
            </GlowCard>
          </motion.div>
        )}

        {step === 'solve-challenges' && userData && (
          <motion.div
            key="solve"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <ChallengeVerifier
              challenges={userData.selectedChallenges}
              configs={userData.challengeConfigs}
              username={username}
              onSuccess={handleSuccess}
            />
          </motion.div>
        )}

        {step === 'success' && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
          >
            <GlowCard glowColor="success">
              <SuccessScreen
                username={username}
                onContinue={handleContinue}
              />
            </GlowCard>
          </motion.div>
        )}
      </AnimatePresence>
    </AuthLayout>
  );
};

export default Login;
