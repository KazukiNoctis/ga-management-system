export interface Profile {
  id: string;
  full_name: string;
  role: 'staff' | 'admin';
  created_at?: string;
}

export interface CheckingForm {
  id: string;
  user_id: string;
  title: string;
  image_url: string | null;
  note: string;
  created_at: string;
}

export interface Expense {
  id: string;
  user_id: string;
  title: string;
  amount: number;
  image_url: string | null;
  description: string;
  created_at: string;
}

export interface Task {
  id: string;
  title: string;
  description: string | null;
  priority: 'Low' | 'Medium' | 'Critical';
  status: 'Pending' | 'Finished' | 'Aborted';
  image_url: string | null;
  submitter_name: string;
  submitter_division: string;
  user_id: string | null;
  resolution_note: string | null;
  created_at: string;
}

export interface Database {
  public: {
    Tables: {
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
      tasks: {
        Row: Task;
        Insert: Omit<Task, 'id' | 'created_at'>;
        Update: Partial<Omit<Task, 'id' | 'created_at'>>;
      };
    };
  };
}
