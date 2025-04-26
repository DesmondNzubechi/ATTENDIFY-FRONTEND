import { DashboardLayout } from '@/components/dashboard/DashboardLayout';

export default function QuickGuide() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 md:mt-0 mt-[40px]">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800 uppercase">Quick Guide</h1>
        </div>

              {/* Welcome Section */}
              <div className='bg-white p-6 w-full border rounded shadow-md '>
              {/* <div className="bg-white  rounded-2xl p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Welcome to ATTENDIFY - Your Digital Attendance management platform</h2>
          <p className="text-gray-600">
            Manage students, courses, attendance, and academic sessions easily. This platform is designed to simplify your work and make management effortless. Let's walk through how everything works!
          </p>
                  </div> */}
                     {/* What You Can Do */}
        <div className="bg-white  rounded-2xl p-6">
          <h2 className="text-2xl text-center font-semibold uppercase text-gray-800 mb-4"> What You Can Do</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {['Manage Students', 'Manage Lecturers', 'Manage Courses', 'Manage Attendance', 'Manage Academic Sessions', 'Manage Your Account'].map((item) => (
              <div key={item} className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition">
                <p className="text-gray-700">{item}</p>
              </div>
            ))}
          </div>
                  </div>

                    {/* Features Section */}
        <div className="bg-white w-full rounded-2xl p-6 space-y-8">
          <h2 className="text-2xl text-center font-semibold uppercase text-gray-800">How to Use Each Feature</h2>

                      <div className='grid w-full justify-center gap-5 md:grid-cols-3 grid-col-1 '>
                      {[
            { title: ' Students Management', description: ['Create, view, update, or delete student records.', 'Filter students by Year or Level.'] },
            { title: 'Lecturer Management', description: ['Create and manage lecturer profiles.', 'Update or remove lecturers easily.'] },
            { title: 'Course Management', description: ['Add courses with title, code, semester, and level.', 'View or filter courses.', 'Delete single or all courses.'] },
            { title: 'Academic Sessions', description: ['Create new academic sessions.', 'View, edit, or delete sessions.'] },
            { title: 'Attendance Management', description: ['Create and activate attendance.', 'Mark students present/absent.', 'Edit or view attendance records.'] },
            { title: 'Account Management', description: ['Update your profile.', 'Change your password.', 'Logout securely.'] },
          ].map((feature) => (
            <div key={feature.title} className='p-5 rounded bg-gray-50 w-full '>
              <h3 className="text-lg font-bold  text-gray-700 mb-1">{feature.title}</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-1 ml-2">
                {feature.description.map((desc, idx) => (
                  <li key={idx}>{desc}</li>
                ))}
              </ul>
            </div>
          ))}
                      </div>
        </div>

                    {/* Quick Actions Table */}
        <div className="bg-white  rounded-2xl p-6">
          <h2 className="text-2xl font-semibold text-center text-gray-800 uppercase mb-4"> Quick Actions</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-4 text-gray-700 font-medium">Action</th>
                  <th className="text-left py-3 px-4 text-gray-700 font-medium">Where to Find It</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { action: 'Create a Student', location: 'Students → Create Student' },
                  { action: 'Add a Course', location: 'Courses → Add Course' },
                  { action: 'Start Attendance', location: 'Attendance → Create Attendance' },
                  { action: 'Manage Profile', location: 'Profile Settings → Update Profile' },
                  { action: 'Create Academic Session', location: 'Academic Sessions → Create Session' },
                ].map((item, idx) => (
                  <tr key={idx} className="border-t">
                    <td className="py-3 px-4 text-gray-600">{item.action}</td>
                    <td className="py-3 px-4 text-gray-600">{item.location}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Help Section */}
        <div className="bg-white flex flex-col   rounded-2xl p-6">
          <h2 className="text-2xl font-semibold uppercase text-gray-800 md:text-center mb-2"> Need Help?</h2>
          <p className="text-gray-600 md:text-center mb-4">
            If you encounter any problems:
          </p>
          <ul className="list-disc flex md:flex-row flex-col gap-2 justify-center list-inside text-gray-600 space-y-1 ml-2">
            <li>Contact the platform administrator.</li>
            <li>Use the support chat if available.</li>
            <li>Come back to this guide for assistance.</li>
          </ul>
        </div>

                  
              </div>
    


      
        {/* Ending Section */}
        {/* <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl p-8 text-center shadow-md">
          <h2 className="text-3xl font-bold mb-2">You’re All Set!</h2>
          <p className="text-lg mb-2">
            Explore the platform and enjoy managing class attendance.
          </p>
          <p className="italic text-sm">"Technology should make life easier — and that's exactly what we've built for you."</p>
        </div> */}
      </div>
    </DashboardLayout>
  );
}
