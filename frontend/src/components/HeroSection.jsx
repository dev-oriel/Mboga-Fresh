import React from "react";

const Hero = () => {
  return (
    <div className="relative h-[65vh] min-h-[500px] w-full">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://lh3.googleusercontent.com/aida-public/AB6AXuC3UJK7ZKfwXhP82tuHAjC-v858sCyB64-3IjaUr6JMqvRW37M7a0nYhOhJj8jLiU_4AmfPNEqA8dJdsxpwkLQ9kYJZnK_Zyyqs-Y1Yo7euFiGefjA9z5IIGMeAs5u8zP7BaAj-0y0Vu-6lEhcVCcudR7gOzvuz2mYJG5W6VmWsZAh_sbpkTJbIA1ywI5CcdsMYYy4rcjSDGtE_za1_5B1F3xpUjvsZawttNxALy1dhsxTZG-CrhO3zk-6Ioku861N73-AkySmhmcQ')",
        }}
      ></div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Content */}
      <div className="relative z-10 flex h-full items-center justify-center text-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto flex flex-col items-center gap-6">
            <h1 className="text-5xl md:text-7xl font-black text-white leading-tight drop-shadow-xl">
              Karibu Mboga Fresh – Your Local Market, Digitized!
            </h1>
            <p className="text-xl md:text-2xl text-white/90 drop-shadow-lg max-w-2xl">
              Shop fresh, support local farmers and mama mbogas near you.
            </p>

            {/* Buttons */}
            <div className="mt-6 flex flex-col sm:flex-row gap-4">
              {/* Primary button - Fresh green */}
              <button className="flex min-w-[180px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-14 px-8 bg-[#28A745] text-white text-lg font-bold shadow-2xl transition-transform hover:scale-105 hover:bg-[#1e7e34]">
                Explore Marketplace
              </button>

              {/* Secondary button - Light green/neutral */}
              <button className="flex min-w-[180px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-14 px-8 bg-[#DFF5E1] text-[#2D2D2D] text-lg font-bold shadow-2xl transition-transform hover:scale-105 hover:bg-[#bde6c1]">
                View Vendors Near Me
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
