/** @format */

'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';

const CategoriesForm = ({
  onSubmit,
  isSubmitting,
  initialData = null,
  buttonText = 'Submit',
}) => {
  const [name, setName] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      if (initialData.image && initialData.image.url) {
        setImagePreview(initialData.image.url);
      }
    }
  }, [initialData]);

  useEffect(() => {
    // Cleanup the object URL on component unmount
    return () => {
      if (imagePreview && imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      // Revoke previous blob URL to prevent memory leaks
      if (imagePreview && imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview);
      }
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImage(null);
      setImagePreview(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    if (image) {
      formData.append('image', image);
    }
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-lg">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>
            {initialData ? 'Edit Category' : 'Create Category'}
          </CardTitle>
          <CardDescription>
            {initialData
              ? 'Update the details of the existing category.'
              : 'Fill in the details below to create a new category.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Category Name</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Electronics"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="file-upload">Category Image</Label>
            <Input id="file-upload" type="file" onChange={handleImageChange} />
          </div>

          {imagePreview && (
            <div className="mt-4">
              <Label>Image Preview</Label>
              <div className="mt-2 w-full h-48 relative rounded-md border overflow-hidden">
                <Image
                  src={imagePreview}
                  alt="Image Preview"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-md"
                />
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? 'Submitting...' : buttonText}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );};

export default CategoriesForm;