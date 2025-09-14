"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import toast from "react-hot-toast"
import Link from "next/link"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    })
    if (res?.ok) {
      toast.success("Logged in!")
      router.push("/buyers")
    } else {
      toast.error("Invalid credentials")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4">
      <h1 className="text-2xl mb-4">Login</h1>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="block w-full mb-2 text-black p-2 border"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        className="block w-full mb-2 text-black p-2 border"
        required
      />
      <button type="submit" className="w-full p-2 bg-blue-500 text-white">
        Login
      </button>

      <p className="mt-2 text-sm">
        Don't have an account?{" "}
        <Link href="/auth/signup" className="text-blue-500 hover:underline">
          Sign Up
        </Link>
      </p>
    </form>
  )
}
