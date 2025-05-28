
export interface Student {
  id: string;
  name: string;
  email: string;
  studentId: string;
  branch: string;
  year: number;
  gender: string;
  admissionDate: string;
  seatType: string;
  achievements?: Achievement[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: 'academic' | 'internship' | 'competition' | 'extracurricular';
  date: string;
  studentId: string;
  studentName: string;
}

export const branches = [
  'Computer Science',
  'Information Technology',
  'Electronics',
  'Electrical',
  'Mechanical',
  'Civil',
  'Chemical'
];

export const years = [1, 2, 3, 4];

export const seatTypes = ['Regular', 'Management', 'NRI', 'Reserved'];

export const students: Student[] = [
  {
    id: '1',
    name: 'Rahul Sharma',
    email: 'rahul.sharma@example.com',
    studentId: 'CS21001',
    branch: 'Computer Science',
    year: 3,
    gender: 'Male',
    admissionDate: '2021-07-15',
    seatType: 'Regular',
  },
  {
    id: '2',
    name: 'Priya Patel',
    email: 'priya.patel@example.com',
    studentId: 'IT21002',
    branch: 'Information Technology',
    year: 3,
    gender: 'Female',
    admissionDate: '2021-07-16',
    seatType: 'Management',
  },
  {
    id: '3',
    name: 'Amit Kumar',
    email: 'amit.kumar@example.com',
    studentId: 'EC21003',
    branch: 'Electronics',
    year: 3,
    gender: 'Male',
    admissionDate: '2021-07-18',
    seatType: 'Regular',
  },
  {
    id: '4',
    name: 'Neha Singh',
    email: 'neha.singh@example.com',
    studentId: 'CS21004',
    branch: 'Computer Science',
    year: 3,
    gender: 'Female',
    admissionDate: '2021-07-20',
    seatType: 'Regular',
  },
  {
    id: '5',
    name: 'Vikram Reddy',
    email: 'vikram.reddy@example.com',
    studentId: 'ME21005',
    branch: 'Mechanical',
    year: 3,
    gender: 'Male',
    admissionDate: '2021-07-21',
    seatType: 'NRI',
  },
  {
    id: '6',
    name: 'Ananya Gupta',
    email: 'ananya.gupta@example.com',
    studentId: 'CS22006',
    branch: 'Computer Science',
    year: 2,
    gender: 'Female',
    admissionDate: '2022-07-15',
    seatType: 'Regular',
  },
  {
    id: '7',
    name: 'Rajesh Verma',
    email: 'rajesh.verma@example.com',
    studentId: 'CE22007',
    branch: 'Civil',
    year: 2,
    gender: 'Male',
    admissionDate: '2022-07-17',
    seatType: 'Reserved',
  },
  {
    id: '8',
    name: 'Pooja Malhotra',
    email: 'pooja.malhotra@example.com',
    studentId: 'IT22008',
    branch: 'Information Technology',
    year: 2,
    gender: 'Female',
    admissionDate: '2022-07-19',
    seatType: 'Management',
  },
];

export const achievements: Achievement[] = [
  {
    id: '1',
    title: 'First Prize in National Coding Competition',
    description: 'Won first place in the annual national coding competition organized by TechMinds Inc.',
    category: 'competition',
    date: '2023-11-15',
    studentId: 'CS21001',
    studentName: 'Rahul Sharma',
  },
  {
    id: '2',
    title: 'Research Paper Published in IEEE Journal',
    description: 'Published a research paper on "Novel Approaches to Machine Learning" in the IEEE Computer Science journal.',
    category: 'academic',
    date: '2023-10-20',
    studentId: 'CS21004',
    studentName: 'Neha Singh',
  },
  {
    id: '3',
    title: 'Summer Internship at Microsoft',
    description: 'Completed a 3-month summer internship at Microsoft working on cloud infrastructure.',
    category: 'internship',
    date: '2023-08-30',
    studentId: 'IT21002',
    studentName: 'Priya Patel',
  },
  {
    id: '4',
    title: 'Winner of College Hackathon',
    description: 'Led a team of 4 students to win first place in the annual college hackathon.',
    category: 'competition',
    date: '2024-02-10',
    studentId: 'CS21001',
    studentName: 'Rahul Sharma',
  },
  {
    id: '5',
    title: 'Student Council President',
    description: 'Elected as the president of the student council for the academic year 2023-24.',
    category: 'extracurricular',
    date: '2023-09-05',
    studentId: 'ME21005',
    studentName: 'Vikram Reddy',
  },
  {
    id: '6',
    title: 'Winter Internship at Google',
    description: 'Selected for the prestigious Google winter internship program in software engineering.',
    category: 'internship',
    date: '2024-01-05',
    studentId: 'CS22006',
    studentName: 'Ananya Gupta',
  },
  {
    id: '7',
    title: 'Best Paper Award at Student Conference',
    description: 'Received the best paper award for research on sustainable construction methods.',
    category: 'academic',
    date: '2023-12-12',
    studentId: 'CE22007',
    studentName: 'Rajesh Verma',
  },
  {
    id: '8',
    title: 'National Science Olympiad Bronze Medal',
    description: 'Secured third place and bronze medal in the National Science Olympiad.',
    category: 'academic',
    date: '2024-03-02',
    studentId: 'CS21004',
    studentName: 'Neha Singh',
  },
];

// Chart data
export const achievementsByCategory = [
  { name: 'Academic', value: 18 },
  { name: 'Internship', value: 12 },
  { name: 'Competition', value: 15 },
  { name: 'Extracurricular', value: 8 },
];

export const studentsByBranch = [
  { name: 'Computer Science', students: 45 },
  { name: 'Information Technology', students: 38 },
  { name: 'Electronics', students: 30 },
  { name: 'Electrical', students: 25 },
  { name: 'Mechanical', students: 20 },
  { name: 'Civil', students: 22 },
  { name: 'Chemical', students: 15 },
];

export const studentsByYear = [
  { name: '1st Year', students: 65 },
  { name: '2nd Year', students: 55 },
  { name: '3rd Year', students: 48 },
  { name: '4th Year', students: 40 },
];
