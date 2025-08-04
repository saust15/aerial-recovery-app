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

    const updateExerciseReps = (exerciseId, reps) => {
        setDailyData(prev => ({
            ...prev,
            exercises: prev.exercises.map(ex => 
                ex.id === exerciseId ? { ...ex, actualReps: reps } : ex
            )
        }));
    };

    const updateExerciseDetails = (exerciseId, updates) => {
        setAvailableExercises(prev => 
            prev.map(ex => 
                ex.id === exerciseId ? { ...ex, ...updates } : ex
            )
        );
        
        // Also update in today's exercises if present
        setDailyData(prev => ({
            ...prev,
            exercises: prev.exercises.map(ex => 
                ex.id === exerciseId ? { ...ex, ...updates } : ex
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

    const exportToPDF = () => {
        try {
            // Create the report content
            const reportData = {
                generatedDate: new Date().toLocaleDateString(),
                totalDaysTracked: savedData.length,
                summary: {
                    avgPain: savedData.length > 0 ? (savedData.reduce((sum, day) => sum + (day.painLevel || 0), 0) / savedData.length).toFixed(1) : 0,
                    avgWater: savedData.length > 0 ? (savedData.reduce((sum, day) => sum + (day.waterIntake || 0), 0) / savedData.length).toFixed(1) : 0,
                    totalExercises: savedData.reduce((sum, day) => sum + (day.completedExercises || 0), 0)
                },
                dailyEntries: savedData,
                painNotes: painNoteHistory
            };

            // Check if we're on mobile
            const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
            
            if (isMobile) {
                // For mobile: create a downloadable HTML file
                const htmlContent = generateReportHTML(reportData);
                const blob = new Blob([htmlContent], { 
                    type: 'text/html;charset=utf-8' 
                });
                const url = URL.createObjectURL(blob);
                
                // Create download link
                const downloadLink = document.createElement('a');
                downloadLink.href = url;
                downloadLink.download = `aerial-recovery-report-${new Date().toISOString().split('T')[0]}.html`;
                downloadLink.style.display = 'none';
                
                // Trigger download
                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);
                
                // Clean up URL
                setTimeout(() => URL.revokeObjectURL(url), 100);
            } else {
                // For desktop: use print dialog
                const htmlContent = generateReportHTML(reportData);
                const printWindow = window.open('', '_blank');
                printWindow.document.write(htmlContent);
                printWindow.document.close();
                printWindow.focus();
                printWindow.print();
            }
            
            return true;
        } catch (error) {
            console.error('Error generating PDF:', error);
            return false;
        }
    };

    const generateReportHTML = (data) => {
        return `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Aerial Recovery Report</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; color: #333; line-height: 1.6; }
                    .header { text-align: center; margin-bottom: 30px; border-bottom: 3px solid #e74c3c; padding-bottom: 20px; }
                    .summary { background: #f8f9fa; padding: 20px; border-radius: 10px; margin-bottom: 30px; }
                    .summary h3 { color: #e74c3c; margin-top: 0; }
                    .stat-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 20px; margin: 20px 0; }
                    .stat-box { text-align: center; padding: 15px; background: white; border: 2px solid #ddd; border-radius: 8px; }
                    .stat-number { font-size: 24px; font-weight: bold; color: #e74c3c; }
                    .daily-entry { margin: 15px 0; padding: 15px; border: 1px solid #ddd; border-radius: 8px; page-break-inside: avoid; }
                    .date { font-weight: bold; color: #3498db; margin-bottom: 10px; }
                    .pain-notes { background: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0; }
                    .mobile-instructions { background: #e8f4fd; padding: 15px; border-radius: 8px; margin-bottom: 20px; text-align: center; }
                    .icon { font-style: normal; }
                    @media screen and (max-width: 768px) {
                        body { margin: 10px; font-size: 14px; }
                        .stat-grid { grid-template-columns: 1fr; }
                        .header h1 { font-size: 24px; }
                    }
                    @media print { 
                        body { margin: 0; font-size: 12px; } 
                        .no-print, .mobile-instructions { display: none; }
                        .daily-entry { page-break-inside: avoid; margin: 10px 0; }
                    }
                </style>
            </head>
            <body>
                <div class="mobile-instructions">
                    <span class="icon">📱</span> <strong>Mobile Users:</strong> This report has been downloaded as an HTML file. You can print it to PDF using your browser's print function, or view it as-is. Look for the downloaded file in your Downloads folder.
                </div>
                
                <div class="header">
                    <h1><span class="icon">🎪</span> Aerial Recovery Report</h1>
                    <p>Generated on ${data.generatedDate}</p>
                    <p>Total Days Tracked: ${data.totalDaysTracked}</p>
                </div>
                
                <div class="summary">
                    <h3><span class="icon">📊</span> Summary Statistics</h3>
                    <div class="stat-grid">
                        <div class="stat-box">
                            <div class="stat-number">${data.summary.avgPain}</div>
                            <div>Average Pain Level</div>
                        </div>
                        <div class="stat-box">
                            <div class="stat-number">${data.summary.avgWater}</div>
                            <div>Average Water Intake</div>
                        </div>
                        <div class="stat-box">
                            <div class="stat-number">${data.summary.totalExercises}</div>
                            <div>Total Exercises Completed</div>
                        </div>
                    </div>
                </div>

                <h3><span class="icon">📅</span> Daily Progress History</h3>
                ${data.dailyEntries.map(entry => `
                    <div class="daily-entry">
                        <div class="date">${new Date(entry.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
                        <p><strong>Pain Level:</strong> ${entry.painLevel !== null ? entry.painLevel + '/10' : 'Not recorded'}</p>
                        <p><strong>Water Intake:</strong> ${entry.waterIntake || 0} glasses</p>
                        <p><strong>Exercises Completed:</strong> ${entry.completedExercises || 0}/${entry.totalExercises || 0}</p>
                        ${entry.painNotes ? `<p><strong>Notes:</strong> "${entry.painNotes}"</p>` : ''}
                        ${entry.exercises && entry.exercises.length > 0 ? `
                            <p><strong>Exercises:</strong></p>
                            <ul>
                                ${entry.exercises.map(ex => `
                                    <li>${ex.name} - ${ex.completed ? (ex.actualReps ? `${ex.actualReps} reps completed` : 'Completed') : 'Not completed'}</li>
                                `).join('')}
                            </ul>
                        ` : ''}
                    </div>
                `).join('')}

                ${data.painNotes.length > 0 ? `
                    <div class="pain-notes">
                        <h3><span class="icon">📝</span> Pain Notes History</h3>
                        ${data.painNotes.map(note => `
                            <div style="margin: 10px 0; padding: 10px; border-left: 4px solid #f39c12;">
                                <p><strong>${note.date} - ${note.injuryArea}</strong></p>
                                <p>${note.note}</p>
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
                
                <div style="margin-top: 30px; text-align: center; color: #666; font-size: 12px;">
                    <p>Report generated by Aerial Recovery App <span class="icon">🎪</span></p>
                </div>
            </body>
            </html>
        `;
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
        updateExerciseReps,
        updateExerciseDetails,
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
        saveToHistory,
        exportToPDF
    };
};

// Make available globally
window.useRecoveryData = useRecoveryData;
