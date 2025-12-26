import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { X, MapPin, Calendar, UserPlus } from "lucide-react";
import api from "../../utils/api";
import { useAuth } from "../../contexts/AuthContext";

export default function TravelLogDetail({ log: initialLog, onClose }) {
  const { user, loading: authLoading } = useAuth();
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [log, setLog] = useState(initialLog || null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const fetchLogDetails = async () => {
    if (!user) {
      setErrorMsg("You need to be logged in to view travel log.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const logId = initialLog?._id || id;

      const res = await api.get(`/travelLogs/${logId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setLog(res.data);
    } catch (err) {
      console.error("Failed to fetch travel log:", err);
      setErrorMsg(
        "Failed to load travel log. " + (err.response?.data?.msg || err.message)
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if ((initialLog && initialLog._id) || (id && !authLoading)) {
      fetchLogDetails();
    } else if (!authLoading && !user) {
      setErrorMsg("You must loggedin to view  travel log.");
      setLoading(false);
    }
  }, [id, user, authLoading, location.search]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 rounded-full border-b-4 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading travel log...</p>
        </div>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-red-600">{errorMsg}</div>
    );
  }

  if (!log) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-gray-600">
        Travel log not found.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="relative h-96 bg-gradient-to-br from-blue-400 to-cyan-400">
          {log.photos?.length ? (
            <img
              src={log.photos[0]}
              alt={log.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <MapPin className="w-24 h-24 text-white opacity-50" />
            </div>
          )}

          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white rounded-full shadow hover:bg-gray-100"
          >
            <X className="w-6 h-6 text-gray-700" />
          </button>

          <div className="absolute bottom-4 left-4">
            <span
              className={`px-4 py-1.5 rounded-full text-sm font-semibold ${
                log.status === "visited"
                  ? "bg-green-500 text-white"
                  : log.status === "wishlist"
                  ? "bg-yellow-500 text-white"
                  : log.status === "ongoing"
                  ? "bg-purple-500 text-white"
                  : "bg-gray-500 text-white"
              }`}
            ></span>
          </div>
        </div>

        <div className="p-8">
          <h1 className="text-4xl font-bold mb-4 text-gray-900">{log.title}</h1>

          <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-6">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              <span>{log.destination}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span>
                {new Date(log.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>

          {log.description && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Description
              </h2>
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                {log.description}
              </p>
            </div>
          )}

          <div className="flex gap-4 mt-8 border-t pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
