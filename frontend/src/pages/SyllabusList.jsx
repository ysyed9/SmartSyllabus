import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useSyllabus } from '../context/SyllabusContext'
import { Search, Filter, Plus, BookOpen, Calendar, User } from 'lucide-react'
import { format } from 'date-fns'

const SyllabusList = () => {
  const { syllabi, loading, deleteSyllabus } = useSyllabus()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterSemester, setFilterSemester] = useState('')
  const [filterYear, setFilterYear] = useState('')

  const filteredSyllabi = syllabi.filter(syllabus => {
    const matchesSearch = 
      syllabus.courseCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      syllabus.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      syllabus.instructor.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesSemester = !filterSemester || syllabus.semester === filterSemester
    const matchesYear = !filterYear || syllabus.year.toString() === filterYear

    return matchesSearch && matchesSemester && matchesYear
  })

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this syllabus?')) {
      try {
        await deleteSyllabus(id)
      } catch (error) {
        console.error('Failed to delete syllabus:', error)
      }
    }
  }

  const semesters = [...new Set(syllabi.map(s => s.semester))]
  const years = [...new Set(syllabi.map(s => s.year))].sort((a, b) => b - a)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Syllabi</h1>
          <p className="text-gray-600 mt-2">Manage your course syllabi</p>
        </div>
        <Link
          to="/upload"
          className="btn btn-primary flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Syllabus</span>
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="card p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search syllabi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10"
            />
          </div>

          <div>
            <select
              value={filterSemester}
              onChange={(e) => setFilterSemester(e.target.value)}
              className="input"
            >
              <option value="">All Semesters</option>
              {semesters.map(semester => (
                <option key={semester} value={semester}>{semester}</option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={filterYear}
              onChange={(e) => setFilterYear(e.target.value)}
              className="input"
            >
              <option value="">All Years</option>
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-600">
              {filteredSyllabi.length} of {syllabi.length} syllabi
            </span>
          </div>
        </div>
      </div>

      {/* Syllabi Grid */}
      {filteredSyllabi.length === 0 ? (
        <div className="card p-12 text-center">
          <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No syllabi found</h3>
          <p className="text-gray-600 mb-6">
            {syllabi.length === 0 
              ? "You haven't uploaded any syllabi yet."
              : "No syllabi match your search criteria."
            }
          </p>
          {syllabi.length === 0 && (
            <Link to="/upload" className="btn btn-primary">
              Upload Your First Syllabus
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSyllabi.map((syllabus) => (
            <div key={syllabus._id} className="card p-6 hover:shadow-lg transition-shadow duration-200">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{syllabus.courseCode}</h3>
                  <p className="text-sm text-gray-600 mt-1">{syllabus.courseName}</p>
                </div>
                <div className="flex space-x-2">
                  <Link
                    to={`/syllabi/${syllabus._id}`}
                    className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                  >
                    View
                  </Link>
                  <button
                    onClick={() => handleDelete(syllabus._id)}
                    className="text-red-600 hover:text-red-700 text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <User className="h-4 w-4 mr-2" />
                  <span>{syllabus.instructor}</span>
                </div>

                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>{syllabus.semester} {syllabus.year}</span>
                </div>

                <div className="flex items-center text-sm text-gray-600">
                  <BookOpen className="h-4 w-4 mr-2" />
                  <span>{syllabus.assignments.length} assignments</span>
                </div>

                {syllabus.contactInfo?.email && (
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Email:</span> {syllabus.contactInfo.email}
                  </div>
                )}

                {syllabus.officeHours && (
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Office Hours:</span> {syllabus.officeHours}
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Added {format(new Date(syllabus.createdAt), 'MMM d, yyyy')}</span>
                  {syllabus.originalFile && (
                    <span className="bg-gray-100 px-2 py-1 rounded">
                      {syllabus.originalFile.mimetype === 'application/pdf' ? 'PDF' : 'Image'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default SyllabusList 