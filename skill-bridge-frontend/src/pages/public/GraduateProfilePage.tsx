import { useParams, Link } from 'react-router-dom';
import { GraduationCap, Linkedin, Mail, Calendar, MapPin, Briefcase, Award } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Avatar } from '@/components/common/Avatar';
import { Badge } from '@/components/common/Badge';

export default function GraduateProfilePage() {
  const { id } = useParams();

  // Mock data simulation
  const grad = {
    fullName: 'Kwame Mensah',
    headline: 'Full Stack Developer',
    bio: 'A passionate developer from UPSA with experience in building scalable web applications. I love solving complex problems and learning new technologies.',
    email: 'kwame.mensah@upsa.edu.gh',
    skills: [
      { name: 'React', level: 'ADVANCED' },
      { name: 'Java', level: 'INTERMEDIATE' },
      { name: 'Spring Boot', level: 'INTERMEDIATE' },
      { name: 'TypeScript', level: 'ADVANCED' },
      { name: 'PostgreSQL', level: 'INTERMEDIATE' },
    ],
    experience: [
      { title: 'Junior Developer', company: 'Tech Hub Ghana', duration: '2024 - Present', desc: 'Working on internal tools and API development.' },
      { title: 'Intern', company: 'Global Solutions', duration: '2023 - 2024', desc: 'Assisted in frontend development using React.' },
    ],
    education: [
      { institution: 'UPSA', degree: 'BSc Computer Science', duration: '2020 - 2024' },
    ],
    certifications: [
      { name: 'Oracle Certified Java Associate', org: 'Oracle', date: '2023' },
    ]
  };

  return (
    <div className="min-h-screen bg-muted/10 pb-20">
      <nav className="flex items-center justify-between px-6 h-20 border-b bg-background sticky top-0 z-50">
        <Link to="/" className="flex items-center gap-2">
          <GraduationCap className="h-6 w-6 text-blue-600" />
          <span className="font-bold">SKILLBRIDGE GH</span>
        </Link>
        <Link to="/graduates">
          <Button variant="ghost" className="rounded-2xl">Back to list</Button>
        </Link>
      </nav>

      <div className="max-w-6xl mx-auto px-6 mt-12">
        {/* Profile Header */}
        <header className="bg-background border rounded-[3rem] p-10 md:p-16 relative overflow-hidden shadow-sm">
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-10" />
          <div className="flex flex-col md:flex-row items-center md:items-start gap-10 relative z-10 text-center md:text-left">
            <Avatar fallback={grad.fullName} size="xl" className="h-40 w-40 border-4 shadow-xl" />
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-bold mb-2">{grad.fullName}</h1>
              <p className="text-xl text-blue-600 font-semibold mb-6">{grad.headline}</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                <Button className="rounded-2xl flex gap-2">
                  <Mail className="h-4 w-4" />
                  Contact
                </Button>
                <Button variant="outline" className="rounded-2xl flex gap-2 border-2">
                  <Linkedin className="h-4 w-4 fill-current" />
                  LinkedIn
                </Button>
              </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-10">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-background border rounded-[2.5rem] p-10 shadow-sm">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <span className="h-8 w-1.5 bg-blue-600 rounded-full" />
                About
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">{grad.bio}</p>
            </section>

            <section className="bg-background border rounded-[2.5rem] p-10 shadow-sm">
              <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                <span className="h-8 w-1.5 bg-blue-600 rounded-full" />
                Skills
              </h2>
              <div className="flex flex-wrap gap-3">
                {grad.skills.map(skill => (
                  <div key={skill.name} className="flex flex-col items-center bg-muted/30 px-6 py-4 rounded-3xl border">
                    <span className="font-bold mb-1">{skill.name}</span>
                    <Badge variant="blue" className="text-[10px]">{skill.level}</Badge>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-background border rounded-[2.5rem] p-10 shadow-sm">
              <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                <span className="h-8 w-1.5 bg-blue-600 rounded-full" />
                Experience
              </h2>
              <div className="space-y-10">
                {grad.experience.map((exp, i) => (
                  <div key={i} className="flex gap-6">
                    <div className="h-12 w-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 shrink-0">
                      <Briefcase className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{exp.title}</h3>
                      <p className="text-blue-600 font-medium">{exp.company}</p>
                      <p className="text-sm text-muted-foreground mt-1 mb-3">{exp.duration}</p>
                      <p className="text-muted-foreground">{exp.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            <section className="bg-background border rounded-[2.5rem] p-10 shadow-sm">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                <GraduationCap className="h-5 w-5 text-blue-600" />
                Education
              </h2>
              {grad.education.map((edu, i) => (
                <div key={i}>
                  <h3 className="font-bold">{edu.institution}</h3>
                  <p className="text-sm text-muted-foreground">{edu.degree}</p>
                  <p className="text-xs text-muted-foreground mt-1">{edu.duration}</p>
                </div>
              ))}
            </section>

            <section className="bg-background border rounded-[2.5rem] p-10 shadow-sm">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                <Award className="h-5 w-5 text-blue-600" />
                Certifications
              </h2>
              {grad.certifications.map((cert, i) => (
                <div key={i}>
                  <h3 className="font-bold">{cert.name}</h3>
                  <p className="text-sm text-muted-foreground">{cert.org} • {cert.date}</p>
                </div>
              ))}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
