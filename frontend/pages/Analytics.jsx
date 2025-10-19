import React, { useEffect, useState } from "react";
import { FileText, Tag, Calendar, TrendingUp } from "lucide-react";
import Navbar from "../src/components/Navbar";

const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:5000";

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        if (!userId || !token) {
          throw new Error("User not authenticated. Missing token or userId.");
        }

        const res = await fetch(`${BASE_URL}/api/notes/analytics?userId=${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (!data.success) throw new Error("Failed to load analytics data.");

        setAnalytics(data.data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [userId, token]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-40 text-purple-600 font-medium">
        Loading analytics...
      </div>
    );

  if (error)
    return (
      <div className="text-red-500 text-center font-medium mt-6">
        Error: {error}
      </div>
    );

  return (
    <div className="min-h-screen bg-purple-50">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-8 text-gray-800">
        <h1 className="text-3xl font-bold text-purple-700 mb-1">Analytics</h1>
        <p className="text-gray-600 mb-8 text-sm">
          Insights about your notes and tags
        </p>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {/* Total Notes */}
          <div className="bg-white rounded-xl shadow p-4 flex justify-between items-center border border-purple-100">
            <div>
              <h2 className="text-sm font-semibold text-gray-700">
                Total Notes
              </h2>
              <p className="text-2xl font-bold text-purple-600 mt-1">
                {analytics.totalNotes}
              </p>
              <p className="text-xs text-gray-500">All your notes</p>
            </div>
            <FileText className="text-purple-500 w-8 h-8" />
          </div>

          {/* Unique Tags */}
          <div className="bg-white rounded-xl shadow p-4 flex justify-between items-center border border-purple-100">
            <div>
              <h2 className="text-sm font-semibold text-gray-700">
                Unique Tags
              </h2>
              <p className="text-2xl font-bold text-purple-600 mt-1">
                {analytics.uniqueTagsCount}
              </p>
              <p className="text-xs text-gray-500">Different tags used</p>
            </div>
            <Tag className="text-purple-500 w-8 h-8" />
          </div>

          {/* Recent Note */}
          <div className="bg-white rounded-xl shadow p-4 flex justify-between items-center border border-purple-100">
            <div>
              <h2 className="text-sm font-semibold text-gray-700">
                Recent Note
              </h2>
              <p className="text-2xl font-bold text-purple-600 mt-1">1</p>
              <p className="text-xs text-gray-500">
                Created on{" "}
                {new Date(analytics.recentNote.createdAt).toLocaleDateString()}
              </p>
            </div>
            <Calendar className="text-purple-500 w-8 h-8" />
          </div>
        </div>

        {/* Top Tags */}
        <div className="bg-white rounded-xl shadow p-6 border border-purple-100">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="text-purple-600" />
            <h2 className="text-xl font-semibold text-gray-900">Top Tags</h2>
          </div>
          <p className="text-gray-600 mb-4 text-sm">
            Most frequently used tags in your notes
          </p>

          <div className="flex flex-wrap gap-3">
            {analytics.topTags.map((tag, i) => (
              <div
                key={i}
                className="bg-purple-100 text-purple-700 px-3 py-2 rounded-md font-medium flex items-center gap-2 shadow-sm text-sm"
              >
                {tag.tag}
                <span className="text-xs bg-purple-200 px-2 py-0.5 rounded-md">
                  {tag.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
