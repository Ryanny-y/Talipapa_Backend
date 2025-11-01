export interface AdminLoginBody {
  username: string;
  password: string;
}

export interface CreateAdminBody {
  username: string;
  email: string;
  contactNumber: string; 
  roles: string[];
  password: string;
}