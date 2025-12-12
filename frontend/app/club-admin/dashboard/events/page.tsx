"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/MyContext";
import { Event } from "@/lib/types";
import { Button } from "@/components/ui/button";

export default function ManageEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const { token } = useAuth();
  const clubId = 1; // Placeholder

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/api/clubs/${clubId}/events`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          setEvents(data);
        }
      } catch (error) {
        console.error("Failed to fetch events", error);
      }
    };

    if (token) {
      fetchEvents();
    }
  }, [token]);

  return (
    <div className="container mx-auto">
      <h1 className="my-8 text-4xl font-bold">Manage Events</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-gray-500 border-b">Title</th>
              <th className="px-6 py-3 text-left text-gray-500 border-b">Description</th>
              <th className="px-6 py-3 text-left text-gray-500 border-b">Date</th>
              <th className="px-6 py-3 text-left text-gray-500 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event.id}>
                <td className="px-6 py-4 border-b">{event.title}</td>
                <td className="px-6 py-4 border-b">{event.description}</td>
                <td className="px-6 py-4 border-b">{event.date}</td>
                <td className="px-6 py-4 border-b">
                  <Button className="mr-2">Edit</Button>
                  <Button variant="destructive">Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
