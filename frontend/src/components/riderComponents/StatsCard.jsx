// In src/components/riderComponents/StatsCard.jsx
const StatsCard = ({ label, value, onClick, clickable = false }) => {
  return (
    <div 
      className={`bg-white dark:bg-gray-800 rounded-lg shadow p-6 ${
        clickable ? 'cursor-pointer hover:shadow-lg transition-shadow' : ''
      }`}
      onClick={clickable ? onClick : undefined}
    >
      <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
        {label}
      </p>
      <div className="text-2xl font-bold text-gray-900 dark:text-white">
        {value}
      </div>
    </div>
  );
};

export default StatsCard;
