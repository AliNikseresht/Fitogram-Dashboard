"use client";

import Link from "next/link";
import React from "react";
import CustomLoadingBars from "@/components/ui/loadings/CustomLoadingBars";
import { useUserProfile } from "@/hooks/useUserProfile";
import { IoIosSend } from "react-icons/io";

const CoachChat = () => {
  const { profile, loading, error } = useUserProfile();

  if (loading) return <CustomLoadingBars />;
  if (error) return <div className="text-red-500">Error: {error}</div>;
  if (!profile)
    return <div className="text-red-500">No profile data found.</div>;

  return (
    <div className="bg-[#fff] p-4 rounded-xl w-full max-w-sm flex flex-col h-full">
      <p className="text-gray-600 mb-4 font-bold">Coach Chat</p>
      {profile.coach ? (
        <div className="space-y-3">
          <div className="flex gap-2 items-center">
            <div className="w-12 h-12 rounded-full bg-gray-900"></div>
            <div className="flex flex-col">
              <p className="font-medium text-sm">{profile.coach.full_name}</p>
              <p className="font-medium text-xs text-[#5dd589]">Online now</p>
            </div>
          </div>

          <div className="">
            <div className="h-32 overflow-y-auto rounded p-2 bg-[#f9fbfb] mb-2">
              <p className="text-gray-500 text-sm">No messages yet.</p>
            </div>
            <div className="flex items-center">
              <input
                type="text"
                placeholder="Type your message..."
                className="w-full bg-[#f3f4f6] rounded-s-lg px-3 py-2 text-sm focus:outline-none"
              />
              <p className="bg-[#0284c7] p-[0.4em] rounded-r-lg cursor-pointer">
                <IoIosSend color="#fff" size={23} />
              </p>
            </div>
          </div>
        </div>
      ) : profile.status === "pending_coach_request" ? (
        <p className="font-medium text-yellow-600">Coach request is pending</p>
      ) : (
        <div className="space-y-2">
          <p className="font-medium text-red-600 text-sm">
            You haven`t selected a coach yet. Click below to choose one.
          </p>
          <Link
            href="/users/coach"
            className="inline-block bg-[#0284c7] text-white px-4 py-1.5 text-sm rounded hover:bg-[#027bc7] duration-200"
          >
            Choose a Coach
          </Link>
        </div>
      )}
    </div>
  );
};

export default CoachChat;
