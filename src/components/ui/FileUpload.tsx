import React, { useState, useRef } from 'react';
import { Upload, X, FileText, Film, CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '../../utils/cn';
import { Button } from './Button';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  maxSize?: number; // in MB
  label?: string;
  helperText?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  accept = '.pdf,.mp4',
  maxSize = 100,
  label = "Télécharger un fichier",
  helperText = "PDF ou MP4 (max 100MB)"
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (selectedFile: File) => {
    setError(null);
    
    // Check extension
    const ext = selectedFile.name.split('.').pop()?.toLowerCase();
    const allowed = accept.split(',').map(a => a.replace('.', '').toLowerCase());
    
    if (ext && !allowed.includes(ext)) {
      setError(`Format non supporté. formats acceptés: ${accept}`);
      return false;
    }

    // Check size
    if (selectedFile.size > maxSize * 1024 * 1024) {
      setError(`Le fichier est trop lourd. Maximum ${maxSize}MB.`);
      return false;
    }

    return true;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && validateFile(selectedFile)) {
      setFile(selectedFile);
      onFileSelect(selectedFile);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile && validateFile(droppedFile)) {
      setFile(droppedFile);
      onFileSelect(droppedFile);
    }
  };

  const removeFile = () => {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-3">
      {label && <label className="text-sm font-black text-slate-700 uppercase tracking-widest ml-1">{label}</label>}
      
      {!file ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            "relative border-2 border-dashed rounded-3xl p-10 transition-all cursor-pointer group flex flex-col items-center justify-center text-center",
            isDragging 
              ? "border-indigo-600 bg-indigo-50/50" 
              : "border-slate-200 bg-slate-50 hover:border-indigo-300 hover:bg-slate-100/50"
          )}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept={accept}
            className="hidden"
          />
          
          <div className={cn(
            "w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 shadow-lg shadow-indigo-100 bg-white text-indigo-600",
            isDragging && "scale-110 shadow-indigo-200"
          )}>
            <Upload className="w-8 h-8" />
          </div>
          
          <p className="text-base font-black text-slate-900">
            Cliquez ou glissez-déposez
          </p>
          <p className="text-xs font-bold text-slate-400 mt-2 uppercase tracking-widest">
            {helperText}
          </p>

          {error && (
            <div className="mt-4 flex items-center space-x-2 text-rose-500 bg-rose-50 px-4 py-2 rounded-xl border border-rose-100 animate-in fade-in slide-in-from-top-1">
              <AlertCircle className="w-4 h-4" />
              <span className="text-xs font-bold">{error}</span>
            </div>
          )}
        </div>
      ) : (
        <div className="relative p-6 rounded-3xl border-2 border-indigo-100 bg-indigo-50/30 flex items-center justify-between group animate-in zoom-in-95">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-md shadow-indigo-100">
              {file.name.endsWith('.mp4') ? (
                <Film className="w-6 h-6 text-indigo-600" />
              ) : (
                <FileText className="w-6 h-6 text-indigo-600" />
              )}
            </div>
            <div>
              <p className="text-sm font-black text-slate-900 line-clamp-1">{file.name}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                {(file.size / (1024 * 1024)).toFixed(2)} MB • Prêt pour l'upload
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={(e) => {
                e.stopPropagation();
                removeFile();
              }}
              className="h-8 w-8 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
