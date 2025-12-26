import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../utils/api";
import { X } from "lucide-react";

export default function TravelLogForm({ log, onClose, onSaveSuccess }) {
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    destination: "",
    description: "",
    date: "",
    latitude: "",
    longitude: "",
    status: "visited",
  });

  useEffect(() => {
    if (log) {
      setFormData({
        title: log.title || "",
        destination: log.destination || "",
        description: log.description || "",
        date: log.date ? new Date(log.date).toISOString().split("T")[0] : "",
        latitude: log.latitude || "",
        longitude: log.longitude || "",
        status: log.status || "visited",
      });
    }
  }, [log]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMsg("");

    const token = localStorage.getItem("token");
    if (!token) {
      setErrorMsg("You need to be logged in.");
      setIsSaving(false);
      return;
    }

    try {
      const payload = {
        title: formData.title,
        destination: formData.destination,
        description: formData.description,
        status: formData.status,
        latitude: formData.latitude,
        longitude: formData.longitude,
      };

      const config = {
        headers: {
          "x-auth-token": token,
          "Content-Type": "application/json",
        },
      };

      let response;
      if (log) {
        response = await api.put(`/travelLogs/${log._id}`, payload, config);
      } else {
        response = await api.post("/travelLogs", payload, config);
      }

      console.log("Log saved:", response.data);
      onSaveSuccess?.();
      onClose?.();
    } catch (err) {
      console.error("Error saving log:", err);
      setErrorMsg(
        err.response?.data?.msg ||
          "Failed to save travel log. Please try again."
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8">
      <div className="bg-white shadow-xl rounded-2xl p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">
            {log ? "Edit Travel Log" : "New Travel Log"}
          </h2>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        {errorMsg && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />

          <input
            type="text"
            name="destination"
            placeholder="Destination"
            value={formData.destination}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />

          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />

          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              name="latitude"
              placeholder="Latitude"
              value={formData.latitude}
              onChange={handleChange}
              className="border p-2 rounded"
            />
            <input
              type="number"
              name="longitude"
              placeholder="Longitude"
              value={formData.longitude}
              onChange={handleChange}
              className="border p-2 rounded"
            />
          </div>

          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="visited">Visited</option>
            <option value="wishlist">Wishlist</option>
            <option value="ongoing">Ongoing</option>
          </select>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border p-2 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 bg-blue-600 text-white p-2 rounded"
            >
              {isSaving ? "Saving..." : log ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
