'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
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
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);

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

    const fetchUnitsAndCategories = async () => {
      const unitRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/inventory/unit/list`, {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      const units = await unitRes.json();
      setUnitList(units);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/inventory/list?restaurantId=${restaurantId}`, {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      const data = await res.json();
      setCategoryList(data.categoryList || []);
    };

    fetchUnitsAndCategories();
  }, [restaurantId]);

  const fetchInventoryPage = async () => {
    const jwt = getJwt();
    if (!jwt || !restaurantId || !hasMore) return;

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/inventory/paged?restaurantId=${restaurantId}&page=${page}&size=10`,
      { headers: { Authorization: `Bearer ${jwt}` } }
    );

    const json = await res.json();
    const result = json.data;
    const newItems = result.content;

    setInventoryList((prev) => [...prev, ...newItems]);
    setHasMore(!result.last);
    setPage((prev) => prev + 1);
  };

  useEffect(() => {
    setInventoryList([]);
    setPage(0);
    setHasMore(true);
  }, [restaurantId]);

  useEffect(() => {
    fetchInventoryPage();
  }, [page]);

  const lastItemRef = useCallback(
    (node: HTMLElement | null) => {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          fetchInventoryPage();
        }
      });
      if (node) observer.current.observe(node);
    },
    [hasMore]
  );

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
            {items.map((item, i) => (
              <div
                key={item.id}
                ref={i === items.length - 1 ? lastItemRef : null}
                className={`d-flex gap-2 mb-2 align-items-center ${item.needNow ? 'alert-danger' : ''}`}
              >
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

        {/* ...Modal 부분 동일... */}
      </div>
    </div>
  );
};

export default InventoryPage;