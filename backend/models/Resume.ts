export interface Resume {
    id?: number;
    candidate_name: string;
    candidate_email: string;
    skills: string[];
    experience: number;
    file_url: string;
    ai_score?: number;
    job_id: number;
    created_at?: Date;
  }
