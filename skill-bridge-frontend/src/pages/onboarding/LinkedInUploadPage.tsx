import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, Upload, FileText, CheckCircle, Info } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { authService, graduateService } from '@/api';
import { useAuth } from '@/hooks/useAuth';

export default function LinkedInUploadPage() {
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await graduateService.checkProfileStatus();
        if (res.data.data) {
          navigate('/graduate/dashboard');
        }
      } catch (err) {
        console.error("Failed to check status", err);
      }
    };
    checkStatus();
  }, [navigate]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type !== 'application/pdf') {
        toast.error('Please upload a PDF file');
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleContinue = async () => {
    if (!linkedinUrl || !file) return;
    
    setIsUploading(true);
    try {
      const response = await graduateService.uploadPdf(file);
      
      toast.success('LinkedIn profile parsed successfully!');
      // Pass the parsed data and the linkedin URL to the manual fill page
      navigate('/onboarding/manual', { 
        state: { 
          parsedData: response.data.data,
          linkedinUrl: linkedinUrl
        } 
      });
    } catch (error: any) {
      console.error('PDF Parse Error:', error);
      toast.error(error.response?.data?.message || 'Failed to parse PDF. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 flex items-center justify-center p-6 bg-muted/20">
        <div className="w-full max-w-xl bg-background p-10 rounded-[2.5rem] border shadow-xl">
          <h1 className="text-3xl font-bold mb-8">Connect your LinkedIn</h1>

          <div className="space-y-8">
            <Input
              label="LinkedIn URL"
              placeholder="https://linkedin.com/in/yourname"
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
            />

            <div className="relative">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t"></div>
              </div>
              <div className="relative flex justify-center text-sm font-medium leading-6">
                <span className="bg-background px-6 text-muted-foreground">THEN</span>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4">Upload your LinkedIn PDF</h3>
              
              <div className="bg-blue-50/50 p-6 rounded-3xl border border-blue-100 mb-6">
                <h4 className="font-bold text-blue-800 flex items-center gap-2 mb-3">
                  <Info className="h-4 w-4" />
                  How to get your PDF:
                </h4>
                <ol className="text-sm text-blue-700 space-y-2 list-decimal ml-4">
                  <li>Go to your LinkedIn profile</li>
                  <li>Click <strong>More</strong> button near your name</li>
                  <li>Select <strong>Save to PDF</strong></li>
                  <li>Upload that file below</li>
                </ol>
              </div>

              <div 
                className={`border-2 border-dashed rounded-3xl p-10 text-center transition-all ${
                  file ? 'border-green-500 bg-green-50/30' : 'border-zinc-200 hover:border-blue-600'
                }`}
              >
                <input
                  type="file"
                  id="pdf-upload"
                  className="hidden"
                  accept=".pdf"
                  onChange={handleFileChange}
                />
                <label htmlFor="pdf-upload" className="cursor-pointer flex flex-col items-center">
                  {file ? (
                    <>
                      <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
                      <p className="font-medium text-green-700">{file.name}</p>
                      <p className="text-xs text-green-600 mt-1">Ready to parse</p>
                    </>
                  ) : (
                    <>
                      <div className="h-16 w-16 bg-blue-100 rounded-3xl flex items-center justify-center text-blue-600 mb-4">
                        <Upload className="h-8 w-8" />
                      </div>
                      <p className="font-bold text-lg">Click to upload</p>
                      <p className="text-sm text-muted-foreground">or drag and drop your LinkedIn PDF</p>
                    </>
                  )}
                </label>
              </div>
            </div>

            <Button
              className="w-full rounded-2xl h-14"
              size="lg"
              disabled={!linkedinUrl || !file}
              isLoading={isUploading}
              onClick={handleContinue}
            >
              {isUploading ? 'Reading your profile...' : 'Continue'}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
