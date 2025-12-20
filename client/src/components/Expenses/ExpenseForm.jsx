import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { createExpense, updateExpense, getTravelLogs } from "../../utils/api";

const ExpenseForm = ({ currentExpense, onSave }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    category: "",
    date: "",
    travelLog: "",
  });
  const [travelLogs, setTravelLogs] = useState([]);
  const [loadingLogs, setLoadingLogs] = useState(true);
  const [logError, setLogError] = useState("");

  useEffect(() => {
    const loadLogs = async () => {
      try {
        const logs = await getTravelLogs();
        setTravelLogs(logs);
      } catch (err) {
        console.error("Failed to fetch travels log:", err);
        setLogError("Could not load travels log.");
      } finally {
        setLoadingLogs(false);
      }
    };
    loadLogs();
  }, []);

  useEffect(() => {
    if (currentExpense) {
      setFormData({
        description: currentExpense.description || "",
        amount: currentExpense.amount || "",
        category: currentExpense.category || "",
        date: currentExpense.date ? currentExpense.date.slice(0, 10) : "",
        travelLog: currentExpense.travelLog || "",
      });
    } else {
      setFormData({
        description: "",
        amount: "",
        category: "",
        date: "",
        travelLog: "",
      });
    }
  }, [currentExpense]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      if (currentExpense) {
        await updateExpense(currentExpense._id, formData);
      } else {
        await createExpense(formData);
      }
      onSave?.();
      setFormData({
        description: "",
        amount: "",
        category: "",
        date: "",
        travelLog: "",
      });
    } catch (err) {
      console.error("Error saving expense:", err);
      alert("Something went wrong saving, Try again.");
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-5 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">
        {currentExpense ? "Edit Expense" : "Add Expense"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="description" className="block text-gray-700 mb-1">
            Description
          </label>
          <input
            type="text"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="e.g. Dinner at local café"
            className="w-full  focus:ring-2 focus:ring-blue-500 outline-none px-3 py-2 border rounded-lg"
            required
          />
        </div>

        <div>
          <label htmlFor="amount" className="block text-gray-700 mb-1">
            Amount
          </label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="e.g. 45.50"
            min="0"
            step="0.01"
            className="w-full focus:ring-2 focus:ring-blue-500 outline-none  px-3 py-2 border rounded-lg "
            required
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-gray-700 mb-1">
            Category
          </label>
          <input
            type="text"
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder="e.g. Food, Transport, Stay"
            className="w-full focus:ring-2 focus:ring-blue-500 outline-none px-3 py-2 border rounded-lg "
            required
          />
        </div>

        <div>
          <label htmlFor="date" className="block text-gray-700 mb-1">
            Date
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full  focus:ring-2 focus:ring-blue-500 outline-none px-3 py-2 border rounded-lg"
            required
          />
        </div>

        <div>
          <label htmlFor="travelLog" className="block text-gray-700 mb-1">
            Travel Log
          </label>
          {loadingLogs ? (
            <p className="text-gray-500 text-sm">Loading travel logs...</p>
          ) : logError ? (
            <p className="text-red-500 text-sm">{logError}</p>
          ) : (
            <select
              id="travelLog"
              name="travelLog"
              value={formData.travelLog}
              onChange={handleChange}
              className="w-full  focus:ring-2 focus:ring-blue-500 outline-none px-3 py-2 border rounded-lg"
              required={!currentExpense}
            >
              <option value="">Select a Travel Log</option>
              {travelLogs.map((log) => (
                <option key={log._id} value={log._id}>
                  {log.title}
                </option>
              ))}
            </select>
          )}
        </div>

        <button
          type="submit"
          disabled={!formData.description || !formData.amount}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          {currentExpense ? "Update Expense" : "Add Expense"}
        </button>
      </form>
    </div>
  );
};

export default ExpenseForm;
