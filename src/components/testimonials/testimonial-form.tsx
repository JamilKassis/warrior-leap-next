'use client';

import { useState } from 'react';
import { StarIcon } from '@heroicons/react/20/solid';

interface TestimonialFormProps {
  onSubmit: (data: {
    name: string;
    rating: number;
    comment: string;
    email?: string;
    phone?: string;
  }) => Promise<{ isRateLimited?: boolean }>;
}

interface FormErrors {
  name?: string;
  rating?: string;
  comment?: string;
  email?: string;
  phone?: string;
}

const sanitizeInput = (input: string): string => {
  return input.replace(/[<>]/g, '');
};

export function TestimonialForm({ onSubmit }: TestimonialFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<string>('');
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    rating: 0,
    comment: '',
    email: '',
    phone: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    const name = sanitizeInput(formData.name.trim());
    if (!name) newErrors.name = 'Name is required';
    else if (name.length < 2) newErrors.name = 'Name must be at least 2 characters long';
    else if (name.length > 50) newErrors.name = 'Name must be less than 50 characters';

    if (formData.rating === 0) newErrors.rating = 'Please select a rating';

    const comment = sanitizeInput(formData.comment.trim());
    if (!comment) newErrors.comment = 'Comment is required';
    else if (comment.length < 10) newErrors.comment = 'Comment must be at least 10 characters long';
    else if (comment.length > 500) newErrors.comment = 'Comment must be less than 500 characters';

    if (formData.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) newErrors.email = 'Please enter a valid email address';
    }

    if (formData.phone.trim()) {
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
      const cleanPhone = formData.phone.replace(/[\s\-\(\)\.]/g, '');
      if (!phoneRegex.test(cleanPhone)) newErrors.phone = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitSuccess(false);
    setSubmitMessage('');
    setSubmitError(null);

    try {
      const sanitizedData = {
        name: sanitizeInput(formData.name.trim()),
        rating: formData.rating,
        comment: sanitizeInput(formData.comment.trim()),
        ...(formData.email && { email: sanitizeInput(formData.email.trim()) }),
        ...(formData.phone && { phone: sanitizeInput(formData.phone.trim()) }),
      };

      const result = await onSubmit(sanitizedData);
      setSubmitSuccess(true);
      if (result?.isRateLimited) {
        setSubmitMessage('You have already submitted a testimonial. Please try again tomorrow.');
      } else {
        setSubmitMessage('Thank you for your testimonial!');
      }
      setFormData({ name: '', rating: 0, comment: '', email: '', phone: '' });
      setErrors({});
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Failed to submit testimonial');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const sanitizedValue = sanitizeInput(value);
    setFormData((prev) => ({ ...prev, [name]: sanitizedValue }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <div className="text-center mb-5">
        <h3 className="text-xl md:text-2xl font-bold text-brand-dark mb-1">Share Your Experience</h3>
        <p className="text-gray-600 text-sm">Help others discover the benefits</p>
      </div>

      <div className="relative">
        <div className="relative bg-white rounded-xl border border-stone-200 p-5 md:p-6 shadow-sm">
          <div role="status" aria-live="polite" aria-atomic="true">
            {submitSuccess && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-lg mb-4 text-sm">
                {submitMessage}
              </div>
            )}
            {submitError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm" role="alert">
                {submitError}
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label htmlFor="name" className="block text-xs font-medium text-gray-700 mb-1.5">Your Name</label>
                <input
                  type="text" id="name" name="name" required value={formData.name} onChange={handleInputChange}
                  className={`w-full px-3 py-2 rounded-lg border ${errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'} focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/50 transition-colors text-gray-900 placeholder-gray-400 text-sm`}
                  placeholder="Enter your name" maxLength={50}
                />
                {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Rating</label>
                <div className={`flex items-center justify-center py-2 px-3 rounded-lg border ${errors.rating ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'}`}>
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating} type="button"
                      onClick={() => { setFormData((prev) => ({ ...prev, rating })); if (errors.rating) setErrors((prev) => ({ ...prev, rating: undefined })); }}
                      className={`p-0.5 transition-colors ${formData.rating >= rating ? 'text-yellow-500' : 'text-gray-300 hover:text-gray-400'}`}
                    >
                      <StarIcon className="w-5 h-5" />
                    </button>
                  ))}
                </div>
                {errors.rating && <p className="text-xs text-red-600 mt-1">{errors.rating}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="comment" className="block text-xs font-medium text-gray-700 mb-1.5">Your Experience</label>
              <textarea
                id="comment" name="comment" required rows={3} value={formData.comment} onChange={handleInputChange}
                className={`w-full px-3 py-2 rounded-lg border ${errors.comment ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'} focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/50 transition-colors text-gray-900 placeholder-gray-400 text-sm resize-none`}
                placeholder="Share your experience..." maxLength={500}
              />
              <div className="flex justify-between mt-1">
                {errors.comment ? <p className="text-xs text-red-600">{errors.comment}</p> : <span />}
                <span className="text-xs text-gray-400">{formData.comment.length}/500</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="email" className="block text-xs font-medium text-gray-700 mb-1.5">Email <span className="text-gray-400">(Optional)</span></label>
                <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange}
                  className={`w-full px-3 py-2 rounded-lg border ${errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'} focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/50 transition-colors text-gray-900 placeholder-gray-400 text-sm`}
                  placeholder="your@email.com"
                />
                {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
              </div>
              <div>
                <label htmlFor="phone" className="block text-xs font-medium text-gray-700 mb-1.5">Phone <span className="text-gray-400">(Optional)</span></label>
                <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleInputChange}
                  className={`w-full px-3 py-2 rounded-lg border ${errors.phone ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'} focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/50 transition-colors text-gray-900 placeholder-gray-400 text-sm`}
                  placeholder="+961..."
                />
                {errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone}</p>}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <p className="text-xs text-gray-500">Review published after approval</p>
              <button type="submit" disabled={isSubmitting}
                className="px-5 py-2 bg-brand-primary hover:bg-brand-primary/80 text-white font-medium rounded-lg transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
