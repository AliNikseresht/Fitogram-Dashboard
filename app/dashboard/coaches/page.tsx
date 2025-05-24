"use client";

export default function CoachesPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">🏋️ Coach Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card title="کاربران من">لیست کاربران با امکان کلیک</Card>
        <Card title="درخواست‌ها">بررسی درخواست‌های جدید</Card>
        <Card title="ساخت برنامه">فرم ساخت رژیم یا تمرین</Card>
        <Card title="گزارش پیشرفت">آمار پیشرفت کاربران</Card>
      </div>
    </div>
  );
}

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white p-4 rounded-xl shadow-md">
      <h2 className="text-lg font-semibold mb-2">{title}</h2>
      <div>{children}</div>
    </div>
  );
}
