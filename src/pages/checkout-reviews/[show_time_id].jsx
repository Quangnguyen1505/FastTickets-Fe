// pages/checkout-reviews/index.js
"use client";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Layout from "@/components/Layout";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { getCheckout } from "@/utils/https/booking";
import { checkStatusPayment, genUrlPaymentMomo, genUrlPaymentVNPay } from "@/utils/https/payment";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { getAllVouchersByUserId } from "@/utils/https/voucher";
import Image from "next/image";
import ChatbotUI from "@/components/Chatbot";

export default function CheckoutReviews() {
  const router = useRouter();
  const orderStore = useSelector((state) => state.order);
  const controller = useMemo(() => new AbortController(), []);
  const { show_time_id } = router.query;

  const [checkouts, setCheckouts] = useState([]);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [userVouchers, setUserVouchers] = useState([]);
  const [showVoucherPopup, setShowVoucherPopup] = useState(false);

  const [paymentMethod, setPaymentMethod] = useState("momo");
  const userStore = useSelector((state) => state.user.data);
  const accessToken = userStore.tokens?.accessToken;
  const userId = userStore.shop?.id;

  console.log("orderStore ", orderStore)
  useEffect(() => {
    if (show_time_id != orderStore?.show_time_id) {
      router.push("/");
    }
    const fetchShowTimes = async () => {
        const res = await getCheckout(show_time_id, orderStore?.user_order, orderStore?.snacks_order, controller);
        console.log("res ", res.data.metadata);
        setCheckouts(res.data.metadata);
    }
    fetchShowTimes();
  }, [show_time_id])

  useEffect(() => {
    const fetchUpdatedCheckout = async () => {
        if (!show_time_id || !orderStore?.user_order || !orderStore?.snacks_order) return;

        try {
            const discount_id = selectedVoucher?.id || null;
            const res = await getCheckout(show_time_id, orderStore?.user_order, orderStore?.snacks_order, controller, discount_id);
            setCheckouts(res.data.metadata);
        } catch (err) {
            console.error("Lỗi cập nhật thông tin thanh toán sau khi chọn voucher:", err);
        }
    };

    fetchUpdatedCheckout();
  }, [selectedVoucher]);

  useEffect(() => {
    const fetchVouchers = async () => {
        try {
            const response = await getAllVouchersByUserId(userId, accessToken);
            setUserVouchers(response.metadata.discounts);
        } catch (error) {
            console.error("Error fetching vouchers:", error);
        }
    };
    if (userId && accessToken) {
        fetchVouchers();
    }
  }, [userId, accessToken]);

  const handleBooking = async () => {
    const data = {
        show_time_id: checkouts.showtime?.show_time_id,
        user_order: orderStore?.user_order,
        snacks_order: orderStore?.snacks_order,
        discount_id: selectedVoucher?.id || null,
    };
    console.log("data ", data);
    try {
        console.log("paymentMethod ", paymentMethod);
        if(paymentMethod == 'momo') {
            const res = await genUrlPaymentMomo(
                userId, 
                accessToken, 
                data.show_time_id, 
                data.user_order, 
                data.snacks_order,
                controller,
                selectedVoucher?.id ?? null
            );
            const url = res.data.metadata.payUrl;
            console.log("paymentMethod ", url);
            router.push(url);
        }else if(paymentMethod == 'vnpay') {
            const res = await genUrlPaymentVNPay(
                userId, 
                accessToken, 
                data.show_time_id, 
                data.user_order, 
                data.snacks_order,
                controller,
                selectedVoucher?.id ?? null
            );
            const url = res.data.metadata;
            console.log("paymentMethod ", url);
            router.push(url);
        }
    } catch (error) {
      console.log("Error booking tickets:", error);
    }
  }

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
                        {/* <img
                        src={checkouts.showtime?.movie.image_url}
                        alt={checkouts.showtime?.movie.movie_title || "Movie Title"}
                        className="rounded-xl shadow-md w-full h-auto object-cover"
                        /> */}
                        <Image
                            src={checkouts.showtime?.movie.image_url}
                            alt={checkouts.showtime?.movie.movie_title || "Movie Title"}
                            width={300}
                            height={450}
                            className="rounded-xl shadow-md w-full h-auto object-cover"
                            unoptimized={checkouts.showtime?.movie.image_url?.startsWith('http') ? false : undefined}
                            // You may need to configure next.config.js for external domains
                        />
                    </div>

                    {/* Thông tin đơn hàng */}
                    <div className="md:w-2/3 w-full p-6 space-y-5">
                        <h2 className="text-2xl font-bold text-gray-800">{checkouts.showtime?.movie.movie_title || "Movie Title"}</h2>
                        <p className="text-sm text-gray-600">
                            <strong>Phòng chiếu:</strong> {checkouts.showtime?.room.room_name || "-"}
                        </p>
                        <p className="text-sm text-gray-600">
                            <strong>Suất chiếu:</strong> {checkouts.showtime?.start_time || ""} - {checkouts.showtime?.show_date || ""}
                        </p>
                        <p className="text-sm text-gray-600">
                            <strong>Ghế:</strong> {checkouts.user_order?.map((item) => item.location).join(", ")}
                        </p>
                        <p className="text-sm text-gray-600">
                            <strong>Số vé:</strong> {checkouts.user_order?.length}
                        </p>
                        <p className="text-sm text-gray-600">
                            <strong>Đồ uống/Đồ ăn:</strong> {checkouts.snacks_order_detail?.map((item) => item.name).join(", ") || "-"} x{checkouts.snacks_order_detail?.map((item) => item.quantity).join(", ") || "-"}
                        </p>    
                        <p className="text-sm text-gray-600">
                            <strong>Giá vé:</strong>{" "}
                            {checkouts.user_order?.map((item) => item.price).join("vnđ, ")}
                        </p>
                        <p className="text-lg font-semibold text-green-600">
                            Tổng: {checkouts.checkoutPrice}vn₫
                        </p>

                        {/* Chọn voucher */}
                        {/* Nút chọn voucher */}
                        <div className="mt-4">
                            <label className="block mb-1 font-medium text-gray-700">
                                Chọn voucher giảm giá:
                            </label>
                            <button
                                onClick={() => setShowVoucherPopup(true)}
                                className="px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition"
                            >
                                {selectedVoucher ? selectedVoucher.discount_name : "Chọn voucher"}
                            </button>
                        </div>
                        {showVoucherPopup && (
                            <div className="fixed inset-0 z-50 bg-black bg-opacity-30 flex items-center justify-center">
                                <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-lg">
                                <h3 className="text-lg font-semibold mb-4">Chọn Voucher</h3>
                                <div className="max-h-60 overflow-y-auto space-y-3">
                                    {userVouchers.length === 0 ? (
                                    <p className="text-sm text-gray-400">Bạn chưa có voucher nào.</p>
                                    ) : (
                                    userVouchers.map((voucher) => (
                                        <div
                                        key={voucher.id}
                                        className={`cursor-pointer border rounded-lg p-3 hover:border-primary transition-all ${
                                            selectedVoucher?.id === voucher.id ? "border-primary bg-primary/10" : "border-gray-300"
                                        }`}
                                        onClick={() => {
                                            setSelectedVoucher(voucher);
                                            setShowVoucherPopup(false);
                                        }}
                                        >
                                        <p className="text-sm font-semibold text-primary">{voucher.discount_name}</p>
                                        <p className="text-xs text-gray-500">{voucher.discount_description}</p>
                                        <p className="text-xs text-gray-400">
                                            HSD: {new Date(voucher.discount_end_date).toLocaleDateString("vi-VN")}
                                        </p>
                                        </div>
                                    ))
                                    )}
                                </div>
                                <div className="text-right pt-4">
                                    <button
                                    onClick={() => setShowVoucherPopup(false)}
                                    className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
                                    >
                                    Đóng
                                    </button>
                                </div>
                                </div>
                            </div>
                        )}

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
                                    paymentMethod === "vnpay"
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
                            onClick={handleBooking}
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
        <ChatbotUI />
    </Layout>
    </>
  );
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'auth'])),
    },
  };  
}

export async function getStaticPaths() {
    return { paths: [], fallback: 'blocking' };
}