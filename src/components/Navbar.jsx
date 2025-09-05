import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../api/notesApi';

const Navbar = () => {
  const navigate = useNavigate();
  const isAuthenticated = authApi.isAuthenticated();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    authApi.logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b border-gray-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Brand */}
          <div className="flex items-center">
            <Link to="/" className="text-xl font-semibold text-green-600">
              Note App
            </Link>
          </div>

          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700"
              >
                Logout
              </button>
            )}
          </div>

          {/* No mobile menu since there are no nav links */}
        </div>
      </div>
      {/* Mobile logout only */}
      {isAuthenticated && (
        <div className="md:hidden border-t border-gray-100 bg-white/90 backdrop-blur">
          <div className="px-4 py-3">
            <button
              onClick={() => { setOpen(false); handleLogout(); }}
              className="w-full rounded bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
