import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, ArrowRight, Loader2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { GlowCard } from './GlowCard';

interface UsernameInputProps {
  onSubmit: (username: string) => void;
  isLogin?: boolean;
  onCheckUsername?: (username: string) => Promise<{ exists: boolean; error?: string }>;
}

export const UsernameInput = ({ 
  onSubmit, 
  isLogin = false,
  onCheckUsername,
}: UsernameInputProps) => {
  const [username, setUsername] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState('');
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);

  const checkUsername = async (value: string) => {
    if (value.length < 3) {
      setError('Username must be at least 3 characters');
      setIsAvailable(null);
      return;
    }

    setIsChecking(true);
    setError('');

    try {
      let exists = false;

      if (onCheckUsername) {
        const result = await onCheckUsername(value);
        exists = result.exists;
        if (result.error) {
          setError(result.error);
          setIsAvailable(null);
          setIsChecking(false);
          return;
        }
      }

      if (isLogin) {
        if (!exists) {
          setError('Username not found');
          setIsAvailable(null);
        } else {
          setIsAvailable(true);
        }
      } else {
        if (exists) {
          setError('Username already taken');
          setIsAvailable(false);
        } else {
          setIsAvailable(true);
        }
      }
    } catch (err) {
      setError('Unable to check username right now');
      setIsAvailable(null);
    } finally {
      setIsChecking(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isAvailable && username.length >= 3) {
      onSubmit(username);
    }
  };

  return (
    <GlowCard className="p-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="text-center mb-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center"
          >
            <User className="w-8 h-8 text-primary" />
          </motion.div>
          <h2 className="text-xl font-semibold text-foreground">
            {isLogin ? 'Enter your identity' : 'Choose your identity'}
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            {isLogin 
              ? 'Type your username to load your challenges' 
              : 'Pick a unique username that will identify you'}
          </p>
        </div>

        <div className="relative">
          <Input
            type="text"
            placeholder="Enter username..."
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              setIsAvailable(null);
              setError('');
            }}
            onBlur={() => username.length > 0 && checkUsername(username)}
            className="bg-input border-border text-foreground placeholder:text-muted-foreground h-12 pr-12 text-lg"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {isChecking && <Loader2 className="w-5 h-5 text-primary animate-spin" />}
            {isAvailable === true && !isChecking && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
              >
                <Check className="w-5 h-5 text-success" />
              </motion.div>
            )}
          </div>
        </div>

        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-destructive text-sm"
          >
            {error}
          </motion.p>
        )}

        <Button
          type="submit"
          disabled={!isAvailable || isChecking}
          className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 glow-primary disabled:opacity-50 disabled:glow-none"
        >
          <span>Continue</span>
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </form>
    </GlowCard>
  );
};
