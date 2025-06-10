"use client";

import React from "react";

interface RecommendationsProps {
  recommendations: string[];
}

export default function Recommendations({
  recommendations,
}: RecommendationsProps) {
  return (
    <div className="space-y-3 rounded-xl bg-white p-4 shadow-md w-full">
      <h3 className="text-xl font-semibold text-green-600">Recommendations</h3>
      {recommendations.length === 0 ? (
        <div className="text-gray-500">No recommendations at the moment.</div>
      ) : (
        recommendations.map((rec, idx) => (
          <div
            key={idx}
            className="p-3 bg-white border border-[#bababa] rounded-xl shadow text-xs lg:text-sm"
          >
            {rec}
          </div>
        ))
      )}
    </div>
  );
}
