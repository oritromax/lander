import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface StatsCardProps {
  icon: LucideIcon;
  label: string;
  value: number;
  color: 'green' | 'red' | 'blue';
}

export function StatsCard({ icon: Icon, label, value, color }: StatsCardProps) {
  const getColorStyles = () => {
    switch (color) {
      case 'green':
        return 'bg-green-50 border-green-200 text-green-700';
      case 'red':
        return 'bg-red-50 border-red-200 text-red-700';
      case 'blue':
        return 'bg-blue-50 border-blue-200 text-blue-700';
    }
  };

  const getIconStyles = () => {
    switch (color) {
      case 'green':
        return 'bg-green-500';
      case 'red':
        return 'bg-red-500';
      case 'blue':
        return 'bg-blue-500';
    }
  };

  return (
    <div className={`rounded-lg border p-4 ${getColorStyles()}`}>
      <div className="flex items-center space-x-3">
        <div className={`p-2 rounded-lg ${getIconStyles()}`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-sm font-medium opacity-80">{label}</p>
        </div>
      </div>
    </div>
  );
}