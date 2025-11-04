interface AchievementPayload {
  title: string;
  description: string;
  link?: string;
}

export type CreateAchievementRequest = AchievementPayload;