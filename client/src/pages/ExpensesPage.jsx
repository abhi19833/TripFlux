import React, { useState, useEffect, useContext } from "react";
import { useAuth } from "../contexts/AuthContext";
import { getExpenses, deleteExpense } from "../utils/api";
import ExpenseForm from "../components/Expenses/ExpenseForm";
import ExpenseList from "../components/Expenses/ExpenseList";
import { useNavigate } from "react-router-dom";

const ExpensesPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentExpense, setCurrentExpense] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchExpenses();
  }, [user, navigate]);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const data = await getExpenses();
      setExpenses(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching expenses:", err);
      setError("Failed to load expenses.Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure want to delete expense?")) {
      try {
        await deleteExpense(id);
        fetchExpenses();
      } catch (err) {
        console.error("Error deleting expense:", err);
        setError("Failed to delete expense Please try again.");
      }
    }
  };

  const handleEdit = (expense) => {
    setCurrentExpense(expense);
  };

  const handleSave = () => {
    setCurrentExpense(null);
    fetchExpenses();
  };

  if (loading) {
    return (
      <div className="text-center py-8 text-gray-600">Loading expenses...</div>
    );
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-8">Expense Tracker</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <ExpenseForm currentExpense={currentExpense} onSave={handleSave} />
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">Your Expenses</h2>
          <ExpenseList
            expenses={expenses}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        </div>
      </div>
    </div>
  );
};

export default ExpensesPage;
