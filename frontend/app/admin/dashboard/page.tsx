"use client";
import Link from "next/link";

export default function AdminDashboardPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold">Admin Dashboard</h1>
      <div className="grid grid-cols-1 gap-4 mt-8 md:grid-cols-3">
        <Link href="/admin/dashboard/clubs">
          <a className="p-4 text-center bg-white rounded-lg shadow-md hover:bg-gray-200">
            Manage Clubs
          </a>
        </Link>
        <Link href="/admin/dashboard/users">
          <a className="p-4 text-center bg-white rounded-lg shadow-md hover:bg-gray-200">
            Manage Users
          </a>
        </Link>
        <Link href="/admin/dashboard/submissions">
          <a className="p-4 text-center bg-white rounded-lg shadow-md hover:bg-gray-200">
            Manage Submissions
          </a>
        </Link>
      </div>
    </div>
  );
}