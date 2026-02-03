'use client';

import { useState, useRef, useEffect } from 'react';
import { getSupabaseClient } from '@/lib/supabase/client';
import { PhotoIcon, XMarkIcon, CloudArrowUpIcon, Bars3Icon } from '@heroicons/react/24/outline';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import {
  CSS,
} from '@dnd-kit/utilities';

interface ImageUploadProps {
  images: {url: string; alt: string; isPrimary: boolean}[];
  onImagesChange: (images: {url: string; alt: string; isPrimary: boolean}[]) => void;
  maxImages?: number;
}

interface UploadedImage {
  id: string;
  url: string;
  alt: string;
  isPrimary: boolean;
  file?: File;
  uploading?: boolean;
  preview?: string;
}

interface SortableImageItemProps {
  image: UploadedImage;
  onUpdateAlt: (alt: string) => void;
  onSetPrimary: () => void;
  onRemove: () => void;
}

function SortableImageItem({ image, onUpdateAlt, onSetPrimary, onRemove }: SortableImageItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: image.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative border border-gray-200 rounded-lg p-3 ${isDragging ? 'z-10 shadow-lg' : ''}`}
    >
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute top-2 right-2 z-10 cursor-grab active:cursor-grabbing bg-white rounded-full p-1 shadow-md hover:shadow-lg transition-all"
      >
        <Bars3Icon className="h-4 w-4 text-gray-600" />
      </div>

      <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 mb-3">
        <img
          src={image.preview || image.url}
          alt={image.alt}
          className="w-full h-full object-cover"
        />
        {image.uploading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <input
          type="text"
          value={image.alt}
          onChange={(e) => onUpdateAlt(e.target.value)}
          placeholder="Image description"
          className="w-full text-xs rounded border-gray-300 focus:border-brand-primary focus:ring-brand-primary"
        />

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <input
              type="radio"
              id={`primary-${image.id}`}
              name="primary_image"
              checked={image.isPrimary}
              onChange={onSetPrimary}
              className="h-3 w-3 text-brand-primary focus:ring-brand-primary border-gray-300"
            />
            <label htmlFor={`primary-${image.id}`} className="text-xs text-gray-700">
              Primary
            </label>
          </div>

          <button
            type="button"
            onClick={onRemove}
            className="text-red-600 hover:text-red-800"
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export function ImageUpload({ images, onImagesChange, maxImages = 5 }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>(
    images.map((img, index) => ({ ...img, id: `image-${index}-${Date.now()}` }))
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Sync uploadedImages with incoming images prop (for editing)
  useEffect(() => {
    setUploadedImages(images.map((img, index) => ({
      ...img,
      id: `image-${index}-${Date.now()}`
    })));
  }, [images]);

  const uploadImage = async (file: File): Promise<string> => {
    const supabase = getSupabaseClient();

    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `products/${fileName}`;

    const { data, error } = await supabase.storage
      .from('images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      throw error;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('images')
      .getPublicUrl(data.path);

    return publicUrl;
  };

  const handleFileSelect = async (files: FileList) => {
    if (uploadedImages.length + files.length > maxImages) {
      alert(`Maximum ${maxImages} images allowed`);
      return;
    }

    setUploading(true);
    const newImages: UploadedImage[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert(`${file.name} is not an image file`);
        continue;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert(`${file.name} is too large. Maximum size is 5MB`);
        continue;
      }

      // Create preview URL
      const previewUrl = URL.createObjectURL(file);

      const imageObj: UploadedImage = {
        id: `image-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        url: '',
        alt: file.name.split('.')[0],
        isPrimary: uploadedImages.length === 0 && newImages.length === 0,
        file,
        uploading: true,
        preview: previewUrl
      };

      newImages.push(imageObj);
    }

    // Add new images to state immediately to show previews
    const updatedImages = [...uploadedImages, ...newImages];
    setUploadedImages(updatedImages);

    // Upload files one by one
    for (let i = 0; i < newImages.length; i++) {
      const imageObj = newImages[i];
      try {
        const url = await uploadImage(imageObj.file!);
        imageObj.url = url;
        imageObj.uploading = false;

        // Update the specific image in the array
        const imageIndex = updatedImages.findIndex(img => img.preview === imageObj.preview);
        if (imageIndex !== -1) {
          updatedImages[imageIndex] = imageObj;
          setUploadedImages([...updatedImages]);
          onImagesChange(updatedImages.map(({ url, alt, isPrimary }) => ({ url, alt, isPrimary })));
        }
      } catch (error) {
        console.error('Upload error:', error);
        alert(`Failed to upload ${imageObj.alt}`);
        // Remove failed upload from array
        const filteredImages = updatedImages.filter(img => img.preview !== imageObj.preview);
        setUploadedImages(filteredImages);
      }
    }

    setUploading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = uploadedImages.findIndex((item) => item.id === active.id);
      const newIndex = uploadedImages.findIndex((item) => item.id === over.id);

      const newImages = arrayMove(uploadedImages, oldIndex, newIndex);
      setUploadedImages(newImages);
      onImagesChange(newImages.map(({ url, alt, isPrimary }) => ({ url, alt, isPrimary })));
    }
  };

  const removeImage = (index: number) => {
    const newImages = uploadedImages.filter((_, i) => i !== index);

    // If we removed the primary image, make the first image primary
    if (uploadedImages[index].isPrimary && newImages.length > 0) {
      newImages[0].isPrimary = true;
    }

    setUploadedImages(newImages);
    onImagesChange(newImages.map(({ url, alt, isPrimary }) => ({ url, alt, isPrimary })));
  };

  const updateImageAlt = (index: number, alt: string) => {
    const newImages = [...uploadedImages];
    newImages[index].alt = alt;
    setUploadedImages(newImages);
    onImagesChange(newImages.map(({ url, alt, isPrimary }) => ({ url, alt, isPrimary })));
  };

  const setPrimaryImage = (index: number) => {
    const newImages = uploadedImages.map((img, i) => ({
      ...img,
      isPrimary: i === index
    }));
    setUploadedImages(newImages);
    onImagesChange(newImages.map(({ url, alt, isPrimary }) => ({ url, alt, isPrimary })));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          Product Images
        </label>
        <span className="text-xs text-gray-500">
          {uploadedImages.length}/{maxImages} images
        </span>
      </div>

      {/* Upload Area */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-gray-400 transition-colors">
        <div className="text-center">
          <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
          <div className="mt-4">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading || uploadedImages.length >= maxImages}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-brand-primary hover:bg-brand-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CloudArrowUpIcon className="h-4 w-4 mr-2" />
              {uploading ? 'Uploading...' : 'Upload Images'}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
              className="hidden"
            />
          </div>
          <p className="mt-2 text-xs text-gray-500">
            PNG, JPG, GIF up to 5MB each. Maximum {maxImages} images.
          </p>
        </div>
      </div>

      {/* Image Previews with Drag and Drop */}
      {uploadedImages.length > 0 && (
        <div>
          <div className="mb-2 flex items-center space-x-2">
            <Bars3Icon className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">Drag images to reorder them</span>
          </div>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={uploadedImages.map((img) => img.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {uploadedImages.map((image, index) => (
                  <SortableImageItem
                    key={image.id}
                    image={image}
                    onUpdateAlt={(alt) => updateImageAlt(index, alt)}
                    onSetPrimary={() => setPrimaryImage(index)}
                    onRemove={() => removeImage(index)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      )}
    </div>
  );
}