export interface OtpEmailJobData {
  email: string;
  username: string;
  otp: string;
  expiryMinutes: number;
}

export interface FeedInvalidationJobData {
  userId?: string;
  type: "single" | "all";
}

export interface AnalyticsJobData {
  blogId: string;
  category: string;
  action: "view" | "like" | "comment";
  userId?: string;
}

export interface CleanupJobData {
  type: "expired_otps";
}

export interface NotificationJobData {
  type: "LIKE" | "COMMENT" | "FOLLOW" | "NEW_MESSAGE";
  senderId: string;
  receiverId: string;
  entityId?: string;
}
