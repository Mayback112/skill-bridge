import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/common/Button';
import { GraduationCap, LogOut, Layout, Users, PlusCircle, Settings, Trash2, Edit } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Badge } from '@/components/common/Badge';

export default function EmployerDashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const MOCK_MY_JOBS = [
    { id: '1', title: 'Frontend Developer', applicants: 12, date: '2 days ago' },
    { id: '2', title: 'Data Scientist', applicants: 5, date: '1 week ago' },
  ];

  return (
    <div className="min-h-screen bg-muted/20 flex flex-col">
      <nav className="h-16 border-b bg-background px-6 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <GraduationCap className="h-6 w-6 text-blue-600" />
          <span className="font-bold uppercase tracking-wider">SkillBridge Employer</span>
        </div>
        <div className="flex items-center gap-4">
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
            {MOCK_MY_JOBS.map(job => (
              <div key={job.id} className="bg-background border rounded-[2.5rem] p-8 flex items-center justify-between shadow-sm hover:shadow-md transition-all border-2 border-transparent hover:border-blue-100">
                <div>
                  <h3 className="text-xl font-bold mb-1">{job.title}</h3>
                  <p className="text-sm text-muted-foreground">Posted {job.date}</p>
                  <div className="mt-4 flex items-center gap-2">
                    <Badge variant="blue">{job.applicants} Applicants</Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" className="rounded-xl text-muted-foreground hover:text-blue-600">
                    <Edit className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="rounded-xl text-muted-foreground hover:text-red-600">
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
