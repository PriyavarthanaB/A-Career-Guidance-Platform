export interface User {
  name: string;
  email: string;
  password: string;
  experience: 'junior' | 'mid' | 'senior';
  role: string;
}

export interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: Omit<User, 'password'> & { password: string; confirmPassword: string }) => Promise<void>;
  logout: () => void;
}
