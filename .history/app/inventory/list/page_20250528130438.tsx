'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import AutoReload from '@/components/reload';

interface InventoryItem {
  id: number;
  name: string;
  quantity: number;
  unit: string;
  categoryId: number;
  categoryName?: string;
}

interface Category {
  id: number;
  name: string;
}

export default function InventoryPage() {
  
    const router = useRouter();
    const searchParams = useSearchParams();
    const restaurantId = searchParams.get('restaurantId');


    const [inventoryList, setInventoryList] = useState<InventoryItem[]>([]);
    const [categoryList, setCategoryList] = useState<Category[]>([]);
    const [unitList, setUnitList] = useState<string[]>([]);
    const [currentItem, setCurrentItem] = useState<InventoryItem | null>(null);

    const [newItem, setNewItem] = useState({ name: '', quantity: '', unit: '', categoryId: '' });


    const getJwt = (): string | null => {
        if (typeof window === 'undefined') return null;
        return localStorage.getItem('jwtToken');
      };

    useEffect(() => {
        if (!restaurantId) return;

        const jwt = getJwt();
        if (!jwt) {
            router.push('/auth/owner/login');
            return;
        }

    

        const fetchData = async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/inventory/list?restaurantId=${restaurantId}`, {
                headers: {
                    'Authorization': `Bearer ${jwt}`,
                  },
                
            });
            console.log(res)
            const data = await res.json();
            console.log(data)
            setInventoryList(data.inventoryList || []);
            setCategoryList(data.categoryList || []);

            const unitRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/inventory/unit/list`, {
                credentials: 'include',
                headers: {
                    'Authorization': `Bearer ${jwt}`,
                  },
            });
            const units = await unitRes.json();
            setUnitList(units);
        };

        fetchData();
    }, [restaurantId]);



    const updateItem = async () => {
        const jwt = getJwt();
        if (!jwt || !currentItem) return;
      
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/inventory/update`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwt}`,
          },
          body: JSON.stringify({ ...currentItem, restaurantId }),
        });
      
        if (res.ok) {
          const updated = await res.json(); // ← 서버가 수정된 item 내려줘야 함
          setInventoryList(prev =>
            prev.map(item => item.id === updated.id ? updated : item) // ✅ 수정된 item만 갱신
          );
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
          setInventoryList(prev =>
            prev.filter(item => item.id !== currentItem.id) // ✅ 삭제된 항목만 제거
          );
          setCurrentItem(null);
        }
      };

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
          setInventoryList(prev => [...prev, saved]); // ✅ 자동으로 리스트에 추가
          setNewItem({ name: '', quantity: '', unit: '', categoryId: '' }); // 폼 초기화
        } else {
          alert('Failed to save inventory item');
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
                }, {})
            ).map(([category, items]) => (
                <div key={category}>
                    <h5>{category}</h5>
                    {items.map(item => (
                        <div key={item.id} className="d-flex gap-2 mb-2 align-items-center">
                            <input className="form-control" disabled value={item.name} />
                            <input className="form-control" disabled value={item.quantity} type="number" />
                            <select className="form-select" disabled defaultValue={item.unit}>
                                <option>{item.unit}</option>
                            </select>
                            <button className="btn btn-primary" onClick={() => setCurrentItem(item)} data-bs-toggle="modal" data-bs-target="#editModal">Edit</button>
                        </div>
                    ))}
                </div>
            ))}

            {/* Add Modal */}
            <div className="modal fade" id="addModal" tabIndex={-1}>
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-body">
                            <input className="form-control mb-2" placeholder="Name" onChange={e => setNewItem(p => ({ ...p, name: e.target.value }))} />
                            <input className="form-control mb-2" type="number" placeholder="Quantity" onChange={e => setNewItem(p => ({ ...p, quantity: e.target.value }))} />
                            <select className="form-select mb-2" onChange={e => setNewItem(p => ({ ...p, unit: e.target.value }))}>
                                <option>Select Unit</option>
                                {unitList.map(unit => <option key={unit} value={unit}>{unit}</option>)}
                            </select>
                            <select className="form-select" onChange={e => setNewItem(p => ({ ...p, categoryId: e.target.value }))}>
                                <option>Select Category</option>
                                {categoryList.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                            </select>
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
                        <input className="form-control mb-2" defaultValue={currentItem.name} onChange={e => setCurrentItem(p => ({ ...p, name: e.target.value }))} />
                        <input className="form-control mb-2" type="number" defaultValue={currentItem.quantity} onChange={e => setCurrentItem(p => ({ ...p, quantity: e.target.value }))} />
                        <select className="form-select mb-2" defaultValue={currentItem.unit} onChange={e => setCurrentItem(p => ({ ...p, unit: e.target.value }))}>
                            {unitList.map(unit => <option key={unit} value={unit}>{unit}</option>)}
                        </select>
                        <select className="form-select mb-4" defaultValue={currentItem.categoryId} onChange={e => setCurrentItem(p => ({ ...p, categoryId: e.target.value }))}>
                            {categoryList.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                        </select>
                        <div className="form-check mt-1">
                            <input className="form-check-input" type="checkbox" value="" id="defaultCheck1" />
                            <label className="form-check-label" htmlFor="defaultCheck1"> Need This! </label>
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
}