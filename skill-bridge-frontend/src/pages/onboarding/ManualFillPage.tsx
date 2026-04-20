import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { GraduationCap, Camera, Plus, X, Briefcase, Award, Star, User, FileText, Wrench } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Badge } from '@/components/common/Badge';
import { Avatar } from '@/components/common/Avatar';
import { toast } from 'react-hot-toast';
import { graduateService } from '@/api';
import { useAuth } from '@/hooks/useAuth';

export default function ManualFillPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, setUser } = useAuth();
  
  const parsedData = location.state?.parsedData;
  const linkedinUrlFromState = location.state?.linkedinUrl;

  const [fullName, setFullName] = useState(parsedData?.fullName || user?.fullName || '');
  const [headline, setHeadline] = useState(parsedData?.headline || '');
  const [bio, setBio] = useState(parsedData?.bio || '');
  const [linkedinUrl, setLinkedinUrl] = useState(linkedinUrlFromState || '');
  
  const [skills, setSkills] = useState<any[]>(parsedData?.skills?.map((s: any) => ({ 
    skillName: s.skillName, 
    proficiencyLevel: 'INTERMEDIATE' 
  })) || []);
  
  const [jobs, setJobs] = useState<any[]>(parsedData?.workExperiences?.map((w: any) => ({ 
    jobTitle: w.jobTitle 
  })) || []);

  const [educations, setEducations] = useState<any[]>(parsedData?.educations || []);
  const [workExperiences, setWorkExperiences] = useState<any[]>(parsedData?.workExperiences || []);
  const [certifications, setCertifications] = useState<any[]>(parsedData?.certifications || []);

  const [newSkill, setNewSkill] = useState('');
  const [newJob, setNewJob] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  const addSkill = () => {
    if (newSkill && !skills.some(s => s.skillName === newSkill)) {
      setSkills([...skills, { skillName: newSkill, proficiencyLevel: 'INTERMEDIATE' }]);
      setNewSkill('');
    }
  };

  const removeSkill = (skillName: string) => {
    setSkills(skills.filter(s => s.skillName !== skillName));
  };

  const addJob = () => {
    if (newJob && !jobs.some(j => j.jobTitle === newJob)) {
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

    setIsLoading(true);
    try {
      const payload = {
        fullName,
        headline,
        bio,
        linkedinUrl,
        skills,
        jobsCanDo: jobs,
        educations,
        workExperiences,
        certifications
      };

      const response = await graduateService.updateProfile(user.id, payload);
      
      if (response.data.success) {
        setUser(response.data.data);
        toast.success('Profile saved successfully!');
        navigate('/dashboard/graduate');
      }
    } catch (error: any) {
      console.error('Save Profile Error:', error);
      toast.error(error.response?.data?.message || 'Failed to save profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-muted/20">
      <nav className="p-6 border-b flex justify-between items-center bg-background sticky top-0 z-50">
        <Link to="/" className="flex items-center gap-2">
          <GraduationCap className="h-6 w-6 text-blue-600" />
          <span className="font-bold">SKILLBRIDGE</span>
        </Link>
        <span className="text-sm font-medium text-muted-foreground">Step 2 of 2</span>
      </nav>

      <main className="flex-1 flex p-6 md:p-12 gap-12 max-w-7xl mx-auto w-full font-sans">
        {/* Left Column - Form */}
        <div className="flex-1 space-y-12">
          <section className="bg-background p-10 rounded-[2.5rem] border shadow-sm">
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
              <Camera className="h-6 w-6 text-blue-600" /> Profile Picture
            </h2>
            <div className="flex items-center gap-8">
              <div className="h-32 w-32 rounded-[2.5rem] bg-muted border-2 border-dashed border-zinc-300 flex items-center justify-center text-muted-foreground">
                <Camera className="h-10 w-10" />
              </div>
              <div className="flex flex-col gap-2">
                <Button variant="outline" className="rounded-2xl">Upload Image</Button>
                <span className="text-xs text-muted-foreground text-center">Optional but recommended</span>
              </div>
            </div>
          </section>

          <section className="bg-background p-10 rounded-[2.5rem] border shadow-sm">
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
              <User className="h-6 w-6 text-blue-600" /> Basic Info
            </h2>
            <div className="space-y-6">
              <Input 
                label="Full Name" 
                placeholder="John Doe" 
                value={fullName} 
                onChange={(e) => setFullName(e.target.value)}
              />
              <Input 
                label="Headline" 
                placeholder="Professional title" 
                value={headline} 
                onChange={(e) => setHeadline(e.target.value)}
              />
              <Input 
                label="LinkedIn URL" 
                placeholder="https://linkedin.com/in/yourname" 
                value={linkedinUrl} 
                onChange={(e) => setLinkedinUrl(e.target.value)}
              />
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Bio / About</label>
                <textarea 
                  className="w-full rounded-2xl border border-input bg-background px-4 py-3 min-h-[150px] focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Tell us about yourself"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />
              </div>
            </div>
          </section>

          <section className="bg-background p-10 rounded-[2.5rem] border shadow-sm">
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
              <Wrench className="h-6 w-6 text-blue-600" /> Skills
            </h2>
            <div className="flex gap-3 mb-6">
              <Input 
                placeholder="Add a skill (e.g. JavaScript)" 
                value={newSkill} 
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addSkill()}
              />
              <Button onClick={addSkill} variant="secondary" className="rounded-2xl h-12 w-12 p-0">
                <Plus className="h-6 w-6" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {skills.map(skill => (
                <Badge key={skill.skillName} variant="blue" className="px-4 py-2 text-sm flex items-center gap-2 rounded-2xl">
                  {skill.skillName}
                  <X className="h-4 w-4 cursor-pointer hover:text-red-500" onClick={() => removeSkill(skill.skillName)} />
                </Badge>
              ))}
              {skills.length === 0 && <p className="text-sm text-muted-foreground italic">No skills added yet.</p>}
            </div>
          </section>

          <section className="bg-background p-10 rounded-[2.5rem] border shadow-sm">
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
              <Briefcase className="h-6 w-6 text-blue-600" /> Jobs I Can Do
            </h2>
            <div className="flex gap-3 mb-6">
              <Input 
                placeholder="Add a job title (e.g. UI Designer)" 
                value={newJob} 
                onChange={(e) => setNewJob(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addJob()}
              />
              <Button onClick={addJob} variant="secondary" className="rounded-2xl h-12 w-12 p-0">
                <Plus className="h-6 w-6" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {jobs.map(job => (
                <Badge key={job.jobTitle} variant="outline" className="px-4 py-2 text-sm flex items-center gap-2 rounded-2xl">
                  {job.jobTitle}
                  <X className="h-4 w-4 cursor-pointer hover:text-red-500" onClick={() => removeJob(job.jobTitle)} />
                </Badge>
              ))}
              {jobs.length === 0 && <p className="text-sm text-muted-foreground italic">No job roles added yet.</p>}
            </div>
          </section>

          <Button className="w-full rounded-2xl h-16 text-lg shadow-lg shadow-blue-600/10" onClick={handleSubmit} isLoading={isLoading}>
            Submit Profile
          </Button>
        </div>

        {/* Right Column - Preview */}
        <div className="w-96 sticky top-28 h-fit hidden lg:block">
          <div className="bg-background p-8 rounded-[2.5rem] border shadow-xl">
            <h3 className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-6">Live Preview</h3>
            <div className="flex flex-col items-center text-center">
              <div className="h-24 w-24 rounded-[2rem] bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white text-3xl font-bold shadow-lg mb-6">
                {fullName?.charAt(0) || user?.fullName?.charAt(0) || '?'}
              </div>
              <h4 className="text-2xl font-bold mb-1">{fullName || 'Your Name'}</h4>
              <p className="text-blue-600 font-medium mb-4">{headline || 'Professional Title'}</p>
              
              <div className="w-full h-px bg-zinc-100 my-6" />
              
              <div className="w-full text-left space-y-6">
                <div>
                  <h5 className="text-xs font-bold text-muted-foreground uppercase mb-3 flex items-center gap-2">
                    <Star className="h-3 w-3" /> Top Skills
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {skills.slice(0, 3).map(s => <Badge key={s.skillName} variant="blue" className="rounded-lg">{s.skillName}</Badge>)}
                    {skills.length === 0 && <span className="text-xs italic text-muted-foreground">None</span>}
                  </div>
                </div>
                <div>
                  <h5 className="text-xs font-bold text-muted-foreground uppercase mb-3 flex items-center gap-2">
                    <Briefcase className="h-3 w-3" /> Job Roles
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {jobs.slice(0, 2).map(j => <Badge key={j.jobTitle} variant="outline" className="rounded-lg">{j.jobTitle}</Badge>)}
                    {jobs.length === 0 && <span className="text-xs italic text-muted-foreground">None</span>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
