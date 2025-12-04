const express = require('express');
const cors = require('cors');
const {
  createUser,
  getUserByUsername,
  normalizeConfigs,
  sanitizeUserForClient,
} = require('./db');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.post('/api/register', (req, res) => {
  const { username, selectedChallenges = [], challengeConfigs = {} } = req.body || {};

  if (!username) {
    return res.status(400).json({ error: 'Username is required' });
  }

  const existing = getUserByUsername(username);
  if (existing) {
    return res.status(409).json({ error: 'Username already exists' });
  }

  try {
    const user = createUser({ username, selectedChallenges, challengeConfigs });
    return res.status(201).json({
      message: 'User registered',
      user,
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to create user', details: error.message });
  }
});

app.get('/api/challenges/:username', (req, res) => {
  const { username } = req.params;
  const user = getUserByUsername(username);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const sanitized = sanitizeUserForClient(user);
  return res.json(sanitized);
});

const compareArrays = (a = [], b = []) => {
  if (!Array.isArray(a) || !Array.isArray(b)) return false;
  if (a.length !== b.length) return false;
  return a.every((value, index) => value === b[index]);
};

const compareSets = (a = [], b = []) => {
  if (!Array.isArray(a) || !Array.isArray(b)) return false;
  if (a.length !== b.length) return false;
  const aSet = new Set(a);
  return b.every(item => aSet.has(item));
};

const verifyChallengeAttempt = (challenge, config = {}, attempts = {}) => {
  switch (challenge) {
    case 'pattern': {
      const attempt = attempts.pattern || [];
      const stored = config.pattern?.pattern || [];
      return compareArrays(attempt, stored);
    }
    case 'grid': {
      const stored = config.grid || {};
      const attempt = attempts.grid || {};
      const attemptCells = Array.isArray(attempt.selectedCells) ? attempt.selectedCells : Array.isArray(attempt) ? attempt : [];
      const storedCells = stored.selectedCells || [];
      if (stored.orderMatters) {
        return compareArrays(attemptCells, storedCells);
      }
      return compareSets(attemptCells, storedCells);
    }
    case 'color': {
      const storedSeq = config.color?.sequence || [];
      const attemptSeq = attempts.color || [];
      return compareArrays(attemptSeq, storedSeq);
    }
    case 'emoji': {
      const storedEmoji = config.emoji?.selectedEmoji;
      const attemptEmoji = attempts.emoji || attempts.selectedEmoji;
      return Boolean(storedEmoji && attemptEmoji && storedEmoji === attemptEmoji);
    }
    case 'question': {
      const stored = config.question || {};
      const attemptAnswer = attempts.question?.answer || attempts.question || '';
      const normalizedStored = (stored.normalizedAnswer || stored.answer || '').trim().toLowerCase();
      const normalizedAttempt = (attemptAnswer || '').toString().trim().toLowerCase();
      return normalizedStored.length > 0 && normalizedStored === normalizedAttempt;
    }
    default:
      return false;
  }
};

app.post('/api/verify', (req, res) => {
  const { username, attempts = {} } = req.body || {};
  if (!username) {
    return res.status(400).json({ error: 'Username is required' });
  }

  const user = getUserByUsername(username);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const challengeConfigs = normalizeConfigs(user.challengeConfigs);
  const results = {};

  for (const challenge of user.selectedChallenges) {
    results[challenge] = verifyChallengeAttempt(challenge, challengeConfigs, attempts);
  }

  const success = user.selectedChallenges.every(ch => results[ch]);

  return res.json({
    success,
    results,
  });
});

app.post('/api/verify/challenge', (req, res) => {
  const { username, challenge, attempt } = req.body || {};
  if (!username || !challenge) {
    return res.status(400).json({ error: 'Username and challenge are required' });
  }

  const user = getUserByUsername(username);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  if (!user.selectedChallenges.includes(challenge)) {
    return res.status(400).json({ error: 'Challenge not registered for this user' });
  }

  const challengeConfigs = normalizeConfigs(user.challengeConfigs);
  const attemptPayload = { [challenge]: attempt };
  const success = verifyChallengeAttempt(challenge, challengeConfigs, attemptPayload);

  return res.json({ success });
});

app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
});
