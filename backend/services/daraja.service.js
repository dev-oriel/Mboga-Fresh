import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

// --- Configuration Constants ---
const DARALA_API_BASE = "https://sandbox.safaricom.co.ke";
const BUSINESS_SHORT_CODE = process.env.MPESA_SHORTCODE;
const PASSKEY = process.env.MPESA_PASSKEY;
const CONSUMER_KEY = process.env.MPESA_CONSUMER_KEY;
const CONSUMER_SECRET = process.env.MPESA_CONSUMER_SECRET;
const CALLBACK_URL = process.env.MPESA_CALLBACK_URL;

// Global variable to cache the access token
let ACCESS_TOKEN_CACHE = {
  token: null,
  expiry: 0,
};

/**
 * 1. Generates a new access token from Daraja API credentials.
 */
async function generateAccessToken() {
  if (!CONSUMER_KEY || !CONSUMER_SECRET) {
    throw new Error(
      "M-Pesa Consumer Key/Secret are missing from environment variables."
    );
  }

  const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString(
    "base64"
  );

  try {
    const response = await axios.get(
      `${DARALA_API_BASE}/oauth/v1/generate?grant_type=client_credentials`,
      {
        headers: {
          Authorization: `Basic ${auth}`,
        },
      }
    );

    const token = response.data.access_token;
    const expiresIn = response.data.expires_in;

    ACCESS_TOKEN_CACHE = {
      token: token,
      expiry: Date.now() + (expiresIn - 300) * 1000,
    };
    return token;
  } catch (error) {
    console.error("Daraja Token Error:", error.response?.data || error.message);
    throw new Error("Failed to generate M-Pesa access token.");
  }
}

async function getAccessToken() {
  if (ACCESS_TOKEN_CACHE.token && ACCESS_TOKEN_CACHE.expiry > Date.now()) {
    return ACCESS_TOKEN_CACHE.token;
  }
  return generateAccessToken();
}

/**
 * 2. Initiates the M-Pesa STK Push payment request.
 */
export async function initiateSTKPush(amount, phone, reference) {
  if (!BUSINESS_SHORT_CODE || !PASSKEY || !CALLBACK_URL) {
    throw new Error(
      "M-Pesa configuration (Shortcode/Passkey/Callback) is incomplete."
    );
  }

  const token = await getAccessToken();
  const timestamp = new Date()
    .toISOString()
    .replace(/[^0-9]/g, "")
    .slice(0, -3);

  // Security Hash (Password)
  const password = Buffer.from(
    BUSINESS_SHORT_CODE + PASSKEY + timestamp
  ).toString("base64");

  // Ensure amount is at least 1 for the sandbox environment
  const transactionAmount = Math.max(1, amount);

  const payload = {
    BusinessShortCode: BUSINESS_SHORT_CODE,
    Password: password,
    Timestamp: timestamp,
    TransactionType: "CustomerPayBillOnline",
    Amount: transactionAmount,
    PartyA: phone,
    PartyB: BUSINESS_SHORT_CODE,
    PhoneNumber: phone,
    CallBackURL: CALLBACK_URL,
    AccountReference: reference,
    TransactionDesc: `Mboga Fresh Payment`,
  };

  try {
    const response = await axios.post(
      `${DARALA_API_BASE}/mpesa/stkpush/v1/processrequest`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return {
      checkoutRequestId: response.data.CheckoutRequestID,
      responseCode: response.data.ResponseCode,
      customerMessage: response.data.CustomerMessage,
    };
  } catch (error) {
    console.error("STK Push Error:", error.response?.data || error.message);
    throw new Error(
      `M-Pesa STK Push failed: ${
        error.response?.data?.errorMessage || error.message
      }`
    );
  }
}
