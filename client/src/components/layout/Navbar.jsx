import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
  Compass,
  Users,
  Sparkles,
  LogOut,
  User,
  Menu,
  X,
  Home,
  DollarSign,
  Image,
} from "lucide-react";

export default function Navbar() {
  const { user, profile, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/login");
    } catch (err) {
      console.error("Sign out failed:", err);
    }
  };

  const navLinks = [
    { id: 1, name: "Home", icon: Home, path: "/" },
    { id: 2, name: "My Travels", icon: Compass, path: "/my-logs" },
    { id: 3, name: "AI Assistant", icon: Sparkles, path: "/ai-assistant" },
    { id: 4, name: "Expenses", icon: DollarSign, path: "/expenses" },
    { id: 5, name: "My Media", icon: Image, path: "/media" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div>
              <h1 className="text-lg font-bold text-gray-900">TripFlux</h1>
              <p className="text-xs text-gray-500">Your Journey,Documented</p>
            </div>
          </Link>

          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.id}
                  to={item.path}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-all ${
                    isActive(item.path)
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          <div className="hidden md:flex items-center space-x-3">
            <Link
              to="/profile"
              className="flex rounded-md hover:bg-gray-50 items-center space-x-2 px-3 py-2"
            >
              {profile?.profile_picture_url ? (
                <img
                  src={profile.profile_picture_url}
                  alt={profile.username}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full ">
                  <User className="w-4 h-4 text-white" />
                </div>
              )}
              <span className="text-gray-700 font-medium">
                {user?.username || "Profile"}
              </span>
            </Link>
            <button
              onClick={handleLogout}
              className=" text-gray-600 hover:text-red-600 p-2 hover:bg-red-50 rounded-md transition"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 text-gray-600 hover:bg-gray-50 rounded-md"
          >
            {menuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden border-t border-gray-200 mt-2 pb-4">
            <div className="flex flex-col space-y-1 mt-2">
              {navLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.id}
                    to={item.path}
                    onClick={() => setMenuOpen(false)}
                    className={`flex rounded-md font-medium transition items-center space-x-3 px-4 py-3 ${
                      isActive(item.path)
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
              <Link
                to="/profile"
                onClick={() => setMenuOpen(false)}
                className="flex rounded-md font-medium text-gray-700 hover:bg-gray-100  items-center space-x-3 px-4 py-3"
              >
                <User className="w-5 h-5" />
                <span>Profile</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex rounded-md font-medium text-red-600 hover:bg-red-50 items-center space-x-3 px-4 py-3 "
              >
                <LogOut className="w-5 h-5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
