'use client';

import { useState, useCallback } from 'react';

interface MediaUploaderProps {
  ownerType: 'community' | 'expert';
  ownerId?: string;
  currentCount?: number;
  maxCount?: number;
  onUploadComplete?: () => void;
}

export function MediaUploader({
  ownerType,
  ownerId,
  currentCount = 0,
  maxCount = 200,
  onUploadComplete,
}: MediaUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const validateFiles = (files: FileList | null): File[] => {
    if (!files) return [];
    
    const validFiles: File[] = [];
    const newErrors: string[] = [];
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    Array.from(files).forEach(file => {
      if (!allowedTypes.includes(file.type)) {
        newErrors.push(`${file.name}: Неподдерживаемый формат. Используйте JPG, PNG или WebP`);
      } else if (file.size > maxSize) {
        newErrors.push(`${file.name}: Файл слишком большой. Максимум 10MB`);
      } else {
        validFiles.push(file);
      }
    });

    if (currentCount + validFiles.length > maxCount) {
      newErrors.push(`Превышен лимит. Можно загрузить еще ${maxCount - currentCount} фото`);
      return [];
    }

    if (validFiles.length > 10) {
      newErrors.push('Можно загрузить максимум 10 файлов за раз');
      return [];
    }

    setErrors(newErrors);
    return validFiles;
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = validateFiles(e.dataTransfer.files);
    if (files.length > 0) {
      setSelectedFiles(files);
    }
  }, [currentCount, maxCount]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const files = validateFiles(e.target.files);
    if (files.length > 0) {
      setSelectedFiles(files);
    }
  }, [currentCount, maxCount]);

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    setUploading(true);
    setErrors([]);

    // TODO: Реализовать загрузку на сервер
    // Пока просто имитируем загрузку
    await new Promise(resolve => setTimeout(resolve, 2000));

    setUploading(false);
    setSelectedFiles([]);
    onUploadComplete?.();
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      {/* Dropzone */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`
          border-2 border-dashed rounded-xl p-12 text-center cursor-pointer
          transition-all duration-200
          ${dragActive 
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
            : 'border-gray-300 dark:border-neutral-600 hover:border-blue-400'
          }
          ${uploading || currentCount >= maxCount ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input
          type="file"
          id="file-upload"
          multiple
          accept="image/jpeg,image/png,image/webp"
          onChange={handleChange}
          disabled={uploading || currentCount >= maxCount}
          className="hidden"
        />
        
        <label htmlFor="file-upload" className="cursor-pointer">
          <div className="flex flex-col items-center gap-4">
            <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            
            <div>
              <p className="text-lg font-medium text-gray-900 dark:text-white">
                {dragActive ? 'Отпустите файлы здесь' : 'Перетащите фото сюда'}
              </p>
              <p className="text-sm text-gray-500 dark:text-neutral-400 mt-1">
                или нажмите для выбора файлов
              </p>
              <p className="text-xs text-gray-400 dark:text-neutral-500 mt-2">
                JPG, PNG, WebP до 10MB • Максимум 10 файлов за раз
              </p>
            </div>
            
            <div className="text-sm text-gray-600 dark:text-neutral-400">
              Загружено: {currentCount} / {maxCount}
            </div>
          </div>
        </label>
      </div>

      {/* Selected Files Preview */}
      {selectedFiles.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-700 dark:text-neutral-300">
              Выбрано файлов: {selectedFiles.length}
            </p>
            <button
              onClick={() => setSelectedFiles([])}
              className="text-sm text-red-600 hover:text-red-700 dark:text-red-400"
            >
              Очистить
            </button>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {selectedFiles.map((file, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-neutral-800">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  onClick={() => removeFile(index)}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <p className="text-xs text-gray-600 dark:text-neutral-400 mt-1 truncate">
                  {file.name}
                </p>
              </div>
            ))}
          </div>

          <button
            onClick={handleUpload}
            disabled={uploading}
            className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
          >
            {uploading ? 'Загрузка...' : `Загрузить ${selectedFiles.length} ${selectedFiles.length === 1 ? 'файл' : 'файлов'}`}
          </button>
        </div>
      )}

      {/* Errors */}
      {errors.length > 0 && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-sm font-medium text-red-800 dark:text-red-300 mb-2">
            Ошибки при загрузке:
          </p>
          <ul className="text-sm text-red-700 dark:text-red-400 space-y-1">
            {errors.map((error, i) => (
              <li key={i}>• {error}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}