import React, { useState, useContext, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { createMedia, updateMedia } from "../../utils/api";
import { useNavigate } from "react-router-dom";

import { X, Image, MapPin } from "lucide-react";

const MediaForm = ({ currentMedia, onClose, onSaveSuccess }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    imageUrl: "",
    caption: "",
    location: "",
    isPublic: false,
  });
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    if (currentMedia) {
      setFormData({
        imageUrl: currentMedia.imageUrl || "",
        caption: currentMedia.caption || "",
        location: currentMedia.location || "",
        isPublic: currentMedia.isPublic || false,
      });
    } else {
      setFormData({
        imageUrl: "",
        caption: "",
        location: "",
        isPublic: false,
      });
    }
    setSelectedFile(null);
  }, [currentMedia]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (name === "photo") {
      setSelectedFile(files[0]);
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!user) {
      navigate("/login");
      return;
    }

    const dataToSend = new FormData();
    dataToSend.append("isPublic", formData.isPublic);

    if (selectedFile) {
      dataToSend.append("photo", selectedFile);
    } else if (currentMedia && currentMedia.imageUrl) {
    } else {
      setError("Please select a photos to uploads.");
      setLoading(false);
      return;
    }
    dataToSend.append("caption", formData.caption);
    dataToSend.append("location", formData.location);

    try {
      if (currentMedia) {
        await updateMedia(currentMedia._id, dataToSend);
      } else {
        await createMedia(dataToSend);
      }
      onSaveSuccess();
      onClose();
    } catch (err) {
      console.error("Error saving media:", err.response?.data || err.message);
      setError(
        err.response?.data?.msg || "Error saving media. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" bg-white shadow-md rounded-lg max-w-lg mx-auto p-4">
      <h2 className="text-2xl font-bold mb-3">
        {currentMedia ? "Edit Photo" : "Add New Photo"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="photo" className="block text-gray-700">
            {" "}
            Upload Photo
          </label>
          <div className="relative">
            <Image className=" transform -translate-y-1/2 w-5 h-5 text-gray-400 absolute left-3 top-1/2" />
            <input
              type="file"
              id="photo"
              name="photo"
              onChange={handleChange}
              accept="image/*"
              className="w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pl-11 pr-4 py-3  outline-none transition file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
          {currentMedia && currentMedia.imageUrl && !selectedFile && (
            <p className="text-sm text-gray-500 mt-1">
              Current photo:{" "}
              <a
                href={currentMedia.imageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                View
              </a>
            </p>
          )}
          {selectedFile && (
            <p className="text-sm text-gray-600 mt-1">
              Selected: {selectedFile.name}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="caption" className="block text-gray-700">
            Description (optional)
          </label>
          <input
            type="text"
            id="caption"
            name="caption"
            value={formData.caption}
            onChange={handleChange}
            className="w-full  focus:outline-none focus:ring-2  focus:ring-blue-500 px-3 py-2 border rounded-lg"
            placeholder="Add a description..."
          />
        </div>
        <div>
          <label htmlFor="location" className="block text-gray-700">
            Location (optional)
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full  focus:outline-none focus:ring-2 focus:ring-blue-500 px-3 py-2 border rounded-lg"
            placeholder="e.g., Paris, France"
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            name="isPublic"
            id="isPublic"
            checked={formData.isPublic}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label
            htmlFor="isPublic"
            className="ml-2 block text-sm text-gray-900"
          >
            Share to Community Feeds
          </label>
        </div>

        <button
          type="submit"
          className=" hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 w-full bg-blue-600 text-white py-2 px-4 rounded-lg"
          disabled={loading}
        >
          {loading
            ? "Saving......"
            : currentMedia
            ? "Update Photos"
            : "Add Photos"}{" "}
        </button>
      </form>
    </div>
  );
};

export default MediaForm;
