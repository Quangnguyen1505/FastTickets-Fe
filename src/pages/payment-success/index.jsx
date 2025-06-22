"use client";
import { useEffect, useMemo, useState } from "react";
import { callPaymentVNPayUpdate, checkStatusPayment } from "@/utils/https/payment";
import { useRouter } from "next/router";
import toast from "react-hot-toast";

export default function CheckoutSuccess() {
  const [status, setStatus] = useState("checking...");
  const controller = useMemo(() => new AbortController(), []);
  const router = useRouter();
  const { query } = router;

  useEffect(() => {
    const { orderId } = query 
    if (!orderId) return;
    const pollStatus = async () => {
      try {
        console.log("order Id", orderId);
        const res = await checkStatusPayment(orderId, controller);
        const result = res.data.metadata;
        console.log("result ", result); 
        if (result.resultCode === 0) {
          setStatus("Thanh toán thành công!");
          toast.success("Thanh toán thành công, cảm ơn quý khách đã đặt vé ở cửa hàng FastTickets chúng tôi !");
        } else if (result.resultCode !== 0) {
          setStatus("Thanh toán thất bại!");
          toast.success("Thanh toán thất bại, cảm ơn quý khách đã đặt vé ở cửa hàng FastTickets chúng tôi, chúng tôi sẽ hoàn tiền trong thời gian sớm nhất !");
        } else {
          // Nếu status vẫn pending, poll lại sau 2s
          setTimeout(pollStatus, 2000);
        }
      } catch (error) {
        setStatus("Có lỗi xảy ra, thử lại sau.");
      }
    };

    pollStatus();
  }, [query.orderId]);

  useEffect(() => {
    const {
      vnp_Amount,
      vnp_BankCode,
      vnp_BankTranNo,
      vnp_CardType,
      vnp_OrderInfo,
      vnp_PayDate,
      vnp_TxnRef,
      vnp_SecureHash
    } = query;

    console.log("query", query);

    if (!vnp_Amount || !vnp_BankCode || !vnp_BankTranNo || !vnp_CardType || !vnp_OrderInfo || !vnp_PayDate || !vnp_TxnRef || !vnp_SecureHash) {
      return;
    }
    const fetchPaymentUpdate = async () => {
      try {
        const res = await callPaymentVNPayUpdate(query, controller);
        console.log("res", res);
        setStatus("Thanh toán VNPay thành công!");
        toast.success("Thanh toán VNPay thành công, cảm ơn quý khách đã đặt vé ở cửa hàng FastTickets chúng tôi !");
        console.log("res", res);
      } catch (error) {
        console.error("Error updating payment:", error);
      }
    };
    fetchPaymentUpdate();
  }, [query]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold">Kết quả thanh toán</h1>
        <p>{status}</p>
        <button
          onClick={() => router.push("/")}
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg"
        >
          Quay lại trang chủ
        </button>
      </div>
    </div>
  );
}
