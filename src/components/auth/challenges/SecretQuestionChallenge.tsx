import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Check, HelpCircle, RotateCcw } from 'lucide-react';
import { Label } from '@/components/ui/label';

interface SecretQuestionChallengeProps {
  onComplete: (question: string, answer: string) => void;
  existingQuestion?: string;
  existingAnswer?: string;
  isVerifying?: boolean;
  useServerVerification?: boolean;
}

export const SecretQuestionChallenge = ({
  onComplete,
  existingQuestion,
  existingAnswer,
  isVerifying = false,
  useServerVerification = false,
}: SecretQuestionChallengeProps) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleConfirm = () => {
    if (isVerifying && existingAnswer && !useServerVerification) {
      const normalizedInput = answer.trim().toLowerCase();
      const normalizedStored = existingAnswer.trim().toLowerCase();
      
      if (normalizedInput === normalizedStored) {
        setSuccess(true);
        setTimeout(() => onComplete(existingQuestion || '', answer), 500);
      } else {
        setError(true);
        setTimeout(() => {
          setAnswer('');
          setError(false);
        }, 500);
      }
    } else if (useServerVerification && isVerifying) {
      onComplete(existingQuestion || '', answer.trim());
    } else if (question.trim().length >= 5 && answer.trim().length >= 2) {
      onComplete(question.trim(), answer.trim());
    }
  };

  const reset = () => {
    setQuestion('');
    setAnswer('');
    setError(false);
    setSuccess(false);
  };

  const isValid = isVerifying 
    ? answer.trim().length >= 1
    : question.trim().length >= 5 && answer.trim().length >= 2;

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-14 h-14 mx-auto mb-4 rounded-full bg-secondary/20 border border-secondary/30 flex items-center justify-center"
        >
          <HelpCircle className="w-7 h-7 text-secondary" />
        </motion.div>
        <p className="text-muted-foreground text-sm">
          {isVerifying 
            ? 'Answer your security question'
            : 'Create a personal question only you can answer'}
        </p>
      </div>

      <div className="space-y-4">
        {isVerifying ? (
          <div className={cn(
            'p-4 rounded-lg bg-input/50 border',
            error ? 'border-destructive' : success ? 'border-success' : 'border-border'
          )}>
            <Label className="text-sm text-muted-foreground mb-2 block">
              Your Question
            </Label>
            <p className="text-foreground font-medium text-lg">
              {existingQuestion}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <Label htmlFor="question" className="text-sm text-muted-foreground">
              Your Secret Question
            </Label>
            <Textarea
              id="question"
              placeholder="e.g., What was the name of my first pet?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="bg-input border-border text-foreground placeholder:text-muted-foreground resize-none"
              rows={2}
            />
            <p className="text-xs text-muted-foreground">
              Minimum 5 characters
            </p>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="answer" className="text-sm text-muted-foreground">
          {isVerifying ? 'Your Answer' : 'Secret Answer'}
        </Label>
        <Input
          id="answer"
          type="text"
          placeholder="Your answer..."
          value={answer}
          onChange={(e) => {
            setAnswer(e.target.value);
            setError(false);
          }}
          className={cn(
            'bg-input border-border text-foreground placeholder:text-muted-foreground h-12',
            error && 'border-destructive glow-error',
            success && 'border-success glow-success'
          )}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && isValid) {
              handleConfirm();
            }
          }}
        />
        {!isVerifying && (
          <p className="text-xs text-muted-foreground">
            Answer is case-insensitive • Minimum 2 characters
          </p>
        )}
        {isVerifying && (
          <p className="text-xs text-muted-foreground">
            Enter the answer you set before
          </p>
        )}
      </div>
      </div>

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-destructive text-sm text-center"
        >
          Incorrect answer. Please try again.
        </motion.p>
      )}

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
          disabled={!isValid}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Check className="w-4 h-4 mr-2" />
          {isVerifying ? 'Verify Answer' : 'Confirm Q&A'}
        </Button>
      </div>
    </div>
  );
};
