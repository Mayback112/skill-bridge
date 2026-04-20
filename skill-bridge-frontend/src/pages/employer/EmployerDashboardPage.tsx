import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/common/Button';
import { GraduationCap, LogOut, Layout, Users, PlusCircle, Settings, Trash2, Edit } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Badge } from '@/components/common/Badge';
import { jobService } from '@/api';
import { toast } from 'react-hot-toast';

export default function EmployerDashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setIsLoading(true);
      const response = await jobService.getAll();
      // Filter jobs by current employer (simplified for now, usually backend handles this if we had a specific endpoint)
      if (response.data.success) {
        const myJobs = response.data.data.filter((j: any) => j.employerId === user?.id);
        setJobs(myJobs);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast.error('Failed to load job postings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteJob = async (id: string) => {
    if (!confirm('Are you sure you want to delete this job posting?')) return;
    
    try {
      await jobService.delete(id);
      toast.success('Job deleted successfully');
      setJobs(jobs.filter(j => j.id !== id));
    } catch (error) {
      toast.error('Failed to delete job');
    }
  };

  return (
    <div className="min-h-screen bg-muted/20 flex flex-col">
      <nav className="h-16 border-b bg-background px-6 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <GraduationCap className="h-6 w-6 text-blue-600" />
          <span className="font-bold uppercase tracking-wider">SkillBridge Employer</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium mr-2">{user?.fullName}</span>
          <Button variant="ghost" size="icon" onClick={logout} className="rounded-xl">
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </nav>

      <div className="flex-1 flex">
        <aside className="w-64 border-r bg-background hidden md:flex flex-col p-4 gap-2">
          <Link to="/dashboard/employer" className="flex items-center gap-3 px-4 py-3 bg-blue-50 text-blue-600 rounded-2xl font-medium transition-all">
            <Layout className="h-5 w-5" />
            <span>Dashboard</span>
          </Link>
          <Link to="/graduates" className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-muted rounded-2xl font-medium transition-all">
            <Users className="h-5 w-5" />
            <span>Browse Graduates</span>
          </Link>
          <Link to="/dashboard/employer/post-job" className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-muted rounded-2xl font-medium transition-all">
            <PlusCircle className="h-5 w-5" />
            <span>Post a Job</span>
          </Link>
        </aside>

        <main className="flex-1 p-6 md:p-10 max-w-5xl mx-auto w-full">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-12 rounded-[3rem] text-white mb-10 shadow-xl">
            <h1 className="text-4xl font-bold mb-2">Welcome, {user?.fullName}!</h1>
            <p className="text-blue-100 text-lg opacity-90 font-medium">Ready to find your next top talent from UPSA?</p>
          </div>

          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">My Job Postings</h2>
            <Button onClick={() => navigate('/dashboard/employer/post-job')} className="rounded-2xl flex gap-2">
              <PlusCircle className="h-4 w-4" />
              Post New Job
            </Button>
          </div>

          <div className="grid gap-6">
            {jobs.length > 0 ? (
              jobs.map(job => (
                <div key={job.id} className="bg-background border rounded-[2.5rem] p-8 flex items-center justify-between shadow-sm hover:shadow-md transition-all border-2 border-transparent hover:border-blue-100">
                  <div>
                    <h3 className="text-xl font-bold mb-1">{job.title}</h3>
                    <p className="text-sm text-muted-foreground">Posted on {new Date(job.createdAt).toLocaleDateString()}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {job.requiredSkills?.map((skill: string) => (
                        <Badge key={skill} variant="blue">{skill}</Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteJob(job.id)} className="rounded-xl text-muted-foreground hover:text-red-600">
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-20 bg-background rounded-[3rem] border border-dashed">
                <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground text-lg italic">
                  {isLoading ? 'Loading job postings...' : 'You haven\'t posted any jobs yet.'}
                </p>
                {!isLoading && (
                  <Button onClick={() => navigate('/dashboard/employer/post-job')} variant="ghost" className="mt-2 text-blue-600 font-bold">
                    Post your first job
                  </Button>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

const Briefcase = ({ className }: { className?: string }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
  </svg>
);
