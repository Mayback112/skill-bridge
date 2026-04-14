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
        <section className="py-20 px-6 max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
              Connect Skills With <br />
              <span className="text-blue-600">Opportunity</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              The premier digital skills portal connecting UPSA graduates with forward-thinking employers.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/auth/graduate/register">
                <Button size="lg" className="rounded-2xl w-full sm:w-auto">I'm a Graduate</Button>
              </Link>
              <Link to="/auth/employer/login">
                <Button variant="secondary" size="lg" className="rounded-2xl w-full sm:w-auto">I'm an Employer</Button>
              </Link>
            </div>
          </motion.div>
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
