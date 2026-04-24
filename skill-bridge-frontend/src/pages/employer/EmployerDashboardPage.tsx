import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/common/Button';
import { PlusCircle, Trash2, Users, ChevronRight, Mail, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/common/Badge';
import { jobService } from '@/api';
import { toast } from 'react-hot-toast';
import { Modal } from '@/components/common/Modal';

export default function EmployerDashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [isLoadingApps, setIsLoadingApps] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const handleViewApplications = async (job: any) => {
    setSelectedJob(job);
    setIsModalOpen(true);
    setIsLoadingApps(true);
    try {
      const response = await jobService.getApplications(job.id);
      if (response.data.success) {
        setApplications(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error('Failed to load applications');
    } finally {
      setIsLoadingApps(false);
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
      {/* Hero Image Section */}
      <div className="relative mb-8 md:mb-10 rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-xl">
        <img
          src="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop"
          alt="Business professionals collaborating and hiring"
          className="w-full h-48 md:h-64 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/80 via-indigo-900/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
          <h1 className="text-2xl md:text-4xl font-bold text-white mb-2">Welcome, {user?.fullName}!</h1>
          <p className="text-sm md:text-base text-indigo-100">Ready to find your next top talent from UPSA? Post jobs and manage applicants.</p>
        </div>
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
              <div className="flex-1">
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
              
              <div className="flex items-center gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => handleViewApplications(job)}
                  className="rounded-xl md:rounded-2xl flex gap-2 h-10 md:h-12 text-sm px-6"
                >
                  <Users className="h-4 w-4" />
                  View Applicants
                </Button>
                
                <Button variant="ghost" size="icon" onClick={() => handleDeleteJob(job.id)} className="rounded-xl text-muted-foreground hover:text-red-600 hover:bg-red-50 h-9 w-9 md:h-12 md:w-12">
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

      {/* Applications Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={`Applicants for ${selectedJob?.title}`}
      >
        <div className="py-4">
          <p className="text-sm text-muted-foreground mb-4">Manage {applications.length} applications for this position.</p>
          {isLoadingApps ? (
            <div className="py-10 text-center text-muted-foreground">Loading applicants...</div>
          ) : applications.length > 0 ? (
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
              {applications.map((app) => (
                <div key={app.id} className="border rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full overflow-hidden border bg-muted">
                      {app.graduateProfilePicture ? (
                        <img src={app.graduateProfilePicture} alt={app.graduateFullName} className="h-full w-full object-cover" />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-indigo-600 font-bold text-lg">
                          {app.graduateFullName.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-base">{app.graduateFullName}</h4>
                      <p className="text-xs text-muted-foreground line-clamp-1">{app.graduateHeadline || 'UPSA Graduate'}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Mail className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{app.graduateEmail}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => navigate(`/graduates/${app.graduateId}?applicationId=${app.id}`)}
                      className="text-xs h-9 rounded-xl flex gap-1.5"
                    >
                      View Profile
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                    <Badge variant={app.status === 'ACCEPTED' ? 'success' : app.status === 'REJECTED' ? 'error' : app.status === 'REVIEWED' ? 'blue' : 'secondary'} className="text-[10px] rounded-lg">
                      {app.status === 'REVIEWED' ? 'SEEN' : app.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-10 text-center text-muted-foreground italic">
              No applications yet for this position.
            </div>
          )}
        </div>
        <div className="flex justify-end pt-4">
          <Button onClick={() => setIsModalOpen(false)} variant="outline" className="rounded-xl px-8">Close</Button>
        </div>
      </Modal>
    </div>
  );
}

const Briefcase = ({ className }: { className?: string }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
  </svg>
);
