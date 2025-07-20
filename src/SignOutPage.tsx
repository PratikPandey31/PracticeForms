import React from 'react';
import { Link } from 'react-router-dom';

export default function SignOutPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full flex flex-col items-center">
        <svg className="w-16 h-16 text-blue-600 mb-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        <h1 className="text-3xl font-extrabold text-blue-700 mb-2 text-center">You have signed out</h1>
        <p className="text-lg text-gray-700 mb-6 text-center">Thank you for visiting. You have been successfully signed out.</p>
        <Link to="/" className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition w-full text-center">Return to Home</Link>
      </div>
    </div>
  );
} 