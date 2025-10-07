// src/components/CategoriesSection.jsx
import React from "react";

const categories = [
  {
    name: "Vegetables",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCjDccNzon73G1cZWXiCUTIhQzmH7UB7I0Y379K9UrccRgiXRM4UtZ0ECDVMv5YXMmcnYcqwKoAIP1tYqQ38V6RUJYew_vCO4mTYJ01xiafhaSlCc-5dccqZBSlJxjsllNH0xOKSBlMh86udhI6A5cV0AQHkWCabZjWOdTFxgJ1Axpk7XaxuZWzvkjjLHwhWq-AvixpCIMxY2Z7esIQ8qe1nJfXCYAAWHYnhwEKxePNZL2UrSMNibHZiXTGkVb6t71uC8se8SxjyLE",
  },
  {
    name: "Fruits",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDbZ3fZthY9xhpEYgAoCDVDYlWRdFDnWKVLvDSXcPYMvdHea_N-AaVGvcs_ugORAZZx9FqPafD6mD3HDqbwgX01wirtNKoxVi7vo-C8N3vTw0Ysrab1bSy4KJKCxmRmOrxO8qPF3xX_EyzE0lKC2523xz1Tb-toTxD_8gPO52Lu7UOYPxD5aMJW_14KgyUJkzJRmQcyOQMxbEPcvUOKyfplD5nE2SYqhMWpTZvZ3ryNXeGvjYQChNHvdpyzAbvCn2lTQbkmR8TK6GE",
  },
  {
    name: "Tubers & Cereals",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuACXcp1BYt9T4fAxqjNRtvjA_Owku_1c5BH_ZCpDJ6YqfTQfUA1rKjBC7plhEPOgqJRsCBhCAEX8rKvlG4u9N_vgEojys1SCh_1hXG2sjObslBjy1imfSukOP4VVhSuv9OJlC-cbMxtAGm34uvO5_grk5ZHpQKME0sbfuAJYKjvBHV5GADBnELV2pEDfex62IUj2VZKigpoUrHM9TWOpkE90CxjtfI1u-cLoDq1jZGbxjYAxFI9GCv1sFGLlzcv6024Us4Wl_8gwIs",
  },
  {
    name: "Herbs & Spices",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDQ_aUvx6b5QtM9v-9RIBtjlEZw_VfdHIdduhdyzTJ4CkMjkz7FY43TyBuLGeBIXqVVMztv0UAx0U8lRMjfE9IqQTDmnbfQ48XDif8NzJT2xXXiXNHeXoT2gAIs6KZ5cHCrVvzrf4UJ_YSeo2V3VV0lJN3rcwFlIFb9HD-DUqhK74u_ieJSdVmKP3Y3GfRzjRLKfd8_je4hM8y-65GfU4ZpNyCDi1gMiv5NVVxS-6KBuLtEbyNbla2hfoHleiNItEfXt0-K85Emv-M",
  },
  {
    name: "Organic",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBnLx6IYepgUBa43aDem7Kpi7MzGv2bwyr_SWbURNgJ2_yhbr0PBOBjQGNTGRAGlsYKY8M5TO1M5z3azTPRhvZq7iMh7aeUqWHG_t_dbvM443fwnfcsgLU2EwV4IwMsQwLBCRn6WKQ_A6pfCGJAOr6vxwieQP04ZGPyxrUBr7lsNiw0ieei3V7c6P-LlMWwbtJKaD7MiyUh-49YHDGaa7MereXAuNepZ5NyAyxBa4xrC5c3-43OZPxyVBcvh7xN9MX5LTpk1RfM1SY",
  },
  {
    name: "Value Bundles",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAnxWI5brjG063tzBtpSZUUNQvob4lK2RyBwF2PVFtbjKGIFUFmmhBYGARioZp06dU3fcPEye4sMyJHrlmm7b3j5Hqx4ilVzU2J0F-LwDgbyR2Fo8OvV38ntZmYc4xm38sd3IRXJHrIXitclI5YQUmKwXJvsLLFD4xEwhIlPThUZrnCPj_CYYhD01DjUWbha19DwkbiK4Vv6bvEyVO7wvPoiK8DdsOipHe6kOquIf-eGX88rdP9dR1_N9UQLpiGGXO9nkq2mywCBXk",
  },
];

const CategoriesSection = () => {
  return (
    <section className="py-16 bg-wood-texture/10 dark:bg-gray-900/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800 dark:text-white">
          Shop by Category
        </h2>
        <div className="flex overflow-x-auto space-x-6 pb-4 -mx-4 px-4">
          {categories.map((cat) => (
            <div
              key={cat.name}
              className="flex-shrink-0 w-40 text-center group"
            >
              <div className="relative aspect-square rounded-full overflow-hidden shadow-lg transform group-hover:-translate-y-2 transition-transform duration-300">
                <img
                  alt={cat.name}
                  className="w-full h-full object-cover"
                  src={cat.img}
                />
                <div className="absolute inset-0 bg-black/20"></div>
              </div>
              <h3 className="mt-4 font-semibold text-lg text-gray-700 dark:text-gray-200">
                {cat.name}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
