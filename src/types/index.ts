export interface Branch {
  id: string;
  name: string;
  location: string;
  created_at: string;
}

export interface Profile {
  id: string;
  full_name: string;
  branch_id: string;
  role: 'staff' | 'admin';
  created_at?: string;
}

export interface CheckingForm {
  id: string;
  user_id: string;
  branch_id: string;
  title: string;
  image_url: string | null;
  note: string;
  created_at: string;
}

export interface Expense {
  id: string;
  user_id: string;
  branch_id: string;
  title: string;
  amount: number;
  image_url: string | null;
  description: string;
  created_at: string;
}

export interface Database {
  public: {
    Tables: {
      branches: {
        Row: Branch;
        Insert: Omit<Branch, 'id' | 'created_at'>;
        Update: Partial<Omit<Branch, 'id' | 'created_at'>>;
      };
      profiles: {
        Row: Profile;
        Insert: Profile;
        Update: Partial<Profile>;
      };
      checking_forms: {
        Row: CheckingForm;
        Insert: Omit<CheckingForm, 'id' | 'created_at'>;
        Update: Partial<Omit<CheckingForm, 'id' | 'created_at'>>;
      };
      expenses: {
        Row: Expense;
        Insert: Omit<Expense, 'id' | 'created_at'>;
        Update: Partial<Omit<Expense, 'id' | 'created_at'>>;
      };
    };
  };
}
