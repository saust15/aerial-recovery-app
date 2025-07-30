// ExercisesPage component
const ExercisesPage = ({ recoveryData }) => {
    const { 
        dailyData, 
        availableExercises, 
        toggleExercise, 
        addExerciseToToday, 
        removeExerciseFromToday, 
        addCustomExercise 
    } = recoveryData;

    const { useState } = React;
    const [showAddExercise, setShowAddExercise] = useState(false);
    const [newExercise, setNewExercise] = useState({
        name: '',
        description: '',
        targetArea: '',
        repRange: ''
    });

    const handleAddCustomExercise = () => {
        const success = addCustomExercise(
            newExercise.name, 
            newExercise.description, 
            newExercise.targetArea, 
            newExercise.repRange
        );
        if (success) {
            setNewExercise({ name: '', description: '', targetArea: '', repRange: '' });
            setShowAddExercise(false);
        }
    };

    return (
        <div className="p-6 pb-24">
            <div className="text-center mb-6">
                <h1 className="text-3xl font-bold text-red-600 mb-2">🎪 Recovery Exercises</h1>
                <p className="text-blue-700 font-semibold bg-white bg-opacity-70 rounded-full px-4 py-2 shadow-md">
                    Customize your recovery routine
                </p>
            </div>

            {/* Add Exercise Section */}
            <div className="mb-6 space-y-4">
                <div className="bg-white rounded-2xl shadow-lg p-4 border-4 border-yellow-400">
                    <h3 className="text-lg font-bold text-yellow-600 mb-3">Add Exercise to Today</h3>
                    <div className="flex flex-wrap gap-2 mb-3">
                        {availableExercises
                            .filter(ex => !dailyData.exercises.find(dailyEx => dailyEx.id === ex.id))
                            .map(exercise => (
                            <button
                                key={exercise.id}
                                onClick={() => addExerciseToToday(exercise.id)}
                                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold transition-all transform hover:scale-105"
                            >
                                + {exercise.name}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={() => setShowAddExercise(!showAddExercise)}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl font-semibold transition-all transform hover:scale-105"
                    >
                        {showAddExercise ? '✕ Cancel' : '+ Create New Exercise'}
                    </button>
                </div>

                {/* Create New Exercise Form */}
                {showAddExercise && (
                    <div className="bg-white rounded-2xl shadow-lg p-4 border-4 border-green-500">
                        <h3 className="text-lg font-bold text-green-600 mb-3">Create New Exercise</h3>
                        <div className="space-y-3">
                            <input
                                type="text"
                                placeholder="Exercise name"
                                value={newExercise.name}
                                onChange={(e) => setNewExercise(prev => ({ ...prev, name: e.target.value }))}
                                className="w-full p-2 border-2 border-green-300 rounded-lg"
                            />
                            <input
                                type="text"
                                placeholder="Description"
                                value={newExercise.description}
                                onChange={(e) => setNewExercise(prev => ({ ...prev, description: e.target.value }))}
                                className="w-full p-2 border-2 border-green-300 rounded-lg"
                            />
                            <input
                                type="text"
                                placeholder="Target area (e.g., Hip Labrum)"
                                value={newExercise.targetArea}
                                onChange={(e) => setNewExercise(prev => ({ ...prev, targetArea: e.target.value }))}
                                className="w-full p-2 border-2 border-green-300 rounded-lg"
                            />
                            <input
                                type="text"
                                placeholder="Rep range (e.g., 10-15 reps)"
                                value={newExercise.repRange}
                                onChange={(e) => setNewExercise(prev => ({ ...prev, repRange: e.target.value }))}
                                className="w-full p-2 border-2 border-green-300 rounded-lg"
                            />
                            <button
                                onClick={handleAddCustomExercise}
                                className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-semibold"
                            >
                                Add Exercise
                            </button>
                        </div>
                    </div>
                )}
            </div>
            
            {/* Today's Exercises */}
            <div className="space-y-4">
                <h3 className="text-xl font-bold text-red-600 mb-4">Today's Routine ({dailyData.exercises.length} exercises)</h3>
                {dailyData.exercises.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-lg p-6 text-center border-4 border-gray-300">
                        <p className="text-gray-500 text-lg">No exercises selected for today</p>
                        <p className="text-gray-400 text-sm mt-2">Add some exercises from above!</p>
                    </div>
                ) : (
                    dailyData.exercises.map((exercise) => (
                        <div key={exercise.id} className="bg-white rounded-2xl shadow-lg p-4 border-l-8 border-red-500 hover:shadow-xl transition-shadow">
                            <div className="flex items-start">
                                <button
                                    onClick={() => toggleExercise(exercise.id)}
                                    className="mr-3 mt-1 transform hover:scale-110 transition-transform"
                                >
                                    {exercise.completed ? (
                                        <Icons.CheckCircle2 size={28} className="text-green-500" />
                                    ) : (
                                        <Icons.Circle size={28} className="text-yellow-500 hover:text-green-500" />
                                    )}
                                </button>
                                <div className="flex-1">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <h3 className={`text-lg font-bold ${exercise.completed ? 'text-green-600 line-through' : 'text-blue-600'}`}>
                                                {exercise.name}
                                            </h3>
                                            <div className="flex flex-wrap gap-2 mb-2">
                                                <span className="inline-block bg-gradient-to-r from-yellow-400 to-red-500 text-white text-sm px-3 py-1 rounded-full font-semibold shadow-md">
                                                    {exercise.targetArea}
                                                </span>
                                                {exercise.repRange && (
                                                    <span className="inline-block bg-gradient-to-r from-blue-400 to-purple-500 text-white text-sm px-3 py-1 rounded-full font-semibold shadow-md">
                                                        {exercise.repRange}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-gray-700 text-sm leading-relaxed">{exercise.description}</p>
                                        </div>
                                        <button
                                            onClick={() => removeExerciseFromToday(exercise.id)}
                                            className="ml-2 text-red-500 hover:text-red-700 p-1"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

window.ExercisesPage = ExercisesPage;
