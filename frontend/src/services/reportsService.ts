
import { API_CONFIG, AchievementResponseMessage } from '@/config/api';
import { authService } from './authService';

class ReportsService {
  private baseURL = API_CONFIG.BASE_URL;

  async uploadResult(file: File): Promise<AchievementResponseMessage> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${this.baseURL}${API_CONFIG.ENDPOINTS.UPLOAD_RESULT}`, {
      method: 'POST',
      headers: authService.getAuthHeaders(),
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error('Failed to upload result file');
    }
    
    return response.json();
  }

  async generateCustomReport(reportName: string): Promise<Blob> {
    const response = await fetch(`${this.baseURL}${API_CONFIG.ENDPOINTS.CUSTOM_REPORT}/${reportName}`, {
      headers: authService.getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to generate custom report');
    }
    
    return response.blob();
  }

  downloadBlob(blob: Blob, filename: string) {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }
}

export const reportsService = new ReportsService();
