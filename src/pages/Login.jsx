import { useState, useEffect } from 'react'
import { useAuth } from '../auth/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const { login, profile, user, loading, logout, authError  } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  // ✅ Redirect automatically if already logged in
  useEffect(() => {
    if (profile) {
      if (profile.role === 'hr') navigate('/dashboard/hr/overview')
        else if (profile.role === 'hotel_manager')
          navigate('/dashboard/manager/overview')
        else if (profile.role === 'hotel_admin')
          navigate('/dashboard/admin/overview') 
        else if (profile.role === 'receptionist')
          navigate('/dashboard/reception/overview')
        
      }
  }, [profile, navigate])

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')

    const { error: loginError } = await login(email, password)
    if (loginError) {
      setError(loginError.message)
      return
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center h-screen bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">
      <form
        onSubmit={handleLogin}
        className="bg-white dark:bg-zinc-800 p-8 rounded-xl shadow-lg w-[45vw] h-[50vh] flex flex-col items-center justify-center"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">
          HOTEL GATE Global
        </h2>

        {error && <p className="text-red-500 mb-3">{error}</p>}

        {authError && <p className="text-red-500 mb-3">{authError}</p>}

        <input
          type="email"
          placeholder="Email"
          className="w-[90%] border p-2 mb-4 rounded dark:bg-zinc-700 dark:border-zinc-600 dark:text-zinc-100"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-[90%] border p-2 mb-4 rounded dark:bg-zinc-700 dark:border-zinc-600 dark:text-zinc-100"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="w-[90%] bg-black dark:bg-orange-600 text-white p-2
         rounded mb-3 hover:bg-gray-800 dark:hover:bg-orange-700 transition cursor-pointer">
          { loading ? 'Loading...' : 'Login' }
        </button>

        <button
          type="button"
          onClick={() => navigate('/signup')}
          className="w-[90%] border border-black text-black p-2 rounded hover:bg-gray-100 dark:border-white dark:text-zinc-100 dark:hover:bg-zinc-700 transition cursor-pointer"
        >
          Create test account
        </button>
      </form>
    </div>
  )
}
