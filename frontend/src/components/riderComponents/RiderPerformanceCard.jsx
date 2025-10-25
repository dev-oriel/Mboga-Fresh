// frontend/src/components/riderComponents/RiderPerformanceCard.jsx
import React from "react";
import { useAuth } from "../../context/AuthContext";

const RiderPerformanceCard = () => {
  const { user } = useAuth();

  // Mock data - in a real app, this would come from the backend
  const stats = {
    ordersCompleted: user?.ordersCompleted ?? 250,
    averageRating: user?.averageRating ?? 4.8,
    totalEarnings: user?.totalEarnings ?? 15000,
    onTimeDelivery: user?.onTimeDelivery ?? 95,
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6" id="performance">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900">Performance Metrics</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600 mb-2">Orders Completed</div>
              <div className="text-4xl font-bold text-emerald-600">
                {stats.ordersCompleted}
              </div>
            </div>
            <div className="bg-emerald-600 text-white rounded-full p-3">
              <span className="material-symbols-outlined text-3xl">
                local_shipping
              </span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600 mb-2">Average Rating</div>
              <div className="text-4xl font-bold text-yellow-600 flex items-center gap-2">
                {stats.averageRating}
                <span className="material-symbols-outlined text-3xl">star</span>
              </div>
            </div>
            <div className="bg-yellow-600 text-white rounded-full p-3">
              <span className="material-symbols-outlined text-3xl">
                reviews
              </span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600 mb-2">Total Earnings</div>
              <div className="text-4xl font-bold text-blue-600">
                Ksh {stats.totalEarnings.toLocaleString()}
              </div>
            </div>
            <div className="bg-blue-600 text-white rounded-full p-3">
              <span className="material-symbols-outlined text-3xl">
                payments
              </span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600 mb-2">On-Time Delivery</div>
              <div className="text-4xl font-bold text-purple-600">
                {stats.onTimeDelivery}%
              </div>
            </div>
            <div className="bg-purple-600 text-white rounded-full p-3">
              <span className="material-symbols-outlined text-3xl">
                schedule
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Growth Section */}
      <div className="mt-6 bg-gradient-to-r from-gray-700 to-gray-600 rounded-lg p-6 text-center">
        <h4 className="text-2xl font-bold text-white mb-3">
          Grow with Mboga Fresh
        </h4>
        <p className="text-gray-200 mb-4">
          Access training resources and tips to improve your earnings and ratings.
        </p>
        <button className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors">
          Explore Resources
        </button>
      </div>
    </div>
  );
};

export default RiderPerformanceCard;
