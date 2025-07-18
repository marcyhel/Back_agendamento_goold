export interface LogInterface {
  id?: string;
  userId: string;
  module: "account" | "reservation";
  activity: string;
  details?: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt?: Date;
}

export interface CreateLog {
  userId: string;
  module: "account" | "reservation";
  activity: string;
  details?: string;
  ipAddress?: string;
  userAgent?: string;
}
