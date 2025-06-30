import { createContext, useContext, useReducer, useEffect } from 'react'
import axios from 'axios'

const SyllabusContext = createContext()

// API base URL - always use the full backend URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://backend-5itl4030f-younussyed989s-projects.vercel.app'

const initialState = {
  syllabi: [],
  loading: false,
  error: null,
  upcomingAssignments: []
}

const syllabusReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false }
    case 'SET_SYLLABI':
      return { ...state, syllabi: action.payload, loading: false }
    case 'ADD_SYLLABUS':
      return { ...state, syllabi: [action.payload, ...state.syllabi] }
    case 'UPDATE_SYLLABUS':
      return {
        ...state,
        syllabi: state.syllabi.map(s => 
          s._id === action.payload._id ? action.payload : s
        )
      }
    case 'DELETE_SYLLABUS':
      return {
        ...state,
        syllabi: state.syllabi.filter(s => s._id !== action.payload)
      }
    case 'SET_UPCOMING_ASSIGNMENTS':
      return { ...state, upcomingAssignments: action.payload }
    default:
      return state
  }
}

export const SyllabusProvider = ({ children }) => {
  const [state, dispatch] = useReducer(syllabusReducer, initialState)

  const fetchSyllabi = async () => {
    dispatch({ type: 'SET_LOADING', payload: true })
    try {
      const response = await axios.get(`${API_BASE_URL}/api/syllabi`)
      dispatch({ type: 'SET_SYLLABI', payload: response.data })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message })
    }
  }

  const fetchUpcomingAssignments = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/calendar/upcoming`)
      dispatch({ type: 'SET_UPCOMING_ASSIGNMENTS', payload: response.data })
    } catch (error) {
      console.error('Error fetching upcoming assignments:', error)
    }
  }

  const addSyllabus = async (syllabusData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/syllabi`, syllabusData)
      dispatch({ type: 'ADD_SYLLABUS', payload: response.data })
      return response.data
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message })
      throw error
    }
  }

  const updateSyllabus = async (id, syllabusData) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/api/syllabi/${id}`, syllabusData)
      dispatch({ type: 'UPDATE_SYLLABUS', payload: response.data })
      return response.data
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message })
      throw error
    }
  }

  const deleteSyllabus = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/syllabi/${id}`)
      dispatch({ type: 'DELETE_SYLLABUS', payload: id })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message })
      throw error
    }
  }

  const uploadSyllabus = async (formData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/syllabi/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      dispatch({ type: 'ADD_SYLLABUS', payload: response.data })
      return response.data
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message })
      throw error
    }
  }

  useEffect(() => {
    fetchSyllabi()
    fetchUpcomingAssignments()
  }, [])

  const value = {
    ...state,
    fetchSyllabi,
    fetchUpcomingAssignments,
    addSyllabus,
    updateSyllabus,
    deleteSyllabus,
    uploadSyllabus
  }

  return (
    <SyllabusContext.Provider value={value}>
      {children}
    </SyllabusContext.Provider>
  )
}

export const useSyllabus = () => {
  const context = useContext(SyllabusContext)
  if (!context) {
    throw new Error('useSyllabus must be used within a SyllabusProvider')
  }
  return context
} 