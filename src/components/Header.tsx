import { OrganizationSwitcher, SignedIn, SignedOut, SignInButton, SignOutButton, UserButton } from '@clerk/clerk-react';
import React from "react";

interface HeaderProps {
  onStorageTestOpen: () => void;
  onFormOpen: () => void;
}

export default function Header({ onStorageTestOpen, onFormOpen }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-white/90 shadow border-b border-slate-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3 md:py-4">
        <div className="flex items-center gap-3">
          <div className="bg-teal-600 rounded-full p-2 shadow-md">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <span className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight select-none">Dynamic Form Manager</span>
        </div>
        
        <nav>
          <SignedOut>
            <SignInButton mode="modal">
              <button className="bg-teal-600 text-white px-5 py-2 rounded-lg shadow hover:bg-teal-700 transition font-semibold text-base md:text-lg">Sign In</button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <div className="flex items-center gap-3 md:gap-4">
              <button
                onClick={onStorageTestOpen}
                className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition font-semibold text-sm md:text-base shadow"
              >
                Upload
              </button>

              <button
                onClick={() => onFormOpen()}
                className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition font-semibold text-sm md:text-base shadow"
              >
                Form
              </button>
              <SignOutButton>
                <button className="bg-rose-500 text-white px-3 py-2 rounded-lg hover:bg-rose-600 transition font-semibold text-sm md:text-base shadow">Sign Out</button>
              </SignOutButton>
              <OrganizationSwitcher appearance={{ elements: { rootBox: 'rounded-lg border border-slate-200 shadow-sm' } }} />
              <UserButton appearance={{ elements: { avatarBox: 'ring-2 ring-teal-500' } }} />
            </div>
          </SignedIn>
        </nav>
      </div>
    </header>
  );
} 