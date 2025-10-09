import React from "react";

const PaymentMethodsCard = () => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6" id="payment-methods">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-900">Payment Methods</h3>

        <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition-colors text-sm flex items-center gap-2">
          <span className="material-symbols-outlined text-base">add</span>
          Add New Method
        </button>
      </div>

      <div className="space-y-4">
        <div className="border rounded-lg p-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <img
              alt="M-Pesa logo"
              className="h-8"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuD97jbLfE75ib9MXOEzAj3Jm20HevcrTEPyyPWdhL5Ab4m4RWEFnT5rA8KRouq1jQLrRxzNUj_LJhz3z5NW6IlXc3cM2_2UGZtUqU9JnSNA_jUlvjUV-0_hTefNpms1Y5nDm6LxDluzLVniNcxBJCs12muW5o_781HMi7_UHDdjjBnu968xTzXjvE7GciFFA7-FUWHsCChH0E-6CM416fVWOd7v97BoyBpYWFmcqsXE_WRQoQAmDN3xk0GNPe4Q52jW0VpgUtsdvCQ"
            />
            <div>
              <p className="font-semibold">M-Pesa</p>
              <p className="text-gray-500">+254 712 345 678</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-emerald-600">
              Primary
            </span>
            <button className="text-gray-500 hover:text-rose-500">
              <span className="material-symbols-outlined">delete</span>
            </button>
          </div>
        </div>

        <div className="border rounded-lg p-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <img
              alt="Visa logo"
              className="h-8"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuB9HhZdvb8_G9WeKSSzIdMQqhA2Q1UZByqvzN6-Ow8pCU1zggktqiZ-Pc921Kz2husyTSJVKdAsVNjaW2i4D-Q6OBb3ZdVqLIXLy9E9GiFAUtMYtivdVxbKQ3qF7Hj_5OOfYdc3UP6vGVeUXcXXQLK730DRCV6Zm2n9GI8cbkVJ87jc49RHPCAWw58KYWZD28Cxje_83p-8ofUQl5Tm_vxLn_5_oxQgYQ-q0iQy2iXe5tsqCCM4mli3tjm6RhBcC78cHhs1KURiUbo"
            />
            <div>
              <p className="font-semibold">Visa Card</p>
              <p className="text-gray-500">**** **** **** 1234</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="text-gray-500 hover:text-emerald-600 text-sm">
              Set as primary
            </button>
            <button className="text-gray-500 hover:text-rose-500">
              <span className="material-symbols-outlined">delete</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodsCard;
