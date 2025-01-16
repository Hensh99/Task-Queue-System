export interface Task {
  id: string;
  type: string;
  payload: Object;
  visibility_time?: string;
  retryCount: number;
  error?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt?: string;
}
