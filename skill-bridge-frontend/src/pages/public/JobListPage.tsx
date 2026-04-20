import { useState, useEffect } from 'react';
import { Search, MapPin, Briefcase, Calendar, GraduationCap, ChevronRight } from 'lucide-react';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { Link } from 'react-router-dom';
import { jobService } from '@/api';
import { toast } from 'react-hot-toast';

export default function JobListPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setIsLoading(true);
        const response = await jobService.getAll();
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

    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.requiredSkills?.some((s: string) => s.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-muted/10 pb-20">
      <nav className="flex items-center justify-between px-6 h-20 border-b bg-background sticky top-0 z-50">
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-blue-600 p-2 rounded-xl">
            <GraduationCap className="text-white h-6 w-6" />
          </div>
          <span className="font-bold text-xl">SKILLBRIDGE GH</span>
        </Link>
        <Link to="/auth/graduate/login">
          <Button variant="outline" className="rounded-2xl">Login</Button>
        </Link>
      </nav>

      <main className="max-w-5xl mx-auto p-6 md:p-12">
        <header className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Available Opportunities</h1>
          <p className="text-xl text-muted-foreground">Find the perfect role that matches your verified skills.</p>
        </header>

        <div className="mb-12 relative max-w-2xl">
          <Search className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground" />
          <Input 
            placeholder="Search by job title or skill..." 
            className="pl-12 rounded-2xl h-12 shadow-sm" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="space-y-6">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <div key={job.id} className="bg-background border rounded-[2.5rem] p-10 hover:shadow-xl transition-all border-2 border-transparent hover:border-blue-600/20 group">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-2xl font-bold group-hover:text-blue-600 transition-colors">{job.title}</h3>
                      <Badge variant="success" className="text-[10px]">Active</Badge>
                    </div>
                    <p className="text-xl text-muted-foreground font-medium mb-6">Verified Employer</p>

                    <div className="flex flex-wrap gap-3 mb-6">
                      {job.requiredSkills?.map((skill: string) => (
                        <Badge key={skill} variant="blue" className="rounded-lg px-3 py-1">{skill}</Badge>
                      ))}
                    </div>

                    <div className="flex gap-6 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4" />
                        Full-time
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {new Date(job.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <Button className="rounded-2xl h-14 px-10 group-hover:scale-105 transition-transform flex gap-2">
                    View & Apply
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="py-20 text-center">
              <p className="text-xl text-muted-foreground italic">
                {isLoading ? 'Loading job postings...' : 'No job postings found matching your search.'}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
