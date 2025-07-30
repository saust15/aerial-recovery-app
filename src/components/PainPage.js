// PainPage component
const PainPage = ({ recoveryData }) => {
    const { dailyData, updatePainLevel, updatePainNotes } = recoveryData;

    return (
        <div className="p-6 pb-24">
            <div className="text-center mb-6">
                <h1 className="text-3xl font-bold text-red-600 mb-2">🎪 Pain Tracking</h1>
            </div>
            
            <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-lg p-6 border-4 border-blue-500">
                    <h3 className="text-xl font-bold text-blue-600 mb-4 text-center">Rate your pain level (0-10)</h3>
                    <div className="grid grid-cols-6 gap-2 mb-4">
                        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => (
                            <button
                                key={level}
                                onClick={() => updatePainLevel(level)}
                                className={`w-12 h-12 rounded-xl border-4 font-bold text-lg transition-all transform hover:scale-110 ${
                                    dailyData.painLevel === level
                                        ? level <= 3 ? 'bg-green-500 text-white border-green-600 shadow-lg scale-110'
                                          : level <= 6 ? 'bg-yellow-500 text-white border-yellow-600 shadow-lg scale-110'
                                          : 'bg-red-500 text-white border-red-600 shadow-lg scale-110'
                                        : 'border-yellow-400 text-blue-600 hover:border-red-500 bg-white shadow-md'
                                }`}
                            >
                                {level}
                            </button>
                        ))}
                    </div>
                    <div className="text-sm font-semibold grid grid-cols-3 text-center">
                        <span className="text-green-600">😊 No Pain (0-3)</span>
                        <span className="text-yellow-600">😐 Moderate (4-6)</span>
                        <span className="text-red-600">😣 Severe (7-10)</span>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6 border-4 border-yellow-400">
                    <h3 className="text-xl font-bold text-yellow-600 mb-4 text-center">📝 Pain Notes</h3>
                    <textarea
                        value={dailyData.painNotes}
                        onChange={(e) => updatePainNotes(e.target.value)}
                        placeholder="Describe location, triggers, or any observations about your pain today..."
                        className="w-full h-32 p-3 border-4 border-red-300 rounded-xl resize-none focus:outline-none focus:ring-4 focus:ring-blue-300 focus:border-blue-500 text-gray-700"
                    />
                </div>

                {dailyData.painLevel !== null && (
                    <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded-2xl p-4 border-4 border-green-400">
                        <div className="flex items-center text-green-600 mb-2">
                            <Icons.CheckCircle2 size={24} className="mr-2" />
                            <span className="font-bold text-lg">🎉 Pain level recorded!</span>
                        </div>
                        <p className="text-blue-700 font-semibold">
                            Current pain level: <strong className="text-red-600 text-xl">{dailyData.painLevel}/10</strong>
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

window.PainPage = PainPage;
