// ── Auth Types ──────────────────────────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  name: string;
  picture?: string;
  teamId?: string;
  role: 'owner' | 'member' | 'admin';
  createdAt: string;
}

export interface Team {
  id: string;
  name: string;
  description?: string;
  ownerId: string;
  members: TeamMember[];
  createdAt: string;
  updatedAt: string;
}

export interface TeamMember {
  userId: string;
  email: string;
  name: string;
  role: 'owner' | 'member' | 'admin';
  joinedAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  team?: Team;
}

export interface GoogleAuthCredential {
  id_token: string;
}
