
import { API_CONFIG, StudentList, StudentFullRead, StudentInDB, StudentResponseMessage, StudentUpdate } from '@/config/api';
import { authService } from './authService';

class StudentService {
  private baseUrl = API_CONFIG.BASE_URL;

  private getHeaders() {
    return {
      'Content-Type': 'application/json',
      ...authService.getAuthHeaders(),
    };
  }

  async getAllStudents(): Promise<StudentList> {
    try {
      const response = await fetch(`${this.baseUrl}${API_CONFIG.ENDPOINTS.STUDENTS}`, {
        headers: authService.getAuthHeaders(),
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch students: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching students:', error);
      throw error;
    }
  }

  async getStudentByUSN(usn: string): Promise<StudentFullRead> {
    try {
      const response = await fetch(`${this.baseUrl}${API_CONFIG.ENDPOINTS.STUDENT_BY_USN}${usn}`, {
        headers: authService.getAuthHeaders(),
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch student: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching student:', error);
      throw error;
    }
  }

  async addStudent(student: StudentInDB): Promise<StudentResponseMessage> {
    try {
      const response = await fetch(`${this.baseUrl}${API_CONFIG.ENDPOINTS.STUDENTS}`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ student }),
      });
      if (!response.ok) {
        throw new Error(`Failed to add student: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error adding student:', error);
      throw error;
    }
  }

  async updateStudent(studentData: StudentUpdate): Promise<StudentResponseMessage> {
    try {
      const formData = new URLSearchParams();
      Object.entries(studentData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formData.append(key, value.toString());
        }
      });

      const response = await fetch(`${this.baseUrl}${API_CONFIG.ENDPOINTS.UPDATE_STUDENT}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          ...authService.getAuthHeaders(),
        },
        body: formData,
      });
      if (!response.ok) {
        throw new Error(`Failed to update student: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error updating student:', error);
      throw error;
    }
  }

  async uploadExcel(file: File): Promise<StudentResponseMessage> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${this.baseUrl}${API_CONFIG.ENDPOINTS.UPLOAD_EXCEL}`, {
        method: 'POST',
        headers: authService.getAuthHeaders(),
        body: formData,
      });
      if (!response.ok) {
        throw new Error(`Failed to upload file: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }

  async exportStudents(): Promise<Blob> {
    const studentsData = await this.getAllStudents();
    const csvContent = this.convertToCSV(studentsData.data);
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

export const studentService = new StudentService();
