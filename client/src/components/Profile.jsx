import { useState } from "react";
import { Camera, Edit2, MapPin, Calendar } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useTravel } from "../contexts/TravelContext";

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const { travelLogs } = useTravel();
  const [editing, setEditing] = useState(false);

  const [form, setForm] = useState({
    username: user.username || "",
    bio: user.bio || "",
    travelTags: user.travelTags?.join(", ") || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile({
      ...form,
      travelTags: form.travelTags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    });
    setEditing(false);
  };

  const visitedCountries = new Set(travelLogs.map((log) => log.country)).size;
  const totalLikes = travelLogs.reduce((sum, log) => sum + (log.likes || 0), 0);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="h-48 bg-gradient-to-r from-blue-400 via-teal-400 to-green-400" />

        <div className="px-8 pb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end -mt-20 mb-6">
            <div className="mt-4 sm:mt-0 sm:ml-6 flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-800">
                    {user.username}
                  </h1>
                  <p className="text-gray-600">{user.email}</p>
                </div>
                <button
                  onClick={() => setEditing((prev) => !prev)}
                  className="mt-3 sm:mt-0 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 shadow"
                >
                  <Edit2 size={16} />
                  {editing ? "Cancel" : "Edit Profile"}
                </button>
              </div>
            </div>
          </div>

          {editing ? (
            <form onSubmit={handleSubmit} className="space-y-4 mb-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bio
                </label>
                <textarea
                  name="bio"
                  value={form.bio}
                  onChange={handleChange}
                  rows="3"
                  className=" rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none w-full px-4 py-2 border border-gray-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Travel Tags
                </label>
                <input
                  type="text"
                  name="travelTags"
                  value={form.travelTags}
                  onChange={handleChange}
                  placeholder="adventurer, foodie, backpacker"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 shadow-md"
              >
                Save Changes
              </button>
            </form>
          ) : (
            <div className="mb-8">
              {user.bio && (
                <p className="text-gray-700 text-lg mb-3 leading-relaxed">
                  {user.bio}
                </p>
              )}
              <div className="flex flex-wrap gap-2">
                {user.travelTags?.map((tag, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <MapPin className="text-blue-600" size={22} />
                <h3 className="text-gray-600 font-medium">Countries Visited</h3>
              </div>
              <p className="text-3xl font-bold text-blue-600">
                {visitedCountries}
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <Calendar className="text-green-600" size={22} />
                <h3 className="text-gray-600 font-medium">Travel Logs</h3>
              </div>
              <p className="text-3xl font-bold text-green-600">
                {travelLogs.length}
              </p>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <Camera className="text-orange-600" size={22} />
                <h3 className="text-gray-600 font-medium">Total Likes</h3>
              </div>
              <p className="text-3xl font-bold text-orange-600">{totalLikes}</p>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              My Travel Logs
            </h2>
            {travelLogs.length === 0 ? (
              <p className="text-gray-600">No travel logs yet.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {travelLogs.map((log) => (
                  <div
                    key={log.id}
                    className="group relative overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-transform hover:-translate-y-1"
                  >
                    <img
                      src={log.image}
                      alt={log.city}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-4">
                      <h3 className="text-white font-bold text-lg">
                        {log.city}
                      </h3>
                      <p className="text-white/90 text-sm">{log.country}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
