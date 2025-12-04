import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChallengeType, UserChallenges, PatternConfig, GridConfig, ColorConfig, EmojiConfig, QuestionConfig, VerifyAttempts } from '@/types/auth';
import { PatternLockChallenge } from './challenges/PatternLockChallenge';
import { GridCellChallenge } from './challenges/GridCellChallenge';
import { ColorSequenceChallenge } from './challenges/ColorSequenceChallenge';
import { EmojiChallenge } from './challenges/EmojiChallenge';
import { SecretQuestionChallenge } from './challenges/SecretQuestionChallenge';
import { GlowCard } from './GlowCard';
import { Check, Lock, Shield, Loader2, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { api } from '@/lib/api';

const CHALLENGE_TITLES: Record<ChallengeType, string> = {
  pattern: 'Pattern Lock',
  grid: 'Grid Cells',
  color: 'Color Sequence',
  emoji: 'Emoji Symbol',
  question: 'Secret Question',
};

const EMOJI_DECOYS = ['🎭', '🎪', '🎨', '🎯'];

interface ChallengeVerifierProps {
  challenges: ChallengeType[];
  configs: UserChallenges;
  username: string;
  onSuccess: () => void;
}

export const ChallengeVerifier = ({
  challenges,
  configs,
  username,
  onSuccess,
}: ChallengeVerifierProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completedChallenges, setCompletedChallenges] = useState<ChallengeType[]>([]);
  const [attempts, setAttempts] = useState<VerifyAttempts>({});
  const [verifyingServer, setVerifyingServer] = useState(false);
  const [serverError, setServerError] = useState('');
  const [challengeResults, setChallengeResults] = useState<Record<ChallengeType, 'passed'>>({});
  const [activeError, setActiveError] = useState('');

  const currentChallenge = challenges[currentIndex];
  const allCompleted = completedChallenges.length === challenges.length;

  const handleChallengeComplete = (attemptData: VerifyAttempts[keyof VerifyAttempts]) => {
    setServerError('');
    setActiveError('');
    const newAttempts: VerifyAttempts = { ...attempts, [currentChallenge]: attemptData };
    setAttempts(newAttempts);
    setVerifyingServer(true);

    api.verifyChallenge(username, currentChallenge, attemptData)
      .then((resp) => {
        if (resp.success) {
          const newCompleted = completedChallenges.includes(currentChallenge)
            ? completedChallenges
            : [...completedChallenges, currentChallenge];
          setChallengeResults(prev => ({ ...prev, [currentChallenge]: 'passed' }));
          setCompletedChallenges(newCompleted);

          if (newCompleted.length === challenges.length) {
            setVerifyingServer(false);
            setTimeout(() => onSuccess(), 400);
          } else {
            setVerifyingServer(false);
            setTimeout(() => setCurrentIndex(currentIndex + 1), 400);
          }
        } else {
          setActiveError('That attempt does not match our records. Try again.');
          setVerifyingServer(false);
        }
      })
      .catch((error: any) => {
        setActiveError(error?.message || 'Unable to verify this challenge right now.');
        setVerifyingServer(false);
      });
  };

  const getVerifyEmojiSet = (selectedEmoji: string): string[] => {
    const decoys = EMOJI_DECOYS.filter(e => e !== selectedEmoji).slice(0, 4);
    const set = [...decoys, selectedEmoji];
    // Shuffle
    return set.sort(() => Math.random() - 0.5);
  };

  const renderChallenge = () => {
    switch (currentChallenge) {
      case 'pattern': {
        const config = configs.pattern as PatternConfig | undefined;
        return (
          <PatternLockChallenge
            gridSize={config?.gridSize}
            existingPattern={config?.pattern}
            isVerifying
            useServerVerification={!config?.pattern}
            requiredLength={config?.requiredLength || 4}
            onComplete={(pattern) => handleChallengeComplete(pattern)}
          />
        );
      }
      case 'grid': {
        const config = configs.grid as GridConfig | undefined;
        return (
          <GridCellChallenge
            existingCells={config?.selectedCells}
            existingOrderMatters={config?.orderMatters}
            isVerifying
            useServerVerification={!config?.selectedCells}
            requiredCount={config?.requiredCount}
            onComplete={(cells, orderMatters) => handleChallengeComplete({ selectedCells: cells, orderMatters })}
          />
        );
      }
      case 'color': {
        const config = configs.color as ColorConfig | undefined;
        return (
          <ColorSequenceChallenge
            colorCount={config?.colorCount}
            existingSequence={config?.sequence}
            isVerifying
            useServerVerification={!config?.sequence}
            requiredLength={config?.requiredLength}
            onComplete={(sequence) => handleChallengeComplete(sequence)}
          />
        );
      }
      case 'emoji': {
        const config = configs.emoji as EmojiConfig | undefined;
        return (
          <EmojiChallenge
            existingEmoji={config?.selectedEmoji}
            verifyEmojiSet={config?.emojiSet || getVerifyEmojiSet(config?.selectedEmoji || '')}
            isVerifying
            useServerVerification={!config?.selectedEmoji}
            onComplete={(emoji) => handleChallengeComplete(emoji)}
          />
        );
      }
      case 'question': {
        const config = configs.question as QuestionConfig | undefined;
        return (
          <SecretQuestionChallenge
            existingQuestion={config?.question}
            existingAnswer={config?.answer}
            isVerifying
            useServerVerification={!config?.answer}
            onComplete={(_, answer) => handleChallengeComplete({ answer })}
          />
        );
      }
      default:
        return null;
    }
  };

  if (allCompleted) {
    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center py-12"
      >
        {verifyingServer ? (
          <>
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center glow-primary">
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Checking with the server...
            </h2>
            <p className="text-muted-foreground">
              Hold tight while we confirm your challenges.
            </p>
          </>
        ) : serverError ? (
          <>
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-destructive/15 border-2 border-destructive flex items-center justify-center glow-error">
              <XCircle className="w-10 h-10 text-destructive" />
            </div>
            <h2 className="text-2xl font-bold text-destructive mb-2">
              Verification failed
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto mb-4">
              {serverError}
            </p>
            <button
              onClick={() => {
                setServerError('');
                setCurrentIndex(0);
                setCompletedChallenges([]);
                setAttempts({});
              }}
              className="text-primary underline text-sm"
            >
              Try again
            </button>
          </>
        ) : (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.2 }}
              className="w-24 h-24 mx-auto mb-6 rounded-full bg-success/20 border-2 border-success flex items-center justify-center glow-success"
            >
              <Shield className="w-12 h-12 text-success" />
            </motion.div>
            <h2 className="text-2xl font-bold text-success text-glow-primary mb-2">
              Identity Verified!
            </h2>
            <p className="text-muted-foreground">
              Redirecting to your dashboard...
            </p>
          </>
        )}
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {serverError && !verifyingServer && (
        <div className="text-center text-destructive bg-destructive/10 border border-destructive/40 rounded-lg px-4 py-3">
          {serverError}
        </div>
      )}
      {activeError && (
        <div className="text-center text-destructive bg-destructive/10 border border-destructive/40 rounded-lg px-4 py-3">
          {activeError}
        </div>
      )}

      {/* Progress indicators */}
      <div className="flex justify-center gap-3 mb-6">
        {challenges.map((challenge, index) => {
          const isActive = index === currentIndex;
          const isDone = completedChallenges.includes(challenge);
          const isLocked = index > currentIndex && !isDone;

          return (
            <div
              key={challenge}
              className={cn(
                'w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-300',
                isActive && 'border-primary bg-primary/20 glow-primary',
                isDone && 'border-success bg-success/20 glow-success',
                isLocked && 'border-border bg-input opacity-50'
              )}
            >
              {isDone ? (
                <Check className="w-6 h-6 text-success" />
              ) : isLocked ? (
                <Lock className="w-5 h-5 text-muted-foreground" />
              ) : (
                <span className="text-lg font-bold text-primary">{index + 1}</span>
              )}
            </div>
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
          Verify: {CHALLENGE_TITLES[currentChallenge]}
        </motion.h2>
        <p className="text-sm text-muted-foreground mt-1">
          Challenge {currentIndex + 1} of {challenges.length}
        </p>
        {challengeResults[currentChallenge] === 'passed' && (
          <p className="text-success text-sm mt-2 flex items-center justify-center gap-2">
            <Check className="w-4 h-4" /> This challenge is correct
          </p>
        )}
      </div>

      {/* Challenge content */}
      <GlowCard className="min-h-[400px]">
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
    </div>
  );
};
