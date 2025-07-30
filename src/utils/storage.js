// Think of this like a Repository pattern in C# - handles all data persistence
const StorageManager = {
    // Keys for localStorage (like connection strings)
    KEYS: {
        TODAY_DATA: 'recoveryTrackerToday',
        HISTORY_DATA: 'recoveryTrackerData',
        AVAILABLE_EXERCISES: 'availableExercises'
    },

    // Save today's data (like SaveChanges() in Entity Framework)
    saveTodayData(data) {
        try {
            localStorage.setItem(this.KEYS.TODAY_DATA, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('Error saving today data:', error);
            return false;
        }
    },

    // Load today's data
    loadTodayData() {
        try {
            const data = localStorage.getItem(this.KEYS.TODAY_DATA);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Error loading today data:', error);
            return null;
        }
    },

    // Save to history (like adding to a DbSet and saving)
    saveToHistory(dayData) {
        try {
            const existingHistory = this.loadHistory();
            const newEntry = {
                ...dayData,
                timestamp: new Date().toISOString(),
                completedExercises: dayData.exercises.filter(ex => ex.completed).length,
                totalExercises: dayData.exercises.length
            };
            
            const updatedHistory = [...existingHistory, newEntry];
            localStorage.setItem(this.KEYS.HISTORY_DATA, JSON.stringify(updatedHistory));
            return true;
        } catch (error) {
            console.error('Error saving to history:', error);
            return false;
        }
    },

    // Load history data
    loadHistory() {
        try {
            const data = localStorage.getItem(this.KEYS.HISTORY_DATA);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Error loading history:', error);
            return [];
        }
    },

    // Exercise library management
    saveExerciseLibrary(exercises) {
        try {
            localStorage.setItem(this.KEYS.AVAILABLE_EXERCISES, JSON.stringify(exercises));
            return true;
        } catch (error) {
            console.error('Error saving exercises:', error);
            return false;
        }
    },

    loadExerciseLibrary() {
        try {
            const data = localStorage.getItem(this.KEYS.AVAILABLE_EXERCISES);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Error loading exercises:', error);
            return null;
        }
    }
};

// Make available globally
window.StorageManager = StorageManager;