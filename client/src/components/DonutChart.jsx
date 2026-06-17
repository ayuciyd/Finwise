import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const DonutChart = ({ spent, goals, remaining }) => {
  const data = [
    { name: 'Spent', value: spent, color: '#A32D2D' },
    { name: 'Goals (Saved)', value: goals, color: '#F5A623' },
    { name: 'Remaining', value: remaining > 0 ? remaining : 0, color: '#1B5E3B' },
  ];

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `₹${value}`} />
        </PieChart>
      </ResponsiveContainer>
      <div className="flex justify-center gap-4 mt-2">
        {data.map(d => (
          <div key={d.name} className="flex items-center gap-1 text-xs text-gray-600">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }}></span>
            {d.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DonutChart;
