import { fetchApi } from './api';

export interface TaskItem {
  id: string;
  label: string;
  icon: string;
}

export interface TasksResponse {
  status: string;
  data: {
    tasks: TaskItem[];
  };
}

export async function getTasks(): Promise<TaskItem[]> {
  try {
    const response = await fetchApi<Record<string, unknown>>('/api/v1/tasks');
    if (Array.isArray(response)) {
      return response as TaskItem[];
    }
    if (response && 'data' in response) {
      const data = response.data;
      if (Array.isArray(data)) {
        return data as TaskItem[];
      }
      if (data && typeof data === 'object' && 'tasks' in data) {
        const tasks = (data as Record<string, unknown>).tasks;
        if (Array.isArray(tasks)) {
          return tasks as TaskItem[];
        }
      }
    }
    console.warn('Unexpected API response format for tasks:', response);
    return [];
  } catch (error) {
    console.error('Failed to fetch tasks:', error);
    throw error;
  }
}
