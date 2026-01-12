import React from 'react'
import { Outlet, Link } from 'react-router-dom'
import { Map, Zap, ShieldCheck } from 'lucide-react'

export const AuthLayout = () => {
  return (
    <div className="flex h-screen w-full bg-background overflow-hidden relative">
      {/* Left: Decorative Side (Hidden on mobile) */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 text-white relative items-center justify-center p-12 overflow-hidden">
        {/* Background Gradient & Blobs */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900"></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="relative z-10 max-w-lg space-y-10">
          <Link to="/" className="flex items-center gap-3 text-white/90 hover:text-white transition-colors group">
            <div className="h-10 w-10 rounded-xl bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center group-hover:bg-white/20 transition-all">
              <Map className="h-5 w-5" />
            </div>
            <span className="text-2xl font-bold tracking-tight">SAFAR</span>
          </Link>
          
          <div className="space-y-6">
            <h1 className="text-4xl font-bold leading-tight">
              Manage your fleet with <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">confidence and ease.</span>
            </h1>
            <p className="text-lg text-slate-400 leading-relaxed">
              Join thousands of car owners who trust Safar to track trips, manage drivers, and simplify their daily logistics operations.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6 pt-8 border-t border-white/10">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-blue-400 font-medium">
                <Zap className="h-4 w-4" />
                <span>Instant Tracking</span>
              </div>
              <p className="text-sm text-slate-500">Real-time updates on all your active trips.</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-blue-400 font-medium">
                <ShieldCheck className="h-4 w-4" />
                <span>Secure Data</span>
              </div>
              <p className="text-sm text-slate-500">Enterprise-grade encryption for your privacy.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Form Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 relative">
          <div className="absolute top-6 left-6 lg:hidden">
            <Link to="/" className="flex items-center gap-2 font-bold">
               <Map className="h-6 w-6 text-primary" />
               SAFAR
            </Link>
          </div>
          <Outlet />
      </div>
    </div>
  )
}
