
import React, { useState, useEffect } from 'react';
import { METRICS, DIMENSIONS, OPERATORS, VISUALIZATIONS } from '../constants';
import { ReportConfig, Filter, Schedule } from '../types';
import { MOCK_DATA } from '../mockData';
import PreviewSection from './PreviewSection';

interface ReportBuilderProps {
  initialConfig?: ReportConfig;
  onSave: (config: ReportConfig) => void;
  onCancel: () => void;
  existingNames: string[];
}

const ReportBuilder: React.FC<ReportBuilderProps> = ({ initialConfig, onSave, onCancel, existingNames }) => {
  const [config, setConfig] = useState<ReportConfig>(initialConfig || {
    id: Math.random().toString(36).substr(2, 9),
    name: '',
    metrics: [],
    dimensions: [],
    filters: [],
    visualization: 'Table',
    rowLimit: 10,
    createdAt: new Date().toISOString().split('T')[0]
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [schedule, setSchedule] = useState<Schedule>(initialConfig?.schedule || {
    frequency: 'Daily',
    time: '09:00',
    email: '',
    includeCsv: true
  });

  const handleRunReport = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 800);
  };

  const toggleMetric = (id: string) => {
    const metrics = config.metrics.includes(id) 
      ? config.metrics.filter(m => m !== id)
      : [...config.metrics, id];
    setConfig({ ...config, metrics });
  };

  const toggleDimension = (id: string) => {
    if (!config.dimensions.includes(id) && config.dimensions.length >= 2) return;
    const dimensions = config.dimensions.includes(id)
      ? config.dimensions.filter(d => d !== id)
      : [...config.dimensions, id];
    
    // Auto-update visualization if pie chart becomes invalid
    let viz = config.visualization;
    if (viz === 'Pie Chart' && dimensions.length !== 1) {
      viz = 'Table';
    }

    setConfig({ ...config, dimensions, visualization: viz });
  };

  const addFilter = () => {
    const newFilter: Filter = {
      id: Math.random().toString(36).substr(2, 5),
      field: DIMENSIONS[0].id,
      operator: 'equals',
      value: ''
    };
    setConfig({ ...config, filters: [...config.filters, newFilter] });
  };

  const removeFilter = (id: string) => {
    setConfig({ ...config, filters: config.filters.filter(f => f.id !== id) });
  };

  const updateFilter = (id: string, updates: Partial<Filter>) => {
    setConfig({
      ...config,
      filters: config.filters.map(f => f.id === id ? { ...f, ...updates } : f)
    });
  };

  const validate = () => {
    if (config.metrics.length === 0) return "At least one metric must be selected.";
    if (!config.name.trim()) return "Report name is required.";
    if (existingNames.includes(config.name) && config.name !== initialConfig?.name) return "A report with this name already exists.";
    return null;
  };

  const validationError = validate();

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gray-100">
      {/* Top Header */}
      <div className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-4">
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 transition-colors">
            ← Back
          </button>
          <input 
            type="text" 
            placeholder="Untitled Custom Report" 
            className="text-lg font-semibold bg-transparent focus:ring-2 focus:ring-blue-100 p-1 outline-none border-b border-transparent focus:border-blue-500"
            value={config.name}
            onChange={(e) => setConfig({ ...config, name: e.target.value })}
          />
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={() => setShowScheduleModal(true)}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors border border-gray-300"
          >
             ⏰ {config.schedule ? 'Scheduled' : 'Schedule'}
          </button>
          <button 
            onClick={() => onSave({ ...config, schedule })}
            disabled={!!validationError}
            className={`px-6 py-2 rounded-lg font-semibold shadow-sm transition-all ${
              validationError ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            Save Report
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Config Panel */}
        <div className="w-96 bg-white border-r border-gray-200 overflow-y-auto p-6 space-y-8 scrollbar-thin scrollbar-thumb-gray-300">
          
          {/* Metrics */}
          <section>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex justify-between">
              Select Metrics
              <span className={`text-[10px] lowercase font-normal italic ${config.metrics.length > 0 ? 'text-blue-500' : 'text-red-500'}`}>
                {config.metrics.length === 0 ? 'Selection required' : `${config.metrics.length} selected`}
              </span>
            </h3>
            <div className="space-y-4">
              {['Engagement', 'Revenue', 'Users'].map(cat => (
                <div key={cat} className="space-y-2">
                  <div className="text-xs font-semibold text-gray-600">{cat}</div>
                  <div className="grid grid-cols-1 gap-2 pl-2">
                    {METRICS.filter(m => m.category === cat).map(m => (
                      <label key={m.id} className="flex items-center text-sm text-gray-700 cursor-pointer group">
                        <input 
                          type="checkbox" 
                          className="mr-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          checked={config.metrics.includes(m.id)}
                          onChange={() => toggleMetric(m.id)}
                        />
                        <span className="group-hover:text-blue-600 transition-colors">{m.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Dimensions */}
          <section>
             <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex justify-between">
              Dimensions
              <span className="text-[10px] lowercase font-normal text-gray-400 italic">
                Max 2
              </span>
            </h3>
            <div className="space-y-2">
              {DIMENSIONS.map(d => (
                <label 
                  key={d.id} 
                  className={`flex items-center text-sm cursor-pointer p-2 rounded transition-colors ${
                    config.dimensions.includes(d.id) ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'
                  } ${!config.dimensions.includes(d.id) && config.dimensions.length >= 2 ? 'opacity-40 cursor-not-allowed' : ''}`}
                >
                  <input 
                    type="checkbox" 
                    className="mr-2 h-4 w-4 rounded border-gray-300 text-blue-600"
                    disabled={!config.dimensions.includes(d.id) && config.dimensions.length >= 2}
                    checked={config.dimensions.includes(d.id)}
                    onChange={() => toggleDimension(d.id)}
                  />
                  {d.label}
                </label>
              ))}
              {config.dimensions.length >= 2 && (
                <p className="text-[10px] text-orange-600 mt-1">Maximum 2 dimensions allowed.</p>
              )}
            </div>
          </section>

          {/* Filters */}
          <section>
             <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Filters</h3>
             <div className="space-y-3">
               {config.filters.map(f => (
                 <div key={f.id} className="p-3 bg-gray-50 rounded-lg border border-gray-100 relative group">
                   <button 
                    onClick={() => removeFilter(f.id)}
                    className="absolute top-1 right-1 text-gray-300 hover:text-red-500 text-xs"
                   >✕</button>
                   <select 
                    className="w-full text-xs mb-2 p-1 border rounded bg-white"
                    value={f.field}
                    onChange={(e) => updateFilter(f.id, { field: e.target.value })}
                   >
                     {DIMENSIONS.map(d => <option key={d.id} value={d.id}>{d.label}</option>)}
                     {METRICS.map(m => <option key={m.id} value={m.id}>{m.label}</option>)}
                   </select>
                   <div className="flex gap-1 mb-2">
                     <select 
                      className="flex-1 text-[10px] p-1 border rounded bg-white"
                      value={f.operator}
                      onChange={(e) => updateFilter(f.id, { operator: e.target.value as any })}
                     >
                       {OPERATORS.map(op => <option key={op} value={op}>{op}</option>)}
                     </select>
                   </div>
                   <div className="flex gap-2">
                    <input 
                        type="text" 
                        placeholder="Value..." 
                        className="flex-1 text-[10px] p-1.5 border rounded"
                        value={f.value}
                        onChange={(e) => updateFilter(f.id, { value: e.target.value })}
                      />
                      {f.operator === 'between' && (
                        <input 
                          type="text" 
                          placeholder="Max..." 
                          className="flex-1 text-[10px] p-1.5 border rounded"
                          value={f.value2}
                          onChange={(e) => updateFilter(f.id, { value2: e.target.value })}
                        />
                      )}
                   </div>
                 </div>
               ))}
               <button 
                onClick={addFilter}
                className="w-full py-2 border border-dashed border-gray-300 text-gray-400 text-xs rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all"
               >
                 + Add Filter
               </button>
             </div>
          </section>

          {/* Visualization Settings */}
          <section>
             <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Visualization</h3>
             <div className="grid grid-cols-2 gap-2">
               {VISUALIZATIONS.map(v => {
                 const isDisabled = v === 'Pie Chart' && config.dimensions.length !== 1;
                 return (
                  <button 
                    key={v}
                    disabled={isDisabled}
                    onClick={() => setConfig({ ...config, visualization: v as any })}
                    className={`text-xs p-2.5 rounded-lg border text-center transition-all ${
                      config.visualization === v 
                        ? 'bg-blue-600 border-blue-600 text-white font-semibold' 
                        : 'bg-white border-gray-200 text-gray-600 hover:border-blue-400'
                    } ${isDisabled ? 'opacity-30 cursor-not-allowed bg-gray-50' : ''}`}
                    title={isDisabled ? 'Pie chart requires exactly 1 dimension' : ''}
                  >
                    {v}
                  </button>
                 );
               })}
             </div>
          </section>

          {/* Display options */}
          <section>
             <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Rows</h3>
             <select 
              className="w-full text-sm p-2 border rounded-lg"
              value={config.rowLimit}
              onChange={(e) => setConfig({ ...config, rowLimit: Number(e.target.value) })}
             >
               <option value={10}>Top 10 Rows</option>
               <option value={20}>Top 20 Rows</option>
               <option value={50}>Top 50 Rows</option>
             </select>
          </section>
        </div>

        {/* Right Preview Area */}
        <div className="flex-1 bg-gray-50 overflow-y-auto p-8 relative">
           <div className="max-w-4xl mx-auto h-full flex flex-col">
             <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">Preview Results</h2>
                <button 
                  onClick={handleRunReport}
                  className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white text-sm rounded-lg font-semibold flex items-center transition-colors shadow-sm"
                >
                  ⚡ Run Report
                </button>
             </div>

             <div className="flex-1">
               <PreviewSection config={config} data={MOCK_DATA} isLoading={isLoading} />
             </div>
           </div>
        </div>
      </div>

      {/* Schedule Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-lg text-gray-900">Schedule Report Delivery</h3>
              <button onClick={() => setShowScheduleModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Frequency</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Daily', 'Weekly', 'Monthly'].map(f => (
                    <button 
                      key={f}
                      onClick={() => setSchedule({...schedule, frequency: f as any})}
                      className={`py-2 text-xs border rounded-lg font-medium transition-all ${schedule.frequency === f ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-gray-200 text-gray-600 hover:border-blue-400'}`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Delivery Time</label>
                  <input 
                    type="time" 
                    className="w-full border rounded-lg p-2 text-sm"
                    value={schedule.time}
                    onChange={(e) => setSchedule({...schedule, time: e.target.value})}
                  />
                </div>
                <div className="flex flex-col justify-end">
                   <label className="flex items-center text-sm text-gray-700 cursor-pointer pb-2">
                    <input 
                      type="checkbox" 
                      className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded"
                      checked={schedule.includeCsv}
                      onChange={(e) => setSchedule({...schedule, includeCsv: e.target.checked})}
                    />
                    Include CSV Export
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Recipients (Email)</label>
                <input 
                  type="email" 
                  placeholder="analytics-team@muvi.com"
                  className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  value={schedule.email}
                  onChange={(e) => setSchedule({...schedule, email: e.target.value})}
                />
              </div>
            </div>
            <div className="p-6 bg-gray-50 border-t flex justify-end gap-3">
              <button onClick={() => setShowScheduleModal(false)} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
              <button 
                onClick={() => setShowScheduleModal(false)}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold"
              >
                Apply Schedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportBuilder;
