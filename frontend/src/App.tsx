import { ThemeProvider, CssBaseline } from '@mui/material'
import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'

import Home from './pages/Home'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Layout from './components/Layout/Layout'

import { lightTheme, darkTheme } from './theme/theme'
import { instance } from './config/axios-instance'
import Blog from './pages/Blog'
import NewsDetail from './pages/NewsDetail'

export default function App() {
  const [mode, setMode] = useState<'light' | 'dark'>('light')
  const [user, setUser] = useState<{ id: string; name: string } | null>(null)
  const [loading, setLoading] = useState(true)

  const toggleTheme = () => {
    setMode(prev => (prev === 'light' ? 'dark' : 'light'))
  }

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await instance.get('/users/me')
        setUser(res.data)
      } catch {
        setUser(null)
      } finally {
        setLoading(false)
      }
    }
    fetchUser()
  }, [])

  if (loading) return <div>Loading...</div>

  return (
    <ThemeProvider theme={mode === 'light' ? lightTheme : darkTheme}>
      <CssBaseline enableColorScheme />

      <Router>
        <Routes>

          {/* Public */}
          <Route
            path="/"
            element={!user ? <SignIn /> : <Navigate to="/home" replace />}
          />
          <Route
            path="/signup"
            element={!user ? <SignUp /> : <Navigate to="/home" replace />}
          />

          {/* Protected */}
          <Route
            element={
              user ? (
                <Layout mode={mode} onToggleTheme={toggleTheme} />
              ) : (
                <Navigate to="/" replace />
              )
            }
          >
            <Route path="/home" element={<Home />} />
          </Route>

          <Route
            element={
              user ? (
                <Layout mode={mode} onToggleTheme={toggleTheme} />
              ) : (
                <Navigate to="/" replace />
              )
            }

          >
            <Route path="/blog" element={<Blog />} />
          </Route>

          <Route
            element={
              user ? (
                <Layout mode={mode} onToggleTheme={toggleTheme} />
              ) : (
                <Navigate to="/" replace />
              )
            }

          >
            <Route path="/news/:id" element={<NewsDetail />} />
          </Route>

        </Routes>
      </Router>
    </ThemeProvider>
  )
}
