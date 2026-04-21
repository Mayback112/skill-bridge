import React from 'react';
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { Settings, Star, ExternalLink, BookOpen, Briefcase, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { graduateService, courseService, jobService } from '@/api';
import { toast } from 'react-hot-toast';

export default function GraduateDashboardPage() {
  const { user, setUser } = useAuth();
  const [courses, setCourses] = useState<any[]>([]);
  const [recommendedJobs, setRecommendedJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user?.id) return;

      try {
        setIsLoading(true);
        // Fetch full profile to get skills
        const profileRes = await graduateService.getById(user.id);
        if (profileRes.data.success) {
          const graduateData = profileRes.data.data;
          setUser(graduateData);

          // Fetch recommended jobs based on matching algorithm in backend
          const jobsRes = await jobService.getRecommendations();
          if (jobsRes.data.success) {
            setRecommendedJobs(jobsRes.data.data);
          }

          // Fetch recommended courses based on skills
          const userSkills = graduateData.skills || [];
          if (userSkills.length > 0) {
            // Join skills to search for multiple tags
            const skillQuery = userSkills.map((s: any) => s.skillName).join(',');
            const courseRes = await courseService.getAll(skillQuery);
            if (courseRes.data.success && courseRes.data.data.length > 0) {
              setCourses(courseRes.data.data);
            } else {
              // Fallback to all if no specific matches
              const allRes = await courseService.getAll();
              setCourses(allRes.data.data);
            }
          } else {
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
    <div className="w-full max-w-[1600px] mx-auto">
      <div className="mb-6 md:mb-10">
        <h1 className="text-2xl md:text-3xl font-bold">Graduate Dashboard</h1>
        <p className="text-sm md:text-base text-muted-foreground">Manage your skills and discover opportunities.</p>
      </div>

      <div className="grid gap-6">
        {/* Profile Summary Card */}
        <div className="bg-background border-2 border-blue-600/10 rounded-[2rem] md:rounded-[3rem] p-6 md:p-10 flex flex-col md:flex-row items-center gap-6 md:gap-10 shadow-xl shadow-blue-600/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
          <div className="h-24 w-24 md:h-32 md:w-32 rounded-[2rem] md:rounded-[2.5rem] bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white text-3xl md:text-4xl font-bold shadow-lg ring-4 ring-blue-600/20">
            {user?.fullName?.charAt(0)}
          </div>
          <div className="text-center md:text-left relative z-10">
            <h2 className="text-2xl md:text-3xl font-black mb-1 md:mb-2 tracking-tight">{user?.fullName}</h2>
            <p className="text-blue-600 font-bold text-lg md:text-xl mb-4">{user?.headline || 'UPSA Graduate • Digital Professional'}</p>
            <div className="flex flex-wrap justify-center md:justify-start gap-2 md:gap-3">
              <Badge variant="success" className="px-3 md:px-4 py-1 rounded-lg md:rounded-xl border-2 border-green-500/20 text-[10px] md:text-xs">Verified Talent</Badge>
              <Badge variant="blue" className="px-3 md:px-4 py-1 rounded-lg md:rounded-xl border-2 border-blue-500/20 text-[10px] md:text-xs">Active Profile</Badge>
            </div>
          </div>
          <Link to={user?.id ? `/graduate/profile/${user.id}` : '#'} className="absolute top-4 right-4 md:top-8 md:right-8 text-blue-600 hover:scale-110 transition-transform bg-blue-50 p-2 rounded-xl">
            <Settings className="h-5 w-5 md:h-6 md:w-6" />
          </Link>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 md:gap-8 mt-2 md:mt-4">
          {/* Left Column - Skills */}
          <div className="xl:col-span-1 space-y-6 md:space-y-8">
            <div className="bg-background border-2 border-zinc-100 rounded-[2rem] md:rounded-[3rem] p-6 md:p-8 shadow-lg shadow-zinc-200/50">
              <div className="flex items-center justify-between mb-6 md:mb-8">
                <h3 className="text-lg md:text-xl font-bold">My Skills</h3>
                <div className="h-8 w-8 md:h-10 md:w-10 bg-blue-50 rounded-lg md:rounded-xl flex items-center justify-center text-blue-600">
                  <Star className="h-4 w-4 md:h-5 md:w-5 fill-current" />
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {user?.skills && user.skills.length > 0 ? (
                  user.skills.map((s: any) => (
                    <Badge key={s.id || s.skillName} variant="blue" className="px-3 md:px-4 py-1 md:py-1.5 rounded-lg md:rounded-xl text-xs md:text-sm">
                      {s.skillName}
                    </Badge>
                  ))
                ) : (
                  <div className="text-center w-full py-4">
                    <p className="text-muted-foreground italic text-sm mb-4">No skills added yet.</p>
                    <Link to={user?.id ? `/graduate/profile/${user.id}` : '#'}>
                      <Button variant="outline" size="sm" className="rounded-xl">Update Profile</Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Middle/Right Column - Recommendations */}
          <div className="xl:col-span-2 space-y-6 md:space-y-8">
            {/* Job Recommendations */}
            <div className="bg-background border-2 border-blue-600/10 rounded-[2rem] md:rounded-[3rem] p-6 md:p-10 shadow-xl shadow-blue-600/5">
              <div className="flex items-center justify-between mb-6 md:mb-8">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 md:h-10 md:w-10 bg-blue-600 rounded-lg md:rounded-xl flex items-center justify-center text-white">
                    <Briefcase className="h-4 w-4 md:h-5 md:w-5" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold">Jobs for You</h3>
                </div>
                <Sparkles className="h-4 w-4 md:h-5 md:w-5 text-blue-600 animate-pulse" />
              </div>
              
              <div className="space-y-4">
                {recommendedJobs.length > 0 ? (
                  recommendedJobs.slice(0, 3).map((job: any) => (
                    <div 
                      key={job.id} 
                      className="p-5 md:p-6 rounded-[1.5rem] md:rounded-[2rem] bg-muted/30 hover:bg-white hover:shadow-xl hover:shadow-blue-600/5 transition-all border border-transparent hover:border-blue-100 group"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                          <p className="font-black text-base md:text-lg group-hover:text-blue-600 transition-colors">{job.title}</p>
                          <p className="text-xs md:text-sm text-muted-foreground font-medium">{job.companyName}</p>
                          <div className="flex flex-wrap gap-2 mt-2 md:mt-3">
                            {job.requiredSkills?.slice(0, 3).map((s: string) => (
                              <span key={s} className="text-[9px] md:text-[10px] font-bold uppercase tracking-wider text-blue-600/70">{s}</span>
                            ))}
                          </div>
                        </div>
                        <Link to="/jobs" className="w-full md:w-auto">
                          <Button size="sm" className="w-full md:w-auto rounded-lg md:rounded-xl bg-blue-600 hover:bg-blue-700 text-xs md:text-sm">Apply Now</Button>
                        </Link>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center bg-muted/20 rounded-[1.5rem] md:rounded-[2rem] border-2 border-dashed border-muted">
                    <p className="text-muted-foreground italic px-6 text-sm">
                      {isLoading ? 'Finding the best matches...' : `No jobs found matching your specific skills (${user?.skills?.map((s:any) => s.skillName).join(', ')}).`}
                    </p>
                  </div>
                )}
                {recommendedJobs.length > 0 && (
                  <Link to="/jobs" className="block text-center text-xs md:text-sm font-bold text-blue-600 hover:underline mt-4 md:mt-6">
                    Explore all job opportunities
                  </Link>
                )}
              </div>
            </div>

            {/* Course Recommendations */}
            <div className="bg-background border-2 border-zinc-100 rounded-[2rem] md:rounded-[3rem] p-6 md:p-10 shadow-lg shadow-zinc-200/50">
              <div className="flex items-center justify-between mb-6 md:mb-8">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 md:h-10 md:w-10 bg-emerald-50 rounded-lg md:rounded-xl flex items-center justify-center text-emerald-600">
                    <BookOpen className="h-4 w-4 md:h-5 md:w-5" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold">Upskill Yourself</h3>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {courses.length > 0 ? (
                  courses.slice(0, 4).map((course: any) => (
                    <a 
                      key={course.id} 
                      href={course.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-4 md:p-5 rounded-2xl md:rounded-3xl bg-muted/50 hover:bg-emerald-50 hover:text-emerald-700 transition-all border border-transparent hover:border-emerald-200 group"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-bold text-xs md:text-sm leading-tight mb-2 line-clamp-2">{course.title}</p>
                          <Badge variant="outline" className="text-[9px] md:text-[10px] rounded-md md:rounded-lg bg-background group-hover:bg-emerald-100 group-hover:border-emerald-200">
                            {course.platform}
                          </Badge>
                        </div>
                        <ExternalLink className="h-3 w-3 mt-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                      </div>
                    </a>
                  ))
                ) : (
                  <div className="col-span-full py-8 text-center bg-muted/20 rounded-[1.5rem] md:rounded-[2rem] border-2 border-dashed border-muted">
                    <p className="text-muted-foreground italic px-6 text-sm">
                      {isLoading ? 'Loading learning resources...' : 'No specific courses found for your skills yet. Check back soon!'}
                    </p>
                  </div>
                )}
              </div>
              {courses.length > 0 && (
                <Link to="/graduate/courses" className="block text-center text-xs md:text-sm font-bold text-blue-600 hover:underline mt-6 md:mt-8">
                  Browse all learning resources
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
