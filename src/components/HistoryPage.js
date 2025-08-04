// HistoryPage component with charts and analytics
const HistoryPage = ({ recoveryData }) => {
    const { savedData, painNoteHistory } = recoveryData;

    // Enhanced chart component with better visuals
    const TrendChart = ({ data, title, color, yLabel, maxValue = null, icon }) => {
        if (data.length === 0) return (
            <div className="bg-white rounded-2xl shadow-lg p-6 border-4 border-gray-300 text-center">
                <h3 className="text-lg font-bold text-gray-500 mb-2 flex items-center justify-center">
                    <span className="mr-2">{icon}</span> {title}
                </h3>
                <div className="h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                    <p className="text-gray-400">No data yet - start tracking!</p>
                </div>
            </div>
        );

        // Get last 14 days of data
        const chartData = data.slice(-14);
        const values = chartData.map(d => d.value);
        const chartMaxValue = maxValue || Math.max(...values, 1);
        const chartMinValue = 0; // Always start from 0 for better visualization
        const range = chartMaxValue - chartMinValue;

        return (
            <div className="bg-white rounded-2xl shadow-lg p-4 border-4 border-blue-500">
                <h3 className="text-lg font-bold text-blue-600 mb-4 text-center flex items-center justify-center">
                    <span className="mr-2">{icon}</span> {title}
                </h3>
                
                {/* Chart Area */}
                <div className="h-40 flex items-end justify-between px-3 py-2 bg-gradient-to-t from-gray-100 to-gray-50 rounded-lg border-2 border-gray-200 relative">
                    {/* Y-axis labels */}
                    <div className="absolute left-1 top-0 h-full flex flex-col justify-between text-xs text-gray-400 py-2">
                        <span>{chartMaxValue}</span>
                        <span>{Math.round(chartMaxValue / 2)}</span>
                        <span>0</span>
                    </div>
                    
                    {/* Bars */}
                    <div className="flex items-end justify-between w-full ml-6">
                        {chartData.map((point, index) => {
                            const height = range > 0 ? ((point.value - chartMinValue) / range) * 100 : 20;
                            const displayHeight = Math.max(height, 8); // Minimum height for visibility
                            
                            return (
                                <div key={index} className="flex flex-col items-center flex-1 mx-0.5 group relative">
                                    {/* Bar */}
                                    <div 
                                        className={`w-full ${color} rounded-t-md transition-all duration-300 hover:opacity-80 cursor-pointer relative`}
                                        style={{ height: `${displayHeight}%`, minHeight: '8px' }}
                                    >
                                        {/* Value label on top of bar */}
                                        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-semibold text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {point.value}
                                        </div>
                                        
                                        {/* Tooltip */}
                                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 mb-2">
                                            <div className="font-semibold">{point.value} {yLabel}</div>
                                            <div className="text-gray-300">{new Date(point.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                                            {/* Arrow */}
                                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                                        </div>
                                    </div>
                                    
                                    {/* Date label */}
                                    <span className="text-xs text-gray-500 mt-2 transform -rotate-45 origin-center w-8 h-4 flex items-center justify-center">
                                        {new Date(point.date).toLocaleDateString('en-US', { day: 'numeric' })}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
                
                {/* Chart footer with latest value */}
                <div className="text-center mt-4 p-2 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">
                        Latest: <strong className="text-lg font-bold" style={{color: color.includes('red') ? '#ef4444' : color.includes('blue') ? '#3b82f6' : '#10b981'}}>{data[data.length - 1]?.value} {yLabel}</strong>
                    </span>
                </div>
            </div>
        );
    };

    // Prepare chart data with better filtering and validation
    const painData = savedData
        .filter(day => day.painLevel !== null && day.painLevel !== undefined && day.painLevel >= 0)
        .map(day => ({
            date: day.date,
            value: parseInt(day.painLevel, 10)
        }))
        .filter(item => !isNaN(item.value)); // Extra safety check

    const waterData = savedData
        .map(day => ({
            date: day.date,
            value: parseInt(day.waterIntake || 0, 10)
        }))
        .filter(item => !isNaN(item.value) && item.value >= 0);

    const exerciseData = savedData
        .map(day => ({
            date: day.date,
            value: parseInt(day.completedExercises || 0, 10)
        }))
        .filter(item => !isNaN(item.value) && item.value >= 0);

    // Debug logging (can be removed later)
    console.log('Chart Data Debug:', { 
        savedDataLength: savedData.length, 
        painDataLength: painData.length, 
        waterDataLength: waterData.length, 
        exerciseDataLength: exerciseData.length,
        sampleSavedData: savedData.slice(0, 2),
        samplePainData: painData.slice(0, 2)
    });

    // Calculate statistics
    const calculateStats = (data) => {
        if (data.length === 0) return { avg: 0, min: 0, max: 0, trend: 'stable' };
        
        const values = data.map(d => d.value);
        const avg = (values.reduce((sum, val) => sum + val, 0) / values.length).toFixed(1);
        const min = Math.min(...values);
        const max = Math.max(...values);
        
        // Simple trend calculation (last 3 vs first 3 values)
        if (values.length >= 6) {
            const recent = values.slice(-3).reduce((sum, val) => sum + val, 0) / 3;
            const early = values.slice(0, 3).reduce((sum, val) => sum + val, 0) / 3;
            const trend = recent > early ? 'improving' : recent < early ? 'declining' : 'stable';
            return { avg, min, max, trend };
        }
        
        return { avg, min, max, trend: 'stable' };
    };

    const painStats = calculateStats(painData);
    const waterStats = calculateStats(waterData);
    const exerciseStats = calculateStats(exerciseData);

    return (
        <div className="p-6 pb-24">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-red-600 mb-2">🎪 Recovery History</h1>
                <div className="flex items-center justify-center text-blue-700 font-semibold bg-white bg-opacity-70 rounded-full px-4 py-2 shadow-md">
                    <Icons.Calendar size={18} className="mr-2" />
                    <span>{savedData.length} days tracked</span>
                </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="bg-white rounded-xl shadow-lg p-3 border-4 border-red-400 text-center">
                    <div className="text-2xl font-bold text-red-600">{painStats.avg}</div>
                    <div className="text-xs text-gray-600">Avg Pain</div>
                    <div className={`text-xs mt-1 ${
                        painStats.trend === 'improving' ? 'text-green-600' : 
                        painStats.trend === 'declining' ? 'text-red-600' : 'text-gray-600'
                    }`}>
                        {painStats.trend === 'improving' ? '📉 Better' : 
                         painStats.trend === 'declining' ? '📈 Worse' : '➡️ Stable'}
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-lg p-3 border-4 border-blue-400 text-center">
                    <div className="text-2xl font-bold text-blue-600">{waterStats.avg}</div>
                    <div className="text-xs text-gray-600">Avg Water</div>
                    <div className={`text-xs mt-1 ${
                        waterStats.trend === 'improving' ? 'text-green-600' : 
                        waterStats.trend === 'declining' ? 'text-red-600' : 'text-gray-600'
                    }`}>
                        {waterStats.trend === 'improving' ? '📈 Better' : 
                         waterStats.trend === 'declining' ? '📉 Worse' : '➡️ Stable'}
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-lg p-3 border-4 border-green-400 text-center">
                    <div className="text-2xl font-bold text-green-600">{exerciseStats.avg}</div>
                    <div className="text-xs text-gray-600">Avg Exercises</div>
                    <div className={`text-xs mt-1 ${
                        exerciseStats.trend === 'improving' ? 'text-green-600' : 
                        exerciseStats.trend === 'declining' ? 'text-red-600' : 'text-gray-600'
                    }`}>
                        {exerciseStats.trend === 'improving' ? '📈 Better' : 
                         exerciseStats.trend === 'declining' ? '📉 Worse' : '➡️ Stable'}
                    </div>
                </div>
            </div>

            {/* Charts with better spacing and design */}
            <div className="space-y-8">
                <TrendChart 
                    data={painData} 
                    title="Pain Level Trend (Last 14 Days)" 
                    color="bg-gradient-to-t from-red-400 to-red-600" 
                    yLabel="/10"
                    maxValue={10}
                    icon="📊"
                />
                
                <TrendChart 
                    data={waterData} 
                    title="Water Intake Trend (Last 14 Days)" 
                    color="bg-gradient-to-t from-blue-400 to-blue-600" 
                    yLabel="glasses"
                    icon="💧"
                />
                
                <TrendChart 
                    data={exerciseData} 
                    title="Exercise Completion Trend (Last 14 Days)" 
                    color="bg-gradient-to-t from-green-400 to-green-600" 
                    yLabel="completed"
                    icon="🏋️"
                />
            </div>

            {/* Recent Entries */}
            {savedData.length > 0 && (
                <div className="mt-8">
                    <h3 className="text-xl font-bold text-yellow-600 mb-4 text-center">🗓️ Recent Entries</h3>
                    <div className="space-y-3">
                        {savedData.slice(-5).reverse().map((entry, index) => (
                            <div key={index} className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-yellow-400">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-semibold text-blue-600">
                                        {new Date(entry.date).toLocaleDateString('en-US', { 
                                            weekday: 'short', 
                                            month: 'short', 
                                            day: 'numeric' 
                                        })}
                                    </span>
                                    <div className="flex space-x-3 text-sm">
                                        {entry.painLevel !== null && entry.painLevel !== undefined && (
                                            <span className="bg-red-100 text-red-600 px-2 py-1 rounded">
                                                Pain: {entry.painLevel}/10
                                            </span>
                                        )}
                                        <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded">
                                            Water: {entry.waterIntake || 0}
                                        </span>
                                        <span className="bg-green-100 text-green-600 px-2 py-1 rounded">
                                            Exercises: {entry.completedExercises || 0}/{entry.totalExercises || 0}
                                        </span>
                                    </div>
                                </div>
                                {entry.painNotes && (
                                    <p className="text-gray-600 text-sm italic">"{entry.painNotes}"</p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Pain Note Summary */}
            {painNoteHistory.length > 0 && (
                <div className="mt-8 bg-white rounded-2xl shadow-lg p-6 border-4 border-purple-500">
                    <h3 className="text-xl font-bold text-purple-600 mb-4 text-center">📝 Recent Pain Notes</h3>
                    <div className="space-y-2">
                        {painNoteHistory.slice(-3).reverse().map((note, index) => (
                            <div key={note.id} className="border border-gray-200 rounded-lg p-3">
                                <div className="flex flex-wrap items-center gap-2 mb-1">
                                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-semibold">
                                        {note.date}
                                    </span>
                                    <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-semibold">
                                        {note.injuryArea}
                                    </span>
                                </div>
                                <p className="text-gray-700 text-sm leading-relaxed break-words">
                                    {note.note}
                                </p>
                            </div>
                        ))}
                    </div>
                    <p className="text-center text-gray-500 text-xs mt-3">
                        Showing last 3 pain notes
                    </p>
                </div>
            )}

            {/* No Data Message */}
            {savedData.length === 0 && (
                <div className="text-center mt-8">
                    <div className="bg-white rounded-2xl shadow-lg p-8 border-4 border-gray-300">
                        <h3 className="text-xl font-bold text-gray-500 mb-4">📈 Start Your Recovery Journey!</h3>
                        <p className="text-gray-600 mb-4">
                            Track your daily progress to see beautiful charts and trends here.
                        </p>
                        <p className="text-gray-500 text-sm">
                            Go to the Home page and save your first day of data!
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

window.HistoryPage = HistoryPage;
