import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { getMedia, deleteMedia } from "../utils/api";
import MediaForm from "../components/Media/MediaForm";
import { PlusCircle, Image, Edit, Trash2 } from "lucide-react";

export default function MediaPage() {
  const { user, loading: authLoading } = useAuth();
  const [mediaItems, setMediaItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentMedia, setCurrentMedia] = useState(null);

  const fetchMediaItems = async () => {
    if (!user) {
      setError("You must be logged in to view media.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await getMedia();
      setMediaItems(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching media items:", err);
      setError("Failed to load media items Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && user) {
      fetchMediaItems();
    } else if (!authLoading && !user) {
      setError("You must  loggedin to view media.");
      setLoading(false);
    }
  }, [user, authLoading]);

  const handleAddMedia = () => {
    setCurrentMedia(null);
    setIsFormOpen(true);
  };

  const handleEditMedia = (media) => {
    setCurrentMedia(media);
    setIsFormOpen(true);
  };

  const handleDeleteMedia = async (id) => {
    if (window.confirm("Are you sure you want to delete media item?")) {
      try {
        await deleteMedia(id);
        fetchMediaItems();
      } catch (err) {
        console.error("Error deleting media item:", err);
        setError("Failed to delete media item Please try again.");
      }
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading media...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:justify-between items-center mb-8">
        <div className="text-center sm:text-left mb-4 sm:mb-0">
          <h1 className="text-3xl font-bold text-gray-900">My Media</h1>
          <p className="text-gray-600 mt-1">
            Document and explore your adventures
          </p>
        </div>
        <div className="w-full sm:w-auto flex justify-center sm:justify-end">
          <button
            onClick={handleAddMedia}
            className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-cyan-600 transition shadow-lg hover:shadow-xl"
          >
            <PlusCircle className="w-5 h-5 mr-2" />
            Add New Media
          </button>
        </div>
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 z-50 flex items-center justify-center overflow-y-auto">
          <div className="relative p-5 w-full max-w-lg bg-white rounded-md shadow-lg">
            <MediaForm
              currentMedia={currentMedia}
              onClose={() => setIsFormOpen(false)}
              onSaveSuccess={() => {
                fetchMediaItems();
                setIsFormOpen(false);
              }}
            />
          </div>
        </div>
      )}

      {mediaItems.length === 0 ? (
        <p className="text-center text-gray-600 mt-10">
          No media items found Click Add New Media to start
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mediaItems.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col"
            >
              {item.imageUrl && (
                <img
                  src={item.imageUrl}
                  alt={item.caption || "Media"}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4 flex-1">
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <Image className="w-4 h-4 mr-1" />
                  <span>Photo</span>
                </div>
                <h2 className="text-lg font-semibold text-gray-800 mb-1">
                  {item.caption}
                </h2>
                {item.location && (
                  <p className="text-sm text-gray-500">
                    Location: {item.location}
                  </p>
                )}
                <p className="text-xs text-gray-400 mt-2">
                  {new Date(item.date).toLocaleDateString()}
                </p>
              </div>
              <div className="p-4 border-t border-gray-200 flex justify-end space-x-2">
                <button
                  onClick={() => handleEditMedia(item)}
                  className="p-2 text-blue-600 rounded-full hover:bg-blue-50 transition"
                  title="Edit"
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDeleteMedia(item._id)}
                  className="p-2 text-red-600 rounded-full hover:bg-red-50 transition"
                  title="Delete"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
