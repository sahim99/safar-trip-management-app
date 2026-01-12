import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'

import { Eye, EyeOff } from 'lucide-react'

export const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      // Auth state listener in store will handle redirect/state update ideally, 
      // but we can manually push to dashboard for faster feel or rely on ProtectedRoute
      navigate('/dashboard')
    }
  }

  return (
    <div className="w-full max-w-sm space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Welcome back</h2>
        <p className="text-muted-foreground">
          Enter your email to sign in to your account
        </p>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        <div className="space-y-4">
            <Input
              type="email"
              label="Email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              className="h-11"
            />
            <div className="space-y-2">
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  label="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  className="h-11 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-[34px] text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              <div className="flex justify-end">
                <Link 
                  to="/forgot-password" 
                  className="text-sm font-medium text-blue-600 hover:text-blue-500 hover:underline transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
            </div>
        </div>
        
        {error && (
            <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-md font-medium">
                {error}
            </div>
        )}

        <Button type="submit" className="w-full h-11 text-base shadow-lg shadow-primary/20" isLoading={loading}>
          Sign In
        </Button>
      </form>
      
      <p className="px-8 text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{' '}
        <Link to="/signup" className="underline underline-offset-4 hover:text-primary font-medium text-foreground transition-colors">
          Sign up
        </Link>
      </p>
    </div>
  )
}
