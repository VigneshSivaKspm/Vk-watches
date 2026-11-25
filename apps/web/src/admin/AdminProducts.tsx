import React, { useState, useEffect } from 'react';
import { apiRequest } from '../services/api';
import { Plus, Trash2, Edit2, CheckCircle2 } from 'lucide-react';
import { WatchProduct } from '@vk-time/shared';

export const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<WatchProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewModal, setShowNewModal] = useState(false);

  // New product form state
  const [newProduct, setNewProduct] = useState({
    title: '',
    subtitle: '',
    slug: '',
    description: '',
    shortDescription: '',
    collectionSlug: 'the-automatic-collection',
    gender: 'Men' as const,
    movementType: 'Automatic' as const,
    caseDiameterMm: 40.0,
    price: 45000,
    stock: 10,
    primaryImage: '/images/watches/vk-sovereign-automatic-40-front.svg',
    secondaryImage: '/images/watches/vk-sovereign-automatic-40-tilt.svg',
  });

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await apiRequest<WatchProduct[]>('/admin/products');
      setProducts(data || []);
    } catch (e) {
      console.error('Failed to load products', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiRequest('/admin/products', {
        method: 'POST',
        body: JSON.stringify(newProduct),
      });
      setShowNewModal(false);
      loadProducts();
    } catch (err: any) {
      alert(err.message || 'Product creation failed');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to archive this timepiece reference?')) return;
    try {
      await apiRequest(`/admin/products/${id}`, { method: 'DELETE' });
      loadProducts();
    } catch (e: any) {
      alert(e.message || 'Delete failed');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end border-b border-platinum pb-4">
        <div>
          <span className="text-[10px] uppercase tracking-ultra text-gold font-medium">Inventory & Catalog</span>
          <h1 className="font-serif-luxury text-3xl text-charcoal">Timepiece References</h1>
        </div>

        <button
          onClick={() => setShowNewModal(true)}
          className="px-4 py-2.5 bg-charcoal text-pure text-xs uppercase tracking-luxury hover:bg-gold transition-colors flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Timepiece</span>
        </button>
      </div>

      {loading ? (
        <div className="text-xs text-silver">Loading Inventory...</div>
      ) : (
        <div className="bg-pure border border-platinum rounded-sm overflow-x-auto shadow-subtle">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-ivory border-b border-platinum text-[10px] uppercase tracking-wider text-silver">
                <th className="p-4">Watch</th>
                <th className="p-4">Movement</th>
                <th className="p-4">Diameter</th>
                <th className="p-4">Price</th>
                <th className="p-4">Stock</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-platinum">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-ivory/50">
                  <td className="p-4 flex items-center gap-3">
                    <img src={p.primaryImage} alt={p.title} className="w-10 h-10 object-contain bg-porcelain rounded-sm p-1" />
                    <div>
                      <p className="font-medium text-charcoal">{p.title}</p>
                      <p className="text-[10px] text-silver font-mono">{p.slug}</p>
                    </div>
                  </td>
                  <td className="p-4 text-graphite">{p.movementType}</td>
                  <td className="p-4 text-graphite">{p.caseDiameterMm} mm</td>
                  <td className="p-4 font-serif-luxury text-sm font-medium">₹{p.price.toLocaleString('en-IN')}</td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded-sm text-[10px] font-medium ${p.stock <= 5 ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>
                      {p.stock} In Vault
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="p-1.5 text-silver hover:text-red-500 transition-colors"
                      title="Archive reference"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* New Product Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 bg-charcoal/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-pure p-8 max-w-xl w-full border border-platinum rounded-sm space-y-6 shadow-2xl my-8">
            <h2 className="font-serif-luxury text-2xl text-charcoal border-b border-platinum pb-3">
              Register New Timepiece Model
            </h2>

            <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-silver block mb-1">Model Title</label>
                  <input
                    type="text"
                    required
                    value={newProduct.title}
                    onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                    className="w-full p-2 bg-porcelain border border-platinum rounded-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-silver block mb-1">Slug URL</label>
                  <input
                    type="text"
                    required
                    value={newProduct.slug}
                    onChange={(e) => setNewProduct({ ...newProduct, slug: e.target.value })}
                    className="w-full p-2 bg-porcelain border border-platinum rounded-sm focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-silver block mb-1">Subtitle / Calibre</label>
                <input
                  type="text"
                  required
                  value={newProduct.subtitle}
                  onChange={(e) => setNewProduct({ ...newProduct, subtitle: e.target.value })}
                  placeholder="e.g. Calibre VK-801 | Exhibition Sapphire | Ivory Dial"
                  className="w-full p-2 bg-porcelain border border-platinum rounded-sm focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-silver block mb-1">Movement</label>
                  <select
                    value={newProduct.movementType}
                    onChange={(e: any) => setNewProduct({ ...newProduct, movementType: e.target.value })}
                    className="w-full p-2 bg-porcelain border border-platinum rounded-sm focus:outline-none"
                  >
                    <option value="Automatic">Automatic</option>
                    <option value="Mechanical">Mechanical</option>
                    <option value="Chronograph">Chronograph</option>
                    <option value="Quartz">Quartz</option>
                  </select>
                </div>

                <div>
                  <label className="text-silver block mb-1">Price (INR)</label>
                  <input
                    type="number"
                    required
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
                    className="w-full p-2 bg-porcelain border border-platinum rounded-sm focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-silver block mb-1">Vault Stock</label>
                  <input
                    type="number"
                    required
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({ ...newProduct, stock: parseInt(e.target.value, 10) })}
                    className="w-full p-2 bg-porcelain border border-platinum rounded-sm focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-silver block mb-1">Primary Image URL</label>
                <input
                  type="url"
                  required
                  value={newProduct.primaryImage}
                  onChange={(e) => setNewProduct({ ...newProduct, primaryImage: e.target.value })}
                  className="w-full p-2 bg-porcelain border border-platinum rounded-sm focus:outline-none"
                />
              </div>

              <div>
                <label className="text-silver block mb-1">Description</label>
                <textarea
                  rows={3}
                  required
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value, shortDescription: e.target.value.slice(0, 100) })}
                  className="w-full p-2 bg-porcelain border border-platinum rounded-sm focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-platinum">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2 border border-platinum text-charcoal hover:bg-porcelain rounded-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-charcoal text-pure uppercase tracking-wider hover:bg-gold rounded-sm"
                >
                  Publish Timepiece
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
