"use client";

import React from "react";

interface RecommendationsProps {
  recommendations: string[];
}

export default function Recommendations({
  recommendations,
}: RecommendationsProps) {
  return (
    <div className="space-y-3 mt-6">
      <h3 className="text-xl font-semibold text-green-600">Recommendations</h3>
      {recommendations.length === 0 ? (
        <div className="text-gray-500">No recommendations at the moment.</div>
      ) : (
        recommendations.map((rec, idx) => (
          <div key={idx} className="p-3 bg-green-50 border rounded-xl shadow">
            {rec}
          </div>
        ))
      )}
    </div>
  );
}
