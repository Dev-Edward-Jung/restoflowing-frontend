'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCsrf } from '@/context/CsrfContext';

interface Restaurant {
  id: number;
  restaurantName: string;
  restaurantCity: string;
}

export default function RestaurantPage() {
  const router = useRouter();
  const { token: csrfToken, headerName } = useCsrf();

  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [city, setCity] = useState('');

  const getJwt = (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('jwtToken');
  };

  // 리스트 불러오기
  useEffect(() => {
    const jwt = getJwt();
    if (!jwt) {
      router.push('/auth/owner/login');
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/restaurant/list`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        [headerName]: csrfToken,
        'Authorization': `Bearer ${jwt}`,
      },
    })
      .then(async res => {
        if (!res.ok) {
          if (res.status === 401) {
            // 토큰 만료 혹은 유효하지 않음
            // localStorage.removeItem('jwtToken');
            // router.push('/auth/owner/login');
          }
          throw new Error(`HTTP ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        const list = Array.isArray(data) ? data : data.restaurants;
        setRestaurants(list ?? []);
      })
      .catch(err => {
        console.error('Failed to load restaurants', err);
      })
      .finally(() => setLoading(false));
  }, [csrfToken, headerName, router]);

  // 새로운 레스토랑 저장
  const handleSave = async () => {
    const jwt = getJwt();
    if (!jwt) {
      router.push('/auth/owner/login');
      return;
    }
    if (!name.trim() || !city.trim()) return;

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/restaurant/save`,
      {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          [headerName]: csrfToken,
          'Authorization': `Bearer ${jwt}`,
        },
        body: JSON.stringify({ restaurantName: name.trim(), restaurantCity: city.trim() }),
      }
    );

    if (res.ok) {
      const saved = await res.json();
      setRestaurants(prev => [...prev, saved]);
      setName('');
      setCity('');
      // 모달 닫기 (Bootstrap JS 필요)
      const modalEl = document.getElementById('modalCenter1');
      modalEl?.classList.remove('show');
      modalEl?.setAttribute('aria-hidden', 'true');
      modalEl?.removeAttribute('style');
    } else if (res.status === 401) {
      localStorage.removeItem('jwtToken');
      router.push('/auth/owner/login');
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
                        ) : restaurants.length ? (
                          restaurants.map(r => (
                            <tr
                              key={r.id}
                              className="restaurant-row cursor-pointer"
                              onClick={() => router.push(`/inventory?restaurantId=${r.id}`)}
                            >
                              <td><strong>{r.restaurantName}</strong></td>
                              <td>{r.restaurantCity}</td>
                            </tr>
                          ))
                        ) : (
                          <tr><td colSpan={2}>No restaurants found.</td></tr>
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
                          <h5 className="modal-title">Add Your Restaurant</h5>
                          <button type="button" className="btn-close" data-bs-dismiss="modal" />
                        </div>
                        <div className="modal-body">
                          <div className="mb-3">
                            <label className="form-label">Restaurant Name</label>
                            <input
                              type="text"
                              className="form-control"
                              value={name}
                              onChange={e => setName(e.target.value)}
                            />
                          </div>
                          <div className="mb-3">
                            <label className="form-label">City</label>
                            <input
                              type="text"
                              className="form-control"
                              value={city}
                              onChange={e => setCity(e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="modal-footer">
                          <button type="button" className="btn btn-outline-secondary" data-bs-dismiss="modal">
                            Close
                          </button>
                          <button
                            type="button"
                            className="btn btn-primary"
                            onClick={handleSave}
                            disabled={!name.trim() || !city.trim()}
                          >
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