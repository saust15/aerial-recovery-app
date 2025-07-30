// Navigation component (like a UserControl in C#)
const Navigation = ({ currentPage, onPageChange }) => {
    const navigationItems = [
        { id: 'home', icon: Icons.Home, label: 'Home' },
        { id: 'exercises', icon: Icons.Dumbbell, label: 'Exercises' },
        { id: 'pain', icon: Icons.Activity, label: 'Pain' },
        { id: 'water', icon: Icons.Droplets, label: 'Water' },
        { id: 'history', icon: Icons.Calendar, label: 'History' }
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-red-500 via-blue-500 to-red-500 border-t-4 border-yellow-400 px-4 py-2 shadow-lg">
            <div className="flex justify-around">
                {navigationItems.map(({ id, icon: Icon, label }) => (
                    <button
                        key={id}
                        onClick={() => onPageChange(id)}
                        className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                            currentPage === id 
                                ? 'bg-yellow-400 text-red-700 shadow-md transform scale-105' 
                                : 'text-white hover:text-yellow-300 hover:bg-white hover:bg-opacity-20'
                        }`}
                    >
                        <Icon size={20} />
                        <span className="text-xs mt-1 font-semibold">{label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

// Make available globally
window.Navigation = Navigation;
