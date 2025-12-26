import React from "react";
import { format } from "date-fns";

const ExpenseList = ({ expenses, onDelete, onEdit }) => {
  if (!expenses || expenses.length === 0) {
    return (
      <p className="text-center text-gray-500 mt-6">No expenses recorded.</p>
    );
  }

  return (
    <div className="space-y-3">
      {expenses.map((expense) => {
        const formattedDate = expense.date
          ? format(new Date(expense.date), "PPP")
          : "N/A";

        return (
          <div
            key={expense._id}
            className="bg-white p-4 rounded-lg shadow-sm flex justify-between items-center"
          >
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {expense.description}
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                Category: {expense.category || "Uncategorized"} | Date:{" "}
                {formattedDate}
              </p>
              {expense.travelLog && (
                <p className="text-gray-500 text-xs mt-1">
                  Travel Log: {expense.travelLog.title}
                </p>
              )}
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-green-600 font-bold">
                ₹{Number(expense.amount).toFixed(2)}
              </span>
              <button
                onClick={() => onEdit(expense)}
                className="text-blue-600 text-sm hover:underline"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(expense._id)}
                className="text-red-600 text-sm hover:underline"
              >
                Delete
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ExpenseList;
