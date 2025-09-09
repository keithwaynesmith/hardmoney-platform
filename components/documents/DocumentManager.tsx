'use client';

import React, { useState, useEffect } from 'react';
import { FileUpload } from '@/components/forms/FileUpload';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  File, 
  Image, 
  FileText, 
  Download, 
  Trash2, 
  Eye, 
  Upload,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { Document } from '@/types';
import { documentService } from '@/lib/database/services';

interface DocumentManagerProps {
  dealId: string;
  onDocumentsChange?: (documents: Document[]) => void;
}

export function DocumentManager({ dealId, onDocumentsChange }: DocumentManagerProps) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadDocuments();
  }, [dealId]);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      const docs = await documentService.getDocumentsByDeal(dealId);
      setDocuments(docs);
      onDocumentsChange?.(docs);
    } catch (err) {
      setError('Failed to load documents');
      console.error('Error loading documents:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (files: any[]) => {
    setUploading(true);
    setError(null);

    try {
      for (const fileObj of files) {
        if (fileObj.status === 'completed' && fileObj.url) {
          const documentData = {
            dealId,
            fileName: fileObj.file.name,
            fileUrl: fileObj.url,
            fileType: fileObj.file.type,
            fileSize: fileObj.file.size,
            uploadedBy: 'current-user-id', // This should come from auth context
          };

          const newDoc = await documentService.uploadDocument(documentData);
          if (newDoc) {
            setDocuments(prev => [...prev, newDoc]);
          }
        }
      }
      onDocumentsChange?.(documents);
    } catch (err) {
      setError('Failed to upload documents');
      console.error('Error uploading documents:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleFileRemove = async (documentId: string) => {
    try {
      const success = await documentService.deleteDocument(documentId);
      if (success) {
        setDocuments(prev => prev.filter(doc => doc.id !== documentId));
        onDocumentsChange?.(documents.filter(doc => doc.id !== documentId));
      }
    } catch (err) {
      setError('Failed to delete document');
      console.error('Error deleting document:', err);
    }
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) {
      return <Image className="w-5 h-5 text-blue-500" />;
    } else if (fileType === 'application/pdf') {
      return <FileText className="w-5 h-5 text-red-500" />;
    } else {
      return <File className="w-5 h-5 text-gray-500" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getDocumentType = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return 'PDF Document';
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return 'Image';
      case 'doc':
      case 'docx':
        return 'Word Document';
      case 'xls':
      case 'xlsx':
        return 'Excel Spreadsheet';
      default:
        return 'Document';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Loading documents...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Upload className="w-5 h-5 mr-2" />
            Upload Documents
          </CardTitle>
          <CardDescription>
            Upload property photos, contracts, financial documents, and other supporting materials.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FileUpload
            onUpload={handleFileUpload}
            onRemove={() => {}}
            maxFiles={20}
            maxSize={50 * 1024 * 1024} // 50MB
            acceptedTypes={[
              'image/*',
              'application/pdf',
              '.doc',
              '.docx',
              '.xls',
              '.xlsx',
              '.txt'
            ]}
          />
        </CardContent>
      </Card>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Documents List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center">
              <File className="w-5 h-5 mr-2" />
              Documents ({documents.length})
            </span>
            {uploading && (
              <Badge variant="outline" className="text-blue-600">
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600 mr-1"></div>
                Uploading...
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {documents.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <File className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No documents uploaded yet</p>
              <p className="text-sm">Upload your first document above</p>
            </div>
          ) : (
            <div className="space-y-3">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    {getFileIcon(doc.fileType)}
                    <div>
                      <p className="font-medium text-gray-900">{doc.fileName}</p>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <span>{getDocumentType(doc.fileName)}</span>
                        <span>•</span>
                        <span>{formatFileSize(doc.fileSize || 0)}</span>
                        <span>•</span>
                        <span>{formatDate(doc.uploadedAt)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(doc.fileUrl, '_blank')}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const link = document.createElement('a');
                        link.href = doc.fileUrl;
                        link.download = doc.fileName;
                        link.click();
                      }}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleFileRemove(doc.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Document Categories */}
      {documents.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Document Categories</CardTitle>
            <CardDescription>
              Organize your documents by category for easier review
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { name: 'Property Photos', count: documents.filter(d => d.fileType.startsWith('image/')).length, color: 'blue' },
                { name: 'Contracts', count: documents.filter(d => d.fileName.toLowerCase().includes('contract')).length, color: 'green' },
                { name: 'Financial Documents', count: documents.filter(d => d.fileName.toLowerCase().includes('financial') || d.fileName.toLowerCase().includes('bank')).length, color: 'purple' },
                { name: 'Legal Documents', count: documents.filter(d => d.fileName.toLowerCase().includes('legal') || d.fileName.toLowerCase().includes('agreement')).length, color: 'orange' },
                { name: 'PDF Files', count: documents.filter(d => d.fileType === 'application/pdf').length, color: 'red' },
                { name: 'Other Documents', count: documents.filter(d => !d.fileType.startsWith('image/') && d.fileType !== 'application/pdf').length, color: 'gray' },
              ].map((category) => (
                <div
                  key={category.name}
                  className={`p-4 rounded-lg border-2 border-${category.color}-200 bg-${category.color}-50`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">{category.name}</span>
                    <Badge variant="outline" className={`text-${category.color}-600 border-${category.color}-600`}>
                      {category.count}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

