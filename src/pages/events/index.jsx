import MainLayout from "@/components/LayoutEvent";
import { checkEventsliked, getEvents, likeEvent, unlikeEvent } from "@/utils/https/events";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import toast from "react-hot-toast";

export default function HomePage() {
  const { t } = useTranslation('common');
  const controller = useMemo(() => new AbortController(), []);
  const [events, setEvents] = useState([]);
  const [likedEventIds, setLikedEventIds] = useState([]);
  const router = useRouter();

  const userStore = useSelector((state) => state.user.data);
  const token = userStore.tokens?.accessToken;
  const userId = userStore.shop?.id;
  console.log("userStore", token, userId);

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

    const fetchLikedEvents = async () => {
      try {
        const response = await checkEventsliked(userId, token, controller); 
        console.log("response", response);
        setLikedEventIds(response.data.data.map((item) => item.EventID)); 
      } catch (error) {
        console.error("err fetch liked events:", error);
      }
    };

    fetchAllEvents();
    fetchLikedEvents();
  }, []);

  const handleLikeToggle = async (eventId, isCurrentlyLiked, e) => {
    e.stopPropagation();
    if (!token) {
      toast.error("Vui lòng đăng nhập để chọn ghế.");
      router.push("/login");
      return;
    }

    const eventIndex = events.findIndex((event) => event.ID === eventId);
    if (eventIndex === -1) return;

    const targetEvent = events[eventIndex];

    try {
      const response = isCurrentlyLiked
        ? await unlikeEvent(userId, token, eventId, controller)
        : await likeEvent(userId, token, eventId, controller);
      console.log("response", response);
      if (response.data.code === 200) {
        const updatedEvents = [...events];
        updatedEvents[eventIndex] = {
          ...targetEvent,
          IsLiked: !isCurrentlyLiked,
          LikeCount: targetEvent.LikeCount + (isCurrentlyLiked ? -1 : 1),
        };
        setEvents(updatedEvents);

        // Update the likedEventIds state
        setLikedEventIds((prevLikedEventIds) => {
          if (isCurrentlyLiked) {
            return prevLikedEventIds.filter((id) => id !== eventId); // remove from likedEventIds if unlike
          } else {
            return [...prevLikedEventIds, eventId]; // add to likedEventIds if like
          }
        });
      }
    } catch (error) {
      console.error("Lỗi khi xử lý like/unlike:", error);
    }
  };
  

  return (
    <MainLayout>
      <h2 className="text-lg font-bold border-l-4 border-blue-600 pl-3 mb-4 uppercase">
        {t('events.title')}
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
                <button
                  className={`px-2 py-0.5 text-xs rounded 
                    ${likedEventIds.includes(event.ID) ? "bg-red-500 hover:bg-red-600" : "bg-blue-600 hover:bg-blue-700"} 
                    text-white`}
                  onClick={(e) => handleLikeToggle(event.ID, likedEventIds.includes(event.ID), e)}
                >
                  {likedEventIds.includes(event.ID) ? t("events.unlike") : t("events.like")}
                </button>
                <span>{event.LikeCount}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </MainLayout>
  );
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };  
}
