import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, Camera, Plus, X, Briefcase, Award, Star, User, FileText, Wrench, Save, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Badge } from '@/components/common/Badge';
import { toast } from 'react-hot-toast';
import { graduateService } from '@/api';
import { useAuth } from '@/hooks/useAuth';

export default function GraduateEditProfilePage() {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();

  const [fullName, setFullName] = useState('');
  const [headline, setHeadline] = useState('');
  const [bio, setBio] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  
  const [skills, setSkills] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [educations, setEducations] = useState<any[]>([]);
  const [workExperiences, setWorkExperiences] = useState<any[]>([]);
  const [certifications, setCertifications] = useState<any[]>([]);

  const [newSkill, setNewSkill] = useState('');
  const [newJob, setNewJob] = useState('');

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.id) return;
      try {
        setIsLoading(true);
        const res = await graduateService.getById(user.id);
        if (res.data.success) {
          const data = res.data.data;
          setFullName(data.fullName || '');
          setHeadline(data.headline || '');
          setBio(data.bio || '');
          setLinkedinUrl(data.linkedInUrl || '');
          setProfilePicture(data.profilePicture || '');
          setSkills(data.skills || []);
          
          // Map backend jobs to expected format
          setJobs(data.jobsCanDo?.map((j: string) => ({ jobTitle: j })) || []);
          
          setEducations(data.educations || []);
          setWorkExperiences(data.workExperiences || []);
          setCertifications(data.certifications || []);
        }
      } catch (err) {
        console.error("Failed to fetch profile", err);
        toast.error("Failed to load profile data");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [user?.id]);

  const addSkill = () => {
    if (newSkill && !skills.some(s => s.skillName.toLowerCase() === newSkill.toLowerCase())) {
      setSkills([...skills, { skillName: newSkill, proficiencyLevel: 'INTERMEDIATE' }]);
      setNewSkill('');
    }
  };

  const removeSkill = (skillName: string) => {
    setSkills(skills.filter(s => s.skillName !== skillName));
  };

  const addJob = () => {
    if (newJob && !jobs.some(j => j.jobTitle.toLowerCase() === newJob.toLowerCase())) {
      setJobs([...jobs, { jobTitle: newJob }]);
      setNewJob('');
    }
  };

  const removeJob = (jobTitle: string) => {
    setJobs(jobs.filter(j => j.jobTitle !== jobTitle));
  };

  const handleSubmit = async () => {
    if (skills.length === 0 || jobs.length === 0) {
      toast.error('At least 1 skill and 1 job role are required');
      return;
    }

    if (!user?.id) {
      toast.error('User not authenticated');
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        fullName,
        headline,
        bio,
        linkedinUrl,
        profilePicture,
        skills,
        jobsCanDo: jobs,
        educations,
        workExperiences,
        certifications
      };

      const response = await graduateService.updateProfile(user.id, payload);
      
      if (response.data.success) {
        setUser(response.data.data);
        toast.success('Profile updated successfully!');
        navigate('/graduate/dashboard');
      }
    } catch (error: any) {
      console.error('Update Profile Error:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading profile...</div>;
  }

  return (
    <div className="w-full font-sans max-w-[1600px] mx-auto p-2 md:p-0">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 md:mb-10 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Edit Profile</h1>
          <p className="text-muted-foreground text-base md:text-lg">Keep your professional information up to date.</p>
        </div>
        <div className="flex gap-2 md:gap-4">
          <Link to="/graduate/dashboard" className="flex-1 md:flex-none">
            <Button variant="outline" className="w-full rounded-xl md:rounded-2xl flex gap-2 h-10 md:h-12 text-sm md:text-base">
              <ArrowLeft className="h-4 w-4" /> Cancel
            </Button>
          </Link>
          <Button className="flex-1 md:flex-none rounded-xl md:rounded-2xl flex gap-2 h-10 md:h-12 text-sm md:text-base" onClick={handleSubmit} isLoading={isSaving}>
            <Save className="h-4 w-4" /> Save
          </Button>
        </div>
      </div>

      <main className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
        {/* Left Columns - Form */}
        <div className="lg:col-span-2 space-y-8 md:space-y-12">
          <section className="bg-background p-6 md:p-10 rounded-[1.5rem] md:rounded-[2.5rem] border-2 border-zinc-100 shadow-lg shadow-zinc-200/50">
            <h2 className="text-xl md:text-2xl font-bold mb-6 md:mb-8 flex items-center gap-3">
              <Camera className="h-5 w-5 md:h-6 md:w-6 text-blue-600" /> Profile Picture
            </h2>
            <div className="flex flex-col sm:flex-row items-center gap-6 md:gap-8">
              <div className="h-28 w-28 md:h-32 md:w-32 rounded-[1.5rem] md:rounded-[2.5rem] bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white text-2xl md:text-3xl font-bold shadow-lg overflow-hidden shrink-0">
                {profilePicture ? (
                   <img src={profilePicture} alt="Profile" className="h-full w-full object-cover" />
                ) : (
                  fullName.charAt(0) || user?.fullName?.charAt(0)
                )}
              </div>
              <div className="flex flex-col gap-2 w-full sm:w-auto">
                <Button variant="outline" className="rounded-xl md:rounded-2xl h-10">Change Image</Button>
                <span className="text-[10px] md:text-xs text-muted-foreground text-center">URL implementation pending</span>
              </div>
            </div>
          </section>

          <section className="bg-background p-6 md:p-10 rounded-[1.5rem] md:rounded-[2.5rem] border-2 border-zinc-100 shadow-lg shadow-zinc-200/50">
            <h2 className="text-xl md:text-2xl font-bold mb-6 md:mb-8 flex items-center gap-3">
              <User className="h-5 w-5 md:h-6 md:w-6 text-blue-600" /> Basic Info
            </h2>
            <div className="space-y-4 md:space-y-6">
              <Input 
                label="Full Name" 
                placeholder="John Doe" 
                value={fullName} 
                onChange={(e) => setFullName(e.target.value)}
                className="rounded-xl h-10 md:h-12"
              />
              <Input 
                label="Headline" 
                placeholder="Professional title" 
                value={headline} 
                onChange={(e) => setHeadline(e.target.value)}
                className="rounded-xl h-10 md:h-12"
              />
              <Input 
                label="LinkedIn URL" 
                placeholder="https://linkedin.com/in/yourname" 
                value={linkedinUrl} 
                onChange={(e) => setLinkedinUrl(e.target.value)}
                className="rounded-xl h-10 md:h-12"
              />
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Bio / About</label>
                <textarea 
                  className="w-full rounded-2xl md:rounded-3xl border-2 border-zinc-100 bg-background px-4 md:px-6 py-3 md:py-4 min-h-[120px] md:min-h-[150px] focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition-all text-sm md:text-base"
                  placeholder="Tell us about yourself"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />
              </div>
            </div>
          </section>

          <section className="bg-background p-6 md:p-10 rounded-[1.5rem] md:rounded-[2.5rem] border-2 border-zinc-100 shadow-lg shadow-zinc-200/50">
            <h2 className="text-xl md:text-2xl font-bold mb-6 md:mb-8 flex items-center gap-3">
              <Wrench className="h-5 w-5 md:h-6 md:w-6 text-blue-600" /> Skills
            </h2>
            <div className="flex gap-2 md:gap-3 mb-6">
              <Input 
                placeholder="Add skill..." 
                value={newSkill} 
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addSkill()}
                className="rounded-xl h-10 md:h-12"
              />
              <Button onClick={addSkill} variant="secondary" className="rounded-xl md:rounded-2xl h-10 md:h-12 w-10 md:w-12 p-0 shrink-0">
                <Plus className="h-5 w-5" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 md:gap-3">
              {skills.map(skill => (
                <Badge key={skill.skillName} variant="blue" className="px-3 md:px-5 py-1.5 md:py-2.5 text-xs md:text-base flex items-center gap-2 rounded-lg md:rounded-2xl border-2 border-blue-100">
                  {skill.skillName}
                  <X className="h-3.5 w-3.5 md:h-4 md:w-4 cursor-pointer hover:text-red-500 transition-colors" onClick={() => removeSkill(skill.skillName)} />
                </Badge>
              ))}
            </div>
          </section>

          <section className="bg-background p-6 md:p-10 rounded-[1.5rem] md:rounded-[2.5rem] border-2 border-zinc-100 shadow-lg shadow-zinc-200/50">
            <h2 className="text-xl md:text-2xl font-bold mb-6 md:mb-8 flex items-center gap-3">
              <Briefcase className="h-5 w-5 md:h-6 md:w-6 text-blue-600" /> Jobs I Can Do
            </h2>
            <div className="flex gap-2 md:gap-3 mb-6">
              <Input 
                placeholder="Add job title..." 
                value={newJob} 
                onChange={(e) => setNewJob(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addJob()}
                className="rounded-xl h-10 md:h-12"
              />
              <Button onClick={addJob} variant="secondary" className="rounded-xl md:rounded-2xl h-10 md:h-12 w-10 md:w-12 p-0 shrink-0">
                <Plus className="h-5 w-5" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 md:gap-3">
              {jobs.map(job => (
                <Badge key={job.jobTitle} variant="outline" className="px-3 md:px-5 py-1.5 md:py-2.5 text-xs md:text-base flex items-center gap-2 rounded-lg md:rounded-2xl border-2">
                  {job.jobTitle}
                  <X className="h-3.5 w-3.5 md:h-4 md:w-4 cursor-pointer hover:text-red-500 transition-colors" onClick={() => removeJob(job.jobTitle)} />
                </Badge>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column - Status & Actions */}
        <div className="space-y-6 md:space-y-8 h-fit lg:sticky lg:top-28">
           <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] text-white shadow-xl shadow-blue-600/20">
              <h3 className="text-lg md:text-xl font-bold mb-4 flex items-center gap-2">
                <Star className="h-5 w-5" /> Profile Strength
              </h3>
              <div className="space-y-4">
                <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden">
                   <div className="h-full bg-white rounded-full" style={{ width: '85%' }} />
                </div>
                <p className="text-xs md:text-sm text-blue-100">Your profile is looking great! High quality profiles attract more employers.</p>
              </div>
           </div>

           <div className="bg-background p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border-2 border-zinc-100 shadow-lg shadow-zinc-200/50">
              <h3 className="font-bold mb-6">Quick Settings</h3>
              <div className="space-y-3 md:space-y-4">
                <label className="flex items-center justify-between p-3 md:p-4 rounded-xl md:rounded-2xl bg-muted/30 cursor-pointer hover:bg-muted/50 transition-all border border-transparent hover:border-zinc-200">
                  <span className="text-xs md:text-sm font-medium">Public Profile</span>
                  <div className="h-5 w-9 md:h-6 md:w-11 bg-blue-600 rounded-full relative shrink-0">
                     <div className="absolute top-0.5 right-0.5 md:top-1 md:right-1 h-3.5 w-3.5 md:h-4 md:w-4 bg-white rounded-full shadow-sm" />
                  </div>
                </label>
                <label className="flex items-center justify-between p-3 md:p-4 rounded-xl md:rounded-2xl bg-muted/30 cursor-pointer hover:bg-muted/50 transition-all border border-transparent hover:border-zinc-200">
                  <span className="text-xs md:text-sm font-medium">Open to Work</span>
                  <div className="h-5 w-9 md:h-6 md:w-11 bg-blue-600 rounded-full relative shrink-0">
                     <div className="absolute top-0.5 right-0.5 md:top-1 md:right-1 h-3.5 w-3.5 md:h-4 md:w-4 bg-white rounded-full shadow-sm" />
                  </div>
                </label>
              </div>
              <div className="mt-6 md:mt-8 pt-6 md:pt-8 border-t space-y-4">
                <p className="text-[10px] md:text-xs text-muted-foreground px-2 text-center leading-relaxed">
                  Last updated: {new Date(user?.updatedAt || Date.now()).toLocaleDateString()}
                </p>
                <Button className="w-full rounded-xl md:rounded-2xl h-12 md:h-14 font-bold" onClick={handleSubmit} isLoading={isSaving}>
                  Save All Changes
                </Button>
              </div>
           </div>
        </div>
      </main>
    </div>
  );
}
