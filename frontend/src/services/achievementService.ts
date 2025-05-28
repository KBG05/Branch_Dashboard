
import { API_CONFIG, AchievementRead, AchievementList, AchievementInDB, AchievementUpdate, AchievementResponseMessage } from '@/config/api';
import { authService } from './authService';

class AchievementService {
  private baseURL = API_CONFIG.BASE_URL;

  private getHeaders() {
    return {
      'Content-Type': 'application/json',
      ...authService.getAuthHeaders(),
    };
  }

  async getAllAchievements(): Promise<AchievementList> {
    const response = await fetch(`${this.baseURL}${API_CONFIG.ENDPOINTS.ACHIEVEMENTS}`, {
      headers: authService.getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error('Failed to fetch achievements');
    }
    return response.json();
  }

  async getAchievementsByUSN(usn: string): Promise<AchievementList> {
    const response = await fetch(`${this.baseURL}${API_CONFIG.ENDPOINTS.ACHIEVEMENT_BY_USN}${usn}`, {
      headers: authService.getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch achievements for USN: ${usn}`);
    }
    return response.json();
  }

  async addAchievement(achievement: AchievementInDB): Promise<AchievementResponseMessage> {
    const response = await fetch(`${this.baseURL}${API_CONFIG.ENDPOINTS.ACHIEVEMENTS}`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(achievement),
    });
    if (!response.ok) {
      throw new Error('Failed to add achievement');
    }
    return response.json();
  }

  async updateAchievement(achievement: AchievementUpdate): Promise<AchievementResponseMessage> {
    const response = await fetch(`${this.baseURL}${API_CONFIG.ENDPOINTS.UPDATE_ACHIEVEMENT}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(achievement),
    });
    if (!response.ok) {
      throw new Error('Failed to update achievement');
    }
    return response.json();
  }

  async deleteAchievement(id: string): Promise<AchievementResponseMessage> {
    const response = await fetch(`${this.baseURL}${API_CONFIG.ENDPOINTS.DELETE_ACHIEVEMENT}${id}`, {
      method: 'DELETE',
      headers: authService.getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error('Failed to delete achievement');
    }
    return response.json();
  }

  async uploadExcel(file: File): Promise<AchievementResponseMessage> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${this.baseURL}${API_CONFIG.ENDPOINTS.UPLOAD_ACHIEVEMENT_EXCEL}`, {
      method: 'POST',
      headers: authService.getAuthHeaders(),
      body: formData,
    });
    if (!response.ok) {
      throw new Error('Failed to upload Excel file');
    }
    return response.json();
  }

  async exportAchievements(): Promise<Blob> {
    const achievementsData = await this.getAllAchievements();
    const csvContent = this.convertToCSV(achievementsData.data);
    return new Blob([csvContent], { type: 'text/csv' });
  }

  private convertToCSV(data: any[]): string {
    if (!data.length) return '';
    
    const headers = Object.keys(data[0]);
    const csvRows = [
      headers.join(','),
      ...data.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
    ];
    
    return csvRows.join('\n');
  }
}

export const achievementService = new AchievementService();
