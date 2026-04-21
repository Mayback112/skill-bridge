import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { GraduationCap, Linkedin, Mail, Briefcase, Award, BookOpen, ExternalLink, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { graduateService } from '@/api';
import { toast } from 'react-hot-toast';
import { Graduate } from '@/types/graduate.types';

export default function GraduateReviewPage() {
  const { id } = useParams();
  const [grad, setGrad] = useState<Graduate | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        if (!id) return;
        const response = await graduateService.getById(id);
        if (response.data.success) {
          setGrad(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast.error('Failed to load profile');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!grad) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-background">
        <h1 className="text-2xl font-bold mb-4">Profile not found</h1>
        <Link to="/">
          <Button variant="outline">Back to Home</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background font-sans">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-12">
          {/* Profile Header */}
          <header className="bg-card border rounded-[2rem] md:rounded-[3rem] p-6 md:p-16 relative overflow-hidden shadow-sm">
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-10" />
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-10 relative z-10 text-center md:text-left">
              <div className="h-32 w-32 md:h-40 md:w-40 rounded-[2rem] md:rounded-[2.5rem] bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white text-4xl md:text-5xl font-bold shadow-xl ring-4 ring-blue-600/20 overflow-hidden">
                {grad.profilePicture ? (
                  <img src={grad.profilePicture} alt={grad.fullName} className="w-full h-full object-cover" />
                ) : (
                  grad.fullName?.charAt(0)
                )}
              </div>
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
                  <h1 className="text-3xl md:text-5xl font-bold">{grad.fullName}</h1>
                  {grad.isVerified && (
                    <Badge variant="blue" className="w-fit mx-auto md:mx-0 flex gap-1 rounded-full px-3 py-1 bg-blue-100 text-blue-700 border-blue-200 text-[10px]">
                      <CheckCircle2 className="h-3 w-3" />
                      Verified Graduate
                    </Badge>
                  )}
                </div>
                <p className="text-lg md:text-xl text-blue-600 font-semibold mb-6">{grad.headline || 'UPSA Graduate'}</p>
                <div className="flex flex-wrap justify-center md:justify-start gap-3 md:gap-4">
                  <Button className="rounded-xl md:rounded-2xl flex gap-2 h-10 md:h-12 px-6" onClick={() => window.location.href = `mailto:${grad.email}`}>
                    <Mail className="h-4 w-4" />
                    Contact
                  </Button>
                  {grad.linkedInUrl && (
                    <Button variant="outline" className="rounded-xl md:rounded-2xl flex gap-2 border-2 h-10 md:h-12 px-6" onClick={() => window.open(grad.linkedInUrl, '_blank')}>
                      <Linkedin className="h-4 w-4 fill-current" />
                      LinkedIn
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 mt-6 md:mt-10">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6 md:space-y-8">
              <section className="bg-card border rounded-[1.5rem] md:rounded-[2.5rem] p-6 md:p-10 shadow-sm">
                <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 flex items-center gap-3">
                  <span className="h-6 md:h-8 w-1.5 bg-blue-600 rounded-full" />
                  About
                </h2>
                <p className="text-muted-foreground text-base md:text-lg leading-relaxed">{grad.bio || 'No bio provided.'}</p>
              </section>

              <section className="bg-card border rounded-[1.5rem] md:rounded-[2.5rem] p-6 md:p-10 shadow-sm">
                <h2 className="text-xl md:text-2xl font-bold mb-6 md:mb-8 flex items-center gap-3">
                  <span className="h-6 md:h-8 w-1.5 bg-blue-600 rounded-full" />
                  Digital Skills
                </h2>
                <div className="flex flex-wrap gap-3 md:gap-4">
                  {grad.skills?.map((skill) => (
                    <div key={skill.id} className="flex flex-col items-center bg-muted/30 px-4 md:px-6 py-3 md:py-4 rounded-2xl md:rounded-3xl border hover:border-blue-600/30 transition-colors group">
                      <span className="font-bold text-sm md:text-base mb-1 group-hover:text-blue-600 transition-colors">{skill.skillName}</span>
                      <Badge variant="blue" className="text-[9px] md:text-[10px] rounded-lg">{skill.proficiencyLevel}</Badge>
                    </div>
                  ))}
                  {!grad.skills?.length && <p className="text-muted-foreground italic text-sm">No skills listed.</p>}
                </div>
              </section>

              <section className="bg-card border rounded-[1.5rem] md:rounded-[2.5rem] p-6 md:p-10 shadow-sm">
                <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 flex items-center gap-3">
                  <span className="h-6 md:h-8 w-1.5 bg-blue-600 rounded-full" />
                  Jobs I Can Do
                </h2>
                <div className="flex flex-wrap gap-2 md:gap-3">
                  {grad.jobsCanDo?.map((job, i) => (
                    <Badge key={i} variant="outline" className="px-4 md:px-5 py-2 md:py-2.5 rounded-xl md:rounded-2xl text-sm md:text-base border-2">
                      {job}
                    </Badge>
                  ))}
                  {!grad.jobsCanDo?.length && <p className="text-muted-foreground italic text-sm">Not specified.</p>}
                </div>
              </section>

              <section className="bg-card border rounded-[1.5rem] md:rounded-[2.5rem] p-6 md:p-10 shadow-sm">
                <h2 className="text-xl md:text-2xl font-bold mb-6 md:mb-8 flex items-center gap-3">
                  <span className="h-6 md:h-8 w-1.5 bg-blue-600 rounded-full" />
                  Work Experience
                </h2>
                <div className="space-y-8 md:space-y-10">
                  {grad.workExperiences?.length > 0 ? (
                    grad.workExperiences.map((exp, i) => (
                      <div key={i} className="flex gap-4 md:gap-6">
                        <div className="h-10 w-10 md:h-12 md:w-12 bg-blue-100 rounded-xl md:rounded-2xl flex items-center justify-center text-blue-600 shrink-0">
                          <Briefcase className="h-5 w-5 md:h-6 md:w-6" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg md:text-xl font-bold">{exp.jobTitle}</h3>
                          <p className="text-blue-600 font-medium text-sm md:text-base">{exp.company}</p>
                          <p className="text-xs md:text-sm text-muted-foreground mt-1 mb-2 md:mb-3">
                            {exp.startDate} - {exp.endDate || 'Present'}
                          </p>
                          <p className="text-muted-foreground text-sm md:text-base leading-relaxed">{exp.description}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground italic text-sm">No work experience listed.</p>
                  )}
                </div>
              </section>
            </div>

            {/* Right Column */}
            <div className="space-y-6 md:space-y-8">
              <section className="bg-card border rounded-[1.5rem] md:rounded-[2.5rem] p-6 md:p-10 shadow-sm">
                <h2 className="text-lg md:text-xl font-bold mb-4 md:mb-6 flex items-center gap-3">
                  <GraduationCap className="h-5 w-5 text-blue-600" />
                  Education
                </h2>
                <div className="space-y-6">
                  {grad.educations?.length > 0 ? (
                    grad.educations.map((edu, i) => (
                      <div key={i} className="relative pl-6 border-l-2 border-blue-600/20 pb-2 last:pb-0">
                        <div className="absolute left-[-5px] top-0 h-2 w-2 rounded-full bg-blue-600" />
                        <h3 className="font-bold text-sm md:text-base">{edu.institution}</h3>
                        <p className="text-xs md:text-sm text-muted-foreground">{edu.degree}</p>
                        {edu.fieldOfStudy && <p className="text-[10px] md:text-xs text-blue-600 font-medium">{edu.fieldOfStudy}</p>}
                        <p className="text-[10px] md:text-xs text-muted-foreground mt-1">{edu.startDate} - {edu.endDate || 'Present'}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground italic text-sm">No education listed.</p>
                  )}
                </div>
              </section>

              <section className="bg-card border rounded-[1.5rem] md:rounded-[2.5rem] p-6 md:p-10 shadow-sm">
                <h2 className="text-lg md:text-xl font-bold mb-4 md:mb-6 flex items-center gap-3">
                  <Award className="h-5 w-5 text-blue-600" />
                  Certifications
                </h2>
                <div className="space-y-6">
                  {grad.certifications?.length > 0 ? (
                    grad.certifications.map((cert, i) => (
                      <div key={i} className="mb-4 last:mb-0">
                        <h3 className="font-bold text-sm">{cert.name}</h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          {cert.issuingOrganization} {cert.issueDate && `• ${cert.issueDate}`}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground italic text-sm">No certifications listed.</p>
                  )}
                </div>
              </section>
            </div>
          </div>
        </div>
    </div>
  );
}
