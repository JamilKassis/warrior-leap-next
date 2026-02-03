'use client';

import React, { useState } from 'react';
import { Tag, Star, Shield, Zap, Heart, Award, CheckCircle, Sparkles, Flame, Target, Globe, X } from 'lucide-react';
import type { ProductFormData } from '../../types';

interface FeaturesSectionProps {
  formData: ProductFormData;
  setFormData: React.Dispatch<React.SetStateAction<ProductFormData>>;
}

export const FeaturesSection: React.FC<FeaturesSectionProps> = ({ formData, setFormData }) => {
  const [newFeature, setNewFeature] = useState({ text: '', icon: 'Star' });

  // Available icons for features
  const featureIcons = [
    { name: 'Star', icon: Star, label: '⭐ Star' },
    { name: 'Shield', icon: Shield, label: '🛡️ Shield' },
    { name: 'Zap', icon: Zap, label: '⚡ Lightning' },
    { name: 'Heart', icon: Heart, label: '❤️ Heart' },
    { name: 'Award', icon: Award, label: '🏆 Award' },
    { name: 'CheckCircle', icon: CheckCircle, label: '✅ Check' },
    { name: 'Sparkles', icon: Sparkles, label: '✨ Sparkles' },
    { name: 'Flame', icon: Flame, label: '🔥 Fire' },
    { name: 'Target', icon: Target, label: '🎯 Target' },
    { name: 'Globe', icon: Globe, label: '🌍 Globe' }
  ];

  const addFeature = () => {
    if (newFeature.text.trim()) {
      const featureObj = {
        text: newFeature.text.trim(),
        icon: newFeature.icon
      };
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, featureObj]
      }));
      setNewFeature({ text: '', icon: 'Star' });
    }
  };

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Tag className="w-4 h-4 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Product Features</h3>
          <p className="text-gray-600 text-xs">Highlight key features and benefits with icons</p>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <input
            type="text"
            value={newFeature.text}
            onChange={(e) => setNewFeature(prev => ({ ...prev, text: e.target.value }))}
            placeholder="Add a compelling feature"
            className="md:col-span-2 px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-all duration-200 bg-white text-gray-900"
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
          />
          <select
            value={newFeature.icon}
            onChange={(e) => setNewFeature(prev => ({ ...prev, icon: e.target.value }))}
            className="px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-primary focus:border-brand-primary bg-white text-gray-900"
          >
            {featureIcons.map((iconData) => (
              <option key={iconData.name} value={iconData.name}>
                {iconData.label}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={addFeature}
            disabled={!newFeature.text.trim()}
            className="px-4 py-2.5 bg-brand-primary text-white rounded-xl hover:bg-brand-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold hover:shadow-lg text-sm"
          >
            Add Feature
          </button>
        </div>
        
        {formData.features.length > 0 && (
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <h4 className="font-medium text-gray-900 mb-2 text-sm">Current Features ({formData.features.length})</h4>
            <div className="flex flex-wrap gap-2">
              {formData.features.map((feature, index) => {
                // Handle both old string format and new object format
                const featureText = typeof feature === 'string' ? feature : feature.text;
                const featureIcon = typeof feature === 'string' ? 'Star' : feature.icon;
                const IconComponent = featureIcons.find(f => f.name === featureIcon)?.icon || Star;
                
                return (
                  <span
                    key={index}
                    className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1.5 rounded-full text-xs font-medium border border-blue-200 hover:bg-blue-200 transition-colors"
                  >
                    <IconComponent className="w-3 h-3" />
                    {featureText}
                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
                      className="text-blue-600 hover:text-blue-800 hover:bg-blue-200 rounded-full p-0.5 transition-all"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}; 