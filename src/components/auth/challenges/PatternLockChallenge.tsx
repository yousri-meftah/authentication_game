import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { RotateCcw, Check } from 'lucide-react';

interface PatternLockChallengeProps {
  gridSize?: 4 | 6;
  onComplete: (pattern: number[]) => void;
  existingPattern?: number[];
  isVerifying?: boolean;
  useServerVerification?: boolean;
  requiredLength?: number;
}

export const PatternLockChallenge = ({
  gridSize = 4,
  onComplete,
  existingPattern,
  isVerifying = false,
  useServerVerification = false,
  requiredLength = 4,
}: PatternLockChallengeProps) => {
  const [pattern, setPattern] = useState<number[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [selectedSize, setSelectedSize] = useState<4 | 6>(gridSize);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  const totalCells = selectedSize * selectedSize;

  const handleCellEnter = useCallback((index: number) => {
    if (!isDrawing) return;
    if (pattern.includes(index)) return;
    
    setPattern(prev => [...prev, index]);
    setError(false);
  }, [isDrawing, pattern]);

  const handleMouseDown = (index: number) => {
    setIsDrawing(true);
    setPattern([index]);
    setError(false);
    setSuccess(false);
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
    
    if (isVerifying && existingPattern && !useServerVerification) {
      const isCorrect = 
        pattern.length === existingPattern.length &&
        pattern.every((cell, i) => cell === existingPattern[i]);
      
      if (isCorrect) {
        setSuccess(true);
        setTimeout(() => onComplete(pattern), 500);
      } else {
        setError(true);
        setTimeout(() => setPattern([]), 500);
      }
    }
  };

  const reset = () => {
    setPattern([]);
    setError(false);
    setSuccess(false);
  };

  const handleConfirm = () => {
    const min = requiredLength || 4;
    if (pattern.length >= min) {
      onComplete(pattern);
    }
  };

  const getCellPosition = (index: number) => {
    const row = Math.floor(index / selectedSize);
    const col = index % selectedSize;
    return { row, col };
  };

  return (
    <div className="space-y-6">
      {!isVerifying && (
        <div className="flex justify-center gap-2 mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => { setSelectedSize(4); reset(); }}
            className={cn(
              'border-border',
              selectedSize === 4 && 'border-primary bg-primary/10'
            )}
          >
            4×4 Grid
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => { setSelectedSize(6); reset(); }}
            className={cn(
              'border-border',
              selectedSize === 6 && 'border-primary bg-primary/10'
            )}
          >
            6×6 Grid
          </Button>
        </div>
      )}

      <div 
        className="relative mx-auto"
        style={{ 
          width: selectedSize === 4 ? 240 : 300,
          height: selectedSize === 4 ? 240 : 300,
        }}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchEnd={handleMouseUp}
      >
        {/* SVG for drawing lines */}
        <svg className="absolute inset-0 pointer-events-none z-10" style={{ width: '100%', height: '100%' }}>
          {pattern.map((cellIndex, i) => {
            if (i === 0) return null;
            const prev = pattern[i - 1];
            const prevPos = getCellPosition(prev);
            const currPos = getCellPosition(cellIndex);
            
            const cellSize = selectedSize === 4 ? 60 : 50;
            const x1 = prevPos.col * cellSize + cellSize / 2;
            const y1 = prevPos.row * cellSize + cellSize / 2;
            const x2 = currPos.col * cellSize + cellSize / 2;
            const y2 = currPos.row * cellSize + cellSize / 2;

            return (
              <motion.line
                key={`${prev}-${cellIndex}`}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                className={cn(
                  'stroke-[4]',
                  error ? 'stroke-destructive' : success ? 'stroke-success' : 'stroke-secondary'
                )}
                strokeLinecap="round"
                style={{ filter: error ? 'drop-shadow(0 0 8px hsl(var(--destructive)))' : success ? 'drop-shadow(0 0 8px hsl(var(--success)))' : 'drop-shadow(0 0 8px hsl(var(--secondary)))' }}
              />
            );
          })}
        </svg>

        {/* Grid cells */}
        <div 
          className="grid gap-1"
          style={{ 
            gridTemplateColumns: `repeat(${selectedSize}, 1fr)`,
          }}
        >
          {Array.from({ length: totalCells }).map((_, index) => {
            const isActive = pattern.includes(index);
            const patternIndex = pattern.indexOf(index);
            
            return (
              <motion.button
                key={index}
                onMouseDown={() => handleMouseDown(index)}
                onMouseEnter={() => handleCellEnter(index)}
                onTouchStart={() => handleMouseDown(index)}
                onTouchMove={(e) => {
                  const touch = e.touches[0];
                  const element = document.elementFromPoint(touch.clientX, touch.clientY);
                  const cellIndex = element?.getAttribute('data-index');
                  if (cellIndex) handleCellEnter(parseInt(cellIndex));
                }}
                data-index={index}
                className={cn(
                  'aspect-square rounded-full border-2 transition-all duration-200 flex items-center justify-center',
                  'bg-input border-border hover:border-primary/50',
                  isActive && !error && !success && 'bg-secondary/30 border-secondary glow-secondary',
                  error && isActive && 'bg-destructive/30 border-destructive glow-error',
                  success && isActive && 'bg-success/30 border-success glow-success'
                )}
                whileTap={{ scale: 0.9 }}
              >
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className={cn(
                        'w-3 h-3 rounded-full',
                        error ? 'bg-destructive' : success ? 'bg-success' : 'bg-secondary'
                      )}
                    />
                  )}
                </AnimatePresence>
                {isActive && patternIndex >= 0 && (
                  <span className="absolute text-[10px] font-bold text-foreground/50">
                    {patternIndex + 1}
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      <div className="text-center">
        <p className={cn(
          'text-sm mb-4',
          pattern.length >= requiredLength ? 'text-success' : 'text-muted-foreground'
        )}>
          {isVerifying 
            ? `Draw your pattern${requiredLength ? ` (min ${requiredLength})` : ''}`
            : `Pattern length: ${pattern.length} ${pattern.length < (requiredLength || 4) ? `(min ${requiredLength || 4})` : '✓'}`
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
          
          {(!isVerifying || useServerVerification) && (
            <Button
              onClick={handleConfirm}
              disabled={pattern.length < (requiredLength || 4)}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Check className="w-4 h-4 mr-2" />
              {isVerifying ? 'Submit Pattern' : 'Confirm Pattern'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
