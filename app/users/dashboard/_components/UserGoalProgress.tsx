interface UserGoalProgressProps {
  progressPercent: number;
}

export const UserGoalProgress = ({
  progressPercent,
}: UserGoalProgressProps) => (
  <div className="flex flex-col py-2 px-[1.15em] gap-3">
    <div className="flex w-full justify-between items-center">
      <h4 className="text-[#212121] font-bold">Goal Progress</h4>
      <p className="text-[#0583c7]">{progressPercent}% Complete</p>
    </div>
    <div className="w-full bg-gray-300 rounded-full h-2.5 lg:h-4 overflow-hidden">
      <div
        className="bg-gradient-to-r from-[#0583c7] to-[#9f1daf] h-2.5 lg:h-4 rounded-full transition-all duration-500"
        style={{ width: `${progressPercent}%` }}
      />
    </div>
  </div>
);
