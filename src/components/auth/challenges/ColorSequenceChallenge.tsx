import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { RotateCcw, Check, X } from 'lucide-react';

const COLORS = [
  { id: 'red', name: 'Red', class: 'bg-pattern-red', border: 'border-pattern-red' },
  { id: 'blue', name: 'Blue', class: 'bg-pattern-blue', border: 'border-pattern-blue' },
  { id: 'green', name: 'Green', class: 'bg-pattern-green', border: 'border-pattern-green' },
  { id: 'yellow', name: 'Yellow', class: 'bg-pattern-yellow', border: 'border-pattern-yellow' },
  { id: 'purple', name: 'Purple', class: 'bg-pattern-purple', border: 'border-pattern-purple' },
];

interface ColorSequenceChallengeProps {
  colorCount?: 4 | 5;
  onComplete: (sequence: string[], colorCount: 4 | 5) => void;
  existingSequence?: string[];
  isVerifying?: boolean;
  useServerVerification?: boolean;
  requiredLength?: number;
}

export const ColorSequenceChallenge = ({
  colorCount = 5,
  onComplete,
  existingSequence,
  isVerifying = false,
  useServerVerification = false,
  requiredLength,
}: ColorSequenceChallengeProps) => {
  const [sequence, setSequence] = useState<string[]>([]);
  const [selectedCount, setSelectedCount] = useState<4 | 5>(colorCount);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  const availableColors = COLORS.slice(0, selectedCount);
  const minLength = requiredLength || 3;
  const maxLength = 8;

  const handleColorClick = (colorId: string) => {
    if (sequence.length >= maxLength) return;
    setError(false);
    setSuccess(false);
    setSequence(prev => [...prev, colorId]);
  };

  const removeLastColor = () => {
    setSequence(prev => prev.slice(0, -1));
    setError(false);
  };

  const reset = () => {
    setSequence([]);
    setError(false);
    setSuccess(false);
  };

  const handleConfirm = () => {
    if (isVerifying && existingSequence && !useServerVerification) {
      const isCorrect = 
        sequence.length === existingSequence.length &&
        sequence.every((color, i) => color === existingSequence[i]);

      if (isCorrect) {
        setSuccess(true);
        setTimeout(() => onComplete(sequence, selectedCount), 500);
      } else {
        setError(true);
        setTimeout(() => reset(), 500);
      }
    } else if (sequence.length >= minLength) {
      onComplete(sequence, selectedCount);
    }
  };

  return (
    <div className="space-y-6">
      {!isVerifying && (
        <div className="flex justify-center gap-2 mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => { setSelectedCount(4); reset(); }}
            className={cn(
              'border-border',
              selectedCount === 4 && 'border-primary bg-primary/10'
            )}
          >
            4 Colors
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => { setSelectedCount(5); reset(); }}
            className={cn(
              'border-border',
              selectedCount === 5 && 'border-primary bg-primary/10'
            )}
          >
            5 Colors
          </Button>
        </div>
      )}

      {/* Color palette */}
      <div className="flex justify-center gap-4">
        {availableColors.map((color, index) => (
          <motion.button
            key={color.id}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => handleColorClick(color.id)}
            className={cn(
              'w-14 h-14 rounded-xl border-4 transition-all duration-200',
              color.class,
              'border-transparent hover:border-foreground/30',
              'hover:scale-110 hover:shadow-lg'
            )}
            style={{ 
              boxShadow: `0 0 20px hsl(var(--pattern-${color.id}) / 0.3)` 
            }}
            whileTap={{ scale: 0.9 }}
          />
        ))}
      </div>

      {/* Sequence display */}
      <div className="bg-input/30 rounded-lg border border-border p-4 min-h-[80px]">
        <div className="flex flex-wrap items-center gap-2 justify-center">
          <AnimatePresence mode="popLayout">
            {sequence.map((colorId, index) => {
              const color = COLORS.find(c => c.id === colorId);
              return (
                <motion.div
                  key={`${colorId}-${index}`}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ 
                    scale: 1, 
                    opacity: 1,
                    backgroundColor: error ? 'hsl(var(--destructive))' : success ? 'hsl(var(--success))' : undefined
                  }}
                  exit={{ scale: 0, opacity: 0 }}
                  layout
                  className={cn(
                    'w-10 h-10 rounded-lg flex items-center justify-center',
                    color?.class,
                    error && 'animate-pulse'
                  )}
                >
                  <span className="text-sm font-bold text-white/80 drop-shadow-md">
                    {index + 1}
                  </span>
                </motion.div>
              );
            })}
          </AnimatePresence>
          
          {sequence.length === 0 && (
            <p className="text-muted-foreground text-sm">
              Click colors above to create your sequence
            </p>
          )}
        </div>
      </div>

      <div className="text-center">
        <p className={cn(
          'text-sm mb-4',
          sequence.length >= minLength ? 'text-success' : 'text-muted-foreground'
        )}>
          {isVerifying 
            ? `Enter your ${requiredLength || existingSequence?.length || minLength}-color sequence`
            : `Sequence: ${sequence.length}/${maxLength} ${sequence.length < minLength ? `(min ${minLength})` : '✓'}`
          }
        </p>

        <div className="flex justify-center gap-3">
          {sequence.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={removeLastColor}
              className="border-border"
            >
              <X className="w-4 h-4 mr-1" />
              Undo
            </Button>
          )}
          
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
            disabled={sequence.length < minLength}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Check className="w-4 h-4 mr-2" />
            {isVerifying ? 'Submit Sequence' : 'Confirm Sequence'}
          </Button>
        </div>
      </div>
    </div>
  );
};
