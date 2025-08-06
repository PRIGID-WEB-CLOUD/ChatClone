import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Upload, X, File, Image, Video } from "lucide-react";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  onFileRemove?: () => void;
  accept?: string;
  maxSize?: number; // in bytes
  className?: string;
  placeholder?: string;
  currentFile?: File | string;
}

export default function FileUpload({
  onFileSelect,
  onFileRemove,
  accept = "image/*,video/*",
  maxSize = 10 * 1024 * 1024, // 10MB default
  className,
  placeholder = "Drag and drop a file, or click to browse",
  currentFile
}: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getFileIcon = (file: File | string) => {
    const fileName = typeof file === "string" ? file : file.name;
    const extension = fileName.split('.').pop()?.toLowerCase();
    
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension || '')) {
      return <Image className="w-8 h-8 text-blue-500" />;
    }
    
    if (['mp4', 'mov', 'avi', 'mkv'].includes(extension || '')) {
      return <Video className="w-8 h-8 text-purple-500" />;
    }
    
    return <File className="w-8 h-8 text-gray-500" />;
  };

  const validateFile = (file: File): string | null => {
    if (file.size > maxSize) {
      const sizeMB = Math.round(maxSize / (1024 * 1024));
      return `File size must be less than ${sizeMB}MB`;
    }

    if (accept) {
      const acceptedTypes = accept.split(',').map(type => type.trim());
      const isAccepted = acceptedTypes.some(type => {
        if (type.startsWith('.')) {
          return file.name.toLowerCase().endsWith(type.toLowerCase());
        }
        if (type.includes('/*')) {
          return file.type.startsWith(type.replace('/*', ''));
        }
        return file.type === type;
      });

      if (!isAccepted) {
        return `File type not accepted. Allowed types: ${accept}`;
      }
    }

    return null;
  };

  const handleFileSelect = (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    onFileSelect(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleRemove = () => {
    setError(null);
    onFileRemove?.();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getFileName = () => {
    if (typeof currentFile === "string") {
      return currentFile.split('/').pop() || currentFile;
    }
    return currentFile?.name;
  };

  const getFileSize = () => {
    if (typeof currentFile === "string") return null;
    if (!currentFile?.size) return null;
    
    const size = currentFile.size;
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  };

  if (currentFile) {
    return (
      <Card className={cn("p-4", className)}>
        <div className="flex items-center space-x-3">
          {getFileIcon(currentFile)}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {getFileName()}
            </p>
            {getFileSize() && (
              <p className="text-xs text-gray-500">{getFileSize()}</p>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRemove}
            className="text-red-500 hover:text-red-700"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
        {error && (
          <p className="text-sm text-red-500 mt-2">{error}</p>
        )}
      </Card>
    );
  }

  return (
    <div className={cn("space-y-2", className)}>
      <Card
        className={cn(
          "border-2 border-dashed transition-colors cursor-pointer",
          isDragOver 
            ? "border-primary bg-primary/5" 
            : "border-gray-300 hover:border-primary/50",
          error && "border-red-300"
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
      >
        <div className="p-8 text-center">
          <Upload className={cn(
            "w-12 h-12 mx-auto mb-4",
            isDragOver ? "text-primary" : "text-gray-400"
          )} />
          <p className="text-gray-600 mb-2">{placeholder}</p>
          <p className="text-sm text-gray-400">
            {accept.includes('image') && accept.includes('video') 
              ? "PNG, JPG, MP4 up to"
              : accept.includes('image') 
              ? "PNG, JPG up to"
              : "Files up to"
            } {Math.round(maxSize / (1024 * 1024))}MB
          </p>
        </div>
      </Card>

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileInputChange}
        className="hidden"
      />

      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}
