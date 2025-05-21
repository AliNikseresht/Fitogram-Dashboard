interface AvatarProps {
  fullName: string;
  avatarUrl: string | null;
  size?: number;
}

export const Avatar = ({ fullName, avatarUrl, size = 80 }: AvatarProps) => (
  <div
    className={`w-${size} h-${size} rounded-full overflow-hidden border-4 border-indigo-500 shadow-md`}
    style={{ width: size, height: size }}
  >
    {avatarUrl ? (
      <img
        src={avatarUrl}
        alt={`${fullName} avatar`}
        className="w-full h-full object-cover"
      />
    ) : (
      <div className="flex justify-center items-center w-full h-full bg-indigo-200 text-indigo-600 font-bold text-4xl">
        {fullName.charAt(0).toUpperCase()}
      </div>
    )}
  </div>
);
