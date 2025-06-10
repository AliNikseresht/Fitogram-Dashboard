"use client";

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ChatWindow from "@/components/ui/ChatWindow";
import Image from "next/image";
import CustomLoadingBars from "@/components/ui/loadings/CustomLoadingBars";
import supabase from "@/libs/supabaseClient";

interface Student {
  id: string;
  full_name: string;
  avatar_url?: string;
}

const CoachChatForCoach = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) setUserId(user.id);
    }
    fetchUser();
  }, []);

  useEffect(() => {
    async function fetchStudents() {
      if (!userId) return;
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, avatar_url")
        .eq("coach_id", userId);
      if (error) {
        toast.error("Failed to load students");
        return;
      }
      setStudents(data ?? []);
      if (data && data.length > 0) setSelectedStudent(data[0]);
    }
    fetchStudents();
  }, [userId, supabase]);

  if (!userId) return <CustomLoadingBars />;

  return (
    <div className="flex w-full justify-between h-full bg-[#fff] p-4 rounded-xl shadow-md">
      <div className="w-auto overflow-y-auto p-2">
        {students.length === 0 && <p>No students found.</p>}
        <ul className="flex items-center gap-2">
          {students.map((student) => (
            <li
              key={student.id}
              className={`flex items-center gap-1 p-2 rounded-lg text-sm transition hover:bg-[#e1f1fe] cursor-pointer ${
                selectedStudent?.id === student.id
                  ? "bg-blue-100 text-[#0369a1] font-bold"
                  : ""
              }`}
              onClick={() => setSelectedStudent(student)}
            >
              <Image
                src={
                  student.avatar_url && student.avatar_url.trim() !== ""
                    ? student.avatar_url.startsWith("http")
                      ? student.avatar_url
                      : `/avatars/${student.avatar_url}`
                    : "/default-avatar.png"
                }
                alt={student.full_name || "Student Avatar"}
                className="w-10 h-10 rounded-full inline-block mr-2 object-cover border-2 border-[#bababa]"
                width={48}
                height={48}
              />

              {student.full_name}
            </li>
          ))}
        </ul>
      </div>

      {selectedStudent && userId && (
        <ChatWindow
          userId={userId}
          otherUserId={selectedStudent.id}
          otherUserAvatar={
            selectedStudent.avatar_url?.startsWith("http")
              ? selectedStudent.avatar_url
              : selectedStudent.avatar_url
              ? `/avatars/${selectedStudent.avatar_url}`
              : "/default-avatar.png"
          }
          otherUserName={selectedStudent.full_name}
          myId={userId}
        />
      )}

      {!selectedStudent && (
        <div className="flex items-center justify-center flex-1 text-gray-500">
          Select a student to chat
        </div>
      )}
    </div>
  );
};

export default CoachChatForCoach;
