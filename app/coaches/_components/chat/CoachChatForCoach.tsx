"use client";

import React, { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { toast } from "react-toastify";
import ChatWindow from "@/components/ui/ChatWindow";
import Image from "next/image";

interface Student {
  id: string;
  full_name: string;
  avatar_url?: string;
}

const CoachChatForCoach = () => {
  const supabase = createClientComponentClient();
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
  }, [supabase]);

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

  if (!userId) return <p>Loading user...</p>;

  return (
    <div className="flex h-full">
      <div className="w-44 border-r border-gray-300 overflow-y-auto p-2">
        {students.length === 0 && <p>No students found.</p>}
        <ul>
          {students.map((student) => (
            <li
              key={student.id}
              className={`p-2 cursor-pointer ${
                selectedStudent?.id === student.id
                  ? "bg-blue-200 font-bold"
                  : ""
              }`}
              onClick={() => setSelectedStudent(student)}
            >
              <Image
                src={
                  student.avatar_url?.startsWith("http")
                    ? student.avatar_url
                    : student.avatar_url
                    ? `/avatars/${student.avatar_url}`
                    : "/default-avatar.png"
                }
                alt={student.full_name}
                className="w-10 h-10 rounded-full inline-block mr-2 object-cover border-2 border-gray-300"
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
