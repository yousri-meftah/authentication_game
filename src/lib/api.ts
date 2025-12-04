import type { RegistrationData, UserChallenges, ChallengeType } from '@/types/auth';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data?.error || data?.message || 'Request failed');
  }

  return data as T;
}

export type VerifyAttempts = {
  pattern?: number[];
  grid?: { selectedCells: number[]; orderMatters?: boolean } | number[];
  color?: string[];
  emoji?: string;
  question?: { answer: string } | string;
};

export type UserChallengeResponse = {
  username: string;
  selectedChallenges: ChallengeType[];
  challengeConfigs: UserChallenges;
};

export const api = {
  async checkUserExists(username: string): Promise<boolean> {
    if (!username) return false;
    try {
      await request(`/challenges/${encodeURIComponent(username)}`);
      return true;
    } catch (error) {
      return false;
    }
  },

  registerUser(payload: RegistrationData) {
    return request<{ user: UserChallengeResponse }>('/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  fetchChallenges(username: string) {
    return request<UserChallengeResponse>(`/challenges/${encodeURIComponent(username)}`);
  },

  verify(username: string, attempts: VerifyAttempts) {
    return request<{ success: boolean; results: Record<string, boolean> }>('/verify', {
      method: 'POST',
      body: JSON.stringify({ username, attempts }),
    });
  },

  verifyChallenge(username: string, challenge: string, attempt: any) {
    return request<{ success: boolean }>('/verify/challenge', {
      method: 'POST',
      body: JSON.stringify({ username, challenge, attempt }),
    });
  },
};
