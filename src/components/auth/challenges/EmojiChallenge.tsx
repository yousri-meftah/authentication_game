import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Check, RotateCcw } from 'lucide-react';

const EMOJI_SETS = [
  ['🔥', '⭐', '💎', '🎯', '🚀'],
  ['🦁', '🐺', '🦅', '🐉', '🦄'],
  ['🌙', '☀️', '⚡', '🌊', '🍀'],
  ['🎮', '🎸', '🎨', '📚', '🔮'],
  ['🏆', '👑', '💫', '🌈', '🎪'],
];

interface EmojiChallengeProps {
  onComplete: (emoji: string) => void;
  existingEmoji?: string;
  isVerifying?: boolean;
  verifyEmojiSet?: string[];
  useServerVerification?: boolean;
}

export const EmojiChallenge = ({
  onComplete,
  existingEmoji,
  isVerifying = false,
  verifyEmojiSet,
  useServerVerification = false,
}: EmojiChallengeProps) => {
  const [selectedSet, setSelectedSet] = useState(0);
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  const currentEmojis = isVerifying && verifyEmojiSet 
    ? verifyEmojiSet 
    : EMOJI_SETS[selectedSet];

  const handleEmojiClick = (emoji: string) => {
    setSelectedEmoji(emoji);
    setError(false);
    setSuccess(false);
  };

  const handleConfirm = () => {
    if (!selectedEmoji) return;

    if (isVerifying && existingEmoji && !useServerVerification) {
      if (selectedEmoji === existingEmoji) {
        setSuccess(true);
        setTimeout(() => onComplete(selectedEmoji), 500);
      } else {
        setError(true);
        setTimeout(() => setSelectedEmoji(null), 500);
      }
    } else {
      onComplete(selectedEmoji);
    }
  };

  const reset = () => {
    setSelectedEmoji(null);
    setError(false);
    setSuccess(false);
  };

  return (
    <div className="space-y-6">
      {!isVerifying && (
        <div className="flex justify-center gap-2 mb-4 flex-wrap">
          {EMOJI_SETS.map((_, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => { setSelectedSet(index); reset(); }}
              className={cn(
                'border-border',
                selectedSet === index && 'border-primary bg-primary/10'
              )}
            >
              Set {index + 1}
            </Button>
          ))}
        </div>
      )}

      <div className="text-center mb-4">
        <p className="text-muted-foreground text-sm">
          {isVerifying 
            ? 'Select your personal emoji symbol'
            : 'Choose an emoji that represents you'}
        </p>
      </div>

      {/* Emoji grid */}
      <div className="flex justify-center gap-4">
        {currentEmojis.map((emoji, index) => (
          <motion.button
            key={`${emoji}-${index}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => handleEmojiClick(emoji)}
            className={cn(
              'w-16 h-16 rounded-xl border-2 text-3xl transition-all duration-300',
              'bg-input hover:bg-input/80 border-border',
              'hover:scale-110 hover:border-primary/50',
              selectedEmoji === emoji && !error && !success && 'border-primary bg-primary/20 glow-primary scale-110',
              selectedEmoji === emoji && error && 'border-destructive bg-destructive/20 glow-error animate-pulse',
              selectedEmoji === emoji && success && 'border-success bg-success/20 glow-success'
            )}
            whileTap={{ scale: 0.95 }}
          >
            <motion.span
              animate={{
                scale: selectedEmoji === emoji ? [1, 1.2, 1] : 1,
              }}
              transition={{ duration: 0.3 }}
            >
              {emoji}
            </motion.span>
          </motion.button>
        ))}
      </div>

      {/* Selected display */}
      <AnimatePresence>
        {selectedEmoji && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="text-center"
          >
            <div className={cn(
              'inline-flex items-center gap-3 px-6 py-3 rounded-full',
              'bg-input/50 border border-border',
              error && 'border-destructive',
              success && 'border-success'
            )}>
              <span className="text-4xl">{selectedEmoji}</span>
              <span className="text-foreground font-medium">Selected</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-center gap-3 pt-4">
        <Button
          variant="outline"
          onClick={reset}
          className="border-border"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset
        </Button>
        
        <Button
          onClick={handleConfirm}
          disabled={!selectedEmoji}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Check className="w-4 h-4 mr-2" />
          {isVerifying ? 'Verify' : 'Confirm Emoji'}
        </Button>
      </div>
    </div>
  );
};
