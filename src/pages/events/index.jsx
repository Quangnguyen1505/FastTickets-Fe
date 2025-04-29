import MainLayout from "@/components/LayoutEvent";
import { getEvents } from "@/utils/https/events";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";

export default function HomePage() {
  const controller = useMemo(() => new AbortController(), []);
  const [events, setEvents] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchAllEvents = async () => {
      try {
        const response = await getEvents({ limit: 50, page: 1 }, controller);
        console.log("res e ", response.data);
        setEvents(response.data.data || []);
      } catch (error) {
        console.error("err fetch events:", error);
      }
    };

    fetchAllEvents();
  }, []);

  return (
    <MainLayout>
      <h2 className="text-lg font-bold border-l-4 border-blue-600 pl-3 mb-4 uppercase">
        PHIM HAY THÁNG
      </h2>
      <div className="flex flex-col gap-6">
        {events.map((event) => (
          <div key={event.ID} className="flex gap-4 border-b pb-4 cursor-pointer" onClick={() => router.push(`/events/${event.ID  }`)}>
            <div className="w-48 h-28 shrink-0 overflow-hidden rounded">
              <Image
                src={event.EventImageUrl}
                alt={event.EventName}
                width={192}
                height={112}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-700 line-clamp-3">{event.EventDescription}</p>
              <div className="mt-2 text-sm text-gray-600 flex items-center gap-2">
                <button className="bg-blue-600 text-white px-2 py-0.5 text-xs rounded hover:bg-blue-700">
                  Thích
                </button>
                <span>0</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </MainLayout>
  );
}
