export interface UserModel {
  _id?: string;
  sub: string;
  prof_picture?: string;
  info?: string;
  username?: string;
  isProfileComplete?: boolean;
  email: string;
  prof_created?: Date | string;
  last_login?: Date | string;
  preferred_mode?: 'light' | 'dark';
}
