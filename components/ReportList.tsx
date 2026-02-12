
import React, { useState } from 'react';
import { ReportConfig } from '../types';

interface ReportListProps {
  reports: ReportConfig[];
  onCreateNew: () => void;
  onEdit: (report: ReportConfig) => void;
  onDelete: (id: string) => void;
  onDuplicate: (report: ReportConfig) => void;
}

const ReportList: React.FC<ReportListProps> = ({ reports, onCreateNew, onEdit, onDelete, onDuplicate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');

  const filteredReports = reports.filter(r => {
    const matchesSearch = r.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = 
      filterType === 'All' || 
      (filterType === 'Scheduled' && r.schedule) || 
      (filterType === 'My Reports' && !r.schedule);
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="max-w-6xl mx-auto py-8 px-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Custom Reports</h1>
          <p className="text-gray-500">Manage and create tailored insights for your platform.</p>
        </div>
        <button 
          onClick={onCreateNew}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-semibold flex items-center shadow-sm transition-all"
        >
          <span className="mr-2 text-xl">+</span> Create Custom Report
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex gap-4 items-center bg-gray-50/50">
          <input 
            type="text" 
            placeholder="Search by report name..." 
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select 
            className="px-4 py-2 border border-gray-300 rounded-lg outline-none bg-white"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option>All</option>
            <option>Scheduled</option>
            <option>My Reports</option>
          </select>
        </div>

        <table className="w-full text-left">
          <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4">Report Name</th>
              <th className="px-6 py-4">Visualization</th>
              <th className="px-6 py-4">Dimensions</th>
              <th className="px-6 py-4">Scheduled</th>
              <th className="px-6 py-4">Created At</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredReports.length > 0 ? filteredReports.map((report) => (
              <tr key={report.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-medium text-gray-900">{report.name}</td>
                <td className="px-6 py-4 text-gray-600">
                  <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full font-medium">
                    {report.visualization}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-600 text-sm">
                  {report.dimensions.join(', ') || 'None'}
                </td>
                <td className="px-6 py-4 text-gray-600">
                  {report.schedule ? (
                    <span className="flex items-center text-green-600 text-sm">
                      <span className="mr-1.5 font-bold">●</span> {report.schedule.frequency}
                    </span>
                  ) : 'No'}
                </td>
                <td className="px-6 py-4 text-gray-500 text-sm">{report.createdAt}</td>
                <td className="px-6 py-4 text-right space-x-3">
                  <button onClick={() => onDuplicate(report)} className="text-gray-400 hover:text-blue-600 transition-colors" title="Duplicate">
                    📑
                  </button>
                  <button onClick={() => onEdit(report)} className="text-gray-400 hover:text-blue-600 transition-colors" title="Edit">
                    ✏️
                  </button>
                  <button onClick={() => onDelete(report.id)} className="text-gray-400 hover:text-red-600 transition-colors" title="Delete">
                    🗑️
                  </button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-400 italic">
                  No reports found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        
        <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex justify-between items-center text-sm text-gray-500">
          <span>Showing {filteredReports.length} results</span>
          <div className="flex gap-2">
            <button className="px-3 py-1 border rounded bg-white opacity-50 cursor-not-allowed">Previous</button>
            <button className="px-3 py-1 border rounded bg-white">1</button>
            <button className="px-3 py-1 border rounded bg-white">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportList;
