import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { UsernameInput } from '@/components/auth/UsernameInput';
import { ChallengeSelector } from '@/components/auth/ChallengeSelector';
import { ChallengeConfigurator } from '@/components/auth/ChallengeConfigurator';
import { SuccessScreen } from '@/components/auth/SuccessScreen';
import { AuthStep, ChallengeType, UserChallenges } from '@/types/auth';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Home } from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useAuth';

const Register = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<AuthStep>('username');
  const [username, setUsername] = useState('');
  const [selectedChallenges, setSelectedChallenges] = useState<ChallengeType[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    // If already logged in, skip registering again
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleUsernameSubmit = (name: string) => {
    setUsername(name);
    setStep('select-challenges');
  };

  const handleChallengesSelected = (challenges: ChallengeType[]) => {
    setSelectedChallenges(challenges);
    setStep('configure-challenges');
  };

  const handleConfigComplete = async (configs: UserChallenges) => {
    if (!username) return;
    setIsSubmitting(true);

    try {
      await api.registerUser({
        username,
        selectedChallenges,
        challengeConfigs: configs,
      });
      setStep('complete');
    } catch (error: any) {
      toast({
        title: 'Registration failed',
        description: error?.message || 'Could not save your challenges. Please try again.',
        variant: 'destructive',
      });
      setStep('username');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContinue = () => {
    navigate('/login');
  };

  const goBack = () => {
    switch (step) {
      case 'select-challenges':
        setStep('username');
        break;
      case 'configure-challenges':
        setStep('select-challenges');
        break;
      default:
        break;
    }
  };

  const getSubtitle = () => {
    switch (step) {
      case 'username':
        return 'Create your unique identity';
      case 'select-challenges':
        return 'Choose your security games';
      case 'configure-challenges':
        return 'Set up your challenges';
      case 'complete':
        return 'Your account is ready';
      default:
        return '';
    }
  };

  return (
    <AuthLayout title="Register" subtitle={getSubtitle()}>
      <div className="flex justify-between mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="text-muted-foreground hover:text-foreground"
        >
          <Home className="w-4 h-4 mr-2" />
          Home
        </Button>

        {step !== 'username' && step !== 'complete' && (
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
              onCheckUsername={async (name) => ({
                exists: await api.checkUserExists(name),
              })}
            />
            <div className="mt-6 text-center">
              <p className="text-muted-foreground text-sm">
                Already have an account?{' '}
                <button
                  onClick={() => navigate('/login')}
                  className="text-primary hover:underline"
                >
                  Login here
                </button>
              </p>
            </div>
          </motion.div>
        )}

        {step === 'select-challenges' && (
          <motion.div
            key="select"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <ChallengeSelector onSubmit={handleChallengesSelected} />
          </motion.div>
        )}

        {step === 'configure-challenges' && (
          <motion.div
            key="configure"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <ChallengeConfigurator
              challenges={selectedChallenges}
              onComplete={handleConfigComplete}
            />
            {isSubmitting && (
              <p className="text-center text-muted-foreground text-sm mt-4">
                Saving your challenges...
              </p>
            )}
          </motion.div>
        )}

        {step === 'complete' && (
          <motion.div
            key="complete"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
          >
            <SuccessScreen
              username={username}
              isRegistration
              onContinue={handleContinue}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </AuthLayout>
  );
};

export default Register;
