
import React, { useMemo } from 'react';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, Cell 
} from 'recharts';
import { ReportConfig, RawDataRecord, Metric } from '../types';
import { METRICS } from '../constants';

interface PreviewSectionProps {
  config: ReportConfig;
  data: RawDataRecord[];
  isLoading: boolean;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const PreviewSection: React.FC<PreviewSectionProps> = ({ config, data, isLoading }) => {
  const aggregatedData = useMemo(() => {
    if (config.metrics.length === 0) return [];

    // Step 1: Filter raw data
    let filtered = [...data];
    config.filters.forEach(f => {
      if (!f.field || !f.value) return;
      filtered = filtered.filter(row => {
        const val = row[f.field];
        const filterVal = f.value;
        const numVal = Number(val);
        const filterNum = Number(filterVal);
        const filterNum2 = Number(f.value2);

        switch (f.operator) {
          case 'equals': return String(val).toLowerCase() === filterVal.toLowerCase();
          case 'contains': return String(val).toLowerCase().includes(filterVal.toLowerCase());
          case 'greater than': return numVal > filterNum;
          case 'less than': return numVal < filterNum;
          case 'between': return numVal >= filterNum && numVal <= filterNum2;
          default: return true;
        }
      });
    });

    // Step 2: Grouping & Aggregation
    const groups: Record<string, any> = {};
    filtered.forEach(row => {
      const key = config.dimensions.map(d => row[d]).join(' | ') || 'Total';
      if (!groups[key]) {
        groups[key] = { name: key };
        config.metrics.forEach(m => groups[key][m] = 0);
        groups[key].count = 0;
      }
      config.metrics.forEach(m => {
        groups[key][m] += Number(row[m]) || 0;
      });
      groups[key].count++;
    });

    // Step 3: Finalize (calculate averages if needed, but here we sum)
    let result = Object.values(groups);
    
    // Sort and limit
    return result.slice(0, config.rowLimit);
  }, [config, data]);

  if (isLoading) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-12 text-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500 font-medium">Crunching your data...</p>
      </div>
    );
  }

  if (config.metrics.length === 0) {
    return (
      <div className="h-full flex items-center justify-center p-12 text-center text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
        <div>
          <span className="text-4xl mb-4 block">📊</span>
          <p>Please select at least one metric to generate a preview.</p>
        </div>
      </div>
    );
  }

  if (aggregatedData.length === 0) {
    return (
      <div className="h-full flex items-center justify-center p-12 text-center text-gray-400 bg-gray-50 rounded-xl">
        <p>No results found for the current configuration and filters.</p>
      </div>
    );
  }

  const renderChart = () => {
    switch (config.visualization) {
      case 'Bar Chart':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={aggregatedData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              {config.metrics.map((m, idx) => (
                <Bar key={m} dataKey={m} fill={COLORS[idx % COLORS.length]} radius={[4, 4, 0, 0]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        );
      case 'Line Chart':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={aggregatedData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              {config.metrics.map((m, idx) => (
                <Line key={m} type="monotone" dataKey={m} stroke={COLORS[idx % COLORS.length]} strokeWidth={2} dot={{ r: 4 }} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        );
      case 'Pie Chart':
        const primaryMetric = config.metrics[0];
        return (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={aggregatedData}
                dataKey={primaryMetric}
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={120}
                label
              >
                {aggregatedData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );
      default:
        return (
          <div className="overflow-auto max-h-[500px] border border-gray-200 rounded-lg">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase sticky top-0 border-b">
                <tr>
                  <th className="px-4 py-3">Group</th>
                  {config.metrics.map(m => (
                    <th key={m} className="px-4 py-3">{METRICS.find(met => met.id === m)?.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {aggregatedData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-sm text-gray-900">{row.name}</td>
                    {config.metrics.map(m => (
                      <td key={m} className="px-4 py-3 text-sm text-gray-600">
                        {m === 'revenue' || m === 'arpu' ? `$${row[m].toLocaleString()}` : row[m].toLocaleString()}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Visualization: {config.visualization}</h3>
        {renderChart()}
      </div>
      
      {config.visualization !== 'Table' && (
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
           <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Underlying Aggregated Data</h3>
           <div className="overflow-auto max-h-[300px]">
             <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 border-b text-gray-500 font-semibold uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="px-3 py-2">Dimensions</th>
                    {config.metrics.map(m => (
                      <th key={m} className="px-3 py-2">{METRICS.find(met => met.id === m)?.label}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {aggregatedData.map((row, idx) => (
                    <tr key={idx}>
                      <td className="px-3 py-2 text-gray-900 font-medium">{row.name}</td>
                      {config.metrics.map(m => (
                        <td key={m} className="px-3 py-2 text-gray-600">
                          {typeof row[m] === 'number' && row[m] % 1 !== 0 ? row[m].toFixed(2) : row[m]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
             </table>
           </div>
        </div>
      )}
    </div>
  );
};

export default PreviewSection;
