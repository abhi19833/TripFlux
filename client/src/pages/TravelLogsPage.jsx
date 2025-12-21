import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import api from "../utils/api";
import {
  Plus,
  MapPin,
  Calendar,
  Image as ImageIcon,
  CreditCard as Edit2,
  Trash2,
  Eye,
  UserPlus,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import TravelLogForm from "../components/TravelLogs/TravelLogForm";
import TravelLogDetail from "../components/TravelLogs/TravelLogDetail";

export default function TravelLogsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingLog, setEditingLog] = useState(null);
  const [viewingLog, setViewingLog] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (user) {
      loadLogs();
    } else {
      setLogs([]);
      setLoading(false);
    }
  }, [user, filter]);

  const loadLogs = async () => {
    setLoading(true);
    setError(null);

    const token = localStorage.getItem("token");
    if (!token) {
      setError("No authentication token found Please login.");
      setLoading(false);
      return;
    }

    try {
      const config = { headers: { "x-auth-token": token } };
      const res = await api.get("/travelLogs");

      let fetchedLogs = [];

      if (Array.isArray(res.data)) {
        fetchedLogs = res.data;
      } else if (Array.isArray(res.data.logs)) {
        fetchedLogs = res.data.logs;
      } else if (Array.isArray(res.data.data)) {
        fetchedLogs = res.data.data;
      }

      if (filter !== "all") {
        fetchedLogs = fetchedLogs.filter((log) => log.status === filter);
      }

      setLogs(fetchedLogs);
    } catch (err) {
      console.error("Error loading logs:", err.response?.data || err.message);
      setError(err.response?.data?.msg || "Error loading travel logs.");
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this travel log?")) return;

    setLoading(true);
    setError(null);

    const token = localStorage.getItem("token");
    if (!token) {
      setError("No authentication token found. Please log in.");
      setLoading(false);
      return;
    }

    try {
      const config = { headers: { "x-auth-token": token } };
      await api.delete(`/travelLogs/${id}`);
      loadLogs();
    } catch (err) {
      console.error("Error deleting log:", err.response?.data || err.message);
      setError(err.response?.data?.msg || "Error deleting travel log.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (log) => {
    setEditingLog(log);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingLog(null);
  };

  const handleSaveSuccess = () => {
    loadLogs();
  };

  const filters = [
    { id: "all", label: "All Travels" },
    { id: "visited", label: "Visited" },
    { id: "wishlist", label: "Wishlist" },
    { id: "ongoing", label: "Ongoing" },
  ];

  if (viewingLog) {
    return (
      <TravelLogDetail
        log={viewingLog}
        onClose={() => setViewingLog(null)}
        onUpdate={loadLogs}
      />
    );
  }

  if (showForm) {
    return (
      <TravelLogForm
        log={editingLog}
        onClose={handleFormClose}
        onSaveSuccess={handleSaveSuccess}
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:justify-between items-center mb-8">
        <div className="text-center sm:text-left mb-4 sm:mb-0">
          <h2 className="text-3xl font-bold text-gray-900">My Travels</h2>
          <p className="text-gray-600 mt-1">
            Document and explore your adventures
          </p>
        </div>
        <div className="w-full sm:w-auto flex justify-center sm:justify-end">
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-cyan-600 transition shadow-lg hover:shadow-xl"
          >
            <Plus className="w-5 h-5" />
            <span>Add Travel Log</span>
          </button>
        </div>
      </div>

      <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
        {filters.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition ${
              filter === f.id
                ? "bg-blue-500 text-white shadow-md"
                : "bg-white text-gray-600 hover:bg-gray-50 shadow"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-6">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        </div>
      ) : logs.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No travels yet
          </h3>
          <p className="text-gray-600 mb-6">
            Start documenting your adventures
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-cyan-600 transition"
          >
            <Plus className="w-5 h-5" />
            <span>Add Your First Travel</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {logs.map((log) => (
            <div
              key={log._id}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition overflow-hidden group"
            >
              <div className="relative h-48 bg-gradient-to-br from-blue-400 to-cyan-400">
                {log.imageUrl ? (
                  <img
                    src={log.imageUrl}
                    alt={log.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="w-16 h-16 text-white opacity-50" />
                  </div>
                )}
                <div className="absolute top-3 right-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      log.status === "visited"
                        ? "bg-green-500 text-white"
                        : log.status === "wishlist"
                        ? "bg-yellow-500 text-white"
                        : "bg-purple-500 text-white"
                    }`}
                  >
                    {log.status === "visited"
                      ? "Visited"
                      : log.status === "wishlist"
                      ? "Wishlist"
                      : "Ongoing"}
                  </span>
                </div>
              </div>

              <div className="p-5">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {log.title}
                </h3>
                <div className="flex items-center text-gray-600 text-sm space-x-4 mb-3">
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{log.destination}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(log.date).toLocaleDateString()}</span>
                  </div>
                </div>
                <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                  {log.description || "No description provided."}
                </p>

                <div className="flex space-x-2">
                  <button
                    onClick={() => setViewingLog(log)}
                    className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition text-sm font-medium"
                  >
                    <Eye className="w-4 h-4" />
                    <span>View</span>
                  </button>
                  <button
                    onClick={() => handleEdit(log)}
                    className="flex items-center justify-center px-3 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate("/add-member");
                    }}
                    className="flex items-center justify-center px-3 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition"
                    title="Add Member"
                  >
                    <UserPlus className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(log._id)}
                    className="flex items-center justify-center px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
