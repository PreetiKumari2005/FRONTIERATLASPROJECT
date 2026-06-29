import { fetchApi } from './api';

export interface ModelData {
  platform: string;
  source: string;
  time: string;
  title: string;
  likes: string;
  comments: string;
}

export interface ModelsResponse {
  status?: string;
  data: {
    models: ModelData[];
  };
}

export async function getModels(): Promise<ModelData[]> {
  try {
    const response = await fetchApi<Record<string, unknown>>('/api/v1/models');
    
    if (Array.isArray(response)) {
      return response as ModelData[];
    }
    if (response && 'data' in response) {
      const data = response.data;
      if (Array.isArray(data)) {
        return data as ModelData[];
      }
      if (data && typeof data === 'object' && 'models' in data) {
        const models = (data as Record<string, unknown>).models;
        if (Array.isArray(models)) {
          return models as ModelData[];
        }
      }
    }
    
    console.warn('Unexpected API response format for models:', response);
    return [];
  } catch (error) {
    console.error('Failed to fetch models:', error);
    throw error;
  }
}
