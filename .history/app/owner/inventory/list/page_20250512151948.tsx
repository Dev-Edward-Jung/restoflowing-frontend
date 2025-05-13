'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function InventoryPage() {
    const searchParams = useSearchParams();
    const restaurantId = searchParams.get('restaurantId');

    const [inventoryList, setInventoryList] = useState([]);
    const [categoryList, setCategoryList] = useState([]);
    const [unitList, setUnitList] = useState([]);
    const [currentItem, setCurrentItem] = useState(null);

    const [newItem, setNewItem] = useState({ name: '', quantity: '', unit: '', categoryId: '' });

    useEffect(() => {
        if (!restaurantId) return;
        const csrfToken = document.querySelector('meta[name="_csrf"]')?.getAttribute('content');
        const csrfHeader = document.querySelector('meta[name="_csrf_header"]')?.getAttribute('content');

        const fetchData = async () => {
            const res = await fetch(`/api/inventory/list?restaurantId=${restaurantId}`, {
                credentials: 'include',
                headers: { [csrfHeader]: csrfToken }
            });
            const data = await res.json();
            setInventoryList(data.inventoryList || []);
            setCategoryList(data.categoryList || []);

            const unitRes = await fetch('/api/inventory/unit/list', {
                credentials: 'include',
                headers: { [csrfHeader]: csrfToken }
            });
            const units = await unitRes.json();
            setUnitList(units);
        };

        fetchData();
    }, [restaurantId]);

    const updateItem = async () => {
        if (!currentItem) return;
        const csrfToken = document.querySelector('meta[name="_csrf"]')?.getAttribute('content');
        const csrfHeader = document.querySelector('meta[name="_csrf_header"]')?.getAttribute('content');
        await fetch('/api/inventory/update', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                [csrfHeader]: csrfToken
            },
            body: JSON.stringify({ ...currentItem, restaurantId })
        });
        location.reload();
    };

    const deleteItem = async () => {
        if (!currentItem) return;
        const csrfToken = document.querySelector('meta[name="_csrf"]')?.getAttribute('content');
        const csrfHeader = document.querySelector('meta[name="_csrf_header"]')?.getAttribute('content');
        await fetch('/api/inventory/delete', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                [csrfHeader]: csrfToken
            },
            body: JSON.stringify({ id: currentItem.id, restaurantId })
        });
        location.reload();
    };

    const addItem = async () => {
        const csrfToken = document.querySelector('meta[name="_csrf"]')?.getAttribute('content');
        const csrfHeader = document.querySelector('meta[name="_csrf_header"]')?.getAttribute('content');
        await fetch('/api/inventory/save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                [csrfHeader]: csrfToken
            },
            body: JSON.stringify({ ...newItem, restaurantId })
        });
        location.reload();
    };

    return (
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
            {currentItem && (
                <div className="modal fade" id="editModal" tabIndex={-1}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-body">
                                <input className="form-control mb-2" defaultValue={currentItem.name} onChange={e => setCurrentItem(p => ({ ...p, name: e.target.value }))} />
                                <input className="form-control mb-2" type="number" defaultValue={currentItem.quantity} onChange={e => setCurrentItem(p => ({ ...p, quantity: e.target.value }))} />
                                <select className="form-select mb-2" defaultValue={currentItem.unit} onChange={e => setCurrentItem(p => ({ ...p, unit: e.target.value }))}>
                                    {unitList.map(unit => <option key={unit} value={unit}>{unit}</option>)}
                                </select>
                                <select className="form-select" defaultValue={currentItem.categoryId} onChange={e => setCurrentItem(p => ({ ...p, categoryId: e.target.value }))}>
                                    {categoryList.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                                </select>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-outline-danger" onClick={deleteItem} data-bs-dismiss="modal">Delete</button>
                                <button className="btn btn-primary" onClick={updateItem} data-bs-dismiss="modal">Save</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <button className="btn btn-primary mt-3" data-bs-toggle="modal" data-bs-target="#addModal">Add Product</button>
        </div>
    );
}