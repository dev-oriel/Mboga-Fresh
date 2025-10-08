import React from "react";

const VendorCard = ({ name, img = "https://via.placeholder.com/150" }) => {
  return (
    <div className="text-center group">
      <div
        className="w-24 h-24 mx-auto rounded-full bg-cover bg-center mb-2 ring-2 ring-transparent group-hover:ring-[#42cf17] transition-all"
        style={{ backgroundImage: `url('${img}')` }}
      />
      <p className="font-medium text-[#374151] dark:text-[#D1D5DB]">{name}</p>
    </div>
  );
};

export default VendorCard;
