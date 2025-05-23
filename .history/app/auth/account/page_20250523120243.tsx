'use client';

import { useState } from 'react';

export function MyAccountPage() {
  const [formData, setFormData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    organization: 'ThemeSelection',
    phoneNumber: '',
    address: '',
    state: '',
    zipCode: '',
    country: '',
    language: '',
    timeZone: '',
    currency: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitted:', formData);
    // Add fetch POST logic here
  };

  return (
    <div className="card-body">
      <form id="formAccountSettings" onSubmit={handleSubmit}>
        <div className="row">
          <div className="mb-3 col-md-6">
            <label htmlFor="firstName" className="form-label">First Name</label>
            <input className="form-control" type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} autoFocus />
          </div>

          <div className="mb-3 col-md-6">
            <label htmlFor="lastName" className="form-label">Last Name</label>
            <input className="form-control" type="text" name="lastName" id="lastName" value={formData.lastName} onChange={handleChange} />
          </div>

          <div className="mb-3 col-md-6">
            <label htmlFor="email" className="form-label">E-mail</label>
            <input className="form-control" type="text" id="email" name="email" value={formData.email} onChange={handleChange} />
          </div>

          <div className="mb-3 col-md-6">
            <label htmlFor="organization" className="form-label">Organization</label>
            <input type="text" className="form-control" id="organization" name="organization" value={formData.organization} onChange={handleChange} />
          </div>

          <div className="mb-3 col-md-6">
            <label htmlFor="phoneNumber" className="form-label">Phone Number</label>
            <div className="input-group input-group-merge">
              <span className="input-group-text">US (+1)</span>
              <input type="text" id="phoneNumber" name="phoneNumber" className="form-control" placeholder="202 555 0111" value={formData.phoneNumber} onChange={handleChange} />
            </div>
          </div>

          <div className="mb-3 col-md-6">
            <label htmlFor="address" className="form-label">Address</label>
            <input type="text" className="form-control" id="address" name="address" placeholder="Address" value={formData.address} onChange={handleChange} />
          </div>

          <div className="mb-3 col-md-6">
            <label htmlFor="state" className="form-label">State</label>
            <input className="form-control" type="text" id="state" name="state" placeholder="California" value={formData.state} onChange={handleChange} />
          </div>

          <div className="mb-3 col-md-6">
            <label htmlFor="zipCode" className="form-label">Zip Code</label>
            <input type="text" className="form-control" id="zipCode" name="zipCode" placeholder="231465" maxLength={6} value={formData.zipCode} onChange={handleChange} />
          </div>

          <div className="mb-3 col-md-6">
            <label htmlFor="country" className="form-label">Country</label>
            <select id="country" name="country" className="form-select" value={formData.country} onChange={handleChange}>
              <option value="">Select</option>
              <option value="United States">United States</option>
              <option value="Korea">Korea, Republic of</option>
              {/* Add other countries as needed */}
            </select>
          </div>

          <div className="mb-3 col-md-6">
            <label htmlFor="language" className="form-label">Language</label>
            <select id="language" name="language" className="form-select" value={formData.language} onChange={handleChange}>
              <option value="">Select Language</option>
              <option value="en">English</option>
              <option value="fr">French</option>
              <option value="de">German</option>
              <option value="pt">Portuguese</option>
            </select>
          </div>

          <div className="mb-3 col-md-6">
            <label htmlFor="timeZone" className="form-label">Timezone</label>
            <select id="timeZone" name="timeZone" className="form-select" value={formData.timeZone} onChange={handleChange}>
              <option value="">Select Timezone</option>
              <option value="-5">(GMT-05:00) Eastern Time (US & Canada)</option>
              <option value="-8">(GMT-08:00) Pacific Time (US & Canada)</option>
              {/* Add more if needed */}
            </select>
          </div>

          <div className="mb-3 col-md-6">
            <label htmlFor="currency" className="form-label">Currency</label>
            <select id="currency" name="currency" className="form-select" value={formData.currency} onChange={handleChange}>
              <option value="">Select Currency</option>
              <option value="usd">USD</option>
              <option value="euro">Euro</option>
              <option value="pound">Pound</option>
              <option value="bitcoin">Bitcoin</option>
            </select>
          </div>
        </div>

        <div className="mt-2">
          <button type="submit" className="btn btn-primary me-2">Save changes</button>
          <button type="reset" className="btn btn-outline-secondary">Cancel</button>
        </div>
      </form>
    </div>
  );
}