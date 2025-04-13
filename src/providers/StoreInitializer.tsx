import { useEffect } from 'react';
import { useStudentsStore } from '@/stores/useStudentsStore';
import { useCoursesStore } from '@/stores/useCoursesStore';
import { useAcademicSessionsStore } from '@/stores/useAcademicSessionsStore';
import { useAttendanceStore } from '@/stores/useAttendanceStore';
import { useLecturersStore } from '@/stores/useLecturersStore';

// Mock data
const mockStudents = [
  {
    id: '1',
    firstName: 'Elizabeth',
    lastName: 'Alan',
    email: 'elizabeth@gmail.com',
    registrationNumber: 'P7345H3234',
    course: 'Medicine & Surgery',
    avatar: '/placeholder.svg'
  },
  {
    id: '2',
    firstName: 'Desmond',
    lastName: 'Nyeko',
    email: 'desmond@gmail.com',
    registrationNumber: 'P7346H3234',
    course: 'Law',
    avatar: '/placeholder.svg'
  },
  {
    id: '3',
    firstName: 'Cedar',
    lastName: 'James',
    email: 'cedar@gmail.com',
    registrationNumber: 'P7346H3224',
    course: 'Engineering',
    avatar: '/placeholder.svg'
  },
  {
    id: '4',
    firstName: 'Sophie',
    lastName: 'Garcia',
    email: 'sophie@gmail.com',
    registrationNumber: 'P7347H3234',
    course: 'Computer Science',
    avatar: '/placeholder.svg'
  },
  {
    id: '5',
    firstName: 'Michael',
    lastName: 'Wong',
    email: 'michael@gmail.com',
    registrationNumber: 'P7348H3234',
    course: 'Business Administration',
    avatar: '/placeholder.svg'
  },
  {
    id: '6',
    firstName: 'Olivia',
    lastName: 'Smith',
    email: 'olivia@gmail.com',
    registrationNumber: 'P7349H3234',
    course: 'Psychology',
    avatar: '/placeholder.svg'
  },
  {
    id: '7',
    firstName: 'Ethan',
    lastName: 'Johnson',
    email: 'ethan@gmail.com',
    registrationNumber: 'P7350H3234',
    course: 'Physics',
    avatar: '/placeholder.svg'
  },
];

const mockCourses = [
  {
    id: '1',
    courseName: 'Introduction to Computer Science',
    courseCode: 'CSC101',
    description: 'Fundamentals of programming and computer science'
  },
  {
    id: '2',
    courseName: 'Data Structures and Algorithms',
    courseCode: 'CSC201',
    description: 'Study of data structures and algorithms'
  },
  {
    id: '3',
    courseName: 'Advanced Calculus',
    courseCode: 'MTH301',
    description: 'Advanced topics in calculus and mathematical analysis'
  },
  {
    id: '4',
    courseName: 'Linear Algebra',
    courseCode: 'MTH201',
    description: 'Introduction to linear algebra concepts'
  },
  {
    id: '5',
    courseName: 'Probability and Statistics',
    courseCode: 'STA201',
    description: 'Basic concepts of probability and statistics'
  }
];

const mockSessions = [
  {
    id: '1',
    sessionName: '2023/2024',
    startDate: '2023-09-01',
    endDate: '2024-07-31'
  },
  {
    id: '2',
    sessionName: '2024/2025',
    startDate: '2024-09-01',
    endDate: '2025-07-31'
  },
  {
    id: '3',
    sessionName: '2022/2023',
    startDate: '2022-09-01',
    endDate: '2023-07-31'
  }
];

const mockLecturers = [
  {
    id: '1',
    name: 'Elizabeth Alan',
    email: 'elena@gmail.com',
    faculty: 'Science',
    department: 'Chemistry',
    avatar: '/placeholder.svg'
  },
  {
    id: '2',
    name: 'Desmond Nyeko',
    email: 'desmond@gmail.com',
    faculty: 'Engineering',
    department: 'Civil Engineering',
    avatar: '/placeholder.svg'
  },
  {
    id: '3',
    name: 'Cedar James',
    email: 'cedar@gmail.com',
    faculty: 'Arts',
    department: 'Philosophy',
    avatar: '/placeholder.svg'
  },
  {
    id: '4',
    name: 'Sophie Garcia',
    email: 'sophie@example.com',
    faculty: 'Medicine',
    department: 'Surgery',
    avatar: '/placeholder.svg'
  },
  {
    id: '5',
    name: 'Michael Wong',
    email: 'michael@example.com',
    faculty: 'Science',
    department: 'Physics',
    avatar: '/placeholder.svg'
  },
  {
    id: '6',
    name: 'Olivia Smith',
    email: 'olivia@example.com',
    faculty: 'Engineering',
    department: 'Electrical Engineering',
    avatar: '/placeholder.svg'
  },
  {
    id: '7',
    name: 'Ethan Johnson',
    email: 'ethan@example.com',
    faculty: 'Arts',
    department: 'History',
    avatar: '/placeholder.svg'
  }
];

// Mock attendance data with different status types
const today = new Date().toISOString().split('T')[0];
const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

const mockAttendanceSessions = [
  {
    id: '1',
    course: 'Introduction to Computer Science (CSC101)',
    level: '100',
    sessionName: '2023/2024',
    date: today,
    isActive: true,
    students: [
      {
        id: '1',
        name: 'Elizabeth Alan',
        registrationNumber: 'P7345H3234',
        attendance: {
          [today]: { status: 'present', time: '10:30 AM' },
          [yesterday]: { status: 'absent' }
        }
      },
      {
        id: '2',
        name: 'Desmond Nyeko',
        registrationNumber: 'P7346H3234',
        attendance: {
          [today]: { status: 'absent', time: '10:35 AM' },
          [yesterday]: { status: 'present', time: '9:45 AM' }
        }
      },
      {
        id: '3',
        name: 'Cedar James',
        registrationNumber: 'P7346H3224',
        attendance: {
          [today]: { status: 'not-marked' },
          [yesterday]: { status: 'present', time: '9:50 AM' }
        }
      },
      {
        id: '4',
        name: 'Sophie Garcia',
        registrationNumber: 'P7347H3234',
        attendance: {
          [today]: { status: 'present', time: '10:15 AM' },
          [yesterday]: { status: 'present', time: '9:40 AM' }
        }
      },
      {
        id: '5',
        name: 'Michael Wong',
        registrationNumber: 'P7348H3234',
        attendance: {
          [today]: { status: 'not-marked' },
          [yesterday]: { status: 'absent' }
        }
      }
    ]
  },
  {
    id: '2',
    course: 'Data Structures and Algorithms (CSC201)',
    level: '200',
    sessionName: '2023/2024',
    date: yesterday,
    isActive: false,
    students: [
      {
        id: '1',
        name: 'Elizabeth Alan',
        registrationNumber: 'P7345H3234',
        attendance: {
          [yesterday]: { status: 'present', time: '2:30 PM' }
        }
      },
      {
        id: '2',
        name: 'Desmond Nyeko',
        registrationNumber: 'P7346H3234',
        attendance: {
          [yesterday]: { status: 'present', time: '2:25 PM' }
        }
      },
      {
        id: '3',
        name: 'Cedar James',
        registrationNumber: 'P7346H3224',
        attendance: {
          [yesterday]: { status: 'absent' }
        }
      }
    ]
  },
  {
    id: '3',
    course: 'Advanced Calculus (MTH301)',
    level: '300',
    sessionName: '2023/2024',
    date: today,
    isActive: true,
    students: [
      {
        id: '4',
        name: 'Sophie Garcia',
        registrationNumber: 'P7347H3234',
        attendance: {
          [today]: { status: 'present', time: '1:15 PM' }
        }
      },
      {
        id: '5',
        name: 'Michael Wong',
        registrationNumber: 'P7348H3234',
        attendance: {
          [today]: { status: 'absent', time: '1:20 PM' }
        }
      },
      {
        id: '6',
        name: 'Olivia Smith',
        registrationNumber: 'P7349H3234',
        attendance: {
          [today]: { status: 'not-marked' }
        }
      }
    ]
  }
];

export const StoreInitializer = () => {
  const { setStudents } = useStudentsStore();
  const { setCourses } = useCoursesStore();
  const { setSessions } = useAcademicSessionsStore();
  const { setSessions: setAttendanceSessions } = useAttendanceStore();
  const { setLecturers } = useLecturersStore();

  useEffect(() => {
    // Initialize stores with mock data
    setStudents(mockStudents);
    setCourses(mockCourses);
    setSessions(mockSessions);
    setAttendanceSessions(mockAttendanceSessions);
    setLecturers(mockLecturers);
  }, [setStudents, setCourses, setSessions, setAttendanceSessions, setLecturers]);

  return null;
};
