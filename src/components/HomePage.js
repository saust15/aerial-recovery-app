// Updated HomePage component with injury area management
const HomePage = ({ recoveryData }) => {
    const { 
        dailyData, 
        savedData, 
        userInjuryAreas, 
        saveToHistory, 
        addInjuryArea, 
        removeInjuryArea,
        exportToPDF
    } = recoveryData;
    
    const { useState } = React;
    const [showAddInjury, setShowAddInjury] = useState(false);
    const [newInjuryArea, setNewInjuryArea] = useState('');
    
    const completedExercises = dailyData.exercises.filter(ex => ex.completed).length;
    const totalExercises = dailyData.exercises.length;

    const handleSaveProgress = () => {
        const success = saveToHistory();
        if (success) {
            alert('📊 Day saved to history! Great work on your recovery journey! 🎉');
        } else {
            alert('Error saving data. Please try again.');
        }
    };

    const handleExportPDF = () => {
        if (savedData.length === 0) {
            alert('📋 No data to export yet. Save some daily progress first!');
            return;
        }
        
        const success = exportToPDF();
        if (success) {
            alert('📄 Report generated! Check your browser\'s print dialog.');
        } else {
            alert('❌ Error generating report. Please try again.');
        }
    };

    const handleAddInjuryArea = (area) => {
        const success = addInjuryArea(area);
        if (success) {
            setNewInjuryArea('');
            setShowAddInjury(false);
        }
    };

    const handleAddCustomInjury = () => {
        if (newInjuryArea.trim()) {
            handleAddInjuryArea(newInjuryArea);
        }
    };

    return (
        <div className="p-6 pb-24">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-red-600 mb-2 drop-shadow-md">🎪 Recovery Tracker 🎪</h1>
                <div className="flex items-center justify-center text-blue-700 font-semibold bg-white bg-opacity-70 rounded-full px-4 py-2 shadow-md">
                    <Icons.Calendar size={18} className="mr-2" />
                    <span>{dailyData.date}</span>
                </div>
            </div>

            {/* Injury Areas Management */}
            <div className="mb-6 bg-white rounded-2xl shadow-lg p-4 border-4 border-purple-500">
                <h3 className="text-lg font-bold text-purple-600 mb-3">🩹 Your Injury Areas</h3>
                <div className="flex flex-wrap gap-2 mb-3">
                    {userInjuryAreas.map((area, index) => (
                        <div key={index} className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-semibold flex items-center">
                            {area}
                            <button
                                onClick={() => removeInjuryArea(area)}
                                className="ml-2 text-purple-600 hover:text-purple-800"
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                </div>
                
                {!showAddInjury ? (
                    <button
                        onClick={() => setShowAddInjury(true)}
                        className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-xl font-semibold transition-all transform hover:scale-105"
                    >
                        + Add Injury Area
                    </button>
                ) : (
                    <div className="space-y-2">
                        <div className="flex flex-wrap gap-2 mb-2">
                            {ExerciseData.INJURY_AREAS
                                .filter(area => !userInjuryAreas.includes(area))
                                .map((area, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleAddInjuryArea(area)}
                                    className="bg-blue-100 hover:bg-blue-200 text-blue-800 px-2 py-1 rounded-full text-xs font-semibold transition-all"
                                >
                                    + {area}
                                </button>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="Custom injury area"
                                value={newInjuryArea}
                                onChange={(e) => setNewInjuryArea(e.target.value)}
                                className="flex-1 p-2 border-2 border-purple-300 rounded-lg text-sm"
                            />
                            <button
                                onClick={handleAddCustomInjury}
                                className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg text-sm font-semibold"
                            >
                                Add
                            </button>
                            <button
                                onClick={() => {
                                    setShowAddInjury(false);
                                    setNewInjuryArea('');
                                }}
                                className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-2 rounded-lg text-sm font-semibold"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Save Button */}
            <div className="mb-6 space-y-3">
                <button
                    onClick={handleSaveProgress}
                    className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold py-3 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 border-4 border-yellow-400"
                >
                    💾 Save Today's Progress
                </button>
                
                <button
                    onClick={handleExportPDF}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 border-4 border-orange-400"
                >
                    📄 Export Recovery Report (PDF)
                </button>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {/* Exercises Summary */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border-4 border-red-500 relative overflow-hidden aspect-square flex flex-col justify-center">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-500 via-yellow-400 to-blue-500"></div>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-red-600">🏋️ Exercises</h3>
                        <Icons.Dumbbell size={24} className="text-red-500" />
                    </div>
                    <div className="flex items-center mb-3">
                        <div className="flex-1 mr-3">
                            <div className="bg-gray-200 rounded-full h-4 border-2 border-yellow-400">
                                <div 
                                    className="bg-gradient-to-r from-red-500 to-blue-500 h-full rounded-full transition-all duration-500"
                                    style={{ width: `${totalExercises > 0 ? (completedExercises / totalExercises) * 100 : 0}%` }}
                                ></div>
                            </div>
                        </div>
                        <span className="text-lg font-bold text-blue-600">
                            {completedExercises}/{totalExercises}
                        </span>
                    </div>
                    {completedExercises === totalExercises && totalExercises > 0 && (
                        <div className="flex items-center justify-center text-green-600 font-bold">
                            <Icons.CheckCircle2 size={24} className="mr-2" />
                            <span>Complete! 🎉</span>
                        </div>
                    )}
                </div>

                {/* Pain Tracking Summary */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border-4 border-blue-500 relative overflow-hidden aspect-square flex flex-col justify-center">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-yellow-400 to-red-500"></div>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-blue-600">💢 Pain Level</h3>
                        <Icons.Activity size={24} className="text-blue-500" />
                    </div>
                    <div className="flex items-center justify-center">
                        {dailyData.painLevel !== null ? (
                            <div className="text-center">
                                <span className="text-4xl font-bold text-red-600 block">
                                    {dailyData.painLevel}/10
                                </span>
                                <div className="flex items-center justify-center mt-2 text-green-600 font-bold">
                                    <Icons.CheckCircle2 size={20} className="mr-2" />
                                    <span>Recorded! 📝</span>
                                </div>
                            </div>
                        ) : (
                            <span className="text-yellow-600 font-semibold text-center">
                                🤔 Not recorded today
                            </span>
                        )}
                    </div>
                </div>

                {/* Water Intake Summary */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border-4 border-yellow-400 relative overflow-hidden aspect-square flex flex-col justify-center">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-yellow-400 via-blue-500 to-red-500"></div>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-yellow-600">💧 Water</h3>
                        <Icons.Droplets size={24} className="text-blue-500" />
                    </div>
                    <div className="text-center">
                        <span className="text-4xl font-bold text-blue-600 block">
                            {dailyData.waterIntake}
                        </span>
                        <span className="text-sm text-blue-500 font-semibold">glasses today</span>
                        {dailyData.waterIntake >= 8 && (
                            <div className="flex items-center justify-center mt-2 text-green-600 font-bold">
                                <Icons.CheckCircle2 size={20} className="mr-2" />
                                <span>Goal reached! 🎯</span>
                            </div>
                        )}
                    </div>
                    <div className="mt-4">
                        <div className="bg-gray-200 rounded-full h-3 border-2 border-blue-400">
                            <div 
                                className="bg-gradient-to-r from-blue-500 to-yellow-400 h-full rounded-full transition-all duration-500"
                                style={{ width: `${Math.min((dailyData.waterIntake / 8) * 100, 100)}%` }}
                            ></div>
                        </div>
                        <span className="text-xs text-blue-500 mt-1 block text-center font-medium">Goal: 8 glasses</span>
                    </div>
                </div>
            </div>

            {/* History Summary */}
            {savedData.length > 0 && (
                <div className="mt-6 bg-white rounded-2xl shadow-lg p-6 border-4 border-green-500">
                    <h3 className="text-xl font-bold text-green-600 mb-4 text-center">📈 Your Progress</h3>
                    <p className="text-center text-gray-700 font-semibold">
                        {savedData.length} days tracked • Keep it up! 🌟
                    </p>
                </div>
            )}
        </div>
    );
};

window.HomePage = HomePage;
