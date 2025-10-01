
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import type { CertificateUploadFormProps } from './types';

const CertificateUploadForm = ({ onUploadSuccess }: CertificateUploadFormProps) => {
  const { user } = useAuth();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [certificateName, setCertificateName] = useState('');
  const [certificateType, setCertificateType] = useState('');
  const [expiryDate, setExpiryDate] = useState('');

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid File Type",
        description: "Please upload a PDF, JPG, or PNG file",
        variant: "destructive"
      });
      return;
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "File size must be less than 10MB",
        variant: "destructive"
      });
      return;
    }

    setSelectedFile(file);
    setCertificateName(file.name.replace(/\.[^/.]+$/, ""));
  };

  const handleUpload = async () => {
    if (!selectedFile || !certificateName || !certificateType || !user) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields and select a file",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Create file path with user ID folder structure
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      console.log('Uploading file to:', filePath);

      // Simulate upload progress since Supabase doesn't support onUploadProgress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      // Upload file to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('certificates')
        .upload(filePath, selectedFile);

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (uploadError) throw uploadError;

      console.log('File uploaded successfully:', uploadData);

      // Get public URL for the uploaded file
      const { data: { publicUrl } } = supabase.storage
        .from('certificates')
        .getPublicUrl(filePath);

      console.log('File public URL:', publicUrl);

      // Save certificate record to database
      const { data: dbData, error: dbError } = await supabase
        .from('uploaded_certificates')
        .insert({
          student_id: user.id,
          certificate_name: certificateName,
          certificate_type: certificateType,
          file_url: publicUrl,
          expiry_date: expiryDate || null
        })
        .select()
        .single();

      if (dbError) throw dbError;

      console.log('Certificate record created:', dbData);

      // Reset form
      setSelectedFile(null);
      setCertificateName('');
      setCertificateType('');
      setExpiryDate('');
      
      // Reset file input
      const fileInput = document.getElementById('certificate-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

      toast({
        title: "Upload Successful",
        description: "Your certificate has been uploaded and is pending review",
      });

      onUploadSuccess();

    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Failed",
        description: "There was an error uploading your certificate. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Upload className="w-5 h-5" />
          <span>Upload New Certificate</span>
        </CardTitle>
        <CardDescription>
          Upload certificates in PDF, JPG, or PNG format (max 10MB)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="certificate-name">Certificate Name</Label>
              <Input
                id="certificate-name"
                type="text"
                value={certificateName}
                onChange={(e) => setCertificateName(e.target.value)}
                placeholder="e.g., CPR Certification"
                disabled={isUploading}
              />
            </div>
            
            <div>
              <Label htmlFor="certificate-type">Certificate Type</Label>
              <Select 
                value={certificateType} 
                onValueChange={setCertificateType}
                disabled={isUploading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CPR/First Aid">CPR/First Aid</SelectItem>
                  <SelectItem value="Background Check">Background Check</SelectItem>
                  <SelectItem value="Training Certificate">Training Certificate</SelectItem>
                  <SelectItem value="License">License</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="expiry-date">Expiry Date (Optional)</Label>
            <Input
              id="expiry-date"
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              disabled={isUploading}
            />
          </div>

          <div>
            <Label htmlFor="certificate-upload">Select Certificate File</Label>
            <Input
              id="certificate-upload"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileSelect}
              disabled={isUploading}
              className="mt-1"
            />
          </div>
          
          {isUploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Uploading...</span>
                <span>{Math.round(uploadProgress)}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          )}

          <Button 
            onClick={handleUpload} 
            disabled={!selectedFile || !certificateName || !certificateType || isUploading}
            className="w-full md:w-auto"
          >
            {isUploading ? 'Uploading...' : 'Upload Certificate'}
          </Button>
          
          <div className="text-sm text-gray-600">
            <p>Supported formats: PDF, JPG, PNG</p>
            <p>Maximum file size: 10MB</p>
            <p>Certificates will be reviewed within 2-3 business days</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CertificateUploadForm;
