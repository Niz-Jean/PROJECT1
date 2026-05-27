import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X } from 'lucide-react';
import { upload } from '../services/api';
import toast from 'react-hot-toast';

const ImageUpload = ({ onUpload, multiple = false, maxFiles = 5 }) => {
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles) => {
    setUploading(true);
    try {
      const formData = new FormData();
      acceptedFiles.forEach(file => formData.append('images', file));
      const res = await upload.multiple(acceptedFiles);
      const newImages = [...images, ...res.data.urls];
      setImages(newImages);
      onUpload(newImages);
      toast.success(`${acceptedFiles.length} image(s) uploaded`);
    } catch (error) { toast.error('Upload failed'); }
    finally { setUploading(false); }
  }, [images, onUpload]);

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    onUpload(newImages);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'image/*': [] }, multiple, maxFiles });

  return (
    <div className="space-y-4">
      <div {...getRootProps()} className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}`}>
        <input {...getInputProps()} /><Upload className="h-10 w-10 mx-auto text-gray-400 mb-2" />
        {isDragActive ? <p className="text-blue-600">Drop files here...</p> : <p className="text-gray-500">Drag & drop images or click to browse</p>}
        <p className="text-xs text-gray-400 mt-1">Supported: JPG, PNG, GIF (Max 5MB each)</p>
      </div>
      {images.length > 0 && (<div className="grid grid-cols-3 gap-3">{images.map((img, idx) => (<div key={idx} className="relative group"><img src={img} alt={`Upload ${idx}`} className="w-full h-24 object-cover rounded-lg" /><button onClick={() => removeImage(idx)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"><X className="h-3 w-3" /></button></div>))}</div>)}
      {uploading && <div className="flex items-center justify-center gap-2"><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div><span className="text-sm text-gray-500">Uploading...</span></div>}
    </div>
  );
};

export default ImageUpload;