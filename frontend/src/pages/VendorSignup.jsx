 import React, { useState } from 'react';

const VendorSignup = () => {
    const [businessName, setBusinessName] = useState('');
    const [ownerName, setOwnerName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [location, setLocation] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Here you would typically send this data to an API
        console.log('Vendor Signup Data:', {
            businessName,
            ownerName,
            phoneNumber,
            location,
            password,
        });
        alert('Form submitted! Check console for data.');
    };

    return (
        // Main page container with light green background and min-height
        <div className="min-h-screen flex flex-col" style={{backgroundColor: '#f0fff0'}}>
            
            {/* Header */}
            <header className="flex justify-between items-center px-4 sm:px-10 py-3 bg-white shadow-md">
                <div className="flex items-center text-xl font-bold" style={{color: '#42cf17'}}>
                    {/* Placeholder for your actual logo image/SVG */}
                    <div className="h-8 w-8 mr-2 rounded-full flex items-center justify-center" style={{backgroundColor: '#42cf17', opacity: 0.3}}>🌱</div> 
                    <span>Mboga Fresh</span>
                </div>
                <button className="text-white font-semibold py-2 px-5 rounded-full transition duration-150 shadow-md hover:opacity-90" style={{backgroundColor: '#42cf17'}}>
                    Log In
                </button>
            </header>

            {/* Main Content Area */}
            <main className="flex-grow flex justify-center items-center p-4">
                <div className="bg-white p-8 sm:p-10 rounded-xl shadow-2xl w-full max-w-md text-center">
                    
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">
                        Create your Vendor Account
                    </h2>
                    <p className="text-sm text-gray-500 mb-8">
                        Freshness You Can Trust.
                    </p>

                    {/* Form */}
                    <form className="space-y-5" onSubmit={handleSubmit}>
                        
                        {/* Business Name */}
                        <input 
                            type="text" 
                            placeholder="Business Name" 
                            value={businessName}
                            onChange={(e) => setBusinessName(e.target.value)}
                            required 
                            className="w-full p-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:ring-2 transition duration-150"
                            style={{'--tw-ring-color': '#42cf17', '--tw-border-opacity': '1'}} 
                            onFocus={(e) => e.target.style.borderColor = '#42cf17'}
                            onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                        />
                        
                        {/* Owner Name */}
                        <input 
                            type="text" 
                            placeholder="Owner Name" 
                            value={ownerName}
                            onChange={(e) => setOwnerName(e.target.value)}
                            required 
                            className="w-full p-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:ring-2 transition duration-150"
                            style={{'--tw-ring-color': '#42cf17', '--tw-border-opacity': '1'}} 
                            onFocus={(e) => e.target.style.borderColor = '#42cf17'}
                            onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                        />
                        
                        {/* Phone Number */}
                        <input 
                            type="tel" 
                            placeholder="Phone Number" 
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            required 
                            className="w-full p-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:ring-2 transition duration-150"
                            style={{'--tw-ring-color': '#42cf17', '--tw-border-opacity': '1'}} 
                            onFocus={(e) => e.target.style.borderColor = '#42cf17'}
                            onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                        />
                        
                        {/* Location Dropdown */}
                        <div className="relative">
                            <select 
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                required
                                className={`w-full p-3 border border-gray-300 rounded-lg focus:ring-2 transition duration-150 appearance-none bg-white 
                                    ${location === '' ? 'text-gray-400' : 'text-gray-800'}`}
                                style={{'--tw-ring-color': '#42cf17', '--tw-border-opacity': '1'}} 
                                onFocus={(e) => e.target.style.borderColor = '#42cf17'}
                                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                            >
                                <option value="" disabled>Select Location</option>
                                <option value="Nairobi">Nairobi</option>
                                <option value="Mombasa">Mombasa</option>
                                <option value="Kisumu">Kisumu</option>
                                {/* Add more locations */}
                            </select>
                            {/* Custom Tailwind dropdown arrow */}
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                            </div>
                        </div>
                        
                        {/* Password */}
                        <input 
                            type="password" 
                            placeholder="Password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required 
                            className="w-full p-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:ring-2 transition duration-150"
                            style={{'--tw-ring-color': '#42cf17', '--tw-border-opacity': '1'}} 
                            onFocus={(e) => e.target.style.borderColor = '#42cf17'}
                            onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                        />
                        
                        {/* Sign Up Button */}
                        <button 
                            type="submit" 
                            className="w-full text-white font-bold py-3 rounded-lg transition duration-300 shadow-md mt-6 hover:opacity-90"
                            style={{backgroundColor: '#42cf17'}}
                        >
                            Sign Up
                        </button>
                    </form>
                </div>
            </main>

            {/* Footer */}
            <footer className="flex justify-center items-center py-5 text-sm text-gray-600 bg-white border-t border-gray-100">
                <a href="#english" className="font-semibold hover:opacity-80" style={{color: '#42cf17'}}>English</a>
                <span className="mx-2">|</span>
                <a href="#swahili" className="font-semibold hover:opacity-80" style={{color: '#42cf17'}}>Swahili</a>
            </footer>
        </div>
    );
};

export default VendorSignup;