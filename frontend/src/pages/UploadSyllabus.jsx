import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSyllabus } from '../context/SyllabusContext'
import { Upload, FileText, Image, AlertCircle } from 'lucide-react'

const UploadSyllabus = () => {
  const navigate = useNavigate()
  const { uploadSyllabus } = useSyllabus()
  const [file, setFile] = useState(null)
  const [formData, setFormData] = useState({
    courseCode: '',
    courseName: '',
    instructor: '',
    semester: '',
    year: new Date().getFullYear(),
    description: '',
    officeHours: '',
    contactInfo: {
      email: '',
      phone: '',
      office: ''
    }
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      if (selectedFile.type === 'application/pdf' || selectedFile.type.startsWith('image/')) {
        setFile(selectedFile)
        setError('')
      } else {
        setError('Please select a PDF or image file')
        setFile(null)
      }
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!file) {
      setError('Please select a file to upload')
      return
    }

    if (!formData.courseCode || !formData.courseName || !formData.instructor) {
      setError('Please fill in all required fields')
      return
    }

    setLoading(true)
    setError('')

    try {
      const data = new FormData()
      data.append('syllabus', file)
      
      // Append form data
      Object.keys(formData).forEach(key => {
        if (typeof formData[key] === 'object') {
          data.append(key, JSON.stringify(formData[key]))
        } else {
          data.append(key, formData[key])
        }
      })

      await uploadSyllabus(data)
      navigate('/syllabi')
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to upload syllabus')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Upload Syllabus</h1>
        <p className="text-gray-600 mt-2">Upload a PDF or image of your syllabus to get started</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* File Upload */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Upload File</h2>
          
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <div className="flex flex-col items-center">
              {file ? (
                <>
                  {file.type === 'application/pdf' ? (
                    <FileText className="h-12 w-12 text-blue-500 mb-4" />
                  ) : (
                    <Image className="h-12 w-12 text-green-500 mb-4" />
                  )}
                  <p className="text-sm font-medium text-gray-900">{file.name}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </>
              ) : (
                <>
                  <Upload className="h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-sm text-gray-600">
                    Drag and drop your syllabus here, or click to browse
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Supports PDF and image files (max 10MB)
                  </p>
                </>
              )}
            </div>
            
            <input
              type="file"
              accept=".pdf,image/*"
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="btn btn-secondary mt-4 cursor-pointer"
            >
              Choose File
            </label>
          </div>
        </div>

        {/* Course Information */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Course Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course Code *
              </label>
              <input
                type="text"
                name="courseCode"
                value={formData.courseCode}
                onChange={handleInputChange}
                className="input"
                placeholder="e.g., CS101"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course Name *
              </label>
              <input
                type="text"
                name="courseName"
                value={formData.courseName}
                onChange={handleInputChange}
                className="input"
                placeholder="e.g., Introduction to Computer Science"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Instructor *
              </label>
              <input
                type="text"
                name="instructor"
                value={formData.instructor}
                onChange={handleInputChange}
                className="input"
                placeholder="e.g., Dr. John Smith"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Semester *
              </label>
              <select
                name="semester"
                value={formData.semester}
                onChange={handleInputChange}
                className="input"
                required
              >
                <option value="">Select semester</option>
                <option value="Fall">Fall</option>
                <option value="Spring">Spring</option>
                <option value="Summer">Summer</option>
                <option value="Winter">Winter</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Year *
              </label>
              <input
                type="number"
                name="year"
                value={formData.year}
                onChange={handleInputChange}
                className="input"
                min="2020"
                max="2030"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Office Hours
              </label>
              <input
                type="text"
                name="officeHours"
                value={formData.officeHours}
                onChange={handleInputChange}
                className="input"
                placeholder="e.g., Mon/Wed 2-4pm"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="input"
              rows="3"
              placeholder="Course description..."
            />
          </div>
        </div>

        {/* Contact Information */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                name="contactInfo.email"
                value={formData.contactInfo.email}
                onChange={handleInputChange}
                className="input"
                placeholder="instructor@university.edu"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone
              </label>
              <input
                type="tel"
                name="contactInfo.phone"
                value={formData.contactInfo.phone}
                onChange={handleInputChange}
                className="input"
                placeholder="(555) 123-4567"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Office
              </label>
              <input
                type="text"
                name="contactInfo.office"
                value={formData.contactInfo.office}
                onChange={handleInputChange}
                className="input"
                placeholder="Building 101, Room 205"
              />
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="flex items-center space-x-2 p-4 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/syllabi')}
            className="btn btn-secondary"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Uploading...' : 'Upload Syllabus'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default UploadSyllabus 