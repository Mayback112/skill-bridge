import React from 'react';
import { useEffect, useState } from 'react';
import { GraduationCap, Users, Briefcase, Trash2, Search, BarChart3 } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { adminService, graduateService } from '@/api';
import { toast } from 'react-hot-toast';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [graduates, setGraduates] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [statsRes, gradsRes] = await Promise.all([
        adminService.getStats(),
        graduateService.getAll()
      ]);

      if (statsRes.data.success) setStats(statsRes.data.data);
      if (gradsRes.data.success) setGraduates(gradsRes.data.data);
    } catch (error) {
      console.error('Error fetching admin data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteGraduate = async (id: string) => {
    if (!confirm('Are you sure you want to remove this graduate from the platform?')) return;

    try {
      await adminService.deleteGraduate(id);
      toast.success('Graduate removed');
      setGraduates(graduates.filter(g => g.id !== id));
    } catch (error) {
      toast.error('Failed to remove graduate');
    }
  };

  const statCards = [
    { label: 'Total Graduates', value: stats?.totalGraduates || '0', icon: <Users className="h-6 w-6 text-blue-600" /> },
    { label: 'Total Employers', value: stats?.totalEmployers || '0', icon: <Briefcase className="h-6 w-6 text-indigo-600" /> },
    { label: 'Jobs Posted', value: stats?.totalJobPostings || '0', icon: <GraduationCap className="h-6 w-6 text-emerald-600" /> },
    { label: 'Top Skill', value: stats?.topSkills ? Object.keys(stats.topSkills)[0] : 'N/A', icon: <BarChart3 className="h-6 w-6 text-amber-600" /> },
  ];

  return (
    <div className="w-full max-w-[1600px] mx-auto p-2 md:p-0">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-12">
        {statCards.map((s, i) => (
          <div key={i} className="bg-background border rounded-[1.5rem] md:rounded-[2rem] p-6 md:p-8 shadow-sm">
            <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl md:rounded-2xl bg-muted flex items-center justify-center mb-4 md:mb-6">
              {s.icon}
            </div>
            <p className="text-2xl md:text-3xl font-black mb-1">{s.value}</p>
            <p className="text-xs md:text-sm font-bold text-muted-foreground uppercase tracking-wider">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 md:gap-10">
        <section className="bg-background border rounded-[1.5rem] md:rounded-[2.5rem] p-6 md:p-8 shadow-sm overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4 px-2 md:px-4">
            <h2 className="text-xl md:text-2xl font-bold">Verified Graduates</h2>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <input className="w-full pl-10 pr-4 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 h-10 md:h-11" placeholder="Search..." />
            </div>
          </div>
          <div className="overflow-x-auto -mx-6 px-6">
            <table className="w-full text-left min-w-[600px]">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-4 font-bold text-muted-foreground uppercase text-[10px] md:text-xs tracking-widest">Name</th>
                  <th className="px-4 py-4 font-bold text-muted-foreground uppercase text-[10px] md:text-xs tracking-widest">Headline</th>
                  <th className="px-4 py-4 font-bold text-muted-foreground uppercase text-[10px] md:text-xs tracking-widest">Skills</th>
                  <th className="px-4 py-4 text-right"></th>
                </tr>
              </thead>
              <tbody>
                {graduates.length > 0 ? (
                  graduates.map(g => (
                    <tr key={g.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-4 md:py-6 font-bold text-sm md:text-base">{g.fullName}</td>
                      <td className="px-4 py-4 md:py-6 text-xs md:text-sm text-muted-foreground">{g.headline || 'N/A'}</td>
                      <td className="px-4 py-4 md:py-6">
                        <div className="flex flex-wrap gap-1">
                          {g.skills?.slice(0, 2).map((s: any) => (
                            <Badge key={s.id} variant="blue" className="text-[9px] md:text-[10px] px-2 py-0 rounded-md">{s.skillName}</Badge>
                          ))}
                          {g.skills?.length > 2 && <span className="text-[9px] md:text-[10px] text-muted-foreground">+{g.skills.length - 2}</span>}
                        </div>
                      </td>
                      <td className="px-4 py-4 md:py-6 text-right">
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteGraduate(g.id)} className="text-red-600 rounded-xl hover:bg-red-50 h-8 w-8 md:h-10 md:w-10">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="text-center py-10 text-muted-foreground italic text-sm">
                      {isLoading ? 'Loading graduates...' : 'No graduates found.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
