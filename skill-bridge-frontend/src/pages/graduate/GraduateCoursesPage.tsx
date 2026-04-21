import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/common/Badge';
import { Search, BookOpen, Loader2, ExternalLink } from 'lucide-react';
import { courseService } from '@/api';
import { toast } from 'react-hot-toast';

const GraduateCoursesPage: React.FC = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setIsLoading(true);
      const res = await courseService.getAll();
      if (res.data.success) {
        setCourses(res.data.data);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast.error('Failed to load courses');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredCourses = courses.filter(c => 
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.skillTag?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 md:p-10 max-w-[1600px] mx-auto w-full font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Learning Resources</h1>
          <p className="text-sm md:text-base text-muted-foreground">Premium courses to bridge your skill gaps.</p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-3 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search courses or skills..." 
            className="pl-11 rounded-xl md:rounded-2xl h-10 md:h-12 text-sm md:text-base shadow-sm" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {filteredCourses.length > 0 ? (
            filteredCourses.map((c) => (
              <Card key={c.id} className="rounded-[1.5rem] md:rounded-3xl hover:border-blue-200 transition-all hover:shadow-xl hover:shadow-blue-600/5 flex flex-col group border-2">
                <CardHeader className="p-6 pb-2">
                  <div className="h-12 w-12 rounded-2xl bg-emerald-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <BookOpen className="h-6 w-6 text-emerald-600" />
                  </div>
                  <CardTitle className="text-base md:text-lg line-clamp-2 min-h-[3.5rem] font-bold">{c.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-6 pt-0 mt-auto">
                  <div className="mb-6 flex flex-wrap gap-2">
                    <Badge variant="secondary" className="text-[9px] font-bold uppercase tracking-wider rounded-md">
                      {c.platform}
                    </Badge>
                    {c.skillTag && (
                      <Badge variant="blue" className="text-[9px] font-bold uppercase tracking-wider rounded-md">
                        {c.skillTag}
                      </Badge>
                    )}
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full rounded-xl h-10 md:h-12 font-bold group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all text-xs md:text-sm"
                    asChild
                  >
                    <a href={c.url} target="_blank" rel="noopener noreferrer">
                      View Course <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full py-20 text-center bg-muted/20 rounded-[2rem] border-2 border-dashed border-muted">
              <p className="text-muted-foreground italic px-6">
                No course resources found matching your search.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GraduateCoursesPage;
