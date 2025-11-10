import React, { useEffect, useState } from 'react';
import { api } from '../../utils/api';
import { FiEdit, FiTrash2, FiX } from 'react-icons/fi';

const AdminProducts = () => {
  const [form, setForm] = useState({
    title: '',
    mrp: '',
    discountPercent: 0,
    description: '',
    category: '',
    images: { image1: '', image2: '', image3: '' },
    product_info: { brand: '', manufacturer: '', SareeLength: '', SareeMaterial: '', SareeColor: '', IncludedComponents: '' },
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editForm, setEditForm] = useState({
    _id: '',
    mrp: '',
    discountPercent: 0,
    price: ''
  });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const data = await api.admin.listProducts();
      setList(data || []);
    } catch (e) {
      setError(e.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onChangeNested = (section, key) => (e) => {
    const { value } = e.target;
    setForm((prev) => ({ ...prev, [section]: { ...(prev[section] || {}), [key]: value } }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const payload = {
        title: form.title,
        mrp: Number(form.mrp),
        discountPercent: Number(form.discountPercent) || 0,
        description: form.description,
        category: form.category,
        images: form.images,
        product_info: form.product_info,
      };
      await api.admin.createProduct(payload);
      setForm({ title: '', mrp: '', discountPercent: 0, description: '', category: '', images: { image1: '', image2: '', image3: '' }, product_info: { brand: '', manufacturer: '', SareeLength: '', SareeMaterial: '', SareeColor: '', IncludedComponents: '' } });
      await load();
    } catch (e2) {
      setError(e2.message || 'Failed to create product');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await api.admin.deleteProduct(id);
      await load();
    } catch (e) {
      setError(e.message || 'Failed to delete product');
    }
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setEditForm({
      _id: product._id,
      mrp: product.mrp,
      discountPercent: product.discountPercent || 0,
      price: Math.round(product.mrp - (product.mrp * (product.discountPercent || 0)) / 100)
    });
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingProduct(null);
    setEditForm({ _id: '', mrp: '', discountPercent: 0, price: '' });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => {
      const updated = { ...prev, [name]: value };
      // Auto-calculate price if MRP or discount changes
      if ((name === 'mrp' || name === 'discountPercent') && updated.mrp) {
        const mrp = name === 'mrp' ? parseFloat(value) || 0 : parseFloat(prev.mrp) || 0;
        const discount = name === 'discountPercent' ? parseFloat(value) || 0 : parseFloat(prev.discountPercent) || 0;
        updated.price = Math.round(mrp - (mrp * discount) / 100);
      }
      return updated;
    });
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      await api.admin.updateProduct(editForm._id, {
        mrp: Number(editForm.mrp),
        discountPercent: Number(editForm.discountPercent) || 0
      });
      await load();
      closeEditModal();
    } catch (e) {
      setError(e.message || 'Failed to update product');
    } finally {
      setSaving(false);
    }
  };

  const priceFor = (p) => {
    if (p.price !== undefined) return p.price;
    return Math.round((p.mrp || 0) - (p.mrp || 0) * ((p.discountPercent || 0) / 100));
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <form onSubmit={submit} className="bg-white border rounded p-4 space-y-3">
          {error && <div className="text-red-600">{error}</div>}
          <input name="title" value={form.title} onChange={onChange} placeholder="Title" className="w-full border rounded px-3 py-2" required />
          <input name="mrp" type="number" value={form.mrp} onChange={onChange} placeholder="MRP" className="w-full border rounded px-3 py-2" required />
          <input name="discountPercent" type="number" value={form.discountPercent} onChange={onChange} placeholder="Discount %" className="w-full border rounded px-3 py-2" />
          <input name="category" value={form.category} onChange={onChange} placeholder="Category" className="w-full border rounded px-3 py-2" required />
          <textarea name="description" value={form.description} onChange={onChange} placeholder="Description" className="w-full border rounded px-3 py-2" rows="3" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <input value={form.images.image1} onChange={onChangeNested('images','image1')} placeholder="Image 1 URL" className="w-full border rounded px-3 py-2" required />
            <input value={form.images.image2} onChange={onChangeNested('images','image2')} placeholder="Image 2 URL" className="w-full border rounded px-3 py-2" />
            <input value={form.images.image3} onChange={onChangeNested('images','image3')} placeholder="Image 3 URL" className="w-full border rounded px-3 py-2" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <input value={form.product_info.brand} onChange={onChangeNested('product_info','brand')} placeholder="Brand" className="w-full border rounded px-3 py-2" />
            <input value={form.product_info.manufacturer} onChange={onChangeNested('product_info','manufacturer')} placeholder="Manufacturer" className="w-full border rounded px-3 py-2" />
            <input value={form.product_info.SareeMaterial} onChange={onChangeNested('product_info','SareeMaterial')} placeholder="Material" className="w-full border rounded px-3 py-2" />
            <input value={form.product_info.SareeColor} onChange={onChangeNested('product_info','SareeColor')} placeholder="Color" className="w-full border rounded px-3 py-2" />
            <input value={form.product_info.SareeLength} onChange={onChangeNested('product_info','SareeLength')} placeholder="Length" className="w-full border rounded px-3 py-2" />
            <input value={form.product_info.IncludedComponents} onChange={onChangeNested('product_info','IncludedComponents')} placeholder="Included" className="w-full border rounded px-3 py-2" />
          </div>
          <button type="submit" disabled={saving} className="px-4 py-2 bg-indigo-600 text-white rounded">{saving ? 'Saving...' : 'Create Product'}</button>
        </form>

        <div className="bg-white border rounded p-4">
          {loading ? (
            <div className="p-4">Loading...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left border-b">
                    <th className="p-2">Image</th>
                    <th className="p-2">Title</th>
                    <th className="p-2">Price</th>
                    <th className="p-2">MRP</th>
                    <th className="p-2">Discount</th>
                    <th className="p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {list.map((p) => (
                    <tr key={p._id} className="border-b">
                      <td className="p-2"><img src={p?.images?.image1} alt="" className="w-12 h-12 object-cover rounded" /></td>
                      <td className="p-2">{p.title}</td>
                      <td className="p-2">₹{priceFor(p).toLocaleString('en-IN')}</td>
                      <td className="p-2">₹{(p.mrp || 0).toLocaleString('en-IN')}</td>
                      <td className="p-2">{p.discountPercent || 0}%</td>
                      <td className="p-2">
                        <div className="flex gap-2">
                          <button 
                            type="button" 
                            onClick={() => openEditModal(p)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-full"
                            title="Edit"
                          >
                            <FiEdit className="w-4 h-4" />
                          </button>
                          <button 
                            type="button"
                            onClick={() => remove(p._id)} 
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-full"
                            title="Delete"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Edit Product Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="flex justify-between items-center border-b p-4">
              <h3 className="text-lg font-medium">Edit Product</h3>
              <button onClick={closeEditModal} className="text-gray-500 hover:text-gray-700">
                <FiX className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleUpdateProduct} className="p-4 space-y-4">
              {error && <div className="text-red-600 text-sm">{error}</div>}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">MRP (₹)</label>
                <input
                  type="number"
                  name="mrp"
                  value={editForm.mrp}
                  onChange={handleEditChange}
                  className="w-full border rounded px-3 py-2"
                  required
                  min="1"
                  step="0.01"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Discount (%):</label>
                <input
                  type="number"
                  name="discountPercent"
                  value={editForm.discountPercent}
                  onChange={handleEditChange}
                  className="w-full border rounded px-3 py-2"
                  min="0"
                  max="100"
                  step="1"
                />
              </div>
              
              <div className="bg-gray-50 p-3 rounded">
                <div className="text-sm text-gray-600 mb-1">Selling Price:</div>
                <div className="text-lg font-semibold">
                  ₹{editForm.price ? editForm.price.toLocaleString('en-IN') : '0.00'}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  (MRP - {editForm.discountPercent}%)
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-50"
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
