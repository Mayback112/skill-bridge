import { useState, useEffect } from 'react';
import { Search, Filter, ArrowRight } from 'lucide-react';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { Link } from 'react-router-dom';
import { graduateService } from '@/api';
import { toast } from 'react-hot-toast';

export default function GraduateListPage() {
  const [graduates, setGraduates] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchGraduates = async () => {
      try {
        setIsLoading(true);
        const response = await graduateService.getAll();
        if (response.data.success) {
          setGraduates(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching graduates:', error);
        toast.error('Failed to load graduates');
      } finally {
        setIsLoading(false);
      }
    };

    fetchGraduates();
  }, []);

  const filteredGraduates = graduates.filter(grad => 
    grad.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    grad.skills?.some((s: any) => s.skillName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
      <main className="max-w-7xl mx-auto p-4 md:p-12">
        <header className="mb-8 md:mb-12">
          <h1 className="text-2xl md:text-4xl font-bold mb-2 md:mb-4">Find Talented UPSA Graduates</h1>
          <p className="text-base md:text-xl text-muted-foreground">Discover verified digital skills from the next generation of professionals.</p>
        </header>

        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row gap-3 md:gap-4 mb-8 md:mb-12 bg-background p-3 md:p-4 rounded-[1.5rem] md:rounded-[2rem] border shadow-sm">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-3 h-4 w-4 md:h-5 md:w-5 text-muted-foreground" />
            <Input 
              placeholder="Search by name or skill..." 
              className="pl-10 md:pl-12 rounded-xl md:rounded-2xl h-10 md:h-12 text-sm md:text-base" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="secondary" className="rounded-xl md:rounded-2xl h-10 md:h-12 flex gap-2 px-6 md:px-8 text-xs md:text-sm">
            <Filter className="h-3.5 w-3.5 md:h-4 md:w-4" />
            Filter
          </Button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {filteredGraduates.length > 0 ? (
            filteredGraduates.map((grad) => (
              <div key={grad.id} className="bg-background border rounded-[1.5rem] md:rounded-[2.5rem] p-6 md:p-8 hover:shadow-xl transition-all group border-2 border-transparent hover:border-blue-600/20">
                <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
                  <div className="h-12 w-12 md:h-16 md:w-16 rounded-[1rem] md:rounded-[1.25rem] bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white text-lg md:text-xl font-bold shadow-lg group-hover:scale-110 transition-transform">
                    {grad.fullName?.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-lg md:text-xl font-bold group-hover:text-blue-600 transition-colors">{grad.fullName}</h3>
                    <p className="text-xs md:text-sm text-muted-foreground font-medium">{grad.headline || 'UPSA Graduate'}</p>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-1.5 md:gap-2 mb-6 md:mb-8">
                  {grad.skills?.slice(0, 4).map((s: any) => (
                    <Badge key={s.id || s.skillName} variant="blue" className="rounded-lg text-[10px] md:text-xs">{s.skillName}</Badge>
                  ))}
                  {grad.skills?.length > 4 && <span className="text-[10px] md:text-xs text-muted-foreground mt-1">+{grad.skills.length - 4} more</span>}
                </div>

                <Link to={`/graduates/${grad.id}`}>
                  <Button variant="outline" className="w-full rounded-xl md:rounded-2xl h-10 md:h-12 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all flex gap-2 text-xs md:text-sm">
                    View Profile
                    <ArrowRight className="h-3.5 w-3.5 md:h-4 md:w-4" />
                  </Button>
                </Link>
              </div>
            ))
          ) : (
            <div className="col-span-full py-12 md:py-20 text-center">
              <p className="text-base md:text-xl text-muted-foreground italic px-6">
                {isLoading ? 'Loading graduates...' : 'No graduates found matching your search.'}
              </p>
            </div>
          )}
        </div>

        {/* Pagination placeholder */}
        {!isLoading && filteredGraduates.length > 0 && (
          <div className="mt-16 flex justify-center gap-2">
            <button className="h-10 w-10 rounded-xl font-bold border transition-all bg-blue-600 text-white border-blue-600">1</button>
          </div>
        )}
      </main>
  );
}
