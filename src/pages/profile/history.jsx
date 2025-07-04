import Image from "next/image";
import Link from "next/link";
import { useSelector } from "react-redux";

import placeholder from "@/Assets/profile/placeholder.png";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Layout from "@/components/Layout";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useEffect, useMemo } from "react";
import { getBookingHistory } from "@/utils/https/booking";
import { useRouter } from "next/router";
import { useState } from "react";
import QRCodeGenerator from "@/utils/qrCode";
import ChatbotUI from "@/components/Chatbot";

function History() {
  const router = useRouter();
  const { query } = router;
  const { limit, page } = query;  

  const controller = useMemo(() => new AbortController(), []);
  const userStore = useSelector((state) => state.user.data);
  const image = userStore.image;
  const firstName = userStore.first_name;
  const lastName = userStore.last_name;
  const accessToken = userStore.tokens?.accessToken;
  const userId = userStore.shop?.id;

  const [bookingList, setBookingList] = useState([]);
  const [showQRList, setShowQRList] = useState([]);

  useEffect(() => {
    const params = {
      limit: limit || 20,
      page: page || 1,
    }
    const fetchHistoryOrder = async () => {
      try {
        const res = await getBookingHistory(userId, accessToken, params, controller);
        console.log("res ", res.data.metadata);
        setBookingList(res.data.metadata || []);
      } catch (error) {
        console.log("Error fetching order history:", error);
      }
    }

    fetchHistoryOrder();
  }, [accessToken, userId, limit, page]);
  return (
    <Layout title={"History"}>
      <Header />
      <main className="global-px py-[3.75rem] mt-16 select-none bg-slate-300/20">
        <section className="flex flex-col lg:flex-row gap-8 rounded-md  tracking-wide">
          <div className="flex-1 bg-white">
            <div className="p-10 border-b">
              <div className="flex items-center justify-between">
                <p className="">INFO</p>
                <div className="flex gap-1">
                  <div className="w-1 h-1 bg-primary rounded-full"></div>
                  <div className="w-1 h-1 bg-primary rounded-full"></div>
                  <div className="w-1 h-1 bg-primary rounded-full"></div>
                </div>
              </div>
              <div className="flex flex-col items-center mt-8">
                <div className="w-[8.5rem] h-[8.5rem] rounded-full">
                  <Image
                    src={image || placeholder}
                    width={136}
                    height={136}
                    alt="profile-img"
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <p className="mt-8 font-semibold text-xl">
                  {" "}
                  {firstName || lastName
                    ? firstName && lastName
                      ? `${firstName} ${lastName}`
                      : firstName || lastName
                    : " "}
                </p>
                <p className="text-sm text-neutral">Moviegoers</p>
              </div>
            </div>
            <div className="pt-8 px-8 pb-20">
              <p className="mb-6">Loyalty Points</p>
              <div className="w-[80%] md:w-[45%] lg:w-full bg-gradient-to-r from-primary to-primary/80 bg-gradient-to-right-top px-4 py-6 rounded-lg text-white">
                <p>Moviegoers</p>
                <p className="text-2xl mt-5">
                  {userStore.points} <span className="text-xs">points</span>
                </p>
              </div>
              <p className="mt-8">180 points become a master</p>
              <progress
                className="progress progress-primary w-56"
                value={userStore.points}
                max="180"
              ></progress>
            </div>
          </div>
          <div className="flex-[2.5]">
            <form className="bg-white">
              <div className="flex border-b px-8 py-6 gap-14 text-lg relative">
                <Link href={"/profile"}>
                  <p className="text-[#AAAAAA]">Account Settings</p>
                </Link>
                <div>
                  <p className="w-36">Order History</p>
                  <div className="h-1 w-28 bg-primary absolute bottom-0"></div>
                </div>
                <Link href={"/profile/voucher"}>
                    <p className="text-[#AAAAAA]">Voucher</p>
                </Link>
              </div>

              {bookingList.map((booking, idx) => {
                const startTime = booking.Showtime?.start_time;
                const movieTitle = booking.Movie?.movie_title || "Tên phim không rõ";
                const roomName = booking.Room?.room_name || "Phòng không rõ";
                const showTime = booking.Showtime?.show_date || "Giờ không rõ";
                const imageMovie =   booking.Movie?.movie_image_url; 
                const bookingSeats = booking.booking_seats;
                const statusLabel = booking.booking_status === "confirmed" ? "Ticket in active" : "Ticket used";
                const btnClass = booking.booking_status === "confirmed" ? "btn-primary" : "btn-secondary";

                const isQRVisible = showQRList[idx] || false;

                const toggleQR = () => {
                  const updated = [...showQRList];
                  updated[idx] = !updated[idx]; // toggle trạng thái
                  setShowQRList(updated);
                };

                return (
                  <div key={booking.id} className="mt-4 border rounded-md">
                    <div className="flex items-center justify-between px-4 md:px-8 py-10 border-b">
                      <div>
                        <p className="text-sm text-[#AAAAAA]">
                          {showTime} - {startTime}
                        </p>
                        <h2 className="font-semibold md:text-2xl">{movieTitle}</h2>
                        <p className="text-sm text-gray-500 mt-1">Phòng chiếu: {roomName}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          Số ghế: {bookingSeats.map(seat => `${seat.Seat.seat_row}${seat.Seat.seat_number}`).join(", ")}
                        </p>
                      </div>
                      <div>
                        <Image
                          src={imageMovie}
                          width={174}
                          height={27}
                          className="h-6 md:h-auto"
                          alt="cinema logo"
                        />
                      </div>
                    </div>
                    <div className="flex justify-between items-center px-8 py-4">
                      <button className={`btn ${btnClass} w-[40%] px-0 md:w-[30%]`}>
                        {statusLabel}
                      </button>
                      <div
                        className="flex items-center gap-2 text-[#AAAAAA] cursor-pointer"
                        onClick={toggleQR}
                      >
                        <p>{isQRVisible ? "Hide QR" : "Show QR"}</p>
                        <i className={`bi ${isQRVisible ? "bi-caret-up" : "bi-caret-down"}`}></i>
                      </div>
                    </div>

                    {isQRVisible && (
                      <div className="px-8 pb-6 flex justify-center">
                        <QRCodeGenerator data={`${process.env.NEXT_PUBLIC_APP_URL}/bookings?bookingId=${booking.id}`} />
                      </div>
                    )}
                  </div>
                );
              })}
            </form>
          </div>
        </section>
      </main>
      <Footer />
      <ChatbotUI />
    </Layout>
  );
}

export default History;

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };  
}