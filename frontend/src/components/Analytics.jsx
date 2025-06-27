import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { motion } from 'framer-motion';

const Analytics = ({ analytics }) => {
  if (!analytics || (!analytics.incomeByCategory && !analytics.expenseByCategory)) {
    return null;
  }

  // Transform data for recharts
  const incomeData = Object.entries(analytics.incomeByCategory || {}).map(([category, amount]) => ({
    name: category.charAt(0).toUpperCase() + category.slice(1),
    value: amount
  }));

  const expenseData = Object.entries(analytics.expenseByCategory || {}).map(([category, amount]) => ({
    name: category.charAt(0).toUpperCase() + category.slice(1),
    value: amount
  }));

  // Color palettes
  const incomeColors = ['#4ADE80', '#22C55E', '#16A34A', '#15803D', '#14532D', '#166534'];
  const expenseColors = ['#F87171', '#EF4444', '#DC2626', '#B91C1C', '#991B1B', '#7F1D1D'];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border-2 border-gray-200">
          <p className="font-semibold">{payload[0].name}</p>
          <p className="text-sm">₹{payload[0].value.toLocaleString()}</p>
          <p className="text-xs text-gray-500">
            {((payload[0].value / payload[0].payload.total) * 100).toFixed(1)}%
          </p>
        </div>
      );
    }
    return null;
  };

  const totalIncome = incomeData.reduce((sum, item) => sum + item.value, 0);
  const totalExpense = expenseData.reduce((sum, item) => sum + item.value, 0);

  // Add total to each data point for percentage calculation
  const incomeDataWithTotal = incomeData.map(item => ({ ...item, total: totalIncome }));
  const expenseDataWithTotal = expenseData.map(item => ({ ...item, total: totalExpense }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="bg-white/95 backdrop-blur rounded-3xl shadow-2xl p-6 md:p-8 border-2 border-indigo-200"
    >
      <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6 flex items-center">
        <span className="mr-2 text-3xl">📊</span> Financial Analytics
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Income Chart */}
        {incomeData.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-4 text-center">
              Income by Category
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={incomeDataWithTotal}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {incomeDataWithTotal.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={incomeColors[index % incomeColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              {incomeData.map((item, index) => (
                <div key={item.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: incomeColors[index % incomeColors.length] }}
                    />
                    <span className="text-gray-700">{item.name}</span>
                  </div>
                  <span className="font-semibold text-gray-800">₹{item.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Expense Chart */}
        {expenseData.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-4 text-center">
              Expenses by Category
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expenseDataWithTotal}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {expenseDataWithTotal.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={expenseColors[index % expenseColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              {expenseData.map((item, index) => (
                <div key={item.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: expenseColors[index % expenseColors.length] }}
                    />
                    <span className="text-gray-700">{item.name}</span>
                  </div>
                  <span className="font-semibold text-gray-800">₹{item.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {incomeData.length === 0 && expenseData.length === 0 && (
        <div className="text-center py-12">
          <span className="text-6xl block mb-4">📈</span>
          <p className="text-gray-500 text-lg">No data to analyze yet!</p>
          <p className="text-gray-400 text-sm mt-2">Start adding income and expenses to see insights</p>
        </div>
      )}
    </motion.div>
  );
};

export default Analytics;