// Updated PainPage component with save button and history
const PainPage = ({ recoveryData }) => {
    const { 
        dailyData, 
        userInjuryAreas, 
        painNoteHistory, 
        updatePainLevel, 
        updatePainNotes, 
        savePainNote 
    } = recoveryData;

    const { useState } = React;
    const [selectedInjuryArea, setSelectedInjuryArea] = useState(userInjuryAreas[0] || '');

    const handleSavePainNote = () => {
        if (dailyData.painNotes.trim() && selectedInjuryArea) {
            const success = savePainNote(selectedInjuryArea, dailyData.painNotes);
            if (success) {
                alert('💾 Pain note saved successfully! 📝');
                updatePainNotes(''); // Clear the note after saving
            } else {
                alert('Please enter a note and select an injury area.');
            }
        } else {
            alert('Please enter a note and select an injury area.');
        }
    };

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
                    
                    {/* Injury Area Dropdown */}
                    <div className="mb-4">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Select Injury Area:</label>
                        <select
                            value={selectedInjuryArea}
                            onChange={(e) => setSelectedInjuryArea(e.target.value)}
                            className="w-full p-3 border-4 border-yellow-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-yellow-300 focus:border-yellow-500 text-gray-700 font-semibold"
                        >
                            <option value="">Choose injury area...</option>
                            {userInjuryAreas.map((area, index) => (
                                <option key={index} value={area}>{area}</option>
                            ))}
                        </select>
                    </div>

                    <textarea
                        value={dailyData.painNotes}
                        onChange={(e) => updatePainNotes(e.target.value)}
                        placeholder="Describe location, triggers, or any observations about your pain today..."
                        className="w-full h-32 p-3 border-4 border-red-300 rounded-xl resize-none focus:outline-none focus:ring-4 focus:ring-blue-300 focus:border-blue-500 text-gray-700 mb-4"
                    />
                    
                    <button
                        onClick={handleSavePainNote}
                        disabled={!dailyData.painNotes.trim() || !selectedInjuryArea}
                        className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 disabled:bg-gray-400 disabled:transform-none disabled:shadow-none"
                    >
                        💾 Save Pain Note
                    </button>
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

                {/* Pain Note History */}
                {painNoteHistory.length > 0 && (
                    <div className="bg-white rounded-2xl shadow-lg p-6 border-4 border-purple-500">
                        <h3 className="text-xl font-bold text-purple-600 mb-4 text-center">📚 Pain Note History</h3>
                        <div className="overflow-x-auto">
                            <div className="space-y-3">
                                {painNoteHistory.slice(-10).reverse().map((entry) => (
                                    <div key={entry.id} className="border border-gray-200 rounded-lg p-3">
                                        <div className="flex flex-wrap items-center gap-2 mb-2">
                                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-semibold">
                                                {entry.date}
                                            </span>
                                            <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-semibold">
                                                {entry.injuryArea}
                                            </span>
                                        </div>
                                        <p className="text-gray-700 text-sm leading-relaxed break-words">
                                            {entry.note}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <p className="text-center text-gray-500 text-xs mt-3">
                            Showing last 10 entries
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

window.PainPage = PainPage;
