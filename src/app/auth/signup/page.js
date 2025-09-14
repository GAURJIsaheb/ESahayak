'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [errors, setErrors] = useState({})
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      })
      if (res.ok) {
        toast.success('Signed up successfully!')
        router.push('/buyers')
      } else {
        const err = await res.json()
        setErrors({ general: err.error || 'Signup failed' })
        toast.error(err.error || 'An error occurred')
      }
    } catch (err) {
      const fieldErrors = { general: 'Please check your input' }
      if (err.errors && Array.isArray(err.errors)) {
        err.errors.forEach((e) => {
          if (e.path && e.path.length > 0) {
            fieldErrors[e.path[0]] = e.message
          }
        })
      } else if (err.message) {
        fieldErrors.general = err.message
      }
      setErrors(fieldErrors)
      toast.error('Validation failed')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 space-y-4" aria-labelledby="signup-title">
      <h1 id="signup-title" className="text-2xl font-bold">Sign Up</h1>
      {errors.general && <p className="text-red-500" role="alert">{errors.general}</p>}
      
      <div>
        <label htmlFor="name" className="block text-sm font-medium">Name</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your Name"
          className="block w-full p-2 border rounded text-black"
          required
          aria-describedby="name-error"
        />
        {errors.name && <span id="name-error" className="text-red-500 text-sm" role="alert">{errors.name}</span>}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium">Email</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          className="block w-full p-2 border rounded text-black"
          required
          aria-describedby="email-error"
        />
        {errors.email && <span id="email-error" className="text-red-500 text-sm" role="alert">{errors.email}</span>}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium">Password</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="At least 6 characters"
          className="block w-full p-2  border rounded text-black"
          required
          aria-describedby="password-error"
        />
        {errors.password && <span id="password-error" className="text-red-500 text-sm" role="alert">{errors.password}</span>}
      </div>

      <button
        type="submit"
        className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Sign Up
      </button>
      <p className="mt-2 text-sm text-center">
        Already have an account?{' '}
        <a href="/auth/login" className="text-blue-500 hover:underline">Log in</a>
      </p>
    </form>
  )
}