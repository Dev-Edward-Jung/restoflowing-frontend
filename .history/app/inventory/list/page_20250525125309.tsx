'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import AutoReload from '@/components/reload';


export default function InventoryPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const restaurantId = searchParams.get('restaurantId');

    const [inventoryList, setInventoryList] = useState([]);
    const [categoryList, setCategoryList] = useState([]);
    const [unitList, setUnitList] = useState([]);
    const [currentItem, setCurrentItem] = useState(null);

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
        if (!jwt) {
            router.push('/auth/owner/login');
            return;
        }
        if (!currentItem) return;
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/inventory/update`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwt}`,
            },
            body: JSON.stringify({ ...currentItem, restaurantId })
        });
        location.reload();
    };

    const deleteItem = async () => {
        const jwt = getJwt();
        if (!jwt) {
            router.push('/auth/owner/login');
            return;
        }
        if (!currentItem) return;
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/inventory/delete`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwt}`
            },
            body: JSON.stringify({ id: currentItem.id, restaurantId })
        });
    };

    const addItem = async () => {
        const jwt = getJwt();
        if (!jwt) {
            router.push('/auth/owner/login');
            return;
        }
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/inventory/save`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwt}`,
            },
            body: JSON.stringify({ ...newItem, restaurantId })
        });
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