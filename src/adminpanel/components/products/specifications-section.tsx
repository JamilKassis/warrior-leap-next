'use client';

import React, { useState } from 'react';
import {
  Settings, Shield, Zap, Target, Package, X,
  Thermometer, Wrench, Droplet, Timer, Maximize2, Layers, Lock, AlertTriangle, Briefcase, Cpu, Filter, Check, Plus
} from 'lucide-react';
import type { ProductFormData } from '../../types';

interface SpecificationsSectionProps {
  formData: ProductFormData;
  setFormData: React.Dispatch<React.SetStateAction<ProductFormData>>;
}

export const SpecificationsSection: React.FC<SpecificationsSectionProps> = ({ formData, setFormData }) => {
  const [newSpec, setNewSpec] = useState({ title: '', description: '', icon: 'Shield' });
  const [editingSpecIndex, setEditingSpecIndex] = useState<number | null>(null);
  const [editingField, setEditingField] = useState<'title' | 'description' | null>(null);
  const [editValue, setEditValue] = useState('');

  // Available icons for specifications (matching frontend ProductSpecifications component)
  const specificationIcons = [
    { name: 'Shield', icon: Shield, label: '🛡️ Protection' },
    { name: 'Thermometer', icon: Thermometer, label: '🌡️ Temperature' },
    { name: 'Wrench', icon: Wrench, label: '🔧 Maintenance' },
    { name: 'Target', icon: Target, label: '🎯 Precision' },
    { name: 'Filter', icon: Filter, label: '🔍 Filter' },
    { name: 'Briefcase', icon: Briefcase, label: '💼 Professional' },
    { name: 'Maximize2', icon: Maximize2, label: '📏 Dimensions' },
    { name: 'Timer', icon: Timer, label: '⏱️ Timer' },
    { name: 'Layers', icon: Layers, label: '📚 Layers' },
    { name: 'Droplet', icon: Droplet, label: '💧 Liquid' },
    { name: 'Lock', icon: Lock, label: '🔒 Security' },
    { name: 'AlertTriangle', icon: AlertTriangle, label: '⚠️ Warning' },
    { name: 'Package', icon: Package, label: '📦 Package' },
    { name: 'Zap', icon: Zap, label: '⚡ Power' },
    { name: 'Cpu', icon: Cpu, label: '💻 Processing' }
  ];

  const addSpecification = () => {
    if (newSpec.title.trim() && newSpec.description.trim()) {
      const specObj = {
        title: newSpec.title.trim(),
        description: newSpec.description.trim(),
        icon: newSpec.icon
      };
      
      setFormData(prev => ({
        ...prev,
        specifications: [...(prev.specifications || []), specObj]
      }));
      
      setNewSpec({ title: '', description: '', icon: 'Shield' });
    }
  };

  const startInlineEdit = (index: number, field: 'title' | 'description', currentValue: string) => {
    setEditingSpecIndex(index);
    setEditingField(field);
    setEditValue(currentValue);
  };

  const saveInlineEdit = () => {
    if (editingSpecIndex !== null && editingField && editValue.trim()) {
      setFormData(prev => ({
        ...prev,
        specifications: (prev.specifications || []).map((spec, index) => 
          index === editingSpecIndex 
            ? { ...spec, [editingField]: editValue.trim() }
            : spec
        )
      }));
    }
    cancelInlineEdit();
  };

  const cancelInlineEdit = () => {
    setEditingSpecIndex(null);
    setEditingField(null);
    setEditValue('');
  };

  const updateSpecIcon = (index: number, newIcon: string) => {
    setFormData(prev => ({
      ...prev,
      specifications: (prev.specifications || []).map((spec, specIndex) => 
        specIndex === index ? { ...spec, icon: newIcon } : spec
      )
    }));
  };

  const removeSpecification = (index: number) => {
    setFormData(prev => ({
      ...prev,
      specifications: (prev.specifications || []).filter((_, i) => i !== index)
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      saveInlineEdit();
    } else if (e.key === 'Escape') {
      cancelInlineEdit();
    }
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
        <div className="p-2 bg-purple-100 rounded-lg">
          <Settings className="w-4 h-4 text-purple-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Technical Specifications</h3>
          <p className="text-gray-600 text-xs">Detailed technical information with professional icons</p>
        </div>
      </div>
      
      <div className="space-y-3">
        {/* Existing Specifications */}
        {(formData.specifications || []).length > 0 && (
          <div className="space-y-2">
            {(formData.specifications || []).map((spec, index) => {
              const specIcon = spec.icon || 'Shield';
              const IconComponent = specificationIcons.find(f => f.name === specIcon)?.icon || Shield;
              
              return (
                <div key={index} className="group bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md hover:border-purple-200 transition-all duration-200">
                  <div className="flex items-start gap-3">
                    {/* Icon Section */}
                    <div className="flex-shrink-0">
                      <div className="w-9 h-9 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                        <IconComponent className="w-5 h-5 text-purple-600" />
                      </div>
                      <select
                        value={specIcon}
                        onChange={(e) => updateSpecIcon(index, e.target.value)}
                        className="mt-1.5 w-full text-xs border border-gray-300 rounded-md px-1.5 py-1 bg-white text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 font-medium shadow-sm"
                      >
                        {specificationIcons.map((iconData) => (
                          <option key={iconData.name} value={iconData.name} className="text-gray-900 bg-white">
                            {iconData.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    {/* Content Section */}
                    <div className="flex-1 min-w-0">
                      {/* Title */}
                      <div className="mb-1">
                        {editingSpecIndex === index && editingField === 'title' ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              onKeyDown={handleKeyPress}
                              onBlur={saveInlineEdit}
                              autoFocus
                              className="flex-1 px-2 py-1.5 border-2 border-purple-500 rounded-md focus:ring-2 focus:ring-purple-500 text-sm font-semibold bg-white text-gray-900"
                              placeholder="Specification title"
                            />
                            <button
                              onClick={saveInlineEdit}
                              className="p-1.5 text-green-600 hover:bg-green-50 rounded-md transition-colors"
                              title="Save"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={cancelInlineEdit}
                              className="p-1.5 text-gray-500 hover:bg-gray-50 rounded-md transition-colors"
                              title="Cancel"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <h4
                            className="text-sm font-semibold text-gray-900 cursor-pointer hover:text-purple-600 hover:bg-purple-50 px-1.5 py-1 rounded-md transition-all duration-200"
                            onClick={() => startInlineEdit(index, 'title', spec.title)}
                            title="Click to edit title"
                          >
                            {spec.title}
                          </h4>
                        )}
                      </div>
                      
                      {/* Description */}
                      <div>
                        {editingSpecIndex === index && editingField === 'description' ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              onKeyDown={handleKeyPress}
                              onBlur={saveInlineEdit}
                              autoFocus
                              className="flex-1 px-2 py-1.5 border-2 border-purple-500 rounded-md focus:ring-2 focus:ring-purple-500 text-xs bg-white text-gray-900"
                              placeholder="Description or value"
                            />
                            <button
                              onClick={saveInlineEdit}
                              className="p-1.5 text-green-600 hover:bg-green-50 rounded-md transition-colors"
                              title="Save"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={cancelInlineEdit}
                              className="p-1.5 text-gray-500 hover:bg-gray-50 rounded-md transition-colors"
                              title="Cancel"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <p
                            className="text-gray-600 text-xs cursor-pointer hover:text-gray-800 hover:bg-gray-50 px-1.5 py-1 rounded-md transition-all duration-200"
                            onClick={() => startInlineEdit(index, 'description', spec.description)}
                            title="Click to edit description"
                          >
                            {spec.description}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => removeSpecification(index)}
                        className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-all duration-200"
                        title="Delete specification"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Add New Specification */}
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-dashed border-purple-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 bg-purple-100 rounded-md flex items-center justify-center">
              <Plus className="w-3.5 h-3.5 text-purple-600" />
            </div>
            <h4 className="text-sm font-semibold text-gray-900">Add New Specification</h4>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
            <div className="lg:col-span-4">
              <label className="block text-xs font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                value={newSpec.title}
                onChange={(e) => setNewSpec(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., Dimensions, Material, Power"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-white text-gray-900 text-sm"
              />
            </div>
            
            <div className="lg:col-span-5">
              <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
              <input
                type="text"
                value={newSpec.description}
                onChange={(e) => setNewSpec(prev => ({ ...prev, description: e.target.value }))}
                placeholder="e.g., 170x80x70 cm, Premium aluminum, 1200W"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-white text-gray-900 text-sm"
              />
            </div>
            
            <div className="lg:col-span-2">
              <label className="block text-xs font-medium text-gray-700 mb-1">Icon</label>
              <select
                value={newSpec.icon}
                onChange={(e) => setNewSpec(prev => ({ ...prev, icon: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white text-gray-900 transition-all duration-200 text-sm font-medium shadow-sm"
              >
                {specificationIcons.map((iconData) => (
                  <option key={iconData.name} value={iconData.name} className="text-gray-900 bg-white">
                    {iconData.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="lg:col-span-1 flex items-end">
              <button
                type="button"
                onClick={addSpecification}
                disabled={!newSpec.title.trim() || !newSpec.description.trim()}
                className="w-full px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold hover:shadow-lg flex items-center justify-center gap-1.5 text-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                Add
              </button>
            </div>
          </div>
          
          {(!newSpec.title.trim() || !newSpec.description.trim()) && (
            <p className="text-xs text-gray-500 mt-2 flex items-center gap-1.5">
              <Settings className="w-3.5 h-3.5" />
              Fill in both title and description to add a specification
            </p>
          )}
        </div>

        {/* Empty State */}
        {(formData.specifications || []).length === 0 && (
          <div className="text-center py-8 bg-gradient-to-br from-gray-50 to-purple-50 rounded-lg border border-gray-200">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Package className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-sm font-semibold text-gray-900 mb-1">No specifications yet</h3>
            <p className="text-gray-600 text-xs">Add technical specifications to help customers understand your product better</p>
          </div>
        )}
      </div>
    </section>
  );
}; 