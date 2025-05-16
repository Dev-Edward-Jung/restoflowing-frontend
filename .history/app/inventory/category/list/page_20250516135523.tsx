"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import OwnerHeader from "@/components/header/OwnerHeader";

export default function CategoryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const restaurantId = searchParams.get("restaurantId");

  const [categories, setCategories] = useState([]);
  const [currentId, setCurrentId] = useState(null);
  const [currentName, setCurrentName] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");

  const getJwt = (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('jwtToken');
  };

  const jwt = getJwt();
  if (!jwt) {
      router.push('/auth/owner/login');
      return;
  }
  

  const fetchCategories = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/category/list?restaurantId=${restaurantId}`, {
      credentials: "include",
      headers: {
        'Authorization': `Bearer ${jwt}`,
      },
    });
    if (!res.ok) {
      console.error("Failed to fetch categories");
      return;
    }
    const data = await res.json();
    setCategories(data);
  };

  const updateCategory = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/category/update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${jwt}`,
      },
      body: JSON.stringify({ id: currentId, name: currentName, restaurantId }),
    });
    if (res.ok) {
      await fetchCategories();
    } else {
      console.error("Update failed");
    }
  };

  const deleteCategory = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/category/delete`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${jwt}`,
      },
      body: JSON.stringify({ id: currentId, restaurantId }),
    });
    if (res.ok) {
      await fetchCategories();
    } else {
      console.error("Delete failed");
    }
  };

  const addCategory = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/category/save`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${jwt}`,
      },
      body: JSON.stringify({ name: newCategoryName, restaurantId }),
    });
    if (res.ok) {
      setNewCategoryName("");
      await fetchCategories();
    } else {
      console.error("Add failed");
    }
  };

  useEffect(() => {
    if (!restaurantId) {
      alert("restaurantId is missing");
      router.push("/auth/owner/login");
      return;
    }
    fetchCategories();
  }, [restaurantId]);

  return (
    <div className="container p-4">
      <h2>Category List</h2>
      <div className="category-list">
        {categories.map((cat) => (
          <div key={cat.id} className="d-flex align-items-center gap-2 mb-2">
            <input
              className="form-control"
              value={cat.name}
              disabled
            />
            <button
              className="btn btn-primary"
              data-bs-toggle="modal"
              data-bs-target="#editModal"
              onClick={() => {
                setCurrentId(cat.id);
                setCurrentName(cat.name);
              }}
            >
              Edit
            </button>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      <div className="modal fade" id="addModal" tabIndex={-1}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add Category</h5>
              <button className="btn-close" data-bs-dismiss="modal" />
            </div>
            <div className="modal-body">
              <input
                className="form-control"
                placeholder="Category Name"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
              />
            </div>
            <div className="modal-footer">
              <button className="btn btn-primary" onClick={addCategory} data-bs-dismiss="modal">
                Add
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <div className="modal fade" id="editModal" tabIndex={-1}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Edit Category</h5>
              <button className="btn-close" data-bs-dismiss="modal" />
            </div>
            <div className="modal-body">
              <input
                className="form-control"
                value={currentName}
                onChange={(e) => setCurrentName(e.target.value)}
              />
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline-danger" onClick={deleteCategory} data-bs-dismiss="modal">
                Delete
              </button>
              <button className="btn btn-primary" onClick={updateCategory} data-bs-dismiss="modal">
                Save
              </button>
            </div>
          </div>
        </div>
      </div>

      <button className="btn btn-primary mt-3" data-bs-toggle="modal" data-bs-target="#addModal">
        Add Category
      </button>
    </div>
  );
}
