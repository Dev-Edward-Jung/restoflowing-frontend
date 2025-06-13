'use client';

import { useEffect, useState, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import AutoReload from '@/components/reload';

interface InventoryItem {
  id: number;
  name: string;
  quantity: number;
  unit: string;
  categoryId: number;
  categoryName?: string;
  needNow?: boolean;
}

interface Category {
  id: number;
  name: string;
}

const InventoryPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const restaurantId = searchParams.get('restaurantId');

  const [inventoryList, setInventoryList] = useState<InventoryItem[]>([]);
  const [categoryList, setCategoryList] = useState<Category[]>([]);
  const [unitList, setUnitList] = useState<string[]>([]);
  const [currentItem, setCurrentItem] = useState<InventoryItem | null>(null);
  const [newItem, setNewItem] = useState<Partial<InventoryItem>>({ name: '', quantity: 0, unit: '', categoryId: 0, needNow: false });
  const [page, setPage] = useState(0);
  const [isLastPage, setIsLastPage] = useState(false);

  const getJwt = (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('jwtToken');
  };

  const fetchData = async (pageToLoad = 0) => {
    const jwt = getJwt();
    if (!jwt) {
      router.push('/auth/owner/login');
      return;
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/inventory/list/paged?restaurantId=${restaurantId}&page=${pageToLoad}&size=10`,
      {
        headers: { Authorization: `Bearer ${jwt}` },
      }
    );

    const json = await res.json();
    const data = json.data;
    console.log(data)
    setInventoryList(prev => {
      const combined = [...prev, ...(data.content || [])];
      const uniqueMap = new Map<number, InventoryItem>();
      combined.forEach(item => {
        if (!uniqueMap.has(item.id)) {
          uniqueMap.set(item.id, item);
        }
      });
      return Array.from(uniqueMap.values());
    });
    setIsLastPage(data.last);
    setPage(data.page + 1);

    if (pageToLoad === 0) {
      const categoryRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/category/list?restaurantId=${restaurantId}`, {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      const rawCategory = await categoryRes.json();
      setCategoryList(rawCategory);

      const unitRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/inventory/unit/list`, {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      const units = await unitRes.json();
      setUnitList(units);
    }
  };

  useEffect(() => {
    if (!restaurantId) return;
    fetchData(0);
  }, [restaurantId]);

  useEffect(() => {
    const handleScroll = () => {
      if (isLastPage) return;
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.body.offsetHeight;

      if (scrollTop + windowHeight >= documentHeight - 100) {
        fetchData(page);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [page, isLastPage, restaurantId]);

  const addItem = async () => {
    const jwt = getJwt();
    if (!jwt) {
      router.push('/auth/owner/login');
      return;
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/inventory/save`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwt}`,
      },
      body: JSON.stringify({ ...newItem, restaurantId }),
    });

    if (res.ok) {
      const json = await res.json();
      const saved = json.data;
      setInventoryList(prev => [...prev, saved]);
      setNewItem({ name: '', quantity: 0, unit: '', categoryId: 0, needNow: false });
    } else {
      alert('Failed to save inventory item');
    }
  };

  const updateItem = async () => {
    const jwt = getJwt();
    if (!jwt || !currentItem) return;

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/inventory/update`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwt}`,
      },
      body: JSON.stringify({ ...currentItem, restaurantId, needNow: currentItem.needNow ?? false }),
    });

    if (res.ok) {
      const updated = await res.json();
      const data = updated.data;
      setInventoryList(prev => prev.map(item => item.id === data.id ? data : item));
    }
  };

  const deleteItem = async () => {
    const jwt = getJwt();
    if (!jwt || !currentItem) return;

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/inventory/delete`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwt}`
      },
      body: JSON.stringify({ id: currentItem.id, restaurantId })
    });

    if (res.ok) {
      setInventoryList(prev => prev.filter(item => item.id !== currentItem.id));
      setCurrentItem(null);
    }
  };

  return (
    <div className='wrapper'>
      <AutoReload />
      <div className="container p-4">
        <h2>Inventory List</h2>
        {Object.entries(
          inventoryList.reduce((acc, cur) => {
            const cat = cur.categoryName || 'Uncategorized';
            acc[cat] = [...(acc[cat] || []), cur];
            return acc;
          }, {} as Record<string, InventoryItem[]>)
        ).map(([category, items]) => (
          <div key={category}>
            <h5>{category}</h5>
            {items.map(item => (
              <div key={item.id} className={`d-flex gap-2 mb-2 align-items-center ${item.needNow ? 'alert-danger' : ''}`}>
                <input className={`form-control ${item.needNow ? 'alert-danger' : ''}`} disabled value={item.name} />
                <input className={`form-control ${item.needNow ? 'alert-danger' : ''}`} disabled value={item.quantity} type="number" />
                <select className={`form-select ${item.needNow ? 'alert-danger' : ''}`} disabled defaultValue={item.unit}>
                  <option>{item.unit}</option>
                </select>
                <button className={`${item.needNow ? 'btn btn-danger' : 'btn btn-primary'}`} onClick={() => setCurrentItem(item)} data-bs-toggle="modal" data-bs-target="#editModal">Edit</button>
              </div>
            ))}
          </div>
        ))}

        {/* Add Modal */}
        <div className="modal fade" id="addModal" tabIndex={-1}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-body">
                <input className="form-control mb-2" placeholder="Name" value={newItem.name || ''} onChange={e => setNewItem(p => ({ ...p, name: e.target.value }))} />
                <input className="form-control mb-2" type="number" placeholder="Quantity" value={newItem.quantity || 0} onChange={e => setNewItem(p => ({ ...p, quantity: Number(e.target.value) }))} />
                <select className="form-select mb-2" value={newItem.unit || ''} onChange={e => setNewItem(p => ({ ...p, unit: e.target.value }))}>
                  <option value="">Select Unit</option>
                  {unitList.map(unit => <option key={unit} value={unit}>{unit}</option>)}
                </select>
                <select className="form-select mb-2" value={newItem.categoryId || 0} onChange={e => setNewItem(p => ({ ...p, categoryId: Number(e.target.value) }))}>
                  <option value={0}>Select Category</option>
                  {categoryList.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                </select>
                <div className="form-check mt-1">
                  <input className="form-check-input" type="checkbox" checked={newItem.needNow || false} onChange={e => setNewItem(p => ({ ...p, needNow: e.target.checked }))} id="addCheck" />
                  <label className="form-check-label" htmlFor="addCheck">Need This!</label>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button className="btn btn-primary" onClick={addItem} data-bs-dismiss="modal">Add</button>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Modal */}
        <div className="modal fade" id="editModal" tabIndex={-1}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              {currentItem ? (
                <>
                  <div className="modal-body">
                    <input className="form-control mb-2" value={currentItem.name} onChange={e => setCurrentItem(p => p ? { ...p, name: e.target.value } : null)} />
                    <input className="form-control mb-2" type="number" value={currentItem.quantity} onChange={e => setCurrentItem(p => p ? { ...p, quantity: Number(e.target.value) } : null)} />
                    <select className="form-select mb-2" value={currentItem.unit} onChange={e => setCurrentItem(p => p ? { ...p, unit: e.target.value } : null)}>
                      {unitList.map(unit => <option key={unit} value={unit}>{unit}</option>)}
                    </select>
                    <select className="form-select mb-4" value={currentItem.categoryId} onChange={e => setCurrentItem(p => p ? { ...p, categoryId: Number(e.target.value) } : null)}>
                      {categoryList.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                    </select>
                    <div className="form-check mt-1">
                      <input className="form-check-input" type="checkbox" checked={!!currentItem.needNow} onChange={e => setCurrentItem(p => p ? { ...p, needNow: e.target.checked } : null)} id="editCheck" />
                      <label className="form-check-label" htmlFor="editCheck">Need This!</label>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button className="btn btn-outline-danger" onClick={deleteItem} data-bs-dismiss="modal">Delete</button>
                    <button className="btn btn-primary" onClick={updateItem} data-bs-dismiss="modal">Save</button>
                  </div>
                </>
              ) : (
                <div className="modal-body">Loading...</div>
              )}
            </div>
          </div>
        </div>

        <button className="btn btn-primary mt-3" data-bs-toggle="modal" data-bs-target="#addModal">Add Product</button>
      </div>
    </div>
  );
};

export default InventoryPage;