// Complete App.js with all pages including History
const App = () => {
    const { useState } = React;
    const [currentPage, setCurrentPage] = useState('home');
    
    // Get business logic from our custom hook
    const recoveryData = window.useRecoveryData();

    if (recoveryData.isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-red-50 via-blue-50 to-yellow-50 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-red-600 mb-4">🎪 Loading Your Data...</h1>
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
                </div>
            </div>
        );
    }

    // Render current page content
    const renderCurrentPage = () => {
        switch (currentPage) {
            case 'home':
                return window.HomePage ? 
                    <window.HomePage recoveryData={recoveryData} /> : 
                    <div className="p-6 text-center">HomePage component not loaded</div>;
            case 'exercises':
                return window.ExercisesPage ? 
                    <window.ExercisesPage recoveryData={recoveryData} /> : 
                    <div className="p-6 text-center">ExercisesPage component not loaded</div>;
            case 'pain':
                return window.PainPage ? 
                    <window.PainPage recoveryData={recoveryData} /> : 
                    <div className="p-6 text-center">PainPage component not loaded</div>;
            case 'water':
                return window.WaterPage ? 
                    <window.WaterPage recoveryData={recoveryData} /> : 
                    <div className="p-6 text-center">WaterPage component not loaded</div>;
            case 'history':
                return window.HistoryPage ? 
                    <window.HistoryPage recoveryData={recoveryData} /> : 
                    <div className="p-6 text-center">HistoryPage component not loaded</div>;
            default:
                return <div className="p-6 text-center">Page not found</div>;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-blue-50 to-yellow-50 relative overflow-hidden">
            {/* Circus tent background */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-10 left-10 w-20 h-20 border-4 border-red-500 rounded-full"></div>
                <div className="absolute top-32 right-16 w-16 h-16 border-4 border-blue-500 rounded-full"></div>
                <div className="absolute top-64 left-1/4 w-12 h-12 border-4 border-yellow-500 rounded-full"></div>
                <div className="absolute bottom-96 right-1/4 w-14 h-14 border-4 border-red-500 rounded-full"></div>
                <div className="absolute bottom-64 left-12 w-18 h-18 border-4 border-blue-500 rounded-full"></div>
                {/* Tent stripes */}
                <div className="absolute top-0 left-0 w-full h-full">
                    <div className="absolute top-20 left-0 w-full h-1 bg-gradient-to-r from-red-200 via-blue-200 to-yellow-200"></div>
                    <div className="absolute top-40 left-0 w-full h-1 bg-gradient-to-r from-yellow-200 via-red-200 to-blue-200"></div>
                    <div className="absolute top-60 left-0 w-full h-1 bg-gradient-to-r from-blue-200 via-yellow-200 to-red-200"></div>
                </div>
            </div>
            
            <div className="relative z-10">
                {renderCurrentPage()}
                <Navigation currentPage={currentPage} onPageChange={setCurrentPage} />
            </div>
        </div>
    );
};

window.App = App;
