import React, { useState } from "react";

const PaymentMethodsCard = () => {
  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: 1,
      type: "M-Pesa",
      number: "+254 712 345 678",
      primary: true,
    },
  ]);

  const [showNewForm, setShowNewForm] = useState(false);
  const [newNumber, setNewNumber] = useState("");
  const [editId, setEditId] = useState(null);
  const [editValue, setEditValue] = useState("");

  // --- Utility: Strictly format phone number as +254 7XX XXX XXX ---
  const formatPhoneNumber = (value) => {
    let digits = value.replace(/\D/g, ""); // remove non-digits

    // Ensure number starts with '7' or '07' or '2547'
    if (digits.startsWith("07")) digits = "254" + digits.slice(1);
    else if (digits.startsWith("7")) digits = "254" + digits;
    else if (!digits.startsWith("254")) digits = "2547"; // fallback

    // Keep only 12 digits (2547XXXXXXX)
    digits = digits.substring(0, 12);

    const match = digits.match(/^254(\d{3})(\d{3})(\d{3})$/);
    if (match) return `+254 ${match[1]} ${match[2]} ${match[3]}`;
    return "+254 7";
  };

  // Validate strict length (+254 7XX XXX XXX => 14 chars)
  const isValidPhoneNumber = (value) => /^\+254\s7\d{2}\s\d{3}\s\d{3}$/.test(value);

  // Add new M-Pesa number
  const handleAddMethod = (e) => {
    e.preventDefault();
    const formatted = formatPhoneNumber(newNumber);

    if (!isValidPhoneNumber(formatted)) {
      alert("Please enter a valid M-Pesa number (e.g. +254 712 345 678)");
      return;
    }

    const newMethod = {
      id: Date.now(),
      type: "M-Pesa",
      number: formatted,
      primary: false,
    };

    setPaymentMethods([newMethod, ...paymentMethods]);
    setNewNumber("");
    setShowNewForm(false);
  };

  // Delete
  const handleDelete = (id) => {
    setPaymentMethods(paymentMethods.filter((m) => m.id !== id));
  };

  // Edit
  const handleEdit = (id, number) => {
    setEditId(id);
    setEditValue(number);
  };

  const handleSaveEdit = (id) => {
    const formatted = formatPhoneNumber(editValue);
    if (!isValidPhoneNumber(formatted)) {
      alert("Please enter a valid M-Pesa number (e.g. +254 712 345 678)");
      return;
    }

    setPaymentMethods(
      paymentMethods.map((m) =>
        m.id === id ? { ...m, number: formatted } : m
      )
    );
    setEditId(null);
    setEditValue("");
  };

  const handleCancelEdit = () => {
    setEditId(null);
    setEditValue("");
  };

  // Set as Primary
  const handleSetPrimary = (id) => {
    setPaymentMethods(
      paymentMethods.map((m) =>
        m.id === id
          ? { ...m, primary: true }
          : { ...m, primary: false }
      )
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6" id="payment-methods">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-900">Payment Methods</h3>

        {!showNewForm && (
          <button
            onClick={() => setShowNewForm(true)}
            className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition-colors text-sm flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-base">add</span>
            Add New Method
          </button>
        )}
      </div>

      {/* Add New Form (appears at the top) */}
      {showNewForm && (
        <form
          onSubmit={handleAddMethod}
          className="border border-gray-200 rounded-lg p-4 mb-6 space-y-4"
        >
          <label
            htmlFor="mpesaNumber"
            className="block text-sm font-medium text-gray-700"
          >
            M-Pesa Phone Number
          </label>
          <input
            id="mpesaNumber"
            type="tel"
            value={newNumber}
            onChange={(e) => setNewNumber(formatPhoneNumber(e.target.value))}
            placeholder="+254 7XX XXX XXX"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm shadow-sm focus:ring-emerald-100 focus:border-emerald-600"
            maxLength={15}
          />

          <div className="flex justify-between items-center pt-2">
            <button
              type="button"
              onClick={() => {
                setShowNewForm(false);
                setNewNumber("");
              }}
              className="text-sm font-medium text-rose-500 hover:underline"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="bg-emerald-600 text-white px-5 py-2 rounded-lg font-semibold hover:opacity-90 transition-colors text-sm"
            >
              Save Method
            </button>
          </div>
        </form>
      )}

      {/* Saved M-Pesa Methods (below the new form) */}
      <div className="space-y-4">
        {paymentMethods.map((method) => (
          <div
            key={method.id}
            className="border border-gray-200 rounded-lg p-4 flex justify-between items-center hover:bg-gray-50 transition-colors"
          >
            {/* Left */}
            <div className="flex items-center gap-4">
              <img
                alt="M-Pesa logo"
                className="h-8"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD97jbLfE75ib9MXOEzAj3Jm20HevcrTEPyyPWdhL5Ab4m4RWEFnT5rA8KRouq1jQLrRxzNUj_LJhz3z5NW6IlXc3cM2_2UGZtUqU9JnSNA_jUlvjUV-0_hTefNpms1Y5nDm6LxDluzLVniNcxBJCs12muW5o_781HMi7_UHDdjjBnu968xTzXjvE7GciFFA7-FUWHsCChH0E-6CM416fVWOd7v97BoyBpYWFmcqsXE_WRQoQAmDN3xk0GNPe4Q52jW0VpgUtsdvCQ"
              />
              <div>
                <p className="font-semibold">M-Pesa</p>
                {editId === method.id ? (
                  <input
                    type="tel"
                    value={editValue}
                    onChange={(e) =>
                      setEditValue(formatPhoneNumber(e.target.value))
                    }
                    placeholder="+254 7XX XXX XXX"
                    maxLength={15}
                    className="mt-1 w-full border border-gray-300 rounded-md px-2 py-1 text-sm focus:border-emerald-600 focus:ring-emerald-100"
                  />
                ) : (
                  <p className="text-gray-500">{method.number}</p>
                )}
              </div>
            </div>

            {/* Right */}
            <div className="flex items-center gap-2">
              {editId !== method.id && (
                <>
                  {method.primary ? (
                    <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                      Primary
                    </span>
                  ) : (
                    <button
                      onClick={() => handleSetPrimary(method.id)}
                      className="text-gray-500 hover:text-emerald-600 text-sm font-medium"
                    >
                      Set as primary
                    </button>
                  )}
                </>
              )}

              {editId === method.id ? (
                <>
                  <button
                    onClick={() => handleSaveEdit(method.id)}
                    className="text-emerald-600 font-medium text-sm hover:text-emerald-700"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="text-gray-500 hover:text-rose-500 font-medium text-sm"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                !method.primary && (
                  <>
                    <button
                      onClick={() => handleEdit(method.id, method.number)}
                      className="text-gray-500 hover:text-emerald-600"
                    >
                      <span className="material-symbols-outlined">edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(method.id)}
                      className="text-gray-500 hover:text-rose-500"
                    >
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                  </>
                )
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentMethodsCard;