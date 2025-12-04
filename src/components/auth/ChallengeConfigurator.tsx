import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChallengeType, UserChallenges } from '@/types/auth';
import { PatternLockChallenge } from './challenges/PatternLockChallenge';
import { GridCellChallenge } from './challenges/GridCellChallenge';
import { ColorSequenceChallenge } from './challenges/ColorSequenceChallenge';
import { EmojiChallenge } from './challenges/EmojiChallenge';
import { SecretQuestionChallenge } from './challenges/SecretQuestionChallenge';
import { GlowCard } from './GlowCard';
import { Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const CHALLENGE_TITLES: Record<ChallengeType, string> = {
  pattern: 'Pattern Lock',
  grid: 'Grid Cells',
  color: 'Color Sequence',
  emoji: 'Emoji Symbol',
  question: 'Secret Question',
};

interface ChallengeConfiguratorProps {
  challenges: ChallengeType[];
  onComplete: (configs: UserChallenges) => void;
}

export const ChallengeConfigurator = ({
  challenges,
  onComplete,
}: ChallengeConfiguratorProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [configs, setConfigs] = useState<UserChallenges>({});
  const [completedChallenges, setCompletedChallenges] = useState<ChallengeType[]>([]);

  const currentChallenge = challenges[currentIndex];
  const isCompleted = completedChallenges.includes(currentChallenge);
  const allCompleted = challenges.every(c => completedChallenges.includes(c));

  const handleChallengeComplete = (config: UserChallenges[keyof UserChallenges]) => {
    setConfigs(prev => ({
      ...prev,
      [currentChallenge]: config,
    }));
    setCompletedChallenges(prev => [...prev, currentChallenge]);

    // Auto-advance to next challenge after a short delay
    if (currentIndex < challenges.length - 1) {
      setTimeout(() => setCurrentIndex(currentIndex + 1), 500);
    }
  };

  const handlePatternComplete = (pattern: number[]) => {
    handleChallengeComplete({ gridSize: pattern.length > 16 ? 6 : 4, pattern });
  };

  const handleGridComplete = (cells: number[], orderMatters: boolean) => {
    handleChallengeComplete({ selectedCells: cells, orderMatters });
  };

  const handleColorComplete = (sequence: string[], colorCount: 4 | 5) => {
    handleChallengeComplete({ colorCount, sequence });
  };

  const handleEmojiComplete = (emoji: string) => {
    handleChallengeComplete({ selectedEmoji: emoji, emojiSet: [] });
  };

  const handleQuestionComplete = (question: string, answer: string) => {
    handleChallengeComplete({ question, answer });
  };

  const handleFinish = () => {
    onComplete(configs);
  };

  const renderChallenge = () => {
    switch (currentChallenge) {
      case 'pattern':
        return <PatternLockChallenge onComplete={handlePatternComplete} />;
      case 'grid':
        return <GridCellChallenge onComplete={handleGridComplete} />;
      case 'color':
        return <ColorSequenceChallenge onComplete={handleColorComplete} />;
      case 'emoji':
        return <EmojiChallenge onComplete={handleEmojiComplete} />;
      case 'question':
        return <SecretQuestionChallenge onComplete={handleQuestionComplete} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress indicators */}
      <div className="flex justify-center gap-2 mb-6">
        {challenges.map((challenge, index) => {
          const isActive = index === currentIndex;
          const isDone = completedChallenges.includes(challenge);

          return (
            <button
              key={challenge}
              onClick={() => setCurrentIndex(index)}
              className={cn(
                'w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-300',
                isActive && 'border-primary bg-primary/20 glow-primary',
                isDone && !isActive && 'border-success bg-success/20',
                !isActive && !isDone && 'border-border bg-input'
              )}
            >
              {isDone ? (
                <Check className={cn('w-5 h-5', isActive ? 'text-primary' : 'text-success')} />
              ) : (
                <span className={cn(
                  'text-sm font-medium',
                  isActive ? 'text-primary' : 'text-muted-foreground'
                )}>
                  {index + 1}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Current challenge title */}
      <div className="text-center mb-4">
        <motion.h2
          key={currentChallenge}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xl font-semibold text-foreground"
        >
          {CHALLENGE_TITLES[currentChallenge]}
          {isCompleted && (
            <span className="ml-2 text-success">✓ Configured</span>
          )}
        </motion.h2>
        <p className="text-sm text-muted-foreground mt-1">
          Step {currentIndex + 1} of {challenges.length}
        </p>
      </div>

      {/* Challenge content */}
      <GlowCard className="min-h-[400px]" glowColor={isCompleted ? 'success' : 'primary'}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentChallenge}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderChallenge()}
          </motion.div>
        </AnimatePresence>
      </GlowCard>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
          disabled={currentIndex === 0}
          className="border-border"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>

        {allCompleted ? (
          <Button
            onClick={handleFinish}
            className="bg-success text-success-foreground hover:bg-success/90 glow-success"
          >
            <Check className="w-4 h-4 mr-2" />
            Complete Registration
          </Button>
        ) : (
          <Button
            variant="outline"
            onClick={() => setCurrentIndex(Math.min(challenges.length - 1, currentIndex + 1))}
            disabled={currentIndex === challenges.length - 1}
            className="border-border"
          >
            Next
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
};
