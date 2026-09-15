export type Client = {
  id: string;
  user_id: string;
  name: string;
  country: string | null;
  country_code: string | null;
  created_at: string;
};

export type BillingType = "one_off" | "recurring";

export type Project = {
  id: string;
  user_id: string;
  client_id: string;
  name: string;
  billing_type: BillingType;
  amount: number;
  monthly_amount: number | null;
  recurring_start: string | null;
  recurring_end: string | null;
  deadline: string | null;
  archived_at: string | null;
  created_at: string;
};

export type Phase = {
  id: string;
  user_id: string;
  project_id: string;
  name: string;
  order_index: number;
  deadline: string | null;
  completed_at: string | null;
  created_at: string;
};

export type ProjectWithProgress = Project & {
  client_name: string;
  country: string | null;
  country_code: string | null;
  total_phases: number;
  done_phases: number;
  progress_pct: number;
};

export type ClientWithProjects = Client & {
  projects: Project[];
  total_amount: number;
};
