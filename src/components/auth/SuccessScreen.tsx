import { motion } from 'framer-motion';
import { CheckCircle, PartyPopper, Shield, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SuccessScreenProps {
  username: string;
  isRegistration?: boolean;
  onContinue: () => void;
}

export const SuccessScreen = ({ 
  username, 
  isRegistration = false,
  onContinue 
}: SuccessScreenProps) => {
  return (
    <div className="text-center py-8">
      {/* Animated confetti-like particles */}
      <div className="relative">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 0, x: 0 }}
            animate={{ 
              opacity: [0, 1, 0],
              y: [-20, -60],
              x: [(i % 2 === 0 ? -1 : 1) * (20 + i * 10), (i % 2 === 0 ? -1 : 1) * (40 + i * 15)],
            }}
            transition={{ 
              duration: 2,
              delay: i * 0.15,
              repeat: Infinity,
              repeatDelay: 1,
            }}
            className="absolute left-1/2 top-0"
          >
            <Sparkles className={`w-4 h-4 ${i % 2 === 0 ? 'text-primary' : 'text-secondary'}`} />
          </motion.div>
        ))}
      </div>

      {/* Main icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', duration: 0.6 }}
        className="relative"
      >
        <motion.div
          animate={{
            boxShadow: [
              '0 0 20px hsl(160 84% 45% / 0.3)',
              '0 0 60px hsl(160 84% 45% / 0.5)',
              '0 0 20px hsl(160 84% 45% / 0.3)',
            ],
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-28 h-28 mx-auto mb-8 rounded-full bg-success/10 border-2 border-success flex items-center justify-center"
        >
          {isRegistration ? (
            <PartyPopper className="w-14 h-14 text-success" />
          ) : (
            <Shield className="w-14 h-14 text-success" />
          )}
        </motion.div>
      </motion.div>

      {/* Success message */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-3xl font-bold text-foreground mb-2">
          {isRegistration ? 'Registration Complete!' : 'Access Granted!'}
        </h2>
        <p className="text-muted-foreground text-lg mb-2">
          Welcome{isRegistration ? '' : ' back'}, <span className="text-primary font-semibold">{username}</span>
        </p>
        {isRegistration && (
          <p className="text-sm text-muted-foreground mb-6">
            Your security challenges have been saved. You can now log in using your unique authentication games.
          </p>
        )}
      </motion.div>

      {/* Success details */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex justify-center gap-4 my-8"
      >
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-success/10 border border-success/30">
          <CheckCircle className="w-5 h-5 text-success" />
          <span className="text-sm text-foreground">Identity Verified</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30">
          <Shield className="w-5 h-5 text-primary" />
          <span className="text-sm text-foreground">Secure Session</span>
        </div>
      </motion.div>

      {/* Continue button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Button
          onClick={onContinue}
          size="lg"
          className="bg-success text-success-foreground hover:bg-success/90 glow-success px-8"
        >
          {isRegistration ? 'Go to Login' : 'Continue to Dashboard'}
        </Button>
      </motion.div>
    </div>
  );
};
