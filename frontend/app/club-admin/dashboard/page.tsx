"use client";
import Link from "next/link";

export default function ClubAdminDashboardPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold">Club Admin Dashboard</h1>
      <div className="grid grid-cols-1 gap-4 mt-8 md:grid-cols-3">
        <Link href="/club-admin/dashboard/events">
          <a className="p-4 text-center bg-white rounded-lg shadow-md hover:bg-gray-200">
            Manage Events
          </a>
        </Link>
        <Link href="/club-admin/dashboard/members">
          <a className="p-4 text-center bg-white rounded-lg shadow-md hover:bg-gray-200">
            Manage Members
          </a>
        </Link>
        <Link href="/club-admin/dashboard/projects">
          <a className="p-4 text-center bg-white rounded-lg shadow-md hover:bg-gray-200">
            Manage Projects
          </a>
        </Link>
      </div>
    </div>
  );
}