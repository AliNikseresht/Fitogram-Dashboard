export interface Profile {
  full_name: string;
}

export interface CoachRequest {
  id: string;
  created_at: string;
  user_id: string;
  profiles: Profile | null;
}

export interface RawCoachRequest {
  id: string;
  created_at: string;
  user_id: string;
  profiles: Profile | Profile[] | null;
}
