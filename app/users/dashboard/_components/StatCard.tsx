import React from "react";

const StatCard = ({ label, value }: { label: string; value: string }) => {
  return (
    <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center min-w-[100px]">
      <p className="text-white text-sm">{label}</p>
      <p className="text-lg font-bold text-white">{value}</p>
    </div>
  );
};

export default StatCard;
