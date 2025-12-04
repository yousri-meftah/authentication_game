import { useState } from 'react';
import { motion } from 'framer-motion';
import { Grid3X3, Palette, Smile, HelpCircle, ArrowRight, Check, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GlowCard } from './GlowCard';
import { Challenge, ChallengeType } from '@/types/auth';
import { cn } from '@/lib/utils';

const CHALLENGES: Challenge[] = [
  {
    id: 'pattern',
    name: 'Pattern Lock',
    description: 'Draw a secret pattern on a grid like a phone unlock',
    icon: 'pattern',
  },
  {
    id: 'grid',
    name: 'Grid Cells',
    description: 'Select specific cells on a 6×6 grid',
    icon: 'grid',
  },
  {
    id: 'color',
    name: 'Color Sequence',
    description: 'Create a secret color combination',
    icon: 'color',
  },
  {
    id: 'emoji',
    name: 'Emoji Symbol',
    description: 'Pick your personal emoji identifier',
    icon: 'emoji',
  },
  {
    id: 'question',
    name: 'Secret Question',
    description: 'Set a security question and answer',
    icon: 'question',
  },
];

const IconMap = {
  pattern: Lock,
  grid: Grid3X3,
  color: Palette,
  emoji: Smile,
  question: HelpCircle,
};

interface ChallengeSelectorProps {
  onSubmit: (selected: ChallengeType[]) => void;
  minRequired?: number;
}

export const ChallengeSelector = ({ 
  onSubmit, 
  minRequired = 2 
}: ChallengeSelectorProps) => {
  const [selected, setSelected] = useState<ChallengeType[]>([]);

  const toggleChallenge = (id: ChallengeType) => {
    setSelected(prev => 
      prev.includes(id) 
        ? prev.filter(c => c !== id)
        : [...prev, id]
    );
  };

  const canContinue = selected.length >= minRequired;

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-foreground mb-2">
          Select Your Challenges
        </h2>
        <p className="text-muted-foreground">
          Choose at least {minRequired} security challenges to protect your account
        </p>
        <div className="mt-4 flex items-center justify-center gap-2">
          <span className="text-sm text-muted-foreground">Selected:</span>
          <span className={cn(
            "text-lg font-bold",
            canContinue ? "text-success" : "text-primary"
          )}>
            {selected.length}
          </span>
          <span className="text-sm text-muted-foreground">/ {minRequired} minimum</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {CHALLENGES.map((challenge, index) => {
          const Icon = IconMap[challenge.icon as keyof typeof IconMap];
          const isSelected = selected.includes(challenge.id);

          return (
            <motion.div
              key={challenge.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <GlowCard
                hover
                glowColor={isSelected ? 'success' : 'primary'}
                className={cn(
                  'cursor-pointer transition-all duration-300',
                  isSelected && 'border-success/50 bg-success/5'
                )}
              >
                <button
                  onClick={() => toggleChallenge(challenge.id)}
                  className="w-full text-left"
                >
                  <div className="flex items-start gap-4">
                    <div className={cn(
                      'w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-300',
                      isSelected 
                        ? 'bg-success/20 border border-success/50' 
                        : 'bg-primary/10 border border-primary/30'
                    )}>
                      <Icon className={cn(
                        'w-6 h-6',
                        isSelected ? 'text-success' : 'text-primary'
                      )} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-foreground">
                          {challenge.name}
                        </h3>
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-6 h-6 rounded-full bg-success flex items-center justify-center"
                          >
                            <Check className="w-4 h-4 text-success-foreground" />
                          </motion.div>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {challenge.description}
                      </p>
                    </div>
                  </div>
                </button>
              </GlowCard>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="pt-4"
      >
        <Button
          onClick={() => onSubmit(selected)}
          disabled={!canContinue}
          className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 glow-primary disabled:opacity-50 disabled:shadow-none"
        >
          <span>Configure Challenges</span>
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </motion.div>
    </div>
  );
};
