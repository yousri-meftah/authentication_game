import { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Shield } from 'lucide-react';

interface LoadChallengesButtonProps {
  onLoad: () => void;
}

export const LoadChallengesButton = ({ onLoad }: LoadChallengesButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    // Simulate loading challenges from server
    await new Promise(resolve => setTimeout(resolve, 1500));
    onLoad();
  };

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center"
      >
        <motion.div
          animate={{
            boxShadow: [
              '0 0 20px hsl(180 100% 50% / 0.3)',
              '0 0 40px hsl(180 100% 50% / 0.5)',
              '0 0 20px hsl(180 100% 50% / 0.3)',
            ],
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-32 h-32 mx-auto mb-8 rounded-full bg-card border-2 border-primary flex items-center justify-center"
        >
          {isLoading ? (
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
          ) : (
            <Shield className="w-12 h-12 text-primary" />
          )}
        </motion.div>

        <h2 className="text-2xl font-semibold text-foreground mb-4">
          Ready to Authenticate
        </h2>
        <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
          Your security challenges are waiting. Click the button below to load them and prove your identity.
        </p>

        <motion.button
          onClick={handleClick}
          disabled={isLoading}
          className="relative px-8 py-4 rounded-lg bg-primary text-primary-foreground font-semibold text-lg overflow-hidden group disabled:opacity-70"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {/* Animated background */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-primary"
            animate={{
              x: ['-100%', '100%'],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'linear',
            }}
            style={{ opacity: 0.3 }}
          />
          
          <span className="relative z-10 flex items-center gap-2">
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Loading Challenges...
              </>
            ) : (
              <>
                <Shield className="w-5 h-5" />
                Load My Challenges
              </>
            )}
          </span>

          {/* Glow effect */}
          <motion.div
            className="absolute inset-0 rounded-lg"
            animate={{
              boxShadow: [
                '0 0 20px hsl(180 100% 50% / 0.5)',
                '0 0 40px hsl(180 100% 50% / 0.8)',
                '0 0 20px hsl(180 100% 50% / 0.5)',
              ],
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </motion.button>
      </motion.div>
    </div>
  );
};
