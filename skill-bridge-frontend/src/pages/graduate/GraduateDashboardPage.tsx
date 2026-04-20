import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { GraduationCap, LogOut, Layout, User, BookOpen, Settings, Star, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { graduateService, courseService } from '@/api';
import { toast } from 'react-hot-toast';

export default function GraduateDashboardPage() {
  const { user, logout, setUser } = useAuth();
  const [courses, setCourses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user?.id) return;

      try {
        setIsLoading(true);
        // Fetch full profile to get skills
        const profileRes = await graduateService.getById(user.id);
        if (profileRes.data.success) {
          setUser(profileRes.data.data);

          // Fetch recommended courses based on first few skills
          const userSkills = profileRes.data.data.skills || [];
          if (userSkills.length > 0) {
            // Just use the first skill for now for recommendations
            const courseRes = await courseService.getAll(userSkills[0].skillName);
            if (courseRes.data.success) {
              setCourses(courseRes.data.data);
            }
          } else {
            // Fallback to all courses if no skills
            const courseRes = await courseService.getAll();
            if (courseRes.data.success) {
              setCourses(courseRes.data.data);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [user?.id]);
  return (
    <div className="min-h-screen bg-muted/20 flex flex-col font-sans">
      {/* Dashboard Navbar */}
      <nav className="h-16 border-b bg-background px-6 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <GraduationCap className="h-6 w-6 text-blue-600" />
          <span className="font-bold">SKILLBRIDGE</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium hidden sm:inline-block">{user?.fullName}</span>
          <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold border-2 border-blue-600">
            {user?.fullName?.charAt(0)}
          </div>
          <Button variant="ghost" size="icon" onClick={logout} className="rounded-xl">
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </nav>

      <div className="flex-1 flex">
        {/* Sidebar */}
        <aside className="w-64 border-r bg-background hidden md:flex flex-col p-4 gap-2">
          <Link to="/dashboard/graduate" className="flex items-center gap-3 px-4 py-3 bg-blue-50 text-blue-600 rounded-2xl font-medium transition-all">
            <Layout className="h-5 w-5" />
            <span>Dashboard</span>
          </Link>
          <Link to={`/graduates/${user?.id}`} className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-muted rounded-2xl font-medium transition-all">
            <User className="h-5 w-5" />
            <span>Profile</span>
          </Link>
          <Link to="/courses" className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-muted rounded-2xl font-medium transition-all">
            <BookOpen className="h-5 w-5" />
            <span>Courses</span>
          </Link>
          <Link to="/settings" className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-muted rounded-2xl font-medium transition-all">
            <Settings className="h-5 w-5" />
            <span>Settings</span>
          </Link>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 md:p-10 max-w-5xl">
          <div className="mb-10">
            <h1 className="text-3xl font-bold">Graduate Dashboard</h1>
            <p className="text-muted-foreground">Manage your skills and discover opportunities.</p>
          </div>

          <div className="grid gap-6">
            {/* Profile Summary Card */}
            <div className="bg-background border-2 border-blue-600/10 rounded-[3rem] p-10 flex flex-col md:flex-row items-center gap-10 shadow-xl shadow-blue-600/5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
              <div className="h-32 w-32 rounded-[2.5rem] bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white text-4xl font-bold shadow-lg ring-4 ring-blue-600/20">
                {user?.fullName?.charAt(0)}
              </div>
              <div className="text-center md:text-left relative z-10">
                <h2 className="text-3xl font-black mb-2 tracking-tight">{user?.fullName}</h2>
                <p className="text-blue-600 font-bold text-xl mb-4">{user?.headline || 'UPSA Graduate • Digital Professional'}</p>
                <div className="flex flex-wrap justify-center md:justify-start gap-3">
                  <Badge variant="success" className="px-4 py-1.5 rounded-xl border-2 border-green-500/20">Verified Talent</Badge>
                  <Badge variant="blue" className="px-4 py-1.5 rounded-xl border-2 border-blue-500/20">Active Profile</Badge>
                </div>
              </div>
              <Link to="/onboarding/method" className="absolute top-8 right-8 text-blue-600 hover:scale-110 transition-transform bg-blue-50 p-2 rounded-xl">
                <Settings className="h-6 w-6" />
              </Link>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mt-4">
              {/* My Skills Section */}
              <div className="bg-background border-2 border-zinc-100 rounded-[3rem] p-10 shadow-lg shadow-zinc-200/50">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-bold">My Skills</h3>
                  <div className="h-10 w-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                    <Star className="h-5 w-5 fill-current" />
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  {user?.skills && user.skills.length > 0 ? (
                    user.skills.map((s: any) => (
                      <Badge key={s.id || s.skillName} variant="blue" className="px-5 py-2 rounded-2xl text-base">
                        {s.skillName}
                      </Badge>
                    ))
                  ) : (
                    <div className="text-center w-full py-4">
                      <p className="text-muted-foreground italic text-lg mb-4">No skills added yet.</p>
                      <Link to="/onboarding/method">
                        <Button variant="outline" className="rounded-2xl">Complete Profile</Button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>

              {/* Recommended Courses Section */}
              <div className="bg-background border-2 border-zinc-100 rounded-[3rem] p-10 shadow-lg shadow-zinc-200/50">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-bold">Recommended</h3>
                  <div className="h-10 w-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                    <BookOpen className="h-5 w-5" />
                  </div>
                </div>
                <div className="space-y-4">
                  {courses.length > 0 ? (
                    courses.slice(0, 3).map((course: any) => (
                      <a 
                        key={course.id} 
                        href={course.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-4 rounded-2xl bg-muted/50 hover:bg-emerald-50 hover:text-emerald-700 transition-all border border-transparent hover:border-emerald-200 group"
                      >
                        <div>
                          <p className="font-bold">{course.title}</p>
                          <p className="text-xs text-muted-foreground group-hover:text-emerald-600">{course.platform} • {course.skillTag}</p>
                        </div>
                        <ExternalLink className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    ))
                  ) : (
                    <p className="text-muted-foreground italic text-lg leading-relaxed">
                      {isLoading ? 'Loading suggestions...' : 'Courses will be suggested here based on your skill gaps.'}
                    </p>
                  )}
                  {courses.length > 0 && (
                    <Link to="/courses" className="block text-center text-sm font-bold text-blue-600 hover:underline mt-4">
                      View all resources
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
