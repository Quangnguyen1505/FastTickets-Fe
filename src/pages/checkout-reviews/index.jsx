// pages/checkout-reviews/index.js
"use client";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Layout from "@/components/Layout";
import { useState } from "react";

export default function CheckoutReviews() {
  // Dữ liệu giả lập (bạn có thể lấy từ localStorage hoặc API sau)
  const movie = {
    title: "Dune: Hành Tinh Cát",
    image:
      "https://res.cloudinary.com/shopdevcloud/image/upload/v1744367055/Cinema/movies/1744367050846.jpg", // link ảnh poster
    showtime: "20:00 - 11/04/2025",
    room: "Phòng 5 - Galaxy Nguyễn Du",
    seats: ["D5", "D6"],
    pricePerTicket: 90000,
  };

  const [paymentMethod, setPaymentMethod] = useState("momo");

  const totalPrice = movie.seats.length * movie.pricePerTicket;

  return (
    <>
    <Layout title={"All Movies"}>
        <Header />
        <main className="w-full mt-12 md:mt-[5.5rem] bg-accent py-10">
            <div className="min-h-screen bg-gray-50 py-8 px-4 md:px-10">
                <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="md:flex">
                    {/* Ảnh phim */}
                    <div className="md:w-1/3 w-full bg-gray-100 p-4 flex items-center justify-center">
                        <img
                        src={movie.image}
                        alt={movie.title}
                        className="rounded-xl shadow-md w-full h-auto object-cover"
                        />
                    </div>

                    {/* Thông tin đơn hàng */}
                    <div className="md:w-2/3 w-full p-6 space-y-5">
                        <h2 className="text-2xl font-bold text-gray-800">{movie.title}</h2>
                        <p className="text-sm text-gray-600">
                        <strong>Phòng chiếu:</strong> {movie.room}
                        </p>
                        <p className="text-sm text-gray-600">
                        <strong>Suất chiếu:</strong> {movie.showtime}
                        </p>
                        <p className="text-sm text-gray-600">
                        <strong>Ghế:</strong> {movie.seats.join(", ")}
                        </p>
                        <p className="text-sm text-gray-600">
                        <strong>Số vé:</strong> {movie.seats.length}
                        </p>
                        <p className="text-sm text-gray-600">
                        <strong>Giá mỗi vé:</strong>{" "}
                        {movie.pricePerTicket.toLocaleString()}₫
                        </p>
                        <p className="text-lg font-semibold text-green-600">
                        Tổng: {totalPrice.toLocaleString()}₫
                        </p>

                        {/* Chọn phương thức thanh toán */}
                        <div>
                        <label className="block mb-1 font-medium text-gray-700">
                            Phương thức thanh toán:
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                            onClick={() => setPaymentMethod("momo")}
                            className={`px-4 py-2 rounded-lg border ${
                                paymentMethod === "momo"
                                ? "bg-pink-500 text-white border-pink-500"
                                : "bg-white text-gray-700 border-gray-300"
                            }`}
                            >
                            Ví MoMo
                            </button>
                            <button
                            onClick={() => setPaymentMethod("zalo")}
                            className={`px-4 py-2 rounded-lg border ${
                                paymentMethod === "zalo"
                                ? "bg-blue-500 text-white border-blue-500"
                                : "bg-white text-gray-700 border-gray-300"
                            }`}
                            >
                            ZaloPay
                            </button>
                            <button
                            onClick={() => setPaymentMethod("atm")}
                            className={`px-4 py-2 rounded-lg border ${
                                paymentMethod === "atm"
                                ? "bg-green-500 text-white border-green-500"
                                : "bg-white text-gray-700 border-gray-300"
                            }`}
                            >
                            Thẻ ATM
                            </button>
                            <button
                            onClick={() => setPaymentMethod("credit")}
                            className={`px-4 py-2 rounded-lg border ${
                                paymentMethod === "credit"
                                ? "bg-yellow-500 text-white border-yellow-500"
                                : "bg-white text-gray-700 border-gray-300"
                            }`}
                            >
                            Thẻ Tín Dụng
                            </button>
                        </div>
                        </div>

                        {/* Nút xác nhận */}
                        <div className="pt-4">
                        <button
                            onClick={() => alert("Thanh toán thành công!")}
                            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold text-lg transition-all duration-300"
                        >
                            Xác nhận và Thanh toán
                        </button>
                        </div>
                    </div>
                    </div>
                </div>
            </div>
        </main>
        <Footer />
    </Layout>
    </>
  );
}
