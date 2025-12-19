// ---------------------------------------------------------
// CLEAN + CORRECT BACKEND URL HANDLING
// ---------------------------------------------------------

const getBackendUrl = () => {
  return import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
};

const API_URL = `${getBackendUrl()}/api`;

// const API_URL = 'https://api.saarisanskar.in/api';

// ---------------------------------------------------------
// PRODUCTS
// ---------------------------------------------------------

export const fetchSarees = async (category) => {
  try {
    const url = `${API_URL}/products${category ? `?category=${encodeURIComponent(category)}` : ''}`;
    console.log("Fetching products from:", url);

    const response = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error Response:", {
        status: response.status,
        statusText: response.statusText,
        url: url,
        body: errorText,
      });
      throw new Error(`Failed to fetch sarees: ${response.status}`);
    }

    const data = await response.json();
    console.log("Products fetched:", data?.length || 0);
    return data;
  } catch (error) {
    console.error("Error fetching sarees:", error);
    throw new Error("Unable to connect to server. Check backend & VITE_BACKEND_URL.");
  }
};


export const fetchSareeById = async (id) => {
  const response = await fetch(`${API_URL}/products/${id}`);
  if (!response.ok) throw new Error("Failed to fetch saree details");
  return response.json();
};


// ---------------------------------------------------------
// HEADER
// ---------------------------------------------------------

export const fetchCategories = async () => {
  const response = await fetch(`${API_URL}/header`);
  if (!response.ok) throw new Error("Failed to fetch categories");
  const data = await response.json();
  return data.navigation.categories;
};

export const searchProducts = async (query) => {
  const response = await fetch(`${API_URL}/header/search?query=${encodeURIComponent(query)}`);
  if (!response.ok) throw new Error("Failed to search products");
  return response.json();
};


// ---------------------------------------------------------
// AUTH HEADERS
// ---------------------------------------------------------

const authHeaders = () => {
  const token = (() => {
    try {
      return localStorage.getItem("auth_token");
    } catch {
      return null;
    }
  })();
  return token ? { Authorization: `Bearer ${token}` } : {};
};


// ---------------------------------------------------------
// ADDRESS
// ---------------------------------------------------------

export const getMyAddress = async () => {
  const res = await fetch(`${API_URL}/address/me`, {
    headers: { "Content-Type": "application/json", ...authHeaders() },
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch address");
  return res.json();
};

export const saveMyAddress = async (payload) => {
  const res = await fetch(`${API_URL}/address`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(payload),
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to save address");
  return res.json();
};

export const updateAddressById = async (id, payload) => {
  const res = await fetch(`${API_URL}/address/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(payload),
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to update address");
  return res.json();
};

export const deleteAddressById = async (id) => {
  const res = await fetch(`${API_URL}/address/${id}`, {
    method: "DELETE",
    headers: { ...authHeaders() },
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to delete address");
  return res.json();
};


// ---------------------------------------------------------
// PAYMENT
// ---------------------------------------------------------

export const createPaymentOrder = async (amount, notes = {}) => {
  const res = await fetch(`${API_URL}/payment/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ amount, currency: "INR", notes }),
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to create payment order");
  return res.json();
};

export const verifyPayment = async (payload) => {
  const res = await fetch(`${API_URL}/payment/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(payload),
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to verify payment");
  return res.json();
};

export const createCodOrder = async () => {
  const url = `${API_URL}/payment/cod`;
  console.log('[createCodOrder] Calling:', url);
  
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    credentials: "include",
  });
  
  console.log('[createCodOrder] Response status:', res.status, res.statusText);
  
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    console.error('[createCodOrder] Error response:', errorData);
    throw new Error(errorData.error || `Failed to create COD order (${res.status})`);
  }
  
  const data = await res.json();
  console.log('[createCodOrder] Success:', data);
  return data;
};

// New Payment Gateway functions
export const createPaymentGatewayOrder = async (orderId, amount, name, email, phone) => {
  const res = await fetch(`${API_URL}/payment/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ orderId, amount, name, email, phone }),
    credentials: "include",
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to create payment gateway order');
  }
  return res.json();
};


// ---------------------------------------------------------
// ORDERS
// ---------------------------------------------------------

export const getMyOrders = async () => {
  const res = await fetch(`${API_URL}/orders`, {
    headers: { "Content-Type": "application/json", ...authHeaders() },
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch orders");
  return res.json();
};
