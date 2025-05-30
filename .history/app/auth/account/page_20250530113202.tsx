'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from "next/navigation";

export default function MyAccountPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    organization: '',
  });
  const restaurantId = searchParams.get("restaurantId");


  function logOut () {
    localStorage.removeItem('jwtToken')
    localStorage.removeItem('rememberPassowrd')
    localStorage.removeItem('rememberEmail')
    localStorage.removeItem('rememberMe')
    router.push('/auth/owner/login')
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitted:', formData);
    // Add fetch POST logic here
  };


    useEffect(() => {
      
      if (!restaurantId) {
        router.push("/auth/owner/login");
      }
    }, [restaurantId]);
  
    const getJwt = (): string | null => {
      if (typeof window === 'undefined') return null;
      return localStorage.getItem('jwtToken');
    };

  const fetchCategories = async () => {
    const jwt = getJwt();
    if (!jwt || !restaurantId) return;
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





  return (
    <div className="container-lg p-4">
    <div className="card mb-4">
        <h5 className="card-header">Your Account Information</h5>
        <div className="card-body">
            <div className="list-view mt-2 flex-wrap">
    <div className="card-body">
      <form id="formAccountSettings" onSubmit={handleSubmit}>
        <div className="row">
          <div className="mb-3 col-md-6">
            <label htmlFor="firstName" className="form-label">UserName</label>
            <input className="form-control" type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} autoFocus />
          </div>

          <div className="mb-3 col-md-6">
            <label htmlFor="email" className="form-label">E-mail</label>
            <input className="form-control" type="text" id="email" name="email" value={formData.email} onChange={handleChange} disabled/>
          </div>

          <div className="mb-3 col-md-6">
            <label htmlFor="phoneNumber" className="form-label">Phone Number</label>
            <div className="input-group input-group-merge">
              <span className="input-group-text">US (+1)</span>
              <input type="text" id="phoneNumber" name="phoneNumber" className="form-control" placeholder="202 555 0111" value={formData.phoneNumber} onChange={handleChange} />
            </div>
          </div>

{/* 
          <div className="mb-3 col-md-6">
            <label htmlFor="language" className="form-label">Language</label>
            <select id="language" name="language" className="form-select" value={formData.language} onChange={handleChange}>
              <option value="">Select Language</option>
              <option value="en">English</option>
              <option value="fr">French</option>
              <option value="de">German</option>
              <option value="pt">Portuguese</option>
            </select>
          </div> */}

        </div>

        <div className="mt-2">
          <button type="submit" className="btn btn-primary me-5">Save changes</button>
          <button 
          type="reset"
           className="btn btn-danger"
           onClick={logOut}
           >Log Out</button>
        </div>
      </form>
    </div>

    </div>
    </div>
    </div>
    </div>
  );
}