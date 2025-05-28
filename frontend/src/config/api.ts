// API Configuration
export const API_CONFIG = {
  BASE_URL: 'http://localhost:8000', // Change this to your backend domain
  ENDPOINTS: {
    STUDENTS: '/student/',
    STUDENT_BY_USN: '/student/',
    UPLOAD_EXCEL: '/student/upload-excel',
    UPDATE_STUDENT: '/student/update',
    ACHIEVEMENTS: '/achievement/',
    ACHIEVEMENT_BY_USN: '/achievement/',
    ACHIEVEMENT_BY_ID: '/achievement/',
    UPLOAD_ACHIEVEMENT_EXCEL: '/achievement/upload-excel',
    UPDATE_ACHIEVEMENT: '/achievement/',
    DELETE_ACHIEVEMENT: '/achievement/',
    LOGIN: '/login',
    ME: '/me',
    UPLOAD_RESULT: '/reports/upload-result',
    CUSTOM_REPORT: '/reports/custom-report',
  }
};

// API Response Types based on your FastAPI schema
export interface StudentRead {
  usn: string;
  name: string;
  branch: string;
  batch: number;
}

export interface StudentFullRead {
  usn: string;
  name: string;
  gender: string;
  doa?: string | null;
  seat_type: string;
  ranking?: string | null;
  batch: number;
  branch: string;
  state: string;
}

export interface StudentInDB {
  id?: string | null;
  usn: string;
  name: string;
  gender?: string | null;
  doa?: string | null;
  dob?: string | null;
  semester?: string | null;
  seat_type?: string | null;
  ranking?: string | null;
  allotted_category?: string | null;
  rural_urban?: string | null;
  state?: string | null;
  non_ka_state?: string | null;
  state_code?: string | null;
  batch?: number | null;
  branch?: string | null;
  created_at?: string | null;
}

export interface StudentList {
  data: StudentRead[];
  count: number;
}

export interface StudentResponseMessage {
  msg: string;
}

export interface StudentUpdate {
  usn?: string | null;
  name?: string | null;
  gender?: string | null;
  doa?: string | null;
  seat_type?: string | null;
  ranking?: string | null;
  batch?: number | null;
  branch?: string | null;
  state?: string | null;
}

// Achievement API Types
export interface AchievementRead {
  id: string;
  usn: string;
  title: string;
  description?: string | null;
  achievement_type?: string | null;
  achievement_date?: string | null;
  certificated_url?: string | null;
}

export interface AchievementInDB {
  id?: string;
  usn: string;
  title: string;
  description?: string | null;
  achievement_type?: string | null;
  achievement_date?: string | null;
  certificated_url?: string | null;
}

export interface AchievementList {
  data: AchievementRead[];
  count: number;
}

export interface AchievementUpdate {
  usn?: string;
  title?: string | null;
  description?: string | null;
  achievement_type?: string | null;
  achievement_date?: string | null;
  certificated_url?: string | null;
}

export interface AchievementResponseMessage {
  msg: string;
}

// Add new authentication types
export interface UserLogin {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export interface UserRead {
  id: string;
  username: string;
}

// Add new reports types
export interface CustomReportResponse {
  data: Blob;
}
