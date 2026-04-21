import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BookOpen, Plus, Trash2, Loader2, ExternalLink } from 'lucide-react';
import { courseService } from '@/api';
import { toast } from 'react-hot-toast';

const AdminCoursesPage: React.FC = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    url: '',
    platform: '',
    skillTag: ''
  });

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

  const handleSubmit = async () => {
    if (!formData.title || !formData.url || !formData.platform) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await courseService.add(formData);
      if (res.data.success) {
        toast.success('Course resource added');
        setFormData({ title: '', url: '', platform: '', skillTag: '' });
        fetchCourses();
      }
    } catch (error) {
      toast.error('Failed to add course resource');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this resource?')) return;
    try {
      await courseService.delete(id);
      toast.success('Resource deleted');
      setCourses(courses.filter(c => c.id !== id));
    } catch (error) {
      toast.error('Failed to delete resource');
    }
  };

  return (
    <div className="space-y-6 md:space-y-8 w-full max-w-[1600px] mx-auto p-2 md:p-0">
      <h1 className="text-2xl md:text-3xl font-bold px-2 md:px-0">Manage Course Resources</h1>
      
      <Card className="rounded-[1.5rem] md:rounded-3xl p-4 md:p-6 overflow-hidden border-2 shadow-sm">
        <CardHeader className="px-2 md:px-6">
          <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
            <Plus className="h-5 w-5" /> Add New Course Resource
          </CardTitle>
        </CardHeader>
        <CardContent className="px-2 md:px-6 grid md:grid-cols-2 gap-4 md:gap-6">
          <div className="space-y-2">
            <Label className="text-sm">Course Title</Label>
            <Input 
              placeholder="e.g., Advanced React Patterns" 
              className="rounded-xl h-10 md:h-11" 
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm">URL</Label>
            <Input 
              placeholder="https://..." 
              className="rounded-xl h-10 md:h-11" 
              value={formData.url}
              onChange={(e) => setFormData({...formData, url: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm">Platform</Label>
            <Input 
              placeholder="e.g., Coursera" 
              className="rounded-xl h-10 md:h-11" 
              value={formData.platform}
              onChange={(e) => setFormData({...formData, platform: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm">Skill Tag</Label>
            <Input 
              placeholder="e.g., Frontend" 
              className="rounded-xl h-10 md:h-11" 
              value={formData.skillTag}
              onChange={(e) => setFormData({...formData, skillTag: e.target.value})}
            />
          </div>
          <Button 
            className="md:col-span-2 rounded-xl h-10 md:h-12 font-bold" 
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Adding...' : 'Add Resource'}
          </Button>
        </CardContent>
      </Card>

      <Card className="rounded-[1.5rem] md:rounded-3xl p-4 md:p-6 overflow-hidden border-2 shadow-sm">
        <CardHeader className="px-2 md:px-6">
          <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
            <BookOpen className="h-5 w-5" /> Existing Resources
          </CardTitle>
        </CardHeader>
        <CardContent className="px-0 md:px-6">
          {isLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[600px]">
                <thead>
                  <tr className="border-b text-[10px] md:text-xs font-bold text-muted-foreground uppercase tracking-widest">
                    <th className="p-4">Title</th>
                    <th className="p-4">Platform</th>
                    <th className="p-4">Skill Tag</th>
                    <th className="p-4 text-right"></th>
                  </tr>
                </thead>
                <tbody>
                  {courses.length > 0 ? (
                    courses.map(c => (
                      <tr key={c.id} className="border-b hover:bg-muted/50 transition-colors">
                        <td className="p-4 font-bold text-sm md:text-base">
                          <div className="flex items-center gap-2">
                            {c.title}
                            <a href={c.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:scale-110 transition-transform">
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </div>
                        </td>
                        <td className="p-4 text-xs md:text-sm text-muted-foreground">{c.platform}</td>
                        <td className="p-4">
                          {c.skillTag && (
                            <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-blue-600 px-2 py-1 bg-blue-50 rounded-md">
                              {c.skillTag}
                            </span>
                          )}
                        </td>
                        <td className="p-4 text-right">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="text-red-600 hover:bg-red-50 rounded-xl h-9 w-9"
                            onClick={() => handleDelete(c.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="p-10 text-center text-muted-foreground italic text-sm">
                        No course resources found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminCoursesPage;
