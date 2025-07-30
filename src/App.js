// Main App component (like your main Program.cs)
const { useState, useEffect } = React;

const App = () => {
    const [currentPage, setCurrentPage] = useState('home');
    const [isLoaded, setIsLoaded] = useState(false);

    // Initialize the app
    useEffect(() => {
        // Check if all our dependencies are loaded
        if (window.Icons && window.StorageManager && window.ExerciseData) {
            setIsLoaded(true);
        }
    }, []);

    if (!isLoaded) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-red-50 via-blue-50 to-yellow-50 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-red-600 mb-4">🎪 Loading Recovery Tracker...</h1>
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-blue-50 to-yellow-50 relative overflow-hidden">
            {/* Circus tent background */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-10 left-10 w-20 h-20 border-4 border-red-500 rounded-full"></div>
                <div className="absolute top-32 right-16 w-16 h-16 border-4 border-blue-500 rounded-full"></div>
                <div className="absolute top-64 left-1/4 w-12 h-12 border-4 border-yellow-500 rounded-full"></div>
            </div>
            
            <div className="relative z-10 p-6">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-red-600 mb-4">🎪 Recovery Tracker 🎪</h1>
                    <p className="text-blue-700 font-semibold bg-white bg-opacity-70 rounded-full px-6 py-3 shadow-md inline-block">
                        Modular Structure Test - Icons: {window.Icons ? '✅' : '❌'} | 
                        Storage: {window.StorageManager ? '✅' : '❌'} | 
                        Data: {window.ExerciseData ? '✅' : '❌'}
                    </p>
                    
                    <div className="mt-8 grid grid-cols-2 gap-4">
                        <div className="bg-white rounded-2xl shadow-lg p-6 border-4 border-red-500">
                            <window.Icons.Dumbbell size={48} className="text-red-500 mx-auto mb-2" />
                            <h3 className="font-bold text-red-600">Exercises Ready</h3>
                            <p className="text-sm text-gray-600">{window.ExerciseData?.DEFAULT_EXERCISES?.length || 0} exercises loaded</p>
                        </div>
                        
                        <div className="bg-white rounded-2xl shadow-lg p-6 border-4 border-blue-500">
                            <window.Icons.Activity size={48} className="text-blue-500 mx-auto mb-2" />
                            <h3 className="font-bold text-blue-600">System Ready</h3>
                            <p className="text-sm text-gray-600">All modules loaded</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Make App available globally
window.App = App;