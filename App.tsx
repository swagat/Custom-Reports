
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ReportList from './components/ReportList';
import ReportBuilder from './components/ReportBuilder';
import { ReportConfig } from './types';

// Initial dummy reports
const INITIAL_REPORTS: ReportConfig[] = [
  {
    id: '1',
    name: 'Weekly Revenue by Country',
    metrics: ['revenue', 'subscriptions'],
    dimensions: ['country'],
    filters: [],
    visualization: 'Bar Chart',
    rowLimit: 10,
    createdAt: '2023-11-01',
    schedule: { frequency: 'Weekly', time: '08:00', email: 'fin@muvi.com', includeCsv: true }
  },
  {
    id: '2',
    name: 'Top Content Performance',
    metrics: ['views', 'watchDuration'],
    dimensions: ['contentTitle'],
    filters: [{ id: 'f1', field: 'views', operator: 'greater than', value: '100' }],
    visualization: 'Table',
    rowLimit: 20,
    createdAt: '2023-11-05'
  }
];

const App: React.FC = () => {
  const [activePage, setActivePage] = useState('reports');
  const [reports, setReports] = useState<ReportConfig[]>(() => {
    const saved = localStorage.getItem('muvi_reports');
    return saved ? JSON.parse(saved) : INITIAL_REPORTS;
  });
  const [isBuilding, setIsBuilding] = useState(false);
  const [editingReport, setEditingReport] = useState<ReportConfig | undefined>();

  useEffect(() => {
    localStorage.setItem('muvi_reports', JSON.stringify(reports));
  }, [reports]);

  const handleSave = (config: ReportConfig) => {
    if (editingReport) {
      setReports(reports.map(r => r.id === config.id ? config : r));
    } else {
      setReports([...reports, config]);
    }
    setIsBuilding(false);
    setEditingReport(undefined);
  };

  const handleDuplicate = (report: ReportConfig) => {
    const duplicated = {
      ...report,
      id: Math.random().toString(36).substr(2, 9),
      name: `${report.name} (Copy)`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setReports([...reports, duplicated]);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this report?')) {
      setReports(reports.filter(r => r.id !== id));
    }
  };

  const startEdit = (report: ReportConfig) => {
    setEditingReport(report);
    setIsBuilding(true);
  };

  const startNew = () => {
    setEditingReport(undefined);
    setIsBuilding(true);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      
      <main className="flex-1 ml-64 min-h-screen overflow-y-auto">
        {activePage === 'reports' ? (
          <>
            {isBuilding ? (
              <ReportBuilder 
                initialConfig={editingReport}
                onSave={handleSave}
                onCancel={() => setIsBuilding(false)}
                existingNames={reports.map(r => r.name)}
              />
            ) : (
              <ReportList 
                reports={reports}
                onCreateNew={startNew}
                onEdit={startEdit}
                onDelete={handleDelete}
                onDuplicate={handleDuplicate}
              />
            )}
          </>
        ) : (
          <div className="p-12 text-center h-full flex flex-col items-center justify-center">
             <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 max-w-md">
               <span className="text-5xl mb-4 block">🚧</span>
               <h2 className="text-2xl font-bold text-gray-900 mb-2">{activePage.charAt(0).toUpperCase() + activePage.slice(1)} Module</h2>
               <p className="text-gray-500 mb-6">This section is currently under development for the next phase of the product validation prototype.</p>
               <button 
                onClick={() => setActivePage('reports')}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold"
               >
                 Back to Custom Reports
               </button>
             </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
