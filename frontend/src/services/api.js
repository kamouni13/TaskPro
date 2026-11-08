import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL

const api = API_URL
  ? axios.create({
      baseURL: API_URL,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
  : null

export default api
