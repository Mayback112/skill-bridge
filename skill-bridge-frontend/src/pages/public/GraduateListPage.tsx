import { useState } from 'react';
import { Search, Filter, GraduationCap, ArrowRight } from 'lucide-react';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { Avatar } from '@/components/common/Avatar';
import { Link } from 'react-router-dom';

const MOCK_GRADUATES = [
  { id: '1', name: 'Kwame Mensah', headline: 'Full Stack Developer', skills: ['React', 'Java', 'SQL'], image: '' },
  { id: '2', name: 'Ama Serwaa', headline: 'UI/UX Designer', skills: ['Figma', 'Adobe XD', 'CSS'], image: '' },
  { id: '3', name: 'Kofi Owusu', headline: 'Data Analyst', skills: ['Python', 'Excel', 'Tableau'], image: '' },
  { id: '4', name: 'Abena Boateng', headline: 'Digital Marketer', skills: ['SEO', 'Google Ads', 'Content'], image: '' },
  { id: '5', name: 'Yaw Appiah', headline: 'Cybersecurity Enthusiast', skills: ['Linux', 'Networking', 'Security+'], image: '' },
  { id: '6', name: 'Esi Addo', headline: 'Software Engineer', skills: ['TypeScript', 'Node.js', 'Docker'], image: '' },
];

export default function GraduateListPage() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="min-h-screen bg-muted/10">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 h-20 border-b bg-background sticky top-0 z-50">
        <Link to="/" className="flex items-center gap-2">
          <GraduationCap className="h-6 w-6 text-blue-600" />
          <span className="font-bold">SKILLBRIDGE GH</span>
        </Link>
        <Link to="/auth/graduate/login">
          <Button variant="outline" className="rounded-2xl">Login</Button>
        </Link>
      </nav>

      <main className="max-w-7xl mx-auto p-6 md:p-12">
        <header className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Find Talented UPSA Graduates</h1>
          <p className="text-xl text-muted-foreground">Discover verified digital skills from the next generation of professionals.</p>
        </header>

        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-12 bg-background p-4 rounded-[2rem] border shadow-sm">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground" />
            <Input 
              placeholder="Search by name or skill..." 
              className="pl-12 rounded-2xl h-12" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="secondary" className="rounded-2xl h-12 flex gap-2 px-8">
            <Filter className="h-4 w-4" />
            Filter by skill
          </Button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {MOCK_GRADUATES.map((grad) => (
            <div key={grad.id} className="bg-background border rounded-[2.5rem] p-8 hover:shadow-xl transition-all group border-2 border-transparent hover:border-blue-600/20">
              <div className="flex items-center gap-4 mb-6">
                <Avatar fallback={grad.name} size="lg" className="group-hover:scale-110 transition-transform" />
                <div>
                  <h3 className="text-xl font-bold group-hover:text-blue-600 transition-colors">{grad.name}</h3>
                  <p className="text-sm text-muted-foreground font-medium">{grad.headline}</p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-8">
                {grad.skills.map(skill => (
                  <Badge key={skill} variant="blue" className="rounded-lg">{skill}</Badge>
                ))}
              </div>

              <Link to={`/graduates/${grad.id}`}>
                <Button variant="outline" className="w-full rounded-2xl group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all flex gap-2">
                  View Profile
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-16 flex justify-center gap-2">
          {[1, 2, 3].map(i => (
            <button key={i} className={`h-10 w-10 rounded-xl font-bold border transition-all ${i === 1 ? 'bg-blue-600 text-white border-blue-600' : 'hover:bg-muted'}`}>
              {i}
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}
