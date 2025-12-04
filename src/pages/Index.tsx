import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, Palette, Grid3X3, Smile, HelpCircle, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

const features = [
  { icon: Lock, title: 'Pattern Lock', description: 'Draw secret patterns on a grid' },
  { icon: Grid3X3, title: 'Grid Selection', description: 'Select secret cell combinations' },
  { icon: Palette, title: 'Color Sequence', description: 'Create color-based passwords' },
  { icon: Smile, title: 'Emoji Identity', description: 'Pick your personal symbol' },
  { icon: HelpCircle, title: 'Secret Question', description: 'Classic Q&A verification' },
];

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 grid-pattern opacity-20" />
      <div className="absolute inset-0 scanline pointer-events-none" />
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="min-h-screen flex flex-col items-center justify-center px-4 py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-8"
            >
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm text-foreground">Reimagining Authentication</span>
            </motion.div>

            {/* Main heading */}
            <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6">
              <span className="text-glow-primary">Security</span> as a{' '}
              <span className="text-secondary text-glow-secondary">Game</span>
            </h1>

            <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
              Experience authentication reimagined. Instead of typing passwords, 
              prove your identity through interactive security challenges designed 
              like games.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => navigate('/register')}
                className="bg-primary text-primary-foreground hover:bg-primary/90 glow-primary h-14 px-8 text-lg"
              >
                Create Account
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate('/login')}
                className="border-border hover:bg-muted h-14 px-8 text-lg"
              >
                <Shield className="w-5 h-5 mr-2" />
                Login
              </Button>
            </div>
          </motion.div>

          {/* Floating icon */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-16"
          >
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="w-20 h-20 rounded-2xl bg-card border border-border flex items-center justify-center glow-primary"
            >
              <Shield className="w-10 h-10 text-primary" />
            </motion.div>
          </motion.div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Five Ways to Prove You're <span className="text-primary">You</span>
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Choose at least two challenges to create your unique multi-factor authentication experience.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="p-6 rounded-xl bg-card/50 backdrop-blur border border-border hover:border-primary/50 transition-all duration-300 group"
                >
                  <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center mb-4 group-hover:glow-primary transition-all duration-300">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-20 px-4 border-t border-border">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                How It Works
              </h2>
            </motion.div>

            <div className="space-y-8">
              {[
                { step: '01', title: 'Choose Your Username', desc: 'Pick a unique identity label that will be your public identifier.' },
                { step: '02', title: 'Select Challenges', desc: 'Choose at least 2 security games from our catalog of 5 options.' },
                { step: '03', title: 'Configure Each Game', desc: 'Set up your secret patterns, cells, colors, emoji, and questions.' },
                { step: '04', title: 'Login by Playing', desc: 'When you return, solve your personal challenges to prove your identity.' },
              ].map((item, index) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="flex items-start gap-6"
                >
                  <div className="flex-shrink-0 w-16 h-16 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
                    <span className="text-xl font-bold text-primary">{item.step}</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-1">{item.title}</h3>
                    <p className="text-muted-foreground">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer CTA */}
        <section className="py-20 px-4 border-t border-border">
          <div className="max-w-2xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Ready to Play?
              </h2>
              <p className="text-muted-foreground mb-8">
                Create your account and experience the future of authentication.
              </p>
              <Button
                size="lg"
                onClick={() => navigate('/register')}
                className="bg-primary text-primary-foreground hover:bg-primary/90 glow-primary h-14 px-10 text-lg"
              >
                Get Started
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 px-4 border-t border-border">
          <div className="max-w-6xl mx-auto text-center">
            <p className="text-muted-foreground text-sm">
              Interactive Authentication System • Secure • Memorable • Fun
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;
