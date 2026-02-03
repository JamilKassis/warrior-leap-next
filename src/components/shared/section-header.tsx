import React from 'react';

interface SectionHeaderProps {
  title: string;
  description: string;
  className?: string;
}

export const SectionHeader = ({ title, description, className = '' }: SectionHeaderProps) => {
  return (
    <div className={`text-center mb-16 ${className}`}>
      <h2 className="text-4xl font-bold mb-4 text-white">{title}</h2>
      <p className="text-xl text-gray-300 max-w-3xl mx-auto">{description}</p>
    </div>
  );
};
