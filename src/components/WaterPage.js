// WaterPage component
const WaterPage = ({ recoveryData }) => {
    const { dailyData, addWater, removeWater } = recoveryData;

    return (
        <div className="p-6 pb-24">
            <div className="text-center mb-6">
                <h1 className="text-3xl font-bold text-blue-600 mb-2">🎪 Water Intake</h1>
            </div>
            
            <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-lg p-8 text-center border-4 border-blue-500">
                    <div className="text-8xl mb-4 font-bold text-blue-600 drop-shadow-lg">{dailyData.waterIntake}</div>
                    <p className="text-xl text-red-600 font-bold mb-6">glasses of water today 💧</p>
                    
                    <div className="flex justify-center space-x-4 mb-6">
                        <button
                            onClick={removeWater}
                            disabled={dailyData.waterIntake === 0}
                            className="bg-red-500 hover:bg-red-600 disabled:bg-gray-300 text-white p-4 rounded-full transition-all transform hover:scale-110 shadow-lg border-4 border-yellow-400"
                        >
                            <Icons.Minus size={28} />
                        </button>
                        <button
                            onClick={addWater}
                            className="bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white p-6 rounded-full transition-all transform hover:scale-110 text-6xl shadow-xl border-4 border-yellow-400"
                        >
                            💧
                        </button>
                        <button
                            onClick={addWater}
                            className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full transition-all transform hover:scale-110 shadow-lg border-4 border-yellow-400"
                        >
                            <Icons.Plus size={28} />
                        </button>
                    </div>

                    <div className="bg-gray-200 rounded-full h-6 mb-2 border-4 border-red-400">
                        <div 
                            className="bg-gradient-to-r from-blue-500 via-yellow-400 to-red-500 h-full rounded-full transition-all duration-500"
                            style={{ width: `${Math.min((dailyData.waterIntake / 8) * 100, 100)}%` }}
                        ></div>
                    </div>
                    <p className="text-lg font-bold text-yellow-600">
                        Goal: 8 glasses per day {dailyData.waterIntake >= 8 && '🎯✅'}
                    </p>
                </div>

                <div className="grid grid-cols-4 gap-3">
                    {Array.from({ length: 12 }, (_, i) => (
                        <div
                            key={i}
                            className={`text-5xl text-center p-3 rounded-2xl border-4 transition-all ${
                                i < dailyData.waterIntake 
                                    ? 'bg-gradient-to-br from-blue-100 to-blue-200 border-blue-400 shadow-lg transform scale-105' 
                                    : 'bg-white border-yellow-300 opacity-50'
                            }`}
                        >
                            💧
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

window.WaterPage = WaterPage;
