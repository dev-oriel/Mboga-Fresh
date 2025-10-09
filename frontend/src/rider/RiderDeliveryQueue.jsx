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
    <div className="bg-[#f7f8f6] dark:bg-[#192210] font-display text-gray-800 dark:text-gray-200 min-h-screen">
      <div className="flex flex-col min-h-screen w-full overflow-x-hidden">
        <div className="flex flex-col grow">
          <RiderHeader />

          <main className="flex flex-1 justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-4xl space-y-8">
              <div className="text-center">
                <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
                  Delivery Queue
                </h1>
                <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
                  Here are the deliveries waiting for you. Tap to accept and start earning.
                </p>
              </div>

              <div className="bg-[#f7f8f6] dark:bg-[#192210] shadow-md rounded-lg overflow-hidden border border-[#73d411]/20 dark:border-[#73d411]/40">
                <ul className="divide-y divide-[#73d411]/20 dark:divide-[#73d411]/40" role="list">
                  {deliveries.map((delivery) => (
                    <DeliveryItem key={delivery.id} {...delivery} />
                  ))}
                </ul>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default RiderDeliveryQueue;
