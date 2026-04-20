import { Button } from '@/components/common/Button'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { GraduationCap, Briefcase, Search, ArrowRight } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 h-20 border-b bg-background/95 backdrop-blur sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-2 rounded-xl">
            <GraduationCap className="text-white h-6 w-6" />
          </div>
          <span className="text-xl font-bold tracking-tight">SKILLBRIDGE GH</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link to="/graduates" className="hover:text-blue-600 transition-colors">Graduates</Link>
          <Link to="/jobs" className="hover:text-blue-600 transition-colors">Jobs</Link>
        </div>
        <Link to="/auth/graduate/login">
          <Button variant="outline" className="rounded-2xl">Login</Button>
        </Link>
      </nav>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-12 md:py-24 px-6 max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="text-left"
            >
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-[1.1]">
                Connect Skills With <br />
                <span className="text-blue-600">Opportunity</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mb-10 leading-relaxed">
                The premier digital skills portal connecting UPSA graduates with forward-thinking employers. Bridge the gap between education and your dream career.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <Link to="/auth/graduate/register" className="w-full sm:w-auto">
                  <Button size="lg" className="rounded-2xl w-full px-8 h-12 text-base">I'm a Graduate</Button>
                </Link>
                <Link to="/auth/employer/login" className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" className="rounded-2xl w-full px-8 h-12 text-base border-2">I'm an Employer</Button>
                </Link>
              </div>
              
              <div className="mt-12 flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-background bg-muted flex items-center justify-center overflow-hidden">
                      <img 
                        src={`https://i.pravatar.cc/150?u=${i + 10}`} 
                        alt="User" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
                <p>Join <span className="font-bold text-foreground">500+</span> graduates already hired</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="absolute -inset-4 bg-blue-600/10 rounded-[2rem] blur-2xl -z-10 animate-pulse" />
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-8 border-background">
                <img 
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop" 
                  alt="Students collaborating" 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                      <Briefcase className="text-white h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm">New Job Posted</p>
                      <p className="text-white/70 text-xs">Software Developer • Accra</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-blue-600/10 rounded-full blur-xl" />
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-600/5 rounded-full blur-xl" />
            </motion.div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-20 bg-muted/30">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-16">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-12">
              {[
                {
                  icon: <GraduationCap className="h-10 w-10 text-blue-600" />,
                  title: "Graduate Lists Skills",
                  desc: "Showcase your UPSA education and digital expertise."
                },
                {
                  icon: <Search className="h-10 w-10 text-blue-600" />,
                  title: "Employer Searches",
                  desc: "Find pre-verified talent with specific skill sets."
                },
                {
                  icon: <Briefcase className="h-10 w-10 text-blue-600" />,
                  title: "Opportunity Found",
                  desc: "Connect directly and build the future together."
                }
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center text-center">
                  <div className="mb-6 p-4 bg-background rounded-3xl shadow-sm border">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-12 px-6 bg-background">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-1 rounded-lg">
              <GraduationCap className="text-white h-4 w-4" />
            </div>
            <span className="font-bold">SKILLBRIDGE GH</span>
          </div>
          <p className="text-sm text-muted-foreground">© 2026 SKILLBRIDGE GH. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
