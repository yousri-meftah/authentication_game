import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { RotateCcw, Check } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface GridCellChallengeProps {
  onComplete: (cells: number[], orderMatters: boolean) => void;
  existingCells?: number[];
  existingOrderMatters?: boolean;
  isVerifying?: boolean;
  useServerVerification?: boolean;
  requiredCount?: number;
}

export const GridCellChallenge = ({
  onComplete,
  existingCells,
  existingOrderMatters = false,
  isVerifying = false,
  useServerVerification = false,
  requiredCount,
}: GridCellChallengeProps) => {
  const [selectedCells, setSelectedCells] = useState<number[]>([]);
  const [orderMatters, setOrderMatters] = useState(existingOrderMatters);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  const gridSize = 6;
  const totalCells = gridSize * gridSize;
  const minCells = requiredCount || 4;

  const handleCellClick = (index: number) => {
    setError(false);
    setSuccess(false);

    if (selectedCells.includes(index)) {
      if (orderMatters || existingOrderMatters) {
        // In order mode, only allow removing the last cell
        if (selectedCells[selectedCells.length - 1] === index) {
          setSelectedCells(prev => prev.slice(0, -1));
        }
      } else {
        setSelectedCells(prev => prev.filter(c => c !== index));
      }
    } else {
      setSelectedCells(prev => [...prev, index]);
    }
  };

  const reset = () => {
    setSelectedCells([]);
    setError(false);
    setSuccess(false);
  };

  const handleConfirm = () => {
    if (isVerifying && existingCells && !useServerVerification) {
      let isCorrect: boolean;
      
      if (existingOrderMatters) {
        isCorrect = 
          selectedCells.length === existingCells.length &&
          selectedCells.every((cell, i) => cell === existingCells[i]);
      } else {
        isCorrect = 
          selectedCells.length === existingCells.length &&
          selectedCells.every(cell => existingCells.includes(cell));
      }

      if (isCorrect) {
        setSuccess(true);
        setTimeout(() => onComplete(selectedCells, orderMatters), 500);
      } else {
        setError(true);
        setTimeout(() => reset(), 500);
      }
    } else if (selectedCells.length >= minCells) {
      onComplete(selectedCells, orderMatters);
    }
  };

  return (
    <div className="space-y-6">
      {!isVerifying && (
        <div className="flex items-center justify-center gap-3 mb-4">
          <Switch
            id="order-mode"
            checked={orderMatters}
            onCheckedChange={setOrderMatters}
          />
          <Label htmlFor="order-mode" className="text-sm text-muted-foreground">
            Click order matters
          </Label>
        </div>
      )}

      <div className="flex justify-center">
        <div 
          className="grid gap-2 p-4 bg-input/30 rounded-lg border border-border"
          style={{ 
            gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
            width: 'fit-content'
          }}
        >
          {Array.from({ length: totalCells }).map((_, index) => {
            const isSelected = selectedCells.includes(index);
            const orderIndex = selectedCells.indexOf(index);

            return (
              <motion.button
                key={index}
                onClick={() => handleCellClick(index)}
                className={cn(
                  'w-10 h-10 rounded-md border-2 transition-all duration-200 relative',
                  'bg-input border-border hover:border-primary/50 hover:bg-primary/10',
                  isSelected && !error && !success && 'bg-primary/30 border-primary glow-primary',
                  error && isSelected && 'bg-destructive/30 border-destructive glow-error',
                  success && isSelected && 'bg-success/30 border-success glow-success'
                )}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <AnimatePresence>
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className={cn(
                        'absolute inset-1 rounded flex items-center justify-center',
                        error ? 'bg-destructive' : success ? 'bg-success' : 'bg-primary'
                      )}
                    >
                      {(orderMatters || existingOrderMatters) && (
                        <span className="text-xs font-bold text-primary-foreground">
                          {orderIndex + 1}
                        </span>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            );
          })}
        </div>
      </div>

      <div className="text-center">
        <p className={cn(
          'text-sm mb-4',
          selectedCells.length >= minCells ? 'text-success' : 'text-muted-foreground'
        )}>
          {isVerifying 
            ? `Select ${minCells} cells${existingOrderMatters ? ' in order' : ''}`
            : `Selected: ${selectedCells.length} cells ${selectedCells.length < minCells ? `(min ${minCells})` : '✓'}`
          }
        </p>

        <div className="flex justify-center gap-3">
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
            disabled={selectedCells.length < minCells}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Check className="w-4 h-4 mr-2" />
            {isVerifying ? 'Submit Selection' : 'Confirm Selection'}
          </Button>
        </div>
      </div>
    </div>
  );
};
