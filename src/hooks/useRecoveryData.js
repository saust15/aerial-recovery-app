// Custom React Hook - like a Service class in C#
// Handles all the business logic for recovery data management
const useRecoveryData = () => {
    const { useState, useEffect } = React;
    
    // State management (like private properties in a C# class)
    const [dailyData, setDailyData] = useState({
        exercises: [],
        painLevel: null,
        painNotes: '',
        waterIntake: 0,
        date: new Date().toDateString()
    });
    
    const [savedData, setSavedData] = useState([]);
    const [availableExercises, setAvailableExercises] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Initialize data on component mount (like a constructor)
    useEffect(() => {
        initializeData();
    }, []);

    // Auto-save daily data when it changes
    useEffect(() => {
        if (!isLoading && dailyData.exercises.length >= 0) {
            StorageManager.saveTodayData(dailyData);
        }
    }, [dailyData, isLoading]);

    // Auto-save exercise library when it changes
    useEffect(() => {
        if (!isLoading && availableExercises.length > 0) {
            StorageManager.saveExerciseLibrary(availableExercises);
        }
    }, [availableExercises, isLoading]);

    // Initialize all data (like a setup method)
    const initializeData = async () => {
        try {
            // Load exercise library
            let exercises = StorageManager.loadExerciseLibrary();
            if (!exercises) {
                exercises = ExerciseData.DEFAULT_EXERCISES;
                StorageManager.saveExerciseLibrary(exercises);
            }
            setAvailableExercises(exercises);

            // Load history
            const history = StorageManager.loadHistory();
            setSavedData(history);

            // Load today's data
            const todayData = StorageManager.loadTodayData();
            const today = new Date().toDateString();
            
            if (todayData && todayData.date === today) {
                setDailyData(todayData);
            } else {
                // New day - reset daily data
                setDailyData(prev => ({
                    ...prev,
                    exercises: [],
                    painLevel: null,
                    painNotes: '',
                    waterIntake: 0,
                    date: today
                }));
            }
            
            setIsLoading(false);
        } catch (error) {
            console.error('Error initializing data:', error);
            setIsLoading(false);
        }
    };

    // Business logic methods (like public methods in a C# service)
    
    const toggleExercise = (exerciseId) => {
        setDailyData(prev => ({
            ...prev,
            exercises: prev.exercises.map(ex => 
                ex.id === exerciseId ? { ...ex, completed: !ex.completed } : ex
            )
        }));
    };

    const addExerciseToToday = (exerciseId) => {
        const exercise = availableExercises.find(ex => ex.id === exerciseId);
        if (exercise && !dailyData.exercises.find(ex => ex.id === exerciseId)) {
            setDailyData(prev => ({
                ...prev,
                exercises: [...prev.exercises, { ...exercise, completed: false }]
            }));
        }
    };

    const removeExerciseFromToday = (exerciseId) => {
        setDailyData(prev => ({
            ...prev,
            exercises: prev.exercises.filter(ex => ex.id !== exerciseId)
        }));
    };

    const addCustomExercise = (name, description, targetArea, repRange) => {
        if (name.trim()) {
            const newExercise = ExerciseData.createNewExercise(name, description, targetArea, repRange);
            setAvailableExercises(prev => [...prev, newExercise]);
            return true;
        }
        return false;
    };

    const updatePainLevel = (level) => {
        setDailyData(prev => ({ ...prev, painLevel: level }));
    };

    const updatePainNotes = (notes) => {
        setDailyData(prev => ({ ...prev, painNotes: notes }));
    };

    const addWater = () => {
        setDailyData(prev => ({ ...prev, waterIntake: prev.waterIntake + 1 }));
    };

    const removeWater = () => {
        setDailyData(prev => ({ ...prev, waterIntake: Math.max(0, prev.waterIntake - 1) }));
    };

    const saveToHistory = () => {
        const success = StorageManager.saveToHistory(dailyData);
        if (success) {
            const updatedHistory = StorageManager.loadHistory();
            setSavedData(updatedHistory);
            return true;
        }
        return false;
    };

    // Return all state and methods (like a public interface)
    return {
        // State
        dailyData,
        savedData,
        availableExercises,
        isLoading,
        
        // Methods
        toggleExercise,
        addExerciseToToday,
        removeExerciseFromToday,
        addCustomExercise,
        updatePainLevel,
        updatePainNotes,
        addWater,
        removeWater,
        saveToHistory
    };
};

// Make available globally
window.useRecoveryData = useRecoveryData;
