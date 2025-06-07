"use client";

type Props = {
  onChange: (file: File | null) => void;
};

const AvatarUpload = ({ onChange }: Props) => (
  <div className="mb-4 text-xs lg:text-sm">
    <label className="block mb-1 font-medium">Avatar</label>
    <input
      type="file"
      accept="image/*"
      onChange={(e) => onChange(e.target.files?.[0] || null)}
      className="w-full"
    />
  </div>
);

export default AvatarUpload;
