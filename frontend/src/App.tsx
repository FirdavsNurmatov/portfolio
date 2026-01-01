import { ThemeProvider, CssBaseline } from '@mui/material'
import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { lightTheme, darkTheme } from './theme/theme'
import Home from './pages/Home'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Layout from './components/Layout/Layout'
import Blog from './pages/Blog'
import NewsDetail from './pages/NewsDetail'
import TokenChecker from './components/TokenChecker'

export default function App() {
  const [mode, setMode] = useState<'light' | 'dark'>(() => {
    const savedMode = localStorage.getItem('theme')
    return savedMode === 'dark' ? 'dark' : 'light'
  })

  const toggleTheme = () => {
    setMode(prev => {
      const nextMode = prev === 'light' ? 'dark' : 'light'
      localStorage.setItem('theme', nextMode)
      return nextMode
    })
  }

  return (
    <ThemeProvider theme={mode === 'light' ? lightTheme : darkTheme}>
      <CssBaseline enableColorScheme />

      <Routes>

        {/* Public */}
        <Route
          index
          element={<SignIn />}
        />
        <Route
          path="/signup"
          element={<SignUp />}
        />

        {/* Protected */}
        <Route element={<Layout mode={mode} onToggleTheme={toggleTheme} />}>
          <Route path="/home" element={<TokenChecker><Home /></TokenChecker>} />
          <Route path="/blog" element={<TokenChecker><Blog /></TokenChecker>} />
          <Route path="/news/:id" element={<TokenChecker><NewsDetail /></TokenChecker>} />
        </Route>

      </Routes>
    </ThemeProvider>
  )
}
