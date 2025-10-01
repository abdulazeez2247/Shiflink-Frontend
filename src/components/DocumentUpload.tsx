
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Upload, FileText, CheckCircle, AlertCircle, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface UploadedDocument {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadProgress: number;
  status: 'uploading' | 'completed' | 'error';
}

const DocumentUpload = () => {
  const [documents, setDocuments] = useState<UploadedDocument[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const newDoc: UploadedDocument = {
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        type: file.type,
        size: file.size,
        uploadProgress: 0,
        status: 'uploading'
      };

      setDocuments(prev => [...prev, newDoc]);

      // Simulate upload progress
      simulateUpload(newDoc.id);
    });
  };

  const simulateUpload = (docId: string) => {
    const interval = setInterval(() => {
      setDocuments(prev => 
        prev.map(doc => {
          if (doc.id === docId) {
            const newProgress = doc.uploadProgress + 10;
            if (newProgress >= 100) {
              clearInterval(interval);
              return { ...doc, uploadProgress: 100, status: 'completed' };
            }
            return { ...doc, uploadProgress: newProgress };
          }
          return doc;
        })
      );
    }, 200);
  };

  const removeDocument = (docId: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== docId));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Upload className="w-5 h-5" />
          <span>Upload Documents</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div 
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-medical-blue transition-colors cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Upload your credentials</h3>
          <p className="text-gray-600 mb-4">Click to browse or drag and drop your files here</p>
          <p className="text-sm text-gray-500">Supported formats: PDF, JPG, PNG (Max 10MB)</p>
          <Button className="mt-4 bg-medical-blue hover:bg-blue-800">
            Select Files
          </Button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={handleFileSelect}
          className="hidden"
        />

        {documents.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Uploaded Documents</h4>
            {documents.map((doc) => (
              <div key={doc.id} className="border rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="font-medium text-gray-900">{doc.name}</p>
                      <p className="text-sm text-gray-600">{formatFileSize(doc.size)}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {doc.status === 'completed' && (
                      <Badge variant="default" className="bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Complete
                      </Badge>
                    )}
                    {doc.status === 'error' && (
                      <Badge variant="destructive">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        Error
                      </Badge>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeDocument(doc.id)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                {doc.status === 'uploading' && (
                  <Progress value={doc.uploadProgress} className="w-full" />
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DocumentUpload;
