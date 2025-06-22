'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from "next/router";
import { updateBookingStatus } from '@/utils/https/booking';
import { useSelector } from 'react-redux';

export default function BookingQRPage() {
  const router = useRouter();
  const [message, setMessage] = useState('Đang xử lý...');
  const [bookingData, setBookingData] = useState(null);

  const userStore = useSelector((state) => state.user.data);
  const accessToken = userStore.tokens?.accessToken;
  const userId = userStore.shop?.id;

  const printRef = useRef();

  useEffect(() => {
    if (!router.isReady) return;

    const { bookingId } = router.query;
    if (!bookingId) {
      setMessage('Thiếu thông tin booking.');
      return;
    }

    const updateBooking = async () => {
      try {
        const res = await updateBookingStatus(bookingId, accessToken, userId);
        setBookingData(res.data.metadata);
        setMessage('In vé thành công!');
      } catch (error) {
        console.error(error);
        setMessage('Có lỗi xảy ra khi cập nhật booking.');
      }
    };

    updateBooking();
  }, [router.isReady]);

  const handlePrint = () => {
    window.print();
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' });

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      {!bookingData ? (
        <h1 className="text-xl font-semibold">{message}</h1>
      ) : (
        <>
          <div ref={printRef} className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg print:w-full print:shadow-none print:border print:border-black">
            <h2 className="text-2xl font-bold text-center mb-4">🎟️ Vé Xem Phim</h2>

            <div className="space-y-2 text-lg">
              <h4 className="font-bold">Fastticket Xô Viết Nghệ Tĩnh</h4>
              <h6 className="italic">11 Xô Viết Nghệ Tĩnh, ...</h6>
              <h6 className="italic">
                {new Date().toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' })}
              </h6>

              <hr className="my-2" />

              <div><strong>🎬 Phim:</strong> {bookingData.Movie?.movie_title}</div>
              <div><strong>🪑 Phòng:</strong> {bookingData.Room?.room_name}</div>
              <div><strong>🕐 Ngày chiếu:</strong> {formatDate(bookingData.Showtime?.show_date)}</div>

              <div className="flex justify-between">
                <div><strong>📍 Ghế:</strong> {bookingData.booking_seats.map(seat => `${seat.Seat?.seat_row}${seat.Seat?.seat_number}`).join(', ')}</div>
                <div className="mr-5"><strong>Số lượng:</strong> {bookingData.booking_seats.length}</div>
              </div>

              <div><strong>💳 Thanh toán:</strong> {bookingData.payment_message} ({bookingData.payment_method})</div>
              <div><strong>💰 Tổng tiền:</strong> {formatCurrency(bookingData.booking_total_checkout)}</div>
              <div><strong>📄 Trạng thái:</strong> {bookingData.booking_status === 'completed' ? 'Đã hoàn thành' : 'Chưa hoàn thành'}</div>
            </div>
          </div>

          {/* Nút in chỉ hiển thị khi không in */}
          <button
            onClick={handlePrint}
            className="mt-6 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 print:hidden"
          >
            In vé
          </button>
        </>
      )}
    </div>
  );
}
