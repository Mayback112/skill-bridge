import { GraduationCap, Users, Briefcase, BookOpen, Trash2, Search, BarChart3 } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';

export default function AdminDashboardPage() {
  const stats = [
    { label: 'Total Graduates', value: '1,240', icon: <Users className="h-6 w-6 text-blue-600" /> },
    { label: 'Total Employers', value: '85', icon: <Briefcase className="h-6 w-6 text-indigo-600" /> },
    { label: 'Jobs Posted', value: '312', icon: <GraduationCap className="h-6 w-6 text-emerald-600" /> },
    { label: 'Trending Skill', value: 'React', icon: <BarChart3 className="h-6 w-6 text-amber-600" /> },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col font-sans">
      <nav className="h-16 border-b bg-background px-6 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <GraduationCap className="h-6 w-6 text-red-600" />
          <span className="font-bold uppercase tracking-widest text-sm">SkillBridge Admin</span>
        </div>
        <Button variant="ghost" className="rounded-xl font-bold text-red-600">Logout</Button>
      </nav>

      <div className="flex-1 flex">
        <aside className="w-64 border-r bg-background hidden lg:flex flex-col p-6 gap-4">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-4 mb-2">Management</p>
          <button className="flex items-center gap-3 px-4 py-3 bg-zinc-100 dark:bg-zinc-800 rounded-2xl font-bold transition-all">
            <Layout className="h-5 w-5" />
            <span>Overview</span>
          </button>
          <button className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-muted rounded-2xl font-bold transition-all">
            <Users className="h-5 w-5" />
            <span>Graduates</span>
          </button>
          <button className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-muted rounded-2xl font-bold transition-all">
            <Briefcase className="h-5 w-5" />
            <span>Jobs</span>
          </button>
          <button className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-muted rounded-2xl font-bold transition-all">
            <BookOpen className="h-5 w-5" />
            <span>Courses</span>
          </button>
        </aside>

        <main className="flex-1 p-6 md:p-12 max-w-7xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-12">
            {stats.map((s, i) => (
              <div key={i} className="bg-background border rounded-[2rem] p-8 shadow-sm">
                <div className="h-12 w-12 rounded-2xl bg-muted flex items-center justify-center mb-6">
                  {s.icon}
                </div>
                <p className="text-3xl font-black mb-1">{s.value}</p>
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="grid gap-10">
            {/* Graduates Table Simulation */}
            <section className="bg-background border rounded-[2.5rem] p-8 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between mb-8 px-4">
                <h2 className="text-2xl font-bold">Recent Graduates</h2>
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <input className="pl-10 pr-4 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600" placeholder="Search..." />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b">
                      <th className="px-4 py-4 font-bold text-muted-foreground uppercase text-xs tracking-widest">Name</th>
                      <th className="px-4 py-4 font-bold text-muted-foreground uppercase text-xs tracking-widest">Email</th>
                      <th className="px-4 py-4 font-bold text-muted-foreground uppercase text-xs tracking-widest">Status</th>
                      <th className="px-4 py-4 text-right"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {[1, 2, 3].map(i => (
                      <tr key={i} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-6 font-bold">Graduate #{i}</td>
                        <td className="px-4 py-6 text-muted-foreground">grad{i}@upsa.edu.gh</td>
                        <td className="px-4 py-6"><Badge variant="success">Verified</Badge></td>
                        <td className="px-4 py-6 text-right">
                          <Button variant="ghost" size="icon" className="text-red-600 rounded-xl hover:bg-red-50">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}

const Layout = ({ className }: { className?: string }) => <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
