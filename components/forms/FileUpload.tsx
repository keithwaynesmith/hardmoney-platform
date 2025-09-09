'use client';

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, File, Image, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface UploadedFile {
  id: string;
  file: File;
  preview?: string;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  error?: string;
  url?: string;
}

interface FileUploadProps {
  onUpload: (files: UploadedFile[]) => void;
  onRemove: (fileId: string) => void;
  maxFiles?: number;
  maxSize?: number; // in bytes
  acceptedTypes?: string[];
  className?: string;
}

export function FileUpload({
  onUpload,
  onRemove,
  maxFiles = 10,
  maxSize = 10 * 1024 * 1024, // 10MB
  acceptedTypes = ['image/*', 'application/pdf', '.doc', '.docx'],
  className = '',
}: FileUploadProps) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles: UploadedFile[] = acceptedFiles.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
      progress: 0,
      status: 'uploading',
    }));

    setFiles((prev) => [...prev, ...newFiles]);
    onUpload([...files, ...newFiles]);

    // Simulate upload progress
    newFiles.forEach((fileObj) => {
      simulateUpload(fileObj);
    });
  }, [files, onUpload]);

  const simulateUpload = async (fileObj: UploadedFile) => {
    setIsUploading(true);
    
    // Simulate upload progress
    for (let progress = 0; progress <= 100; progress += 10) {
      await new Promise(resolve => setTimeout(resolve, 100));
      
      setFiles((prev) =>
        prev.map((f) =>
          f.id === fileObj.id
            ? { ...f, progress }
            : f
        )
      );
    }

    // Simulate completion or error
    const success = Math.random() > 0.1; // 90% success rate for demo
    
    setFiles((prev) =>
      prev.map((f) =>
        f.id === fileObj.id
          ? {
              ...f,
              status: success ? 'completed' : 'error',
              progress: 100,
              error: success ? undefined : 'Upload failed',
              url: success ? `https://example.com/uploads/${fileObj.file.name}` : undefined,
            }
          : f
      )
    );

    setIsUploading(false);
  };

  const removeFile = (fileId: string) => {
    setFiles((prev) => {
      const fileToRemove = prev.find((f) => f.id === fileId);
      if (fileToRemove?.preview) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return prev.filter((f) => f.id !== fileId);
    });
    onRemove(fileId);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles,
    maxSize,
    accept: acceptedTypes.reduce((acc, type) => {
      acc[type] = [];
      return acc;
    }, {} as Record<string, string[]>),
    disabled: isUploading,
  });

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <Image className="w-5 h-5 text-blue-500" />;
    } else if (file.type === 'application/pdf') {
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

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Drop Zone */}
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
          }
          ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />
        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-lg font-medium text-gray-700 mb-2">
          {isDragActive ? 'Drop files here' : 'Drag & drop files here'}
        </p>
        <p className="text-sm text-gray-500 mb-4">
          or click to select files
        </p>
        <div className="text-xs text-gray-400">
          <p>Max {maxFiles} files, {formatFileSize(maxSize)} each</p>
          <p>Accepted: {acceptedTypes.join(', ')}</p>
        </div>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-gray-700">Uploaded Files</h4>
          {files.map((fileObj) => (
            <div
              key={fileObj.id}
              className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
            >
              {/* File Icon/Preview */}
              <div className="flex-shrink-0">
                {fileObj.preview ? (
                  <img
                    src={fileObj.preview}
                    alt={fileObj.file.name}
                    className="w-10 h-10 object-cover rounded"
                  />
                ) : (
                  getFileIcon(fileObj.file)
                )}
              </div>

              {/* File Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {fileObj.file.name}
                </p>
                <p className="text-xs text-gray-500">
                  {formatFileSize(fileObj.file.size)}
                </p>
                
                {/* Progress Bar */}
                {fileObj.status === 'uploading' && (
                  <div className="mt-2">
                    <Progress value={fileObj.progress} className="h-2" />
                    <p className="text-xs text-gray-500 mt-1">
                      {fileObj.progress}% uploaded
                    </p>
                  </div>
                )}

                {/* Status */}
                {fileObj.status === 'completed' && (
                  <div className="flex items-center mt-1">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-xs text-green-600">Upload complete</span>
                  </div>
                )}

                {fileObj.status === 'error' && (
                  <div className="flex items-center mt-1">
                    <AlertCircle className="w-4 h-4 text-red-500 mr-1" />
                    <span className="text-xs text-red-600">
                      {fileObj.error || 'Upload failed'}
                    </span>
                  </div>
                )}
              </div>

              {/* Remove Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeFile(fileObj.id)}
                className="text-gray-400 hover:text-red-500"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Upload Status */}
      {isUploading && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Uploading files... Please don&apos;t close this page.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}

