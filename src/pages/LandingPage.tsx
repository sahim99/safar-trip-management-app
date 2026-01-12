import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Shield, Map, Users, Zap } from 'lucide-react'
import { useAuthStore } from '../store/authStore'

export const LandingPage = () => {
  const { session } = useAuthStore()

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-blue-500/30">
      {/* Background Gradient Mesh */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/20 blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/10 blur-[120px]" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-slate-950/50 backdrop-blur-xl">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Map className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight">SAFAR</span>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/login" className="text-sm font-medium text-slate-400 hover:text-white transition-colors hidden sm:block">
              Sign In
            </Link>
            <Link 
              to="/signup" 
              className="px-4 py-2 rounded-full bg-white text-slate-950 font-semibold text-sm hover:bg-blue-50 transition-all"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-12 md:pt-48 md:pb-20 px-6 overflow-hidden">
        <div className="container mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Private Beta Access
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-8 bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
            Command your <br />
            fleet with precision.
          </h1>
          
          <p className="text-lg md:text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
            The all-in-one operating system for car owners. Manage drivers, track trips, and streamline logistics with enterprise-grade tools.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300">
            <Link 
              to="/signup" 
              className="group relative w-full sm:w-auto px-8 py-4 rounded-full bg-blue-600 text-white font-semibold text-lg hover:bg-blue-500 transition-all shadow-[0_0_40px_-10px_rgba(37,99,235,0.5)] flex items-center justify-center gap-2"
            >
              Start Free Trial <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <div 
              className="group relative w-full sm:w-auto overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
            >
                <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2E8F0_0%,#0F172A_50%,#E2E8F0_100%)]" />
                <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-8 py-4 text-sm font-medium text-white backdrop-blur-3xl">
                    View Interactive Demo
                </span>
            </div>
          </div>
        </div>

        {/* Abstract Dashboard Mockup - Glassmorphism */}
      {/* Abstract Dashboard Mockup - Glassmorphism */}
      <div className="mt-16 md:mt-24 max-w-[320px] md:max-w-[380px] mx-auto relative z-10 animate-in fade-in zoom-in duration-1000 delay-500">
        <div className="relative">
            {/* Mobile Mockup - Centered */}
            <div className="rounded-[2.5rem] bg-slate-950 border-[8px] border-slate-900 shadow-2xl animate-float overflow-hidden z-20 relative">
                <img 
                  src="/safar-mobile-dashboard.png" 
                  alt="Safar Mobile App" 
                  className="w-full h-auto"
                />
                
                {/* Glossy Reflection Overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-transparent pointer-events-none rounded-[2rem]"></div>
            </div>

            {/* Floating Notification 1 - Left */}
            <div className="absolute top-[20%] -left-12 md:-left-24 bg-slate-800/90 backdrop-blur-md border border-white/10 p-4 rounded-2xl shadow-xl animate-float-delayed z-30 hidden md:flex items-center gap-3 max-w-[200px]">
                <div className="h-10 w-10 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
                    <Map className="h-5 w-5 text-green-400" />
                </div>
                <div>
                   <p className="text-xs text-slate-400">Trip Started</p>
                   <p className="text-sm font-bold text-white">Driver Arrived</p>
                </div>
            </div>

            {/* Floating Notification 2 - Right */}
            <div className="absolute bottom-[20%] -right-12 md:-right-24 bg-slate-800/90 backdrop-blur-md border border-white/10 p-4 rounded-2xl shadow-xl animate-float z-30 hidden md:flex items-center gap-3 max-w-[200px]">
                <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
                    <Shield className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                   <p className="text-xs text-slate-400">Security Check</p>
                   <p className="text-sm font-bold text-white">Verified</p>
                </div>
            </div>
            
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] bg-blue-600/20 blur-[100px] -z-10 rounded-full opacity-50"></div>
        </div>
      </div>
      </section>

      {/* Bento Grid Features */}
      <section id="features" className="py-20 relative z-10">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">Built for scale.</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">Everything you need to manage one car or one hundred, all in one cohesive platform.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
             {/* Feature 1 - Large */}
             <div className="md:col-span-2 min-h-[300px] rounded-3xl bg-slate-900/50 border border-white/10 p-8 flex flex-col relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                    <div className="h-12 w-12 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6 text-blue-400">
                        <Users className="h-6 w-6" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3">Driver Management</h3>
                    <p className="text-slate-400 max-w-md">Seamlessly manage profiles, documents, and schedules. Instant formatting for WhatsApp broadcasts.</p>
                </div>
                {/* Abstract Visual */}
                <div className="absolute right-0 bottom-0 w-1/2 h-full opacity-30">
                     <div className="absolute bottom-4 right-4 w-48 h-32 bg-white/5 rounded-lg border border-white/10 p-3 transform rotate-[-5deg] translate-y-8 translate-x-8">
                        <div className="flex gap-2 items-center mb-2 border-b border-white/5 pb-2">
                             <div className="h-6 w-6 rounded-full bg-white/10"></div>
                             <div className="h-2 w-20 bg-white/10 rounded"></div>
                        </div>
                     </div>
                </div>
             </div>

             {/* Feature 2 - Tall */}
             <div className="md:row-span-2 min-h-[300px] rounded-3xl bg-slate-900/50 border border-white/10 p-8 flex flex-col relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-b from-indigo-600/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                    <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-6 text-indigo-400">
                        <Zap className="h-6 w-6" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3">Instant Actions</h3>
                    <p className="text-slate-400 mb-8">One-tap utilities designed for mobile speed.</p>
                    
                    <div className="space-y-3">
                        {['Create Trip', 'Broadcast', 'Share Location', 'Expense Log'].map((item, i) => (
                            <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                <span className="text-sm font-medium">{item}</span>
                            </div>
                        ))}
                    </div>
                </div>
             </div>

             {/* Feature 3 - Small */}
             <div className="min-h-[300px] rounded-3xl bg-slate-900/50 border border-white/10 p-8 flex flex-col relative overflow-hidden group">
                 <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                 <div className="relative z-10">
                    <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-6 text-emerald-400">
                        <Map className="h-6 w-6" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3">Live Tracking</h3>
                    <p className="text-slate-400">Real-time location updates and trip history logging.</p>
                 </div>
             </div>

             {/* Feature 4 - Single Column (moved to middle) */}
             <div className="min-h-[300px] rounded-3xl bg-slate-900/50 border border-white/10 p-8 flex flex-col relative overflow-hidden group">
                 <div className="absolute inset-0 bg-gradient-to-tr from-purple-600/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                 <div className="relative z-10">
                    <div className="h-12 w-12 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-6 text-purple-400">
                        <Shield className="h-6 w-6" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3">Enterprise Security</h3>
                    <p className="text-slate-400">Your data is encrypted and isolated. We process millions of data points with zero compromise.</p>
                 </div>
             </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 border-y border-white/5 bg-slate-900/20">
         <div className="container mx-auto px-6 text-center">
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-10">Trusted by industry leaders in logistics</p>
            <div className="flex flex-wrap justify-center gap-x-16 gap-y-10">
                {['UrbanFleet', 'MetroCab', 'RapidGo', 'CityDrive', 'LogiTech'].map((brand, i) => (
                    <span key={i} className="text-2xl font-bold text-slate-700">{brand}</span>
                ))}
            </div>
         </div>
      </section>
      
      {/* CTA */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
             <img src="/safar-landscape.png" alt="Scenic Road" className="w-full h-full object-cover opacity-20" />
             <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-900/80 to-slate-950"></div>
        </div>
        <div className="container mx-auto px-6 text-center relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-8">Ready to modernize?</h2>
            <Link 
              to="/signup" 
              className="inline-flex h-14 items-center justify-center rounded-full bg-white text-slate-950 px-10 text-lg font-bold hover:bg-slate-200 transition-colors"
            >
              Get Started Now
            </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 border-t border-white/5 bg-slate-950 text-slate-400 text-sm">
        <div className="container mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12">
           <div className="col-span-2 md:col-span-1">
             <div className="flex items-center gap-2 mb-6">
                <div className="h-6 w-6 rounded bg-blue-600 flex items-center justify-center">
                   <Map className="h-3 w-3 text-white" />
                </div>
                <span className="text-white font-bold text-lg">SAFAR</span>
             </div>
             <p className="mb-6">Making travel logistics simple, efficient, and beautiful.</p>
           </div>
           
           <div>
              <h4 className="text-white font-bold mb-4">Product</h4>
              <ul className="space-y-3">
                 <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                 <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                 <li><a href="#" className="hover:text-white transition-colors">Changelog</a></li>
              </ul>
           </div>
           
           <div>
              <h4 className="text-white font-bold mb-4">Company</h4>
              <ul className="space-y-3">
                 <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                 <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                 <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
           </div>
           
           <div>
              <h4 className="text-white font-bold mb-4">Legal</h4>
              <ul className="space-y-3">
                 <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                 <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
              </ul>
           </div>
        </div>
      </footer>
    </div>
  )
}
