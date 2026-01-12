import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'

export const SignupPage = () => {
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // 1. Sign up user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            phone: phone,
          }
        }
      })

      if (authError) throw authError
      
      if (authData.user) {
        // Owner record is created automatically via database trigger
        navigate('/dashboard')
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during signup')
    } finally {
        setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-sm space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Create an account</h2>
        <p className="text-muted-foreground">
          Enter your details below to create your owner account
        </p>
      </div>

      <form onSubmit={handleSignup} className="space-y-4">
        <div className="space-y-4">
            <Input
              label="Full Name"
              placeholder="John Doe"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              disabled={loading}
              className="h-11"
            />
            
            <Input
              type="tel"
              label="Phone Number"
              placeholder="+1 234 567 890"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              disabled={loading}
              className="h-11"
            />

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
            <Input
              type="password"
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              className="h-11"
            />
        </div>

        {error && (
            <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-md font-medium">
                {error}
            </div>
        )}
        
        <Button type="submit" className="w-full h-11 text-base shadow-lg shadow-primary/20" isLoading={loading}>
          Create Account
        </Button>
      </form>
      
      <p className="px-8 text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link to="/login" className="underline underline-offset-4 hover:text-primary font-medium text-foreground transition-colors">
          Sign in
        </Link>
      </p>
    </div>
  )
}
