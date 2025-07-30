// Updated useRecoveryData.js with injury areas and pain notes
const useRecoveryData = () => {
    const { useState, useEffect } = React;
    
    // State management
    const [dailyData, setDailyData] = useState({
        exercises: [],
        painLevel: null,
        painNotes: '',
        waterIntake: 0,
        date: new Date().toDateString()
    });
    
    const [savedData, setSavedData] = useState([]);
    const [availableExercises, setAvailableExercises] = useState([]);
    const [userInjuryAreas, setUserInjuryAreas] = useState([]);
    const [painNoteHistory, setPainNoteHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Initialize data on component mount
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

    // Auto-save injury areas when they change
    useEffect(() => {
        if (!isLoading && userInjuryAreas.length >= 0) {
            try {
                localStorage.setItem('userInjuryAreas', JSON.stringify(userInjuryAreas));
            } catch (error) {
                console.error('Error saving injury areas:', error);
            }
        }
    }, [userInjuryAreas, isLoading]);

    // Auto-save pain note history
    useEffect(() => {
        if (!isLoading) {
            try {
                localStorage.setItem('painNoteHistory', JSON.stringify(painNoteHistory));
            } catch (error) {
                console.error('Error saving pain note history:', error);
            }
        }
    }, [painNoteHistory, isLoading]);

    // Initialize all data
    const initializeData = async () => {
        try {
            // Load exercise library
            let exercises = StorageManager.loadExerciseLibrary();
            if (!exercises) {
                exercises = ExerciseData.DEFAULT_EXERCISES;
                StorageManager.saveExerciseLibrary(exercises);
            }
            setAvailableExercises(exercises);

            // Load user injury areas
            const savedInjuryAreas = localStorage.getItem('userInjuryAreas');
            if (savedInjuryAreas) {
                setUserInjuryAreas(JSON.parse(savedInjuryAreas));
            } else {
                // Default to hip labrum and knee support as mentioned
                setUserInjuryAreas(["Hip Labrum", "Knee Support"]);
            }

            // Load pain note history
            const savedPainNotes = localStorage.getItem('painNoteHistory');
            if (savedPainNotes) {
                setPainNoteHistory(JSON.parse(savedPainNotes));
            }

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

    // Business logic methods
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

    const savePainNote = (injuryArea, note) => {
        if (note.trim() && injuryArea) {
            const newPainNote = {
                id: Date.now(),
                date: new Date().toDateString(),
                injuryArea: injuryArea,
                note: note.trim(),
                timestamp: new Date().toISOString()
            };
            setPainNoteHistory(prev => [...prev, newPainNote]);
            return true;
        }
        return false;
    };

    const addInjuryArea = (area) => {
        if (area.trim() && !userInjuryAreas.includes(area.trim())) {
            setUserInjuryAreas(prev => [...prev, area.trim()]);
            return true;
        }
        return false;
    };

    const removeInjuryArea = (area) => {
        setUserInjuryAreas(prev => prev.filter(a => a !== area));
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

    // Return all state and methods
    return {
        // State
        dailyData,
        savedData,
        availableExercises,
        userInjuryAreas,
        painNoteHistory,
        isLoading,
        
        // Methods
        toggleExercise,
        addExerciseToToday,
        removeExerciseFromToday,
        addCustomExercise,
        updatePainLevel,
        updatePainNotes,
        savePainNote,
        addInjuryArea,
        removeInjuryArea,
        addWater,
        removeWater,
        saveToHistory
    };
};

// Make available globally
window.useRecoveryData = useRecoveryData;
