// frontend/src/components/PaymentMethodsCard.jsx
import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

/**
 * PaymentMethodsCard
 * - Reads user.paymentMethods (or falls back to user.phone as default)
 * - Adds / edits / deletes / sets primary then persists to backend
 * - Uses withCredentials so server cookie auth is sent
 * - Shows a small toast for success / error
 */
const PaymentMethodsCard = () => {
  const { user, refresh } = useAuth(); // note: your AuthContext exposes `refresh()`
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [showNewForm, setShowNewForm] = useState(false);
  const [newNumber, setNewNumber] = useState("");
  const [editId, setEditId] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({
    show: false,
    type: "",
    message: "",
  });
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Helper: normalize id (DB might use _id)
  const getId = (m) => m.id ?? m._id ?? m.tempId;

  // Format to "+254 7XX XXX XXX"
  const formatPhoneNumber = (value) => {
    if (!value) return "";
    const digitsOnly = value.replace(/\D/g, "");
    let digits = digitsOnly;

    // Accept inputs like: 0712345678, 712345678, 254712345678, +254712345678
    if (digits.startsWith("254") && digits.length >= 12) {
      // fine
    } else if (digits.startsWith("0") && digits.length >= 10) {
      // 07XXXXXXXX -> 2547XXXXXXXX
      digits = "254" + digits.slice(1);
    } else if (digits.length === 9 && digits.startsWith("7")) {
      digits = "254" + digits;
    } else if (digits.startsWith("+")) {
      digits = digits.replace(/\D/g, "");
    }

    // Keep only first 12 digits for 2547XXXXXXXX
    digits = digits.substring(0, 12);
    const match = digits.match(/^254(\d{3})(\d{3})(\d{3})$/);
    if (match) return `+254 ${match[1]} ${match[2]} ${match[3]}`;
    // partial formatting while typing
    if (digits.startsWith("2547")) {
      const rest = digits.slice(4);
      if (rest.length <= 3) return `+254 ${digits.slice(3)}`;
      if (rest.length <= 6) return `+254 ${rest.slice(0, 3)} ${rest.slice(3)}`;
      return `+254 ${rest.slice(0, 3)} ${rest.slice(3, 6)} ${rest.slice(6)}`;
    }
    return value;
  };

  const isValidPhoneNumber = (value) =>
    /^\+254\s7\d{2}\s\d{3}\s\d{3}$/.test(value);

  // Show feedback toast
  const showFeedback = (type, message, duration = 3000) => {
    setFeedback({ show: true, type, message });
    setTimeout(() => {
      if (mountedRef.current)
        setFeedback({ show: false, type: "", message: "" });
    }, duration);
  };

  // Load initial payment methods: prefer user.paymentMethods, else fallback to user.phone
  useEffect(() => {
    if (!user) return;

    const fromDb = Array.isArray(user.paymentMethods)
      ? user.paymentMethods
      : [];
    if (fromDb.length > 0) {
      // ensure we have consistent id property for local operations
      const normalized = fromDb.map((m) => ({
        ...m,
        id: getId(m),
      }));
      setPaymentMethods(normalized);
    } else if (user.phone) {
      // fallback: use phone as primary. Format it.
      const formatted = formatPhoneNumber(user.phone);
      setPaymentMethods([
        {
          id: "fallback-" + Date.now(),
          type: "M-Pesa",
          number: formatted,
          primary: true,
        },
      ]);
    } else {
      setPaymentMethods([]);
    }
  }, [user]);

  // Persist to backend
  const savePaymentMethods = async (methods) => {
    try {
      setLoading(true);

      // Ensure we send clean objects (no temp-only fields)
      const payload = methods.map((m) => ({
        type: m.type ?? "M-Pesa",
        number: m.number,
        primary: !!m.primary,
        // if DB has _id, keep it so Mongoose can update; otherwise don't include id
        ...(m._id ? { _id: m._id } : {}),
      }));

      await axios.put(
        "http://localhost:5000/api/profile/payment-methods",
        { paymentMethods: payload },
        { withCredentials: true }
      );

      // attempt to refresh user's profile (AuthContext exposes refresh())
      if (typeof refresh === "function") {
        await refresh();
      }
      showFeedback("success", "Payment methods saved.");
    } catch (err) {
      console.error(
        "savePaymentMethods error:",
        err?.response?.data ?? err.message ?? err
      );
      showFeedback("error", "Failed to save payment methods");
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  };

  // Add new method
  const handleAddMethod = (e) => {
    e?.preventDefault?.();
    const formatted = formatPhoneNumber(newNumber);
    if (!isValidPhoneNumber(formatted)) {
      return showFeedback(
        "error",
        "Enter a valid M-Pesa number (e.g. +254 712 345 678)"
      );
    }

    // create local id and object
    const newMethod = {
      id: "local-" + Date.now(),
      type: "M-Pesa",
      number: formatted,
      primary: paymentMethods.length === 0, // if no methods yet, make primary
    };

    // if newMethod.primary then unset others
    const updated = newMethod.primary
      ? [
          { ...newMethod },
          ...paymentMethods.map((m) => ({ ...m, primary: false })),
        ]
      : [newMethod, ...paymentMethods];

    setPaymentMethods(updated);
    savePaymentMethods(updated);
    setNewNumber("");
    setShowNewForm(false);
  };

  const handleDelete = (id) => {
    const updated = paymentMethods.filter((m) => getId(m) !== id);
    // ensure at least one primary: if primary removed and others exist, set first as primary
    const hadPrimaryRemoved = paymentMethods.some(
      (m) => getId(m) === id && m.primary
    );
    if (
      hadPrimaryRemoved &&
      updated.length > 0 &&
      !updated.some((m) => m.primary)
    ) {
      updated[0].primary = true;
    }
    setPaymentMethods(updated);
    savePaymentMethods(updated);
  };

  const handleEdit = (id, number) => {
    setEditId(id);
    setEditValue(number);
  };

  const handleSaveEdit = (id) => {
    const formatted = formatPhoneNumber(editValue);
    if (!isValidPhoneNumber(formatted)) {
      return showFeedback(
        "error",
        "Enter a valid M-Pesa number (e.g. +254 712 345 678)"
      );
    }

    const updated = paymentMethods.map((m) =>
      getId(m) === id ? { ...m, number: formatted } : m
    );
    setPaymentMethods(updated);
    savePaymentMethods(updated);
    setEditId(null);
    setEditValue("");
  };

  const handleCancelEdit = () => {
    setEditId(null);
    setEditValue("");
  };

  const handleSetPrimary = (id) => {
    const updated = paymentMethods.map((m) => ({
      ...m,
      primary: getId(m) === id,
    }));
    setPaymentMethods(updated);
    savePaymentMethods(updated);
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6" id="payment-methods">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-900">Payment Methods</h3>

        {!showNewForm && (
          <button
            onClick={() => setShowNewForm(true)}
            className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition-colors text-sm flex items-center gap-2"
            disabled={loading}
          >
            <span className="material-symbols-outlined text-base">add</span>
            Add New Method
          </button>
        )}
      </div>

      {showNewForm && (
        <form
          onSubmit={handleAddMethod}
          className="border border-gray-200 rounded-lg p-4 mb-6 space-y-4"
        >
          <label className="block text-sm font-medium text-gray-700">
            M-Pesa Phone Number
          </label>
          <input
            type="tel"
            value={newNumber}
            onChange={(e) => setNewNumber(formatPhoneNumber(e.target.value))}
            placeholder="+254 7XX XXX XXX"
            maxLength={20}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm shadow-sm focus:ring-emerald-100 focus:border-emerald-600"
            disabled={loading}
          />
          <div className="flex justify-between items-center pt-2">
            <button
              type="button"
              onClick={() => {
                setShowNewForm(false);
                setNewNumber("");
              }}
              className="text-sm font-medium text-rose-500 hover:underline"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-emerald-600 text-white px-5 py-2 rounded-lg font-semibold hover:opacity-90 transition-colors text-sm"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Method"}
            </button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {paymentMethods.map((method) => {
          const id = getId(method);
          return (
            <div
              key={id}
              className="border border-gray-200 rounded-lg p-4 flex justify-between items-center hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-4">
                {/* Use local image path — replace /images/mpesa.png with your asset */}
                <img
                  src="/images/mpesa.png"
                  alt="M-Pesa logo"
                  className="h-8"
                />
                <div>
                  <p className="font-semibold">M-Pesa</p>
                  {editId === id ? (
                    <input
                      type="tel"
                      value={editValue}
                      onChange={(e) =>
                        setEditValue(formatPhoneNumber(e.target.value))
                      }
                      placeholder="+254 7XX XXX XXX"
                      maxLength={20}
                      className="mt-1 w-full border border-gray-300 rounded-md px-2 py-1 text-sm focus:border-emerald-600 focus:ring-emerald-100"
                    />
                  ) : (
                    <p className="text-gray-500">{method.number}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {editId !== id && (
                  <>
                    {method.primary ? (
                      <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                        Primary
                      </span>
                    ) : (
                      <button
                        onClick={() => handleSetPrimary(id)}
                        className="text-gray-500 hover:text-emerald-600 text-sm font-medium"
                        disabled={loading}
                      >
                        Set as primary
                      </button>
                    )}
                  </>
                )}

                {editId === id ? (
                  <>
                    <button
                      onClick={() => handleSaveEdit(id)}
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
                        onClick={() => handleEdit(id, method.number)}
                        className="text-gray-500 hover:text-emerald-600"
                      >
                        <span className="material-symbols-outlined">edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(id)}
                        className="text-gray-500 hover:text-rose-500"
                      >
                        <span className="material-symbols-outlined">
                          delete
                        </span>
                      </button>
                    </>
                  )
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Feedback toast */}
      {feedback.show && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-lg shadow-lg text-white ${
            feedback.type === "success" ? "bg-emerald-600" : "bg-rose-600"
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined">
              {feedback.type === "success" ? "check_circle" : "error"}
            </span>
            <p className="text-sm font-medium">{feedback.message}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentMethodsCard;
