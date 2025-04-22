import React, { useState } from 'react';
import { Search, Filter, Check } from 'lucide-react';
import { Card, CardContent } from './ui/Card';
import Button from './ui/Button';
import { mockTemplates } from '../utils/mockData';
import { Template } from '../types';

interface TemplateCardProps {
  template: Template;
  isSelected: boolean;
  onSelect: (templateId: string) => void;
}

const TemplateCard: React.FC<TemplateCardProps> = ({ template, isSelected, onSelect }) => {
  return (
    <Card className={`overflow-hidden transition-all duration-200 ${
      isSelected ? 'ring-2 ring-blue-500' : 'hover:shadow-lg'
    }`}>
      <div className="relative aspect-[3/4] overflow-hidden">
        <img 
          src={template.thumbnail} 
          alt={template.name} 
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
        {isSelected && (
          <div className="absolute top-3 right-3 bg-blue-500 rounded-full p-1">
            <Check className="h-4 w-4 text-white" />
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <h3 className="text-white font-medium">{template.name}</h3>
          <div className="flex items-center mt-1">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <svg 
                  key={i} 
                  className={`h-4 w-4 ${i < Math.floor(template.popularity) ? 'text-yellow-400' : 'text-gray-300'}`} 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-xs text-white ml-1">{template.popularity.toFixed(1)}</span>
          </div>
        </div>
      </div>
      <CardContent className="p-4">
        <p className="text-sm text-slate-600">{template.description}</p>
        <div className="flex flex-wrap gap-1 mt-3">
          {template.tags.map((tag, index) => (
            <span key={index} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded-full">
              {tag}
            </span>
          ))}
        </div>
        <Button 
          variant={isSelected ? "primary" : "outline"} 
          className="mt-4 w-full"
          onClick={() => onSelect(template.id)}
        >
          {isSelected ? "Selected" : "Use Template"}
        </Button>
      </CardContent>
    </Card>
  );
};

const TemplateGallery: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string | null>(null);

  const categories = [...new Set(mockTemplates.map(t => t.category))];
  
  const filteredTemplates = mockTemplates.filter(template => {
    const matchesSearch = 
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = filterCategory ? template.category === filterCategory : true;
    
    return matchesSearch && matchesCategory;
  });
  
  const handleSelectTemplate = (templateId: string) => {
    setSelectedTemplate(templateId);
  };
  
  const handleCategoryFilter = (category: string | null) => {
    setFilterCategory(category === filterCategory ? null : category);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Resume Templates</h2>
          <p className="text-slate-600 mt-1">Choose a professional template to make your resume stand out</p>
        </div>
        
        <div className="flex-shrink-0 w-full md:w-auto">
          <div className="relative">
            <input
              type="text"
              className="pl-10 pr-4 py-2 w-full md:w-64 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
          </div>
        </div>
      </div>
      
      <div className="flex flex-wrap mb-6 gap-2">
        <Button
          variant={filterCategory === null ? "primary" : "outline"}
          size="sm"
          onClick={() => handleCategoryFilter(null)}
          leftIcon={<Filter size={16} />}
        >
          All
        </Button>
        {categories.map((category) => (
          <Button
            key={category}
            variant={filterCategory === category ? "primary" : "outline"}
            size="sm"
            onClick={() => handleCategoryFilter(category)}
          >
            {category}
          </Button>
        ))}
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredTemplates.map(template => (
          <TemplateCard
            key={template.id}
            template={template}
            isSelected={selectedTemplate === template.id}
            onSelect={handleSelectTemplate}
          />
        ))}
      </div>
      
      {filteredTemplates.length === 0 && (
        <div className="text-center py-16">
          <h3 className="text-lg font-medium text-slate-800">No templates found</h3>
          <p className="text-slate-600 mt-1">Try adjusting your search or filters</p>
        </div>
      )}
      
      {selectedTemplate && (
        <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-slate-200 p-4 flex justify-between items-center">
          <div>
            <h3 className="text-slate-800 font-medium">
              {mockTemplates.find(t => t.id === selectedTemplate)?.name}
            </h3>
            <p className="text-sm text-slate-600">Template selected</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setSelectedTemplate(null)}>
              Cancel
            </Button>
            <Button>Apply Template</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplateGallery;