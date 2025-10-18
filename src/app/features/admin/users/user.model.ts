export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  profileImage: string;
  profileImageUrl: string;
  role: 'user' | 'admin';
  active: boolean;
  createdAt: string;
  updatedAt: string;
}
