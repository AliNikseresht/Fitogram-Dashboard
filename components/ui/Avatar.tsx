import Image from "next/image";

interface AvatarProps {
  fullName: string;
  avatarUrl: string | null;
  size?: number;
  borderWidth?: number;
}

export const Avatar = ({
  fullName,
  avatarUrl,
  size = 80,
  borderWidth = 4,
}: AvatarProps) => (
  <div
    className="rounded-full overflow-hidden border-white shadow-md"
    style={{ width: size, height: size, borderWidth, borderStyle: "solid" }}
  >
    {avatarUrl ? (
      <Image
        src={avatarUrl}
        alt={`${fullName} avatar`}
        className="w-full h-full object-cover"
        priority
        width={500}
        height={500}
      />
    ) : (
      <div className="flex justify-center items-center w-full h-full bg-indigo-200 text-indigo-600 font-bold text-4xl">
        {fullName.charAt(0).toUpperCase()}
      </div>
    )}
  </div>
);
