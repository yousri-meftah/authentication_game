const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

const dataDir = path.join(__dirname, 'data');
fs.mkdirSync(dataDir, { recursive: true });

const dbPath = path.join(dataDir, 'auth.db');
const db = new Database(dbPath);

db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    username_lower TEXT NOT NULL UNIQUE,
    selected_challenges TEXT NOT NULL,
    challenge_configs TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

const EMOJI_POOL = [
  '🔥', '⭐', '💎', '🎯', '🚀',
  '🦁', '🐺', '🦅', '🐉', '🦄',
  '🌙', '☀️', '⚡', '🌊', '🍀',
  '🎮', '🎸', '🎨', '📚', '🔮',
  '🏆', '👑', '💫', '🌈', '🎪',
  '🎭', '🎪', '🎯', '🎨', '🎲'
];

const shuffle = (arr) => arr
  .map(item => [Math.random(), item])
  .sort((a, b) => a[0] - b[0])
  .map(([, value]) => value);

const normalizeConfigs = (rawConfigs = {}) => {
  const configs = JSON.parse(JSON.stringify(rawConfigs || {}));

  if (configs.pattern) {
    const pattern = configs.pattern.pattern || [];
    const inferredSize = pattern.length > 16 ? 6 : 4;
    configs.pattern = {
      gridSize: configs.pattern.gridSize || inferredSize,
      pattern,
    };
  }

  if (configs.grid) {
    configs.grid = {
      selectedCells: configs.grid.selectedCells || [],
      orderMatters: Boolean(configs.grid.orderMatters),
    };
  }

  if (configs.color) {
    configs.color = {
      colorCount: configs.color.colorCount || 5,
      sequence: configs.color.sequence || [],
    };
  }

  if (configs.emoji) {
    const selectedEmoji = configs.emoji.selectedEmoji;
    const emojiSet = Array.isArray(configs.emoji.emojiSet) ? configs.emoji.emojiSet : [];
    const uniqueSet = Array.from(new Set([...(emojiSet || []), selectedEmoji].filter(Boolean)));
    configs.emoji = {
      selectedEmoji,
      emojiSet: uniqueSet,
    };
  }

  if (configs.question) {
    const answer = (configs.question.answer || '').toString();
    configs.question = {
      question: configs.question.question || '',
      answer,
      normalizedAnswer: answer.trim().toLowerCase(),
    };
  }

  return configs;
};

const buildEmojiOptions = (selectedEmoji, storedSet = []) => {
  const base = Array.from(new Set([...(storedSet || []), selectedEmoji].filter(Boolean)));
  while (base.length < 5) {
    const candidate = EMOJI_POOL[Math.floor(Math.random() * EMOJI_POOL.length)];
    if (!base.includes(candidate)) {
      base.push(candidate);
    }
  }
  return shuffle(base).slice(0, 5);
};

const createUser = ({ username, selectedChallenges = [], challengeConfigs = {} }) => {
  const normalizedConfigs = normalizeConfigs(challengeConfigs);
  const lower = username.toLowerCase();
  const insert = db.prepare(`
    INSERT INTO users (username, username_lower, selected_challenges, challenge_configs)
    VALUES (?, ?, ?, ?)
  `);

  const info = insert.run(
    username,
    lower,
    JSON.stringify(selectedChallenges || []),
    JSON.stringify(normalizedConfigs)
  );

  return {
    id: info.lastInsertRowid,
    username,
    selectedChallenges,
    challengeConfigs: normalizedConfigs,
  };
};

const getUserByUsername = (username = '') => {
  const lower = username.toLowerCase();
  const row = db.prepare('SELECT * FROM users WHERE username_lower = ?').get(lower);
  if (!row) return null;

  const selectedChallenges = JSON.parse(row.selected_challenges || '[]');
  const challengeConfigs = JSON.parse(row.challenge_configs || '{}');

  return {
    id: row.id,
    username: row.username,
    selectedChallenges,
    challengeConfigs,
  };
};

const sanitizeConfigsForClient = (configs = {}) => {
  const sanitized = {};

  if (configs.pattern) {
    sanitized.pattern = {
      gridSize: configs.pattern.gridSize,
      requiredLength: (configs.pattern.pattern || []).length,
    };
  }

  if (configs.grid) {
    sanitized.grid = {
      orderMatters: Boolean(configs.grid.orderMatters),
      requiredCount: (configs.grid.selectedCells || []).length,
    };
  }

  if (configs.color) {
    sanitized.color = {
      colorCount: configs.color.colorCount,
      requiredLength: (configs.color.sequence || []).length,
    };
  }

  if (configs.emoji) {
    sanitized.emoji = {
      emojiSet: buildEmojiOptions(
        configs.emoji.selectedEmoji,
        configs.emoji.emojiSet
      ),
    };
  }

  if (configs.question) {
    sanitized.question = {
      question: configs.question.question || '',
    };
  }

  return sanitized;
};

const sanitizeUserForClient = (user) => {
  if (!user) return null;
  return {
    username: user.username,
    selectedChallenges: user.selectedChallenges || [],
    challengeConfigs: sanitizeConfigsForClient(user.challengeConfigs || {}),
  };
};

module.exports = {
  db,
  createUser,
  getUserByUsername,
  normalizeConfigs,
  buildEmojiOptions,
  sanitizeUserForClient,
};
