import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import { AppRouter } from './routes/AppRouter'
import { BrowserRouter } from 'react-router-dom'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRouter />
        <Toaster position="top-right" />
      </BrowserRouter>
    </AuthProvider>
  )
}
