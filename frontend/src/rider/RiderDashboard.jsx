import StatsCard from "../components/riderComponents/StatsCard";
import RecentDeliveriesTable from "../components/riderComponents/RecentDeliveriesTable";
import RiderHeader from "../components/riderComponents/RiderHeader";

import { sampleDeliveries } from "../constants/index";

const RiderDashboard = () => {
  // NOTE: data is currently static. Replace with props or fetch from an API later.
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100">
      <RiderHeader userAvatarUrl="https://via.placeholder.com/200" />

      <main className="flex-1 px-4 sm:px-6 lg:px-8 xl:px-20 2xl:px-40 py-8">
        <div className="mx-auto max-w-7xl flex-col gap-8">
          <div className="flex flex-col gap-2 mb-4">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
              Karibu, Juma!
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Here's a summary of your activity.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-6">
            <StatsCard label="Active Deliveries" value="3" />
            <StatsCard label="Total Earnings" value="Ksh 1,500" />
            <StatsCard label="Distance Covered" value="25 km" />
            <StatsCard
              label="Performance Rating"
              value={
                <span className="flex items-center gap-2">
                  <span className="text-3xl font-bold">4.8</span>
                  <svg
                    className="w-6 h-6 text-yellow-400"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 .587l3.668 7.431L24 9.753l-6 5.853L19.335 24 12 19.897 4.665 24 6 15.606 0 9.753l8.332-1.735z" />
                  </svg>
                </span>
              }
            />
          </div>

          <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Recent Deliveries
            </h2>
            <RecentDeliveriesTable deliveries={sampleDeliveries} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default RiderDashboard;
