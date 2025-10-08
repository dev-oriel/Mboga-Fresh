import React from 'react'

const CategoryCard = ({ name, img }) => {
  return (
    <div className="group text-center">
      <div className="aspect-square bg-cover bg-center rounded-xl mb-2" style={{ backgroundImage: `url('${img}')` }} />
      <p className="font-medium text-[#374151] dark:text-[#D1D5DB] group-hover:text-[#42cf17] dark:group-hover:text-[#42cf17] transition">{name}</p>
    </div>
  )
}

export default CategoryCard