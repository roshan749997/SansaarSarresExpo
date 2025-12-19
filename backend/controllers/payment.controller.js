import Razorpay from 'razorpay';
import crypto from 'crypto';
import axios from 'axios';
import Cart from '../models/Cart.js';
import Order from '../models/Order.js';
import { Address } from '../models/Address.js';
import { generateHash } from '../utils/generateHash.js';

const getClient = () => {
  const key_id = process.env.RAZORPAY_KEY_ID || '';
  const key_secret = process.env.RAZORPAY_KEY_SECRET || '';
  if (!key_id || !key_secret) return null;
  return { client: new Razorpay({ key_id, key_secret }), key_id, key_secret };
};

export const createOrder = async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt, notes = {} } = req.body || {};
    const rupees = Number(amount);
    if (!rupees || Number.isNaN(rupees) || rupees <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }
    const ctx = getClient();
    if (!ctx) {
      return res.status(500).json({ error: 'Razorpay keys not configured on server' });
    }

    const options = {
      amount: Math.round(rupees * 100),
      currency,
      receipt: receipt || `rcpt_${Date.now()}`,
      notes,
    };

    const order = await ctx.client.orders.create(options);
    return res.json({ order, key: ctx.key_id });
  } catch (err) {
    console.error('Razorpay createOrder error:', err?.message || err);
    if (err?.error?.description) console.error('Razorpay API:', err.error.description);
    return res.status(500).json({ error: 'Failed to create order' });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body || {};
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ error: 'Missing fields' });
    }
    const ctx = getClient();
    if (!ctx) {
      return res.status(500).json({ error: 'Server secret missing' });
    }

    const payload = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expected = crypto.createHmac('sha256', ctx.key_secret).update(payload).digest('hex');

    if (expected !== razorpay_signature) {
      return res.status(400).json({ success: false, error: 'Invalid signature' });
    }

    const userId = req.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const cart = await Cart.findOne({ user: userId }).populate('items.product');
    if (!cart || !Array.isArray(cart.items) || cart.items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    const items = cart.items.map(i => {
      const p = i.product;
      let base = 0;
      if (p && typeof p.price === 'number') {
        base = Number(p.price) || 0;
      } else {
        const mrp = Number(p?.mrp) || 0;
        const discountPercent = Number(p?.discountPercent) || 0;
        base = Math.round(mrp - (mrp * discountPercent) / 100) || 0;
      }
      return { product: p._id, quantity: i.quantity, price: base };
    });
    const amount = items.reduce((sum, it) => sum + (it.price * it.quantity), 0);

    // Load user's current address to snapshot into the order
    let shippingAddress = null;
    try {
      const addr = await Address.findOne({ userId });
      if (addr) {
        const { fullName, mobileNumber, pincode, locality, address, city, state, landmark, alternatePhone, addressType } = addr;
        shippingAddress = { fullName, mobileNumber, pincode, locality, address, city, state, landmark, alternatePhone, addressType };
      }
    } catch {}

    const order = await Order.create({
      user: userId,
      items,
      amount,
      currency: 'INR',
      status: 'paid',
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
      shippingAddress,
    });

    cart.items = [];
    await cart.save();

    return res.json({ success: true, order });
  } catch (err) {
    console.error('Razorpay verifyPayment error:', err?.message || err);
    return res.status(500).json({ error: 'Verification failed' });
  }
};

export const createCodOrder = async (req, res) => {
  console.log('[createCodOrder] Request received');
  try {
    const userId = req.userId;
    console.log('[createCodOrder] UserId:', userId, 'Type:', typeof userId);
    if (!userId) {
      console.error('[createCodOrder] No userId found in request');
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const cart = await Cart.findOne({ user: userId }).populate('items.product');
    console.log('[createCodOrder] Cart found:', cart ? 'yes' : 'no', 'Items:', cart?.items?.length || 0);
    if (!cart || !Array.isArray(cart.items) || cart.items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    const items = cart.items.map(i => {
      const p = i.product;
      let base = 0;
      if (p && typeof p.price === 'number') {
        base = Number(p.price) || 0;
      } else {
        const mrp = Number(p?.mrp) || 0;
        const discountPercent = Number(p?.discountPercent) || 0;
        base = Math.round(mrp - (mrp * discountPercent) / 100) || 0;
      }
      return { product: p._id, quantity: i.quantity, price: base };
    });
    const amount = items.reduce((sum, it) => sum + (it.price * it.quantity), 0);
    console.log('[createCodOrder] Calculated amount:', amount);

    // Load user's current address to snapshot into the order
    let shippingAddress = null;
    try {
      const addr = await Address.findOne({ userId });
      console.log('[createCodOrder] Address found:', addr ? 'yes' : 'no');
      if (addr) {
        const { fullName, mobileNumber, pincode, locality, address, city, state, landmark, alternatePhone, addressType } = addr;
        shippingAddress = { fullName, mobileNumber, pincode, locality, address, city, state, landmark, alternatePhone, addressType };
        console.log('[createCodOrder] Shipping address loaded:', { city, state, pincode });
      }
    } catch (err) {
      console.error('[createCodOrder] Error loading address:', err.message || err);
    }

    if (!shippingAddress) {
      console.error('[createCodOrder] No shipping address found for userId:', userId);
      return res.status(400).json({ error: 'Shipping address is required for COD orders. Please save your delivery address first.' });
    }

    const order = await Order.create({
      user: userId,
      items,
      amount,
      currency: 'INR',
      status: 'pending',
      paymentMethod: 'cod',
      shippingAddress,
    });
    console.log('[createCodOrder] Order created:', order._id);

    // Clear cart after order creation
    cart.items = [];
    await cart.save();
    console.log('[createCodOrder] Cart cleared');

    return res.json({ success: true, order });
  } catch (err) {
    console.error('[createCodOrder] Error:', err?.message || err);
    console.error('[createCodOrder] Stack:', err?.stack);
    return res.status(500).json({ error: 'Failed to create COD order', details: err?.message });
  }
};

// Helper function to create order from cart (used by payment gateway)
const createOrderFromCart = async (userId) => {
  const cart = await Cart.findOne({ user: userId }).populate('items.product');
  if (!cart || !Array.isArray(cart.items) || cart.items.length === 0) {
    throw new Error('Cart is empty');
  }

  const items = cart.items.map(i => {
    const p = i.product;
    let base = 0;
    if (p && typeof p.price === 'number') {
      base = Number(p.price) || 0;
    } else {
      const mrp = Number(p?.mrp) || 0;
      const discountPercent = Number(p?.discountPercent) || 0;
      base = Math.round(mrp - (mrp * discountPercent) / 100) || 0;
    }
    return { product: p._id, quantity: i.quantity, price: base };
  });
  const amount = items.reduce((sum, it) => sum + (it.price * it.quantity), 0);

  // Load user's current address to snapshot into the order
  let shippingAddress = null;
  try {
    const addr = await Address.findOne({ userId });
    if (addr) {
      const { fullName, mobileNumber, pincode, locality, address, city, state, landmark, alternatePhone, addressType } = addr;
      shippingAddress = { fullName, mobileNumber, pincode, locality, address, city, state, landmark, alternatePhone, addressType };
    }
  } catch {}

  return { items, amount, shippingAddress };
};

// New Payment Gateway Integration
export const createPayment = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const { orderId, amount, name, email, phone } = req.body;

    if (!orderId || !amount || !name || !email || !phone) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create temporary order record to track userId
    const { items, amount: calculatedAmount, shippingAddress } = await createOrderFromCart(userId);
    
    const tempOrder = await Order.create({
      user: userId,
      items,
      amount: calculatedAmount,
      currency: 'INR',
      status: 'created',
      paymentMethod: 'pg',
      pgOrderId: orderId,
      shippingAddress,
    });

    const payload = {
      api_key: process.env.PG_API_KEY,
      order_id: orderId,
      amount: amount,
      currency: "INR",
      description: "Order Payment",
      name,
      email,
      phone,
      city: shippingAddress?.city || "Pune",
      country: "IND",
      zip_code: shippingAddress?.pincode || "411001",
      return_url: `${process.env.BACKEND_URL}/api/payment/success`,
      return_url_failure: `${process.env.BACKEND_URL}/api/payment/failure`,
      mode: process.env.PG_MODE || "LIVE"
    };

    payload.hash = generateHash(payload, process.env.PG_SALT);

    const response = await axios.post(
      `${process.env.PG_API_URL}/v2/paymentrequest`,
      payload
    );

    res.json({
      redirectUrl: response.request.res.responseUrl || response.data.redirect_url || response.data.url
    });
  } catch (err) {
    console.error('Payment Gateway createPayment error:', err?.message || err);
    if (err?.response?.data) console.error('Payment Gateway API:', err.response.data);
    return res.status(500).json({ error: 'Failed to create payment' });
  }
};

export const verifyPaymentStatus = async (orderId) => {
  try {
    const payload = {
      api_key: process.env.PG_API_KEY,
      order_id: orderId
    };

    payload.hash = generateHash(payload, process.env.PG_SALT);

    const res = await axios.post(
      `${process.env.PG_API_URL}/v2/paymentstatus`,
      payload
    );

    return res.data;
  } catch (err) {
    console.error('Payment Gateway verifyPaymentStatus error:', err?.message || err);
    throw err;
  }
};

export const paymentSuccess = async (req, res) => {
  try {
    const data = { ...req.body };
    const receivedHash = data.hash;
    delete data.hash;

    const calculatedHash = generateHash(data, process.env.PG_SALT);

    if (receivedHash !== calculatedHash) {
      console.error('Hash mismatch in payment success callback');
      return res.status(400).send("Hash mismatch");
    }

    // Call payment status API before confirming payment (mandatory)
    const orderId = data.order_id;
    let paymentStatusData = null;
    try {
      paymentStatusData = await verifyPaymentStatus(orderId);
    } catch (err) {
      console.error('Payment status verification failed:', err);
      return res.redirect(`${process.env.FRONTEND_URL}/payment-failure?error=verification_failed`);
    }

    // Verify payment status from API response
    const isSuccess = paymentStatusData?.response_code === '200' || 
                      paymentStatusData?.status === 'success' ||
                      paymentStatusData?.payment_status === 'success';

    if (!isSuccess) {
      return res.redirect(`${process.env.FRONTEND_URL}/payment-failure?error=payment_failed`);
    }

    // Find existing order by order_id (created during createPayment)
    const order = await Order.findOne({ pgOrderId: orderId });
    
    if (!order) {
      console.error('Order not found for pgOrderId:', orderId);
      return res.redirect(`${process.env.FRONTEND_URL}/payment-failure?error=order_not_found`);
    }

    // Update order with payment details
    order.status = 'paid';
    order.pgTransactionId = data.transaction_id || paymentStatusData?.transaction_id;
    order.pgResponseCode = paymentStatusData?.response_code;
    order.pgRawResponse = paymentStatusData;
    await order.save();

    // Clear cart
    const cart = await Cart.findOne({ user: order.user });
    if (cart) {
      cart.items = [];
      await cart.save();
    }

    res.redirect(`${process.env.FRONTEND_URL}/payment-success?orderId=${order._id}`);
  } catch (err) {
    console.error('Payment success handler error:', err?.message || err);
    res.redirect(`${process.env.FRONTEND_URL}/payment-failure?error=server_error`);
  }
};

export const paymentFailure = async (req, res) => {
  try {
    const data = { ...req.body };
    const receivedHash = data.hash;
    delete data.hash;

    // Verify hash even for failure
    if (receivedHash) {
      const calculatedHash = generateHash(data, process.env.PG_SALT);
      if (receivedHash !== calculatedHash) {
        console.error('Hash mismatch in payment failure callback');
      }
    }

    const orderId = data.order_id;
    
    // Update order status if exists
    if (orderId) {
      const order = await Order.findOne({ pgOrderId: orderId });
      if (order) {
        order.status = 'failed';
        order.pgRawResponse = data;
        await order.save();
      }
    }

    res.redirect(`${process.env.FRONTEND_URL}/payment-failure?orderId=${orderId || ''}`);
  } catch (err) {
    console.error('Payment failure handler error:', err?.message || err);
    res.redirect(`${process.env.FRONTEND_URL}/payment-failure?error=server_error`);
  }
};