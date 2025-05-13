'use client';

import { useEffect, useState } from 'react';
import Head from 'next/head';
import Script from 'next/script';

interface Restaurant {
    id: number;
    restaurantName: string;
    restaurantCity: string;
}

export default function RestaurantPage() {
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [name, setName] = useState('');
    const [city, setCity] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/restaurant/list`, {
            credentials: 'include',
        })
            .then((res) => res.json())
            .then((data) => {
                setRestaurants(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error('Failed to load restaurants', err);
                setLoading(false);
            });
    }, []);

    const handleSave = async () => {
        if (!name.trim() || !city.trim()) return;

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/restaurant/save`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ restaurantName: name.trim(), restaurantCity: city.trim() }),
        });

        if (res.ok) {
            window.location.reload();
        } else {
            alert('Failed to save restaurant');
        }
    };

    return (
            <div className="layout-wrapper layout-content-navbar">
                <div className="layout-container">
                    <div className="layout-page">
                        <div className="content-wrapper">
                            <div className="container-xxl flex-grow-1 container-p-y">
                                <div className="col-md-6">
                                    <div className="card mb-4">
                                        <h5 className="card-header">Restaurant List</h5>
                                        <div className="table-responsive text-nowrap">
                                            <table className="table">
                                                <thead className="table-light">
                                                    <tr>
                                                        <th>Name</th>
                                                        <th>City</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="table-border-bottom-0">
                                                    {loading ? (
                                                        <tr><td colSpan={2}>Loading...</td></tr>
                                                    ) : (
                                                        restaurants.map((r) => (
                                                            <tr key={r.id} onClick={() => window.location.href = `/inventory?restaurantId=${r.id}`}
                                                                className="restaurant-row cursor-pointer">
                                                                <td><strong>{r.restaurantName}</strong></td>
                                                                <td>{r.restaurantCity}</td>
                                                            </tr>
                                                        ))
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>

                                        <button
                                            className="btn btn-primary small-button btn-danger mt-3"
                                            data-bs-toggle="modal"
                                            data-bs-target="#modalCenter1"
                                        >
                                            Add Restaurant
                                        </button>

                                        <div className="modal fade" id="modalCenter1" tabIndex={-1} aria-hidden="true">
                                            <div className="modal-dialog modal-dialog-centered">
                                                <div className="modal-content">
                                                    <div className="modal-header">
                                                        <h5 className="modal-title">Would you like to add your restaurant?</h5>
                                                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                    </div>
                                                    <div className="modal-body">
                                                        <div className="mb-3">
                                                            <label className="form-label">Restaurant Name</label>
                                                            <input className="form-control" type="text" value={name} onChange={(e) => setName(e.target.value)} />
                                                        </div>
                                                        <div className="mb-3">
                                                            <label className="form-label">City</label>
                                                            <input className="form-control" type="text" value={city} onChange={(e) => setCity(e.target.value)} />
                                                        </div>
                                                    </div>
                                                    <div className="modal-footer">
                                                        <button type="button" className="btn btn-outline-secondary" data-bs-dismiss="modal">Close</button>
                                                        <button type="button" className="btn btn-primary" onClick={handleSave} disabled={!name.trim() || !city.trim()}>
                                                            Save changes
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    );
}
