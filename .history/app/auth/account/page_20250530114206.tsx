'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from "next/navigation";
import { useUser } from '@/context/UserContext';

export default function MyAccountPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
    const { memberId, memberRole, memberEmail } = useUser();
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
      fetchCategories()
    }, [restaurantId]);
  
    const getJwt = (): string | null => {
      if (typeof window === 'undefined') return null;
      return localStorage.getItem('jwtToken');


    };

  const fetchCategories = async () => {
    const jwt = getJwt();
    if (!jwt || !restaurantId) return;
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me?restaurantId=${restaurantId}`, {
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
    console.log(data)
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
            <label htmlFor="firstName" className="form-label">Role</label>
            <input className="form-control" type="text" id="firstName" name="firstName" value={memberRole || ''} onChange={handleChange} disabled autoFocus />
          </div>

          <div className="mb-3 col-md-6">
            <label htmlFor="email" className="form-label">E-mail</label>
            <input className="form-control" type="text" id="email" name="email" value = {memberEmail || ''} onChange={handleChange} disabled/>
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
          {/* <button type="submit" className="btn btn-primary me-5">Save changes</button> */}
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