import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useSyllabus } from '../context/SyllabusContext'
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Calendar, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Clock,
  Plus,
  Download
} from 'lucide-react'
import { format } from 'date-fns'
import axios from 'axios'

const SyllabusDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { syllabi, updateSyllabus, deleteSyllabus } = useSyllabus()
  const [syllabus, setSyllabus] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({})
  const [newAssignment, setNewAssignment] = useState({
    title: '',
    description: '',
    dueDate: '',
    type: 'assignment',
    weight: 0
  })

  useEffect(() => {
    const foundSyllabus = syllabi.find(s => s._id === id)
    if (foundSyllabus) {
      setSyllabus(foundSyllabus)
      setFormData(foundSyllabus)
      setLoading(false)
    } else {
      // If not found in context, fetch from API
      fetchSyllabus()
    }
  }, [id, syllabi])

  const fetchSyllabus = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/syllabi/${id}`)
      setSyllabus(response.data)
      setFormData(response.data)
    } catch (error) {
      console.error('Failed to fetch syllabus:', error)
      navigate('/syllabi')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    if (name.includes('.')) {
      const [parent, child] = name.split('.')
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleSave = async () => {
    try {
      const updatedSyllabus = await updateSyllabus(id, formData)
      setSyllabus(updatedSyllabus)
      setEditing(false)
    } catch (error) {
      console.error('Failed to update syllabus:', error)
    }
  }

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this syllabus?')) {
      try {
        await deleteSyllabus(id)
        navigate('/syllabi')
      } catch (error) {
        console.error('Failed to delete syllabus:', error)
      }
    }
  }

  const handleAddAssignment = async (e) => {
    e.preventDefault()
    if (!newAssignment.title || !newAssignment.dueDate) return

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/syllabi/${id}/assignments`, newAssignment)
      setSyllabus(response.data)
      setNewAssignment({
        title: '',
        description: '',
        dueDate: '',
        type: 'assignment',
        weight: 0
      })
    } catch (error) {
      console.error('Failed to add assignment:', error)
    }
  }

  const handleDeleteAssignment = async (assignmentId) => {
    if (window.confirm('Are you sure you want to delete this assignment?')) {
      try {
        const response = await axios.delete(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/syllabi/${id}/assignments/${assignmentId}`)
        setSyllabus(response.data)
      } catch (error) {
        console.error('Failed to delete assignment:', error)
      }
    }
  }

  const downloadCalendar = () => {
    window.open(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/calendar/syllabus/${id}`, '_blank')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!syllabus) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Syllabus not found</h2>
        <Link to="/syllabi" className="btn btn-primary">
          Back to Syllabi
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/syllabi" className="btn btn-secondary">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{syllabus.courseCode}</h1>
            <p className="text-gray-600 mt-1">{syllabus.courseName}</p>
          </div>
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={downloadCalendar}
            className="btn btn-secondary flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Calendar</span>
          </button>
          <button
            onClick={() => setEditing(!editing)}
            className="btn btn-secondary flex items-center space-x-2"
          >
            <Edit className="h-4 w-4" />
            <span>{editing ? 'Cancel' : 'Edit'}</span>
          </button>
          <button
            onClick={handleDelete}
            className="btn bg-red-600 text-white hover:bg-red-700 flex items-center space-x-2"
          >
            <Trash2 className="h-4 w-4" />
            <span>Delete</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Course Information */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Course Information</h2>
            
            {editing ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Course Code
                    </label>
                    <input
                      type="text"
                      name="courseCode"
                      value={formData.courseCode}
                      onChange={handleInputChange}
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Course Name
                    </label>
                    <input
                      type="text"
                      name="courseName"
                      value={formData.courseName}
                      onChange={handleInputChange}
                      className="input"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="input"
                    rows="3"
                  />
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setEditing(false)}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="btn btn-primary"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium text-gray-700">Course Code</span>
                    <p className="text-gray-900">{syllabus.courseCode}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Course Name</span>
                    <p className="text-gray-900">{syllabus.courseName}</p>
                  </div>
                </div>
                
                {syllabus.description && (
                  <div>
                    <span className="text-sm font-medium text-gray-700">Description</span>
                    <p className="text-gray-900 mt-1">{syllabus.description}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Assignments */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Assignments</h2>
              <span className="text-sm text-gray-600">
                {syllabus.assignments.length} assignments
              </span>
            </div>

            {/* Add Assignment Form */}
            <form onSubmit={handleAddAssignment} className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={newAssignment.title}
                    onChange={(e) => setNewAssignment(prev => ({ ...prev, title: e.target.value }))}
                    className="input"
                    placeholder="Assignment title"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Due Date *
                  </label>
                  <input
                    type="datetime-local"
                    value={newAssignment.dueDate}
                    onChange={(e) => setNewAssignment(prev => ({ ...prev, dueDate: e.target.value }))}
                    className="input"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type
                  </label>
                  <select
                    value={newAssignment.type}
                    onChange={(e) => setNewAssignment(prev => ({ ...prev, type: e.target.value }))}
                    className="input"
                  >
                    <option value="assignment">Assignment</option>
                    <option value="exam">Exam</option>
                    <option value="quiz">Quiz</option>
                    <option value="project">Project</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Weight (%)
                  </label>
                  <input
                    type="number"
                    value={newAssignment.weight}
                    onChange={(e) => setNewAssignment(prev => ({ ...prev, weight: parseInt(e.target.value) }))}
                    className="input"
                    min="0"
                    max="100"
                  />
                </div>
              </div>
              
              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={newAssignment.description}
                  onChange={(e) => setNewAssignment(prev => ({ ...prev, description: e.target.value }))}
                  className="input"
                  rows="2"
                  placeholder="Assignment description..."
                />
              </div>
              
              <div className="mt-3 flex justify-end">
                <button type="submit" className="btn btn-primary flex items-center space-x-2">
                  <Plus className="h-4 w-4" />
                  <span>Add Assignment</span>
                </button>
              </div>
            </form>

            {/* Assignments List */}
            {syllabus.assignments.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No assignments yet. Add your first assignment above.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {syllabus.assignments
                  .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
                  .map((assignment) => (
                    <div
                      key={assignment._id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
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
                            <span className="text-xs text-gray-500">
                              {assignment.weight}%
                            </span>
                          )}
                        </div>
                        {assignment.description && (
                          <p className="text-sm text-gray-600 mt-1">{assignment.description}</p>
                        )}
                        <p className="text-sm text-gray-500 mt-1">
                          Due: {format(new Date(assignment.dueDate), 'MMM d, yyyy h:mm a')}
                        </p>
                      </div>
                      
                      <button
                        onClick={() => handleDeleteAssignment(assignment._id)}
                        className="text-red-600 hover:text-red-700 ml-4"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Instructor Information */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Instructor</h3>
            
            <div className="space-y-3">
              <div className="flex items-center text-sm">
                <User className="h-4 w-4 text-gray-400 mr-3" />
                <span className="text-gray-900">{syllabus.instructor}</span>
              </div>
              
              {syllabus.contactInfo?.email && (
                <div className="flex items-center text-sm">
                  <Mail className="h-4 w-4 text-gray-400 mr-3" />
                  <a href={`mailto:${syllabus.contactInfo.email}`} className="text-primary-600 hover:text-primary-700">
                    {syllabus.contactInfo.email}
                  </a>
                </div>
              )}
              
              {syllabus.contactInfo?.phone && (
                <div className="flex items-center text-sm">
                  <Phone className="h-4 w-4 text-gray-400 mr-3" />
                  <a href={`tel:${syllabus.contactInfo.phone}`} className="text-gray-900">
                    {syllabus.contactInfo.phone}
                  </a>
                </div>
              )}
              
              {syllabus.contactInfo?.office && (
                <div className="flex items-center text-sm">
                  <MapPin className="h-4 w-4 text-gray-400 mr-3" />
                  <span className="text-gray-900">{syllabus.contactInfo.office}</span>
                </div>
              )}
              
              {syllabus.officeHours && (
                <div className="flex items-center text-sm">
                  <Clock className="h-4 w-4 text-gray-400 mr-3" />
                  <span className="text-gray-900">{syllabus.officeHours}</span>
                </div>
              )}
            </div>
          </div>

          {/* Course Details */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Details</h3>
            
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-gray-700">Semester</span>
                <p className="text-gray-900">{syllabus.semester} {syllabus.year}</p>
              </div>
              
              <div>
                <span className="text-sm font-medium text-gray-700">Created</span>
                <p className="text-gray-900">{format(new Date(syllabus.createdAt), 'MMM d, yyyy')}</p>
              </div>
              
              <div>
                <span className="text-sm font-medium text-gray-700">Last Updated</span>
                <p className="text-gray-900">{format(new Date(syllabus.updatedAt), 'MMM d, yyyy')}</p>
              </div>
            </div>
          </div>

          {/* Original File */}
          {syllabus.originalFile && (
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Original File</h3>
              
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-700">File Name</span>
                  <p className="text-gray-900">{syllabus.originalFile.filename}</p>
                </div>
                
                <div>
                  <span className="text-sm font-medium text-gray-700">File Type</span>
                  <p className="text-gray-900">
                    {syllabus.originalFile.mimetype === 'application/pdf' ? 'PDF Document' : 'Image File'}
                  </p>
                </div>
                
                <a
                  href={`/uploads/${syllabus.originalFile.filename}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary w-full"
                >
                  View Original File
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SyllabusDetail 