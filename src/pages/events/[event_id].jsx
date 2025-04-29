import MainLayout from "@/components/LayoutEvent";
import { getEventById } from "@/utils/https/events";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";

export default function EventDetail() {
  const controller = useMemo(() => new AbortController(), []);
  const router = useRouter();
  const { event_id } = router.query;
  const [event, setEvent] = useState(null);

  useEffect(() => {
    if (!event_id) return;

    const fetchEvent = async () => {
      try {
        const response = await getEventById(event_id, controller);
        setEvent(response.data.data);
      } catch (error) {
        console.error("Error fetching event detail:", error);
      }
    };

    fetchEvent();
  }, [event_id]);

  if (!event) return (
    <MainLayout>
      <div className="flex justify-center items-center h-96">
        <span className="text-lg font-semibold">Đang tải sự kiện...</span>
      </div>
    </MainLayout>
  );

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6 leading-tight">
          {event.EventName}
        </h1>

        {event.EventImageUrl && (
            <div className="flex justify-center mb-6">
                <img
                src={event.EventImageUrl}
                alt={event.EventName}
                className="max-w-3xl w-1/2 h-auto rounded-md shadow"
                />
            </div>
        )}

        <div className="text-lg leading-relaxed text-gray-700 whitespace-pre-line">
          {event.EventDescription}
        </div>
      </div>
    </MainLayout>
  );
}
