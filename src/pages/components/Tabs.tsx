import React, { useState } from 'react';

interface Tab {
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: number;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, defaultTab = 0 }) => {
  const [activeTab, setActiveTab] = useState(defaultTab);

  return (
    <div className="my-6">
      <div className="flex gap-2 border-b theme-border">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            className={`px-4 py-2 font-medium text-sm transition-colors ${
              activeTab === index
                ? 'border-b-2 theme-accent-border theme-accent'
                : 'theme-text-secondary hover:theme-text'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="mt-2">
        {tabs[activeTab]?.content}
      </div>
    </div>
  );
};
