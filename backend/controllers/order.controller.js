import Order from '../models/Order.js';

export const getMyOrders = async (req, res) => {
  try {
    const userId = req.userId;
    console.log('[getMyOrders] UserId:', userId, 'Type:', typeof userId);
    if (!userId) {
      console.error('[getMyOrders] No userId found');
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const orders = await Order.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate('items.product');

    console.log('[getMyOrders] Found orders:', orders.length);
    orders.forEach((order, idx) => {
      console.log(`[getMyOrders] Order ${idx + 1}:`, {
        id: order._id,
        status: order.status,
        paymentMethod: order.paymentMethod,
        amount: order.amount,
        createdAt: order.createdAt
      });
    });

    return res.json(orders);
  } catch (err) {
    console.error('[getMyOrders] Error:', err.message || err);
    return res.status(500).json({ message: 'Failed to fetch orders', error: err.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const { id } = req.params;
    const order = await Order.findOne({ _id: id, user: userId }).populate('items.product');
    if (!order) return res.status(404).json({ message: 'Order not found' });

    return res.json(order);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch order', error: err.message });
  }
};
