import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Linkedin, UserPen, GraduationCap, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { graduateService } from '@/api';

export default function OnboardingMethodPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await graduateService.checkProfileStatus();
        if (res.data.data) {
          navigate('/graduate/dashboard');        }
      } catch (err) {
        console.error("Failed to check status", err);
      }
    };
    checkStatus();
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 flex items-center justify-center p-6 bg-muted/20">
        <div className="w-full max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold mb-4">Set up your profile</h1>
            <p className="text-xl text-muted-foreground mb-12">How would you like to get started?</p>

            <div className="grid md:grid-cols-2 gap-6">
              <button
                onClick={() => navigate('/onboarding/linkedin')}
                className="group p-10 bg-background border-2 border-transparent hover:border-blue-600 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all text-left flex flex-col items-center md:items-start text-center md:text-left"
              >
                <div className="h-16 w-16 bg-blue-100 rounded-3xl flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform">
                  <Linkedin className="h-8 w-8 fill-current" />
                </div>
                <h3 className="text-2xl font-bold mb-3">LinkedIn</h3>
                <p className="text-muted-foreground mb-6">Import your professional details from your LinkedIn profile PDF.</p>
                <div className="mt-auto flex items-center gap-2 text-blue-600 font-bold group-hover:translate-x-1 transition-transform">
                  <span>Use LinkedIn</span>
                  <ChevronRight className="h-5 w-5" />
                </div>
              </button>

              <button
                onClick={() => navigate('/onboarding/manual')}
                className="group p-10 bg-background border-2 border-transparent hover:border-blue-600 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all text-left flex flex-col items-center md:items-start text-center md:text-left"
              >
                <div className="h-16 w-16 bg-zinc-100 rounded-3xl flex items-center justify-center text-zinc-600 mb-6 group-hover:scale-110 transition-transform">
                  <UserPen className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Manual Fill</h3>
                <p className="text-muted-foreground mb-6">Type in your education, skills, and work experience manually.</p>
                <div className="mt-auto flex items-center gap-2 text-zinc-600 font-bold group-hover:translate-x-1 transition-transform">
                  <span>Start Manual</span>
                  <ChevronRight className="h-5 w-5" />
                </div>
              </button>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
