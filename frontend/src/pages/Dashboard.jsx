import { useSyllabus } from '../context/SyllabusContext'
import { Link } from 'react-router-dom'
import { BookOpen, Calendar, Clock, Plus } from 'lucide-react'
import { format } from 'date-fns'

const Dashboard = () => {
  const { syllabi, upcomingAssignments, loading } = useSyllabus()

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  const totalCourses = syllabi.length
  const totalAssignments = syllabi.reduce((acc, syllabus) => acc + syllabus.assignments.length, 0)
  const upcomingCount = upcomingAssignments.length

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome to your syllabus management system</p>
        </div>
        <Link
          to="/upload"
          className="btn btn-primary flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Syllabus</span>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <BookOpen className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Courses</p>
              <p className="text-2xl font-bold text-gray-900">{totalCourses}</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <Calendar className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Assignments</p>
              <p className="text-2xl font-bold text-gray-900">{totalAssignments}</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-3 bg-orange-100 rounded-lg">
              <Clock className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Upcoming</p>
              <p className="text-2xl font-bold text-gray-900">{upcomingCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Syllabi */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Recent Syllabi</h2>
          <Link to="/syllabi" className="text-primary-600 hover:text-primary-700 font-medium">
            View all
          </Link>
        </div>
        
        {syllabi.length === 0 ? (
          <div className="text-center py-8">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No syllabi yet. Upload your first syllabus to get started!</p>
            <Link to="/upload" className="btn btn-primary mt-4">
              Upload Syllabus
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {syllabi.slice(0, 6).map((syllabus) => (
              <Link
                key={syllabus._id}
                to={`/syllabi/${syllabus._id}`}
                className="block p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow duration-200"
              >
                <h3 className="font-semibold text-gray-900">{syllabus.courseCode}</h3>
                <p className="text-sm text-gray-600 mt-1">{syllabus.courseName}</p>
                <p className="text-xs text-gray-500 mt-2">{syllabus.instructor}</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                    {syllabus.assignments.length} assignments
                  </span>
                  <span className="text-xs text-gray-500">
                    {format(new Date(syllabus.createdAt), 'MMM d, yyyy')}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Upcoming Assignments */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Upcoming Assignments</h2>
          <Link to="/calendar" className="text-primary-600 hover:text-primary-700 font-medium">
            View calendar
          </Link>
        </div>
        
        {upcomingAssignments.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No upcoming assignments</p>
          </div>
        ) : (
          <div className="space-y-3">
            {upcomingAssignments.slice(0, 5).map((assignment) => (
              <div
                key={assignment._id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div>
                  <h4 className="font-medium text-gray-900">{assignment.title}</h4>
                  <p className="text-sm text-gray-600">{assignment.courseCode}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {format(new Date(assignment.dueDate), 'MMM d, yyyy')}
                  </p>
                  <p className="text-xs text-gray-500">
                    {format(new Date(assignment.dueDate), 'h:mm a')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard 