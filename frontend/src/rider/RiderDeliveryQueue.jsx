import React from 'react';
import RiderHeader from '../components/riderComponents/RiderHeader';
import DeliveryItem from '../components/riderComponents/DeliveryItem';

const deliveries = [
  {
    id: '12345',
    pickup: "Farmer's Market",
    dropoff: "123 Acacia Avenue",
    earnings: "KES 350",
  },
  {
    id: '67890',
    pickup: "Farm Fresh Depot",
    dropoff: "456 Jacaranda Street",
    earnings: "KES 420",
  },
  {
    id: '11223',
    pickup: "Green Grocer",
    dropoff: "789 Oleander Road",
    earnings: "KES 300",
  },
];

const RiderDeliveryQueue = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <div className="flex flex-col min-h-screen">
        <RiderHeader />

        <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
                Delivery Queue
              </h1>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
                Here are the deliveries waiting for you. Tap to accept and start earning.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
              <ul className="divide-y divide-gray-200 dark:divide-gray-700" role="list">
                {deliveries.map((delivery) => (
                  <DeliveryItem key={delivery.id} {...delivery} />
                ))}
              </ul>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default RiderDeliveryQueue;