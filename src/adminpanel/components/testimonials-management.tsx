'use client';

import { useState, useEffect } from 'react';
import { getSupabaseClient } from '@/lib/supabase/client';
import { Testimonial } from '@/hooks/use-testimonials';
import { StarIcon } from '@heroicons/react/20/solid';
import { CheckCircleIcon, XCircleIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';

export function TestimonialsManagement() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string>('');
  const [newTestimonial, setNewTestimonial] = useState({
    name: '',
    rating: 5,
    comment: '',
    email: '',
    phone: '',
    ip_address: '127.0.0.1' // Default IP for admin-created testimonials
  });

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const debugConnection = async () => {
    try {
      const supabase = getSupabaseClient();

      const user = await supabase.auth.getUser();
      setDebugInfo(`User: ${user?.data?.user?.email || 'No user'}`);

      // Test basic connection
      const { error } = await supabase.from('testimonials').select('count');
      if (error) {
        setDebugInfo(prev => prev + `\nConnection Error: ${error.message}`);
      } else {
        setDebugInfo(prev => prev + `\nConnection: OK`);
      }
    } catch (err) {
      setDebugInfo(`Debug Error: ${err}`);
    }
  };

  const fetchTestimonials = async () => {
    try {
      const supabase = getSupabaseClient();

      console.log('Fetching testimonials...');
      console.log('Current user:', await supabase.auth.getUser());

      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching testimonials:', error);
        throw error;
      }

      // Debug log to check what data we're receiving
      console.log('Fetched testimonials:', data);
      console.log('Total testimonials:', data?.length);
      console.log('First testimonial structure:', data?.[0]);

      setTestimonials(data || []);
      setError(null); // Clear any previous errors
    } catch (err) {
      console.error('Error in fetchTestimonials:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch testimonials');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      const supabase = getSupabaseClient();

      console.log('Attempting to approve testimonial:', id);
      console.log('Current user:', await supabase.auth.getUser());

      const { data, error } = await supabase
        .from('testimonials')
        .update({ approved: true })
        .eq('id', id)
        .select();

      if (error) {
        console.error('Supabase error details:', error);
        throw error;
      }

      console.log('Update successful:', data);
      await fetchTestimonials();
      setError(null); // Clear any previous errors
    } catch (err) {
      console.error('Full error in handleApprove:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to approve testimonial';
      setError(`Failed to approve testimonial: ${errorMessage}`);
    }
  };

  const handleDisapprove = async (id: string) => {
    try {
      const supabase = getSupabaseClient();

      const { error } = await supabase
        .from('testimonials')
        .update({ approved: false })
        .eq('id', id);

      if (error) throw error;
      await fetchTestimonials();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to disapprove testimonial');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this testimonial?')) {
      return;
    }

    try {
      const supabase = getSupabaseClient();

      const { error } = await supabase
        .from('testimonials')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchTestimonials();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete testimonial');
    }
  };

  const handleAddTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const supabase = getSupabaseClient();

      const testimonialData = {
        name: newTestimonial.name,
        rating: newTestimonial.rating,
        comment: newTestimonial.comment,
        ip_address: newTestimonial.ip_address,
        approved: true, // Auto-approve admin-created testimonials
        ...(newTestimonial.email && { email: newTestimonial.email }),
        ...(newTestimonial.phone && { phone: newTestimonial.phone })
      };

      const { error } = await supabase
        .from('testimonials')
        .insert([testimonialData]);

      if (error) throw error;

      // Reset form and close modal
      setNewTestimonial({
        name: '',
        rating: 5,
        comment: '',
        email: '',
        phone: '',
        ip_address: '127.0.0.1'
      });
      setIsModalOpen(false);
      await fetchTestimonials();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add testimonial');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-2 sm:space-y-4 lg:space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white hidden">Testimonials</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center px-2 py-1 sm:px-3 sm:py-1.5 lg:px-4 lg:py-2 bg-brand-primary text-white rounded-lg sm:rounded-xl hover:bg-brand-primary/90 transition-all duration-200 shadow-lg shadow-brand-primary/20"
        >
          <PlusIcon className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 mr-1" />
          <span className="text-xs sm:text-sm font-medium">New Review</span>
        </button>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-2 sm:p-3 lg:p-4">
          <div className="flex">
            <div className="ml-2 sm:ml-3">
              <h3 className="text-xs sm:text-sm font-medium text-red-800">{error}</h3>
              <button
                onClick={debugConnection}
                className="mt-1 sm:mt-2 text-[10px] sm:text-xs text-blue-600 underline"
              >
                Debug Connection
              </button>
            </div>
          </div>
        </div>
      )}

      {debugInfo && (
        <div className="rounded-md bg-blue-50 p-2 sm:p-3 lg:p-4">
          <div className="flex">
            <div className="ml-2 sm:ml-3">
              <h3 className="text-xs sm:text-sm font-medium text-blue-800">Debug Info:</h3>
              <pre className="text-[10px] sm:text-xs text-blue-700 mt-1 whitespace-pre-wrap">{debugInfo}</pre>
            </div>
          </div>
        </div>
      )}

      <div className="rounded-lg overflow-hidden">
        <ul className="divide-y divide-white/10">
          {testimonials.map((testimonial) => (
            <li key={testimonial.id} className="hover:bg-white/5 transition-colors duration-150 rounded-lg lg:rounded-xl mb-1 sm:mb-2">
              <div className="px-2 py-2 sm:px-3 sm:py-3 lg:px-6 lg:py-5">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 lg:gap-3">
                    <p className="text-sm sm:text-base lg:text-lg font-semibold text-white">{testimonial.name}</p>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon
                          key={i}
                          className={`h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 ${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-700'
                            }`}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-1 sm:gap-2">
                    {!testimonial.approved ? (
                      <button
                        onClick={() => handleApprove(testimonial.id)}
                        className="inline-flex items-center px-1.5 py-0.5 sm:px-2 sm:py-1 lg:px-3 lg:py-1.5 bg-green-500/10 text-green-400 border border-green-500/20 rounded-md sm:rounded-lg hover:bg-green-500/20 transition-all duration-200"
                        title="Approve"
                      >
                        <CheckCircleIcon className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5" />
                        <span className="text-[10px] sm:text-xs lg:text-sm font-medium ml-0.5 sm:ml-1 hidden sm:inline">Approve</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleDisapprove(testimonial.id)}
                        className="inline-flex items-center px-1.5 py-0.5 sm:px-2 sm:py-1 lg:px-3 lg:py-1.5 bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 rounded-md sm:rounded-lg hover:bg-yellow-500/20 transition-all duration-200"
                        title="Disapprove"
                      >
                        <XCircleIcon className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5" />
                        <span className="text-[10px] sm:text-xs lg:text-sm font-medium ml-0.5 sm:ml-1 hidden sm:inline">Disapprove</span>
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(testimonial.id)}
                      className="inline-flex items-center px-1.5 py-0.5 sm:px-2 sm:py-1 lg:px-3 lg:py-1.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-md sm:rounded-lg hover:bg-red-500/20 transition-all duration-200"
                      title="Delete"
                    >
                      <TrashIcon className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5" />
                      <span className="text-[10px] sm:text-xs lg:text-sm font-medium ml-0.5 sm:ml-1 hidden sm:inline">Delete</span>
                    </button>
                  </div>
                </div>
                <div className="mt-1.5 sm:mt-2 lg:mt-3">
                  <p className="text-xs sm:text-sm lg:text-base text-gray-300">{testimonial.comment}</p>
                </div>

                {/* Contact Information Section */}
                {(testimonial.email || testimonial.phone) && (
                  <div className="mt-2 sm:mt-3 p-2 sm:p-3 bg-blue-900/10 border border-blue-500/20 rounded-md sm:rounded-lg">
                    <div className="flex items-center mb-1 sm:mb-2">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                      </svg>
                      <span className="text-xs sm:text-sm font-semibold text-blue-300">Contact Information</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-1 sm:gap-2">
                      {testimonial.email && (
                        <div className="flex items-center text-[10px] sm:text-xs lg:text-sm text-blue-300">
                          <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          <span className="font-medium">Email:</span>
                          <a href={`mailto:${testimonial.email}`} className="ml-1 underline hover:text-blue-100 truncate">
                            {testimonial.email}
                          </a>
                        </div>
                      )}
                      {testimonial.phone && (
                        <div className="flex items-center text-[10px] sm:text-xs lg:text-sm text-blue-300">
                          <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          <span className="font-medium">Phone:</span>
                          <a href={`tel:${testimonial.phone}`} className="ml-1 underline hover:text-blue-100">
                            {testimonial.phone}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="mt-1.5 sm:mt-2 lg:mt-3 flex flex-wrap items-center text-[10px] sm:text-xs lg:text-sm text-gray-500 gap-x-2 sm:gap-x-3 lg:gap-x-4 gap-y-1">
                  <p>
                    {new Date(testimonial.created_at).toLocaleDateString()}
                  </p>
                  <span className="hidden sm:inline">•</span>
                  <p className="hidden sm:inline">IP: {testimonial.ip_address}</p>
                  <span>•</span>
                  <p
                    className={`font-medium ${testimonial.approved ? 'text-green-400' : 'text-yellow-400'
                      }`}
                  >
                    {testimonial.approved ? 'Approved' : 'Pending'}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Add Testimonial Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-3 lg:p-4 z-50 overflow-y-auto">
          <div className="bg-brand-dark/95 border border-white/10 rounded-xl sm:rounded-2xl p-3 sm:p-5 lg:p-8 max-w-md w-full shadow-2xl relative my-2 sm:my-4">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-3 sm:mb-4 lg:mb-6 text-center">Add New Testimonial</h2>
            <form onSubmit={handleAddTestimonial}>
              <div className="space-y-3 sm:space-y-4 lg:space-y-6">
                <div>
                  <label htmlFor="name" className="block text-xs sm:text-sm font-semibold text-gray-300 mb-1 sm:mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={newTestimonial.name}
                    onChange={(e) => setNewTestimonial({ ...newTestimonial, name: e.target.value })}
                    className="w-full px-2 py-2 sm:px-3 sm:py-2.5 lg:px-4 lg:py-3 text-sm sm:text-base bg-white/5 border border-white/10 rounded-lg sm:rounded-xl focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all duration-300 text-white"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="rating" className="block text-xs sm:text-sm font-semibold text-gray-300 mb-1 sm:mb-2">
                    Rating
                  </label>
                  <select
                    id="rating"
                    value={newTestimonial.rating}
                    onChange={(e) => setNewTestimonial({ ...newTestimonial, rating: Number(e.target.value) })}
                    className="w-full px-2 py-2 sm:px-3 sm:py-2.5 lg:px-4 lg:py-3 text-sm sm:text-base bg-white/5 border border-white/10 rounded-lg sm:rounded-xl focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all duration-300 text-white"
                  >
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <option key={rating} value={rating} className="text-brand-dark">
                        {rating} {rating === 1 ? 'Star' : 'Stars'}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="comment" className="block text-xs sm:text-sm font-semibold text-gray-300 mb-1 sm:mb-2">
                    Comment
                  </label>
                  <textarea
                    id="comment"
                    value={newTestimonial.comment}
                    onChange={(e) => setNewTestimonial({ ...newTestimonial, comment: e.target.value })}
                    rows={3}
                    className="w-full px-2 py-2 sm:px-3 sm:py-2.5 lg:px-4 lg:py-3 text-sm sm:text-base bg-white/5 border border-white/10 rounded-lg sm:rounded-xl focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all duration-300 resize-none text-white"
                    required
                  />
                </div>

                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-xs sm:text-sm font-semibold text-gray-300 mb-1 sm:mb-2">
                    Email <span className="text-gray-500 text-[10px] sm:text-xs">(Optional)</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={newTestimonial.email}
                    onChange={(e) => setNewTestimonial({ ...newTestimonial, email: e.target.value })}
                    className="w-full px-2 py-2 sm:px-3 sm:py-2.5 lg:px-4 lg:py-3 text-sm sm:text-base bg-white/5 border border-white/10 rounded-lg sm:rounded-xl focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all duration-300 text-white"
                    placeholder="customer@example.com"
                  />
                </div>

                {/* Phone Field */}
                <div>
                  <label htmlFor="phone" className="block text-xs sm:text-sm font-semibold text-gray-300 mb-1 sm:mb-2">
                    Phone <span className="text-gray-500 text-[10px] sm:text-xs">(Optional)</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={newTestimonial.phone}
                    onChange={(e) => setNewTestimonial({ ...newTestimonial, phone: e.target.value })}
                    className="w-full px-2 py-2 sm:px-3 sm:py-2.5 lg:px-4 lg:py-3 text-sm sm:text-base bg-white/5 border border-white/10 rounded-lg sm:rounded-xl focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all duration-300 text-white"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>
              <div className="mt-4 sm:mt-6 lg:mt-8 flex justify-end space-x-2 sm:space-x-3 lg:space-x-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-2 sm:px-4 sm:py-2.5 lg:px-6 lg:py-3 text-xs sm:text-sm text-gray-300 bg-white/5 border border-white/10 rounded-lg sm:rounded-xl hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all duration-300 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 sm:px-6 sm:py-2.5 lg:px-8 lg:py-3 text-xs sm:text-sm text-white bg-gradient-to-r from-brand-primary to-brand-dark border border-transparent rounded-lg sm:rounded-xl hover:from-brand-primary/90 hover:to-brand-dark/90 focus:outline-none focus:ring-4 focus:ring-brand-primary/50 transition-all duration-300 font-medium shadow-lg shadow-brand-primary/25 transform hover:scale-105"
                >
                  Add Testimonial
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}