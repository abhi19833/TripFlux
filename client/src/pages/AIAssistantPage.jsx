import { useState } from "react";
import { Sparkles, MapPin, Calendar, Backpack, DollarSign } from "lucide-react";
import axios from "axios";
import ReactMarkdown from "react-markdown";

export default function AIAssistantPage() {
  const [activeTab, setActiveTab] = useState("itinerary");

  const tabs = [
    { id: "itinerary", label: "Itinerary Planner", icon: MapPin },
    { id: "packing", label: "Packing List", icon: Backpack },
    { id: "budget", label: "Budget Estimator", icon: DollarSign },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mb-4">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900">
          AI Travel Assistant
        </h2>
        <p className="text-gray-600 mt-2">AI help plan your perfect trip</p>
      </div>

      <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                  : "bg-white text-gray-600 hover:bg-gray-50 shadow"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-8">
        {activeTab === "itinerary" && <ItineraryPlanner />}
        {activeTab === "packing" && <PackingListGenerator />}
        {activeTab === "budget" && <BudgetEstimator />}
      </div>
    </div>
  );
}

function ItineraryPlanner() {
  const [formData, setFormData] = useState({
    destination: "",
    days: "",
    budget: "moderate",
    interests: "",
  });
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.destination || !formData.days || !formData.interests) {
      setResult("Please fill all fields before generating your itinerary.");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:5000/api/ai-assistant",
        { type: "itinerary", ...formData },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResult(res.data.response);
    } catch (err) {
      console.error("Error generating itinerary", err);
      setResult("Failed to generate itinerary.Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3 className="text-2xl font-bold text-gray-900 mb-6">
        Generate Trip Itinerary
      </h3>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Destination"
            value={formData.destination}
            onChange={(e) =>
              setFormData({ ...formData, destination: e.target.value })
            }
          />
          <InputField
            label="Number of Days"
            type="number"
            value={formData.days}
            onChange={(e) => setFormData({ ...formData, days: e.target.value })}
          />
        </div>

        <SelectField
          label="Travel Style"
          value={formData.budget}
          onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
          options={[
            { value: "budget", label: "Budget Traveler" },
            { value: "moderate", label: "Moderate" },
            { value: "luxury", label: "Luxury" },
          ]}
        />

        <TextArea
          label="Interests & Activities"
          value={formData.interests}
          onChange={(e) =>
            setFormData({ ...formData, interests: e.target.value })
          }
        />

        <SubmitButton loading={loading} text="Generate Itinerary" />
      </form>

      {result && (
        <ResultBox
          title="AI-Generated Itinerary"
          icon={<Sparkles className="w-5 h-5 text-purple-600" />}
          content={result}
        />
      )}
    </div>
  );
}

function PackingListGenerator() {
  const [formData, setFormData] = useState({
    destination: "",
    days: "",
    season: "summer",
    activities: "",
  });
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult("");
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:5000/api/ai-assistant",
        { type: "packing-list", ...formData },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResult(res.data.response);
    } catch (err) {
      console.error("Error generating packing list:", err);
      setResult("Failed to generate packing list. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3 className="text-2xl font-bold text-gray-900 mb-6">
        Generate Packing List
      </h3>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Destination"
            value={formData.destination}
            onChange={(e) =>
              setFormData({ ...formData, destination: e.target.value })
            }
          />
          <InputField
            label="Trip Duration"
            type="number"
            value={formData.days}
            onChange={(e) => setFormData({ ...formData, days: e.target.value })}
          />
        </div>

        <SelectField
          label="Season"
          value={formData.season}
          onChange={(e) => setFormData({ ...formData, season: e.target.value })}
          options={[
            { value: "spring", label: "Spring" },
            { value: "summer", label: "Summer" },
            { value: "fall", label: "Fall" },
            { value: "winter", label: "Winter" },
          ]}
        />

        <TextArea
          label="Planned Activities"
          value={formData.activities}
          onChange={(e) =>
            setFormData({ ...formData, activities: e.target.value })
          }
        />

        <SubmitButton loading={loading} text="Generate Packing List" />
      </form>

      {result && (
        <ResultBox
          title="AI-Generated Packing List"
          icon={<Backpack className="w-5 h-5 text-purple-600" />}
          content={result}
        />
      )}
    </div>
  );
}

function BudgetEstimator() {
  const [formData, setFormData] = useState({
    destination: "",
    days: "",
    style: "moderate",
    travelers: "1",
  });
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult("");

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:5000/api/ai-assistant",
        { type: "budget-estimate", ...formData },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResult(res.data.response);
    } catch (err) {
      console.error("Error estimating budget:", err);
      setResult("Failed to estimate budget. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3 className="text-2xl font-bold text-gray-900 mb-6">
        Estimate Travel Budget
      </h3>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Destination"
            value={formData.destination}
            onChange={(e) =>
              setFormData({ ...formData, destination: e.target.value })
            }
          />
          <InputField
            label="Number of Days"
            type="number"
            value={formData.days}
            onChange={(e) => setFormData({ ...formData, days: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SelectField
            label="Travel Style"
            value={formData.style}
            onChange={(e) =>
              setFormData({ ...formData, style: e.target.value })
            }
            options={[
              { value: "backpacking", label: "Backpacking" },
              { value: "budget", label: "Budget" },
              { value: "moderate", label: "Moderate" },
              { value: "luxury", label: "Luxury" },
            ]}
          />
          <InputField
            label="Number of Travelers"
            type="number"
            value={formData.travelers}
            onChange={(e) =>
              setFormData({ ...formData, travelers: e.target.value })
            }
          />
        </div>

        <SubmitButton loading={loading} text="Estimate Budget" />
      </form>

      {result && (
        <ResultBox
          title="AI-Generated Budget Estimate"
          icon={<DollarSign className="w-5 h-5 text-purple-600" />}
          content={result}
        />
      )}
    </div>
  );
}

function InputField({ label, ...props }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <input
        {...props}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
      />
    </div>
  );
}

function SelectField({ label, options, ...props }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <select
        {...props}
        className=" rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition w-full px-4 py-3 border border-gray-300"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function TextArea({ label, ...props }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <textarea
        {...props}
        rows="3"
        className="border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none transition w-full px-4 py-3"
      />
    </div>
  );
}

function SubmitButton({ loading, text }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition disabled:opacity-50 shadow-lg"
    >
      {loading ? "Processing..." : text}
    </button>
  );
}

function ResultBox({ title, icon, content }) {
  return (
    <div className="mt-8 p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
      <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
        {icon}
        <span>{title}</span>
      </h4>
      <div className="prose max-w-none">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </div>
  );
}
