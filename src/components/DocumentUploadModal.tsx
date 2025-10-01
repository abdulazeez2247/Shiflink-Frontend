
import { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Upload, FileText, CheckCircle, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface DocumentUploadModalProps {
  credentialName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDocumentUploaded?: () => void;
}

interface UploadedDocument {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadProgress: number;
  status: 'uploading' | 'completed' | 'error';
}

const DocumentUploadModal = ({ credentialName, open, onOpenChange, onDocumentUploaded }: DocumentUploadModalProps) => {
  const { toast } = useToast();
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

  const handleComplete = () => {
    const completedDocs = documents.filter(doc => doc.status === 'completed');
    if (completedDocs.length > 0) {
      onDocumentUploaded?.();
      toast({
        title: "Documents Uploaded",
        description: `${completedDocs.length} document(s) uploaded successfully for ${credentialName}.`
      });
    }
    
    // Reset documents and close modal
    setDocuments([]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Upload Documents</DialogTitle>
          <DialogDescription>
            Upload documents for "{credentialName}"
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div 
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-3" />
            <h3 className="text-sm font-medium text-gray-900 mb-2">Upload credential documents</h3>
            <p className="text-xs text-gray-600 mb-3">Click to browse or drag and drop your files here</p>
            <p className="text-xs text-gray-500">Supported formats: PDF, JPG, PNG (Max 10MB)</p>
            <Button size="sm" className="mt-3">
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
            <div className="space-y-3 max-h-60 overflow-y-auto">
              <h4 className="font-medium text-sm">Uploading Documents</h4>
              {documents.map((doc) => (
                <div key={doc.id} className="border rounded-lg p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-gray-500" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900 truncate">{doc.name}</p>
                        <p className="text-xs text-gray-600">{formatFileSize(doc.size)}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {doc.status === 'completed' && (
                        <Badge variant="default" className="bg-green-100 text-green-800 text-xs">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Complete
                        </Badge>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeDocument(doc.id)}
                        className="h-6 w-6 p-0"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  {doc.status === 'uploading' && (
                    <Progress value={doc.uploadProgress} className="w-full h-1" />
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            {documents.some(doc => doc.status === 'completed') && (
              <Button onClick={handleComplete}>
                Complete Upload
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentUploadModal;
