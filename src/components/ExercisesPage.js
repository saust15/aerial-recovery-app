// ExercisesPage component
const ExercisesPage = ({ recoveryData }) => {
    const { 
        dailyData, 
        availableExercises, 
        toggleExercise,
        updateExerciseReps,
        updateExerciseDetails,
        addExerciseToToday, 
        removeExerciseFromToday, 
        addCustomExercise 
    } = recoveryData;

    const { useState } = React;
    const [showAddExercise, setShowAddExercise] = useState(false);
    const [editingExercise, setEditingExercise] = useState(null);
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

    const handleEditExercise = (exercise) => {
        setEditingExercise({
            ...exercise,
            editedName: exercise.name,
            editedDescription: exercise.description,
            editedTargetArea: exercise.targetArea,
            editedRepRange: exercise.repRange
        });
    };

    const handleSaveEdit = () => {
        if (editingExercise) {
            updateExerciseDetails(editingExercise.id, {
                name: editingExercise.editedName,
                description: editingExercise.editedDescription,
                targetArea: editingExercise.editedTargetArea,
                repRange: editingExercise.editedRepRange
            });
            setEditingExercise(null);
        }
    };

    const handleCancelEdit = () => {
        setEditingExercise(null);
    };

    const handleRepChange = (exerciseId, reps) => {
        updateExerciseReps(exerciseId, reps);
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
                                    {editingExercise && editingExercise.id === exercise.id ? (
                                        /* Editing Mode */
                                        <div className="space-y-3">
                                            <input
                                                type="text"
                                                value={editingExercise.editedName}
                                                onChange={(e) => setEditingExercise(prev => ({ ...prev, editedName: e.target.value }))}
                                                className="w-full p-2 border-2 border-blue-300 rounded-lg font-bold"
                                                placeholder="Exercise name"
                                            />
                                            <textarea
                                                value={editingExercise.editedDescription}
                                                onChange={(e) => setEditingExercise(prev => ({ ...prev, editedDescription: e.target.value }))}
                                                className="w-full p-2 border-2 border-blue-300 rounded-lg"
                                                placeholder="Description"
                                                rows="2"
                                            />
                                            <div className="grid grid-cols-2 gap-2">
                                                <input
                                                    type="text"
                                                    value={editingExercise.editedTargetArea}
                                                    onChange={(e) => setEditingExercise(prev => ({ ...prev, editedTargetArea: e.target.value }))}
                                                    className="p-2 border-2 border-blue-300 rounded-lg"
                                                    placeholder="Target area"
                                                />
                                                <input
                                                    type="text"
                                                    value={editingExercise.editedRepRange}
                                                    onChange={(e) => setEditingExercise(prev => ({ ...prev, editedRepRange: e.target.value }))}
                                                    className="p-2 border-2 border-blue-300 rounded-lg"
                                                    placeholder="Rep range"
                                                />
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={handleSaveEdit}
                                                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold"
                                                >
                                                    ✅ Save
                                                </button>
                                                <button
                                                    onClick={handleCancelEdit}
                                                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold"
                                                >
                                                    ❌ Cancel
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        /* Display Mode */
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
                                                <p className="text-gray-700 text-sm leading-relaxed mb-3">{exercise.description}</p>
                                                
                                                {/* Rep tracking input */}
                                                <div className="flex items-center gap-3">
                                                    <label className="text-sm font-semibold text-gray-700">Reps completed:</label>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        value={exercise.actualReps || ''}
                                                        onChange={(e) => handleRepChange(exercise.id, e.target.value)}
                                                        className="w-20 p-1 border-2 border-gray-300 rounded text-center"
                                                        placeholder="0"
                                                    />
                                                    {exercise.actualReps && (
                                                        <span className="text-sm text-green-600 font-semibold">
                                                            ✅ {exercise.actualReps} reps logged
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-2 ml-2">
                                                <button
                                                    onClick={() => handleEditExercise(exercise)}
                                                    className="text-blue-500 hover:text-blue-700 p-1"
                                                    title="Edit exercise"
                                                >
                                                    ✏️
                                                </button>
                                                <button
                                                    onClick={() => removeExerciseFromToday(exercise.id)}
                                                    className="text-red-500 hover:text-red-700 p-1"
                                                    title="Remove from today"
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        </div>
                                    )}
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
