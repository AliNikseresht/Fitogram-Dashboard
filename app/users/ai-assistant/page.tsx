"use client";

import React from "react";
import AiAssistantChat from "./_components/AiAssistantChat";
import { useUserProfile } from "@/hooks/useUserProfile";
import CustomLoadingBars from "@/components/ui/loadings/CustomLoadingBars";

const AiAssistantPage = () => {
  const { profile, loading, error } = useUserProfile();

  if (loading) return <CustomLoadingBars />;
  if (error) return <div className="text-red-500">Error: {error}</div>;
  if (!profile)
    return <div className="text-red-500">No profile data found.</div>;

  return <AiAssistantChat userId={profile.id} />;
};

export default AiAssistantPage;
