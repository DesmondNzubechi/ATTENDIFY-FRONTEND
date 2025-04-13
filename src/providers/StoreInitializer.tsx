
import { useEffect } from "react";
import { useUserStore } from "@/stores/useUserStore";
import { useCoursesStore } from "@/stores/useCoursesStore";
import { useAttendanceStore, AttendanceSession } from "@/stores/useAttendanceStore";
import { useStudentsStore } from "@/stores/useStudentsStore";
import { useLecturersStore } from "@/stores/useLecturersStore";
import { useAcademicSessionsStore } from "@/stores/useAcademicSessionsStore";

export const StoreInitializer = () => {
  const { setCourses } = useCoursesStore();
  const { setSessions: setAttendanceSessions } = useAttendanceStore();
  const { setStudents } = useStudentsStore();
  const { setLecturers } = useLecturersStore();
  const { setSessions: setAcademicSessions } = useAcademicSessionsStore();

  useEffect(() => {
    // Initializing mock data for courses
    setCourses([
      {
        id: "1",
        courseName: "Introduction to Computer Science",
        courseCode: "CSC101",
        description: "An introductory course to computer science and programming."
      },
      {
        id: "2",
        courseName: "Data Structures and Algorithms",
        courseCode: "CSC201",
        description: "Study of data structures and algorithms for solving computational problems."
      },
      {
        id: "3",
        courseName: "Advanced Calculus",
        courseCode: "MTH301",
        description: "Advanced topics in calculus including multivariable calculus."
      },
      {
        id: "4",
        courseName: "Introduction to Physics",
        courseCode: "PHY101",
        description: "Basic principles of physics and mechanics."
      },
      {
        id: "5",
        courseName: "Organic Chemistry",
        courseCode: "CHM202",
        description: "Study of structure, properties, and reactions of organic compounds."
      }
    ]);

    // Initializing mock data for students
    setStudents([
      {
        id: '1',
        firstName: 'Elizabeth',
        lastName: 'Alan',
        fullName: 'Elizabeth Alan',
        email: 'elizabeth@gmail.com',
        registrationNumber: 'P7345H3234',
        course: 'Medicine & Surgery',
        level: '100',
        admissionYear: '2023',
        avatar: '/placeholder.svg'
      },
      {
        id: '2',
        firstName: 'Desmond',
        lastName: 'Nyeko',
        fullName: 'Desmond Nyeko',
        email: 'desmond@gmail.com',
        registrationNumber: 'P7346H3234',
        course: 'Law',
        level: '200',
        admissionYear: '2022',
        avatar: '/placeholder.svg'
      },
      {
        id: '3',
        firstName: 'Cedar',
        lastName: 'James',
        fullName: 'Cedar James',
        email: 'cedar@gmail.com',
        registrationNumber: 'P7346H3224',
        course: 'Engineering',
        level: '300',
        admissionYear: '2021',
        avatar: '/placeholder.svg'
      },
      {
        id: '4',
        firstName: 'Sophie',
        lastName: 'Garcia',
        fullName: 'Sophie Garcia',
        email: 'sophie@gmail.com',
        registrationNumber: 'P7347H3234',
        course: 'Computer Science',
        level: '100',
        admissionYear: '2023',
        avatar: '/placeholder.svg'
      },
      {
        id: '5',
        firstName: 'Michael',
        lastName: 'Wong',
        fullName: 'Michael Wong',
        email: 'michael@gmail.com',
        registrationNumber: 'P7348H3234',
        course: 'Business Administration',
        level: '400',
        admissionYear: '2020',
        avatar: '/placeholder.svg'
      }
    ]);

    // Initializing mock data for lecturers
    setLecturers([
      {
        id: '1',
        name: 'Dr. John Smith',
        email: 'john.smith@university.edu',
        faculty: 'Science',
        department: 'Computer Science',
        avatar: '/placeholder.svg'
      },
      {
        id: '2',
        name: 'Prof. Maria Rodriguez',
        email: 'maria.rodriguez@university.edu',
        faculty: 'Engineering',
        department: 'Electrical Engineering',
        avatar: '/placeholder.svg'
      },
      {
        id: '3',
        name: 'Dr. David Kim',
        email: 'david.kim@university.edu',
        faculty: 'Medicine',
        department: 'Anatomy',
        avatar: '/placeholder.svg'
      }
    ]);

    // Initializing mock data for academic sessions
    setAcademicSessions([
      {
        id: '1',
        sessionName: '2023/2024',
        startDate: '2023-09-01',
        endDate: '2024-07-31',
        semesters: ['first semester', 'second semester'],
        isActive: true
      },
      {
        id: '2',
        sessionName: '2024/2025',
        startDate: '2024-09-01',
        endDate: '2025-07-31',
        semesters: ['first semester', 'second semester'],
        isActive: false
      },
      {
        id: '3',
        sessionName: '2022/2023',
        startDate: '2022-09-01',
        endDate: '2023-07-31',
        semesters: ['first semester', 'second semester'],
        isActive: false
      }
    ]);

    // Initializing mock data for attendance with proper typing
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    
    const mockAttendanceSessions: AttendanceSession[] = [
      {
        id: '1',
        course: 'Introduction to Computer Science',
        courseCode: 'CSC101',
        level: '100',
        sessionName: '2023/2024',
        date: today,
        isActive: true,
        semester: 'first semester',
        students: [
          {
            id: '1',
            name: 'Elizabeth Alan',
            registrationNumber: 'P7345H3234',
            attendance: {
              [today]: { status: 'present', time: '09:15:23' }
            }
          },
          {
            id: '2',
            name: 'Desmond Nyeko',
            registrationNumber: 'P7346H3234',
            attendance: {
              [today]: { status: 'absent' }
            }
          },
          {
            id: '3',
            name: 'Cedar James',
            registrationNumber: 'P7346H3224',
            attendance: {
              [today]: { status: 'not-marked' }
            }
          },
          {
            id: '4',
            name: 'Sophie Garcia',
            registrationNumber: 'P7347H3234',
            attendance: {
              [today]: { status: 'present', time: '09:05:07' }
            }
          },
          {
            id: '5',
            name: 'Michael Wong',
            registrationNumber: 'P7348H3234',
            attendance: {
              [today]: { status: 'not-marked' }
            }
          }
        ]
      },
      {
        id: '2',
        course: 'Data Structures and Algorithms',
        courseCode: 'CSC201',
        level: '200',
        sessionName: '2023/2024',
        date: yesterday,
        isActive: false,
        semester: 'first semester',
        students: [
          {
            id: '1',
            name: 'Elizabeth Alan',
            registrationNumber: 'P7345H3234',
            attendance: {
              [yesterday]: { status: 'present', time: '10:30:15' }
            }
          },
          {
            id: '2',
            name: 'Desmond Nyeko',
            registrationNumber: 'P7346H3234',
            attendance: {
              [yesterday]: { status: 'present', time: '10:25:33' }
            }
          },
          {
            id: '3',
            name: 'Cedar James',
            registrationNumber: 'P7346H3224',
            attendance: {
              [yesterday]: { status: 'absent' }
            }
          },
          {
            id: '4',
            name: 'Sophie Garcia',
            registrationNumber: 'P7347H3234',
            attendance: {
              [yesterday]: { status: 'present', time: '10:15:42' }
            }
          },
          {
            id: '5',
            name: 'Michael Wong',
            registrationNumber: 'P7348H3234',
            attendance: {
              [yesterday]: { status: 'absent' }
            }
          }
        ]
      },
      {
        id: '3',
        course: 'Advanced Calculus',
        courseCode: 'MTH301',
        level: '300',
        sessionName: '2023/2024',
        date: new Date(Date.now() - 172800000).toISOString().split('T')[0], // 2 days ago
        isActive: false,
        semester: 'second semester',
        students: [
          {
            id: '1',
            name: 'Elizabeth Alan',
            registrationNumber: 'P7345H3234',
            attendance: {}
          },
          {
            id: '2',
            name: 'Desmond Nyeko',
            registrationNumber: 'P7346H3234',
            attendance: {}
          },
          {
            id: '3',
            name: 'Cedar James',
            registrationNumber: 'P7346H3224',
            attendance: {}
          },
          {
            id: '4',
            name: 'Sophie Garcia',
            registrationNumber: 'P7347H3234',
            attendance: {}
          },
          {
            id: '5',
            name: 'Michael Wong',
            registrationNumber: 'P7348H3234',
            attendance: {}
          }
        ]
      }
    ];
    
    setAttendanceSessions(mockAttendanceSessions);
  }, []);

  return null;
};
