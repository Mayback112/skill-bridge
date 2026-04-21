import { useState, useEffect } from 'react';
import { Search, Briefcase, Calendar, ChevronRight } from 'lucide-react';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
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
      <main className="max-w-5xl mx-auto p-4 md:p-12">
        <header className="mb-8 md:mb-12">
          <h1 className="text-2xl md:text-4xl font-bold mb-2 md:mb-4">Available Opportunities</h1>
          <p className="text-base md:text-xl text-muted-foreground">Find the perfect role that matches your verified skills.</p>
        </header>

        <div className="mb-8 md:mb-12 relative max-w-2xl">
          <Search className="absolute left-4 top-3 h-4 w-4 md:h-5 md:w-5 text-muted-foreground" />
          <Input 
            placeholder="Search jobs..." 
            className="pl-10 md:pl-12 rounded-xl md:rounded-2xl h-10 md:h-12 shadow-sm text-sm md:text-base" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="space-y-4 md:space-y-6">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <div key={job.id} className="bg-background border rounded-[1.5rem] md:rounded-[2.5rem] p-6 md:p-10 hover:shadow-xl transition-all border-2 border-transparent hover:border-blue-600/20 group">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg md:text-2xl font-bold group-hover:text-blue-600 transition-colors">{job.title}</h3>
                      <Badge variant="success" className="text-[9px] md:text-[10px]">Active</Badge>
                    </div>
                    <p className="text-sm md:text-xl text-muted-foreground font-medium mb-4 md:mb-6">Verified Employer</p>

                    <div className="flex flex-wrap gap-1.5 md:gap-3 mb-4 md:mb-6">
                      {job.requiredSkills?.map((skill: string) => (
                        <Badge key={skill} variant="blue" className="rounded-md md:rounded-lg px-2 md:px-3 py-0.5 md:py-1 text-[10px] md:text-xs">{skill}</Badge>
                      ))}
                    </div>

                    <div className="flex flex-wrap gap-4 md:gap-6 text-[10px] md:text-sm text-muted-foreground">
                      <div className="flex items-center gap-1.5 md:gap-2">
                        <Briefcase className="h-3.5 w-3.5 md:h-4 md:w-4" />
                        Full-time
                      </div>
                      <div className="flex items-center gap-1.5 md:gap-2">
                        <Calendar className="h-3.5 w-3.5 md:h-4 md:w-4" />
                        {new Date(job.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <Button className="w-full lg:w-auto rounded-xl md:rounded-2xl h-12 md:h-14 px-6 md:px-10 group-hover:scale-105 transition-transform flex gap-2 text-xs md:text-sm">
                    View & Apply
                    <ChevronRight className="h-4 w-4 md:h-5 md:w-5" />
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="py-12 md:py-20 text-center">
              <p className="text-base md:text-xl text-muted-foreground italic px-6">
                {isLoading ? 'Loading job postings...' : 'No job postings found matching your search.'}
              </p>
            </div>
          )}
        </div>
      </main>
  );
}
