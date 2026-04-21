import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/common/Button';
import { PlusCircle, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/common/Badge';
import { jobService } from '@/api';
import { toast } from 'react-hot-toast';

export default function EmployerDashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setIsLoading(true);
      const response = await jobService.getMyJobs();
      if (response.data.success) {
        setJobs(response.data.data);
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
    <div className="w-full max-w-[1600px] mx-auto p-2 md:p-0">
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 md:p-12 rounded-[2rem] md:rounded-[3rem] text-white mb-8 md:mb-10 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
        <h1 className="text-2xl md:text-4xl font-bold mb-2">Welcome, {user?.fullName}!</h1>
        <p className="text-blue-100 text-sm md:text-lg opacity-90 font-medium max-w-xl">Ready to find your next top talent from UPSA? Post jobs and manage applicants.</p>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <h2 className="text-xl md:text-2xl font-bold">My Job Postings</h2>
        <Button onClick={() => navigate('/dashboard/employer/post-job')} className="rounded-xl md:rounded-2xl flex gap-2 h-10 md:h-12 text-sm md:text-base">
          <PlusCircle className="h-4 w-4" />
          Post New Job
        </Button>
      </div>

      <div className="grid gap-4 md:gap-6">
        {jobs.length > 0 ? (
          jobs.map(job => (
            <div key={job.id} className="bg-background border rounded-[1.5rem] md:rounded-[2.5rem] p-6 md:p-8 flex flex-col sm:flex-row sm:items-center justify-between shadow-sm hover:shadow-md transition-all border-2 border-transparent hover:border-blue-100 gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                   <h3 className="text-lg md:text-xl font-bold">{job.title}</h3>
                   <Badge variant="success" className="text-[9px] h-4">Active</Badge>
                </div>
                <p className="text-xs md:text-sm text-muted-foreground">Posted on {new Date(job.createdAt).toLocaleDateString()}</p>
                <div className="mt-4 flex flex-wrap gap-1.5 md:gap-2">
                  {job.requiredSkills?.map((skill: string) => (
                    <Badge key={skill} variant="blue" className="text-[10px] rounded-md">{skill}</Badge>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 justify-end sm:justify-start pt-4 sm:pt-0 border-t sm:border-none">
                <Button variant="ghost" size="icon" onClick={() => handleDeleteJob(job.id)} className="rounded-xl text-muted-foreground hover:text-red-600 hover:bg-red-50 h-9 w-9 md:h-10 md:w-10">
                  <Trash2 className="h-4 w-4 md:h-5 md:w-5" />
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-16 md:py-20 bg-background rounded-[2rem] md:rounded-[3rem] border-2 border-dashed border-muted">
            <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
               <Briefcase className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground text-base md:text-lg italic px-6">
              {isLoading ? 'Loading job postings...' : 'You haven\'t posted any jobs yet. Start hiring today!'}
            </p>
            {!isLoading && (
              <Button onClick={() => navigate('/dashboard/employer/post-job')} variant="ghost" className="mt-4 text-blue-600 font-bold hover:bg-blue-50 rounded-xl">
                Post your first job
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const Briefcase = ({ className }: { className?: string }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
  </svg>
);
