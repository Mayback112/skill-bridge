import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, Plus, X, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Badge } from '@/components/common/Badge';
import { toast } from 'react-hot-toast';

export default function PostJobPage() {
  const navigate = useNavigate();
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const addSkill = () => {
    if (newSkill && !skills.includes(newSkill)) {
      setSkills([...skills, newSkill]);
      setNewSkill('');
    }
  };

  const handlePost = async () => {
    if (skills.length === 0) {
      toast.error('At least one required skill is needed');
      return;
    }
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    toast.success('Job posted successfully!');
    navigate('/dashboard/employer');
  };

  return (
    <div className="min-h-screen bg-muted/20 pb-20">
      <nav className="h-16 border-b bg-background px-6 flex items-center justify-between sticky top-0 z-50">
        <Link to="/dashboard/employer" className="flex items-center gap-2">
          <ArrowLeft className="h-5 w-5" />
          <span className="font-bold">Back to Dashboard</span>
        </Link>
      </nav>

      <main className="max-w-2xl mx-auto p-6 md:pt-12">
        <div className="bg-background border rounded-[3rem] p-10 md:p-12 shadow-xl">
          <h1 className="text-3xl font-bold mb-10">Post a New Job</h1>
          
          <div className="space-y-8">
            <Input label="Job Title" placeholder="e.g. Frontend React Developer" />
            
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Job Description</label>
              <textarea 
                className="w-full rounded-2xl border border-input bg-background px-4 py-3 min-h-[200px] focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Describe the role, responsibilities, and company culture..."
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-3 block">Required Skills</label>
              <div className="flex gap-3 mb-4">
                <Input 
                  placeholder="Add a skill (e.g. TypeScript)" 
                  value={newSkill} 
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addSkill()}
                />
                <Button onClick={addSkill} variant="secondary" className="rounded-2xl h-12 w-12 p-0">
                  <Plus className="h-6 w-6" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {skills.map(s => (
                  <Badge key={s} variant="blue" className="px-4 py-2 rounded-2xl flex items-center gap-2">
                    {s}
                    <X className="h-4 w-4 cursor-pointer" onClick={() => setSkills(skills.filter(sk => sk !== s))} />
                  </Badge>
                ))}
              </div>
            </div>

            <Button onClick={handlePost} isLoading={isLoading} className="w-full rounded-2xl h-16 text-lg mt-6 shadow-lg shadow-blue-600/20">
              Post Job Opportunity
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
