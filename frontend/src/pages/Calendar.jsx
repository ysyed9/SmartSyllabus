import { useSyllabus } from '../context/SyllabusContext'
import { Calendar as CalendarIcon, Download, Clock, BookOpen } from 'lucide-react'
import { format } from 'date-fns'

const CalendarPage = () => {
  const { upcomingAssignments, syllabi } = useSyllabus()

  const downloadAllCalendar = () => {
    window.open(`${import.meta.env.VITE_API_URL || 'https://backend-5itl4030f-younussyed989s-projects.vercel.app'}/api/calendar/all`, '_blank')
  }

  const downloadSyllabusCalendar = (syllabusId) => {
    window.open(`${import.meta.env.VITE_API_URL || 'https://backend-5itl4030f-younussyed989s-projects.vercel.app'}/api/calendar/syllabus/${syllabusId}`, '_blank')
  }

  const getDaysUntilDue = (dueDate) => {
    const now = new Date()
    const due = new Date(dueDate)
    const diffTime = due - now
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const getUrgencyColor = (daysUntil) => {
    if (daysUntil <= 1) return 'text-red-600 bg-red-50 border-red-200'
    if (daysUntil <= 3) return 'text-orange-600 bg-orange-50 border-orange-200'
    if (daysUntil <= 7) return 'text-yellow-600 bg-yellow-50 border-yellow-200'
    return 'text-green-600 bg-green-50 border-green-200'
  }

  const groupedAssignments = upcomingAssignments.reduce((acc, assignment) => {
    const date = format(new Date(assignment.dueDate), 'yyyy-MM-dd')
    if (!acc[date]) {
      acc[date] = []
    }
    acc[date].push(assignment)
    return acc
  }, {})

  const sortedDates = Object.keys(groupedAssignments).sort()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Calendar</h1>
          <p className="text-gray-600 mt-2">Track your upcoming assignments and deadlines</p>
        </div>
        <button
          onClick={downloadAllCalendar}
          className="btn btn-primary flex items-center space-x-2"
        >
          <Download className="h-4 w-4" />
          <span>Download All</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <CalendarIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Assignments</p>
              <p className="text-2xl font-bold text-gray-900">{upcomingAssignments.length}</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <BookOpen className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Courses</p>
              <p className="text-2xl font-bold text-gray-900">
                {new Set(upcomingAssignments.map(a => a.courseCode)).size}
              </p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-3 bg-orange-100 rounded-lg">
              <Clock className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Due This Week</p>
              <p className="text-2xl font-bold text-gray-900">
                {upcomingAssignments.filter(a => {
                  const daysUntil = getDaysUntilDue(a.dueDate)
                  return daysUntil <= 7 && daysUntil >= 0
                }).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar View */}
      {upcomingAssignments.length === 0 ? (
        <div className="card p-12 text-center">
          <CalendarIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No upcoming assignments</h3>
          <p className="text-gray-600">
            You're all caught up! Add assignments to your syllabi to see them here.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Course-specific calendars */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Course Calendars</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {syllabi.map((syllabus) => {
                const courseAssignments = upcomingAssignments.filter(
                  a => a.courseCode === syllabus.courseCode
                )
                if (courseAssignments.length === 0) return null

                return (
                  <div key={syllabus._id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">{syllabus.courseCode}</h3>
                        <p className="text-sm text-gray-600">{syllabus.courseName}</p>
                      </div>
                      <button
                        onClick={() => downloadSyllabusCalendar(syllabus._id)}
                        className="text-primary-600 hover:text-primary-700"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="text-sm text-gray-600">
                      {courseAssignments.length} upcoming assignment{courseAssignments.length !== 1 ? 's' : ''}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Timeline View */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Upcoming Timeline</h2>
            <div className="space-y-4">
              {sortedDates.map((date) => (
                <div key={date} className="border-l-4 border-primary-500 pl-4">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {format(new Date(date), 'EEEE, MMMM d, yyyy')}
                  </h3>
                  <div className="space-y-3">
                    {groupedAssignments[date]
                      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
                      .map((assignment) => {
                        const daysUntil = getDaysUntilDue(assignment.dueDate)
                        const urgencyClass = getUrgencyColor(daysUntil)
                        
                        return (
                          <div
                            key={assignment._id}
                            className={`p-4 rounded-lg border ${urgencyClass}`}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-3 mb-2">
                                  <h4 className="font-medium text-gray-900">{assignment.title}</h4>
                                  <span className={`px-2 py-1 text-xs rounded-full ${
                                    assignment.type === 'exam' ? 'bg-red-100 text-red-800' :
                                    assignment.type === 'quiz' ? 'bg-yellow-100 text-yellow-800' :
                                    assignment.type === 'project' ? 'bg-purple-100 text-purple-800' :
                                    'bg-blue-100 text-blue-800'
                                  }`}>
                                    {assignment.type}
                                  </span>
                                  {assignment.weight > 0 && (
                                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                                      {assignment.weight}%
                                    </span>
                                  )}
                                </div>
                                
                                <p className="text-sm text-gray-600 mb-2">{assignment.courseCode}</p>
                                
                                {assignment.description && (
                                  <p className="text-sm text-gray-600 mb-2">{assignment.description}</p>
                                )}
                                
                                <div className="flex items-center space-x-4 text-sm">
                                  <span className="text-gray-500">
                                    Due: {format(new Date(assignment.dueDate), 'h:mm a')}
                                  </span>
                                  <span className={`font-medium ${
                                    daysUntil <= 1 ? 'text-red-600' :
                                    daysUntil <= 3 ? 'text-orange-600' :
                                    daysUntil <= 7 ? 'text-yellow-600' :
                                    'text-green-600'
                                  }`}>
                                    {daysUntil === 0 ? 'Due today' :
                                     daysUntil === 1 ? 'Due tomorrow' :
                                     daysUntil < 0 ? 'Overdue' :
                                     `${daysUntil} day${daysUntil !== 1 ? 's' : ''} left`}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CalendarPage 