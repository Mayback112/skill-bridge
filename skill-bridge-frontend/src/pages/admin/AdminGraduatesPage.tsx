import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/common/Badge';
import { Users, Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { graduateService, adminService } from '@/api';
import { toast } from 'react-hot-toast';

const AdminGraduatesPage: React.FC = () => {
  const [graduates, setGraduates] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchGraduates();
  }, []);

  const fetchGraduates = async () => {
    try {
      setIsLoading(true);
      const res = await graduateService.getAll();
      if (res.data.success) {
        setGraduates(res.data.data);
      }
    } catch (error) {
      console.error('Error fetching graduates:', error);
      toast.error('Failed to load graduates');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this graduate?')) return;
    try {
      await adminService.deleteGraduate(id);
      toast.success('Graduate removed');
      setGraduates(graduates.filter(g => g.id !== id));
    } catch (error) {
      toast.error('Failed to remove graduate');
    }
  };

  return (
    <div className="space-y-6 md:space-y-8 w-full max-w-[1600px] mx-auto p-2 md:p-0">
      <h1 className="text-2xl md:text-3xl font-bold px-2 md:px-0">Manage Graduates</h1>
      <Card className="rounded-[1.5rem] md:rounded-3xl p-4 md:p-6 overflow-hidden border-2 shadow-lg shadow-zinc-100">
        <CardHeader className="px-2 md:px-6">
          <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
            <Users className="h-5 w-5" /> Registered Graduates
          </CardTitle>
        </CardHeader>
        <CardContent className="px-0 md:px-6">
          {isLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[700px]">
                <thead>
                  <tr className="border-b text-[10px] md:text-xs font-bold text-muted-foreground uppercase tracking-widest">
                    <th className="p-4">Name</th>
                    <th className="p-4">Headline</th>
                    <th className="p-4">Skills</th>
                    <th className="p-4 text-right"></th>
                  </tr>
                </thead>
                <tbody>
                  {graduates.length > 0 ? (
                    graduates.map(g => (
                      <tr key={g.id} className="border-b hover:bg-muted/50 transition-colors">
                        <td className="p-4 font-bold text-sm md:text-base">{g.fullName}</td>
                        <td className="p-4 text-xs md:text-sm text-muted-foreground">{g.headline || 'N/A'}</td>
                        <td className="p-4">
                          <div className="flex gap-1.5 flex-wrap">
                            {g.skills?.slice(0, 3).map((s: any) => (
                              <Badge key={s.id} variant="secondary" className="rounded-md text-[9px] md:text-[10px]">
                                {s.skillName}
                              </Badge>
                            ))}
                            {g.skills?.length > 3 && <span className="text-[9px] text-muted-foreground">+{g.skills.length - 3}</span>}
                          </div>
                        </td>
                        <td className="p-4 text-right">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="text-red-600 hover:bg-red-50 rounded-xl h-9 w-9"
                            onClick={() => handleDelete(g.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="p-10 text-center text-muted-foreground italic text-sm">
                        No graduates found.
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

export default AdminGraduatesPage;
