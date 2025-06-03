import Image from "next/image";
import Link from "next/link";
import { useSelector } from "react-redux";

import placeholder from "@/Assets/profile/placeholder.png";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Layout from "@/components/Layout";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useEffect, useState } from "react";
import { claimVoucher, getAllVouchers, getAllVouchersByUserId } from "@/utils/https/voucher";
import { handleClientScriptLoad } from "next/script";

function Voucher() {
  const userStore = useSelector((state) => state.user.data);
  const token = userStore.tokens?.accessToken;
  const userId = userStore.shop?.id;
  const image = userStore.image;
  const firstName = userStore.first_name;
  const lastName = userStore.last_name;

  const [voucherUser, setVoucherUser] = useState([]);
  const [voucherShop, setVoucherShop] = useState([]);

  useEffect(() => {
    const fetchAllVouchers = async () => {
      try {
        const response = await getAllVouchersByUserId(userId, token);
        const responseAllVoucher = await getAllVouchers(userId, token);

        const userVouchers = response?.metadata?.discounts || [];
        const allShopVouchers = responseAllVoucher?.metadata?.discounts || [];

        const userVoucherIds = new Set(userVouchers.map(v => v.id));
        const filteredShopVouchers = allShopVouchers.filter(v => !userVoucherIds.has(v.id));

        setVoucherUser(userVouchers);
        setVoucherShop(filteredShopVouchers);
      } catch (error) {
        console.error("Error fetching vouchers:", error);
      }
    };
    if (userId && token) {
      fetchAllVouchers();
    }
  }, [userId, token]);


  const handleClaimsVoucher = async (voucherId) => {
    try {
      const response = await claimVoucher(userId, token, voucherId);
      console.log("Claim response:", response);

      // Tìm voucher vừa nhận từ danh sách voucherShop
      const claimedVoucher = voucherShop.find(v => v.id === voucherId);
      if (!claimedVoucher) return;

      // Cập nhật lại hai state
      setVoucherShop(prev => prev.filter(v => v.id !== voucherId));
      setVoucherUser(prev => [...prev, claimedVoucher]);
    } catch (error) {
      console.error("Error claiming voucher:", error);
    }
  };

  const groupedVouchers = voucherUser.reduce((acc, voucher) => {
    const code = voucher.discount_code;
    if (!acc[code]) {
      acc[code] = { ...voucher, quantity: 1 };
    } else {
      acc[code].quantity += 1;
    }
    return acc;
  }, {});

  const groupedVoucherList = Object.values(groupedVouchers);


  return (
    <Layout title={"Voucher Wallet"}>
      <Header />
      <main className="global-px py-[3.75rem] mt-16 select-none bg-slate-300/20">
        <section className="flex flex-col lg:flex-row gap-8 rounded-md tracking-wide">
          {/* Info Panel */}
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
              <div className="w-[80%] md:w-[45%] lg:w-full bg-gradient-to-r from-primary to-primary/80 px-4 py-6 rounded-lg text-white">
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

          {/* Voucher Panel */}
          <div className="flex-[2.5] bg-white px-8 py-6 rounded-md">
            <div className="flex border-b pb-6 gap-14 text-lg relative mb-6">
              <Link href={"/profile"}>
                <p className="text-[#AAAAAA]">Account Settings</p>
              </Link>
              <Link href={"/profile/history?page=1&limit=10"}>
                <p className="text-[#AAAAAA]">Order History</p>
              </Link>
              <div>
                <p className="w-36">Voucher</p>
                <div className="h-1 w-28 bg-primary absolute bottom-0"></div>
              </div>
            </div>

            {/* User Vouchers */}
            <h2 className="text-xl font-semibold mb-4">Voucher của bạn</h2>
            {voucherUser.length === 0 ? (
              <p className="text-center text-gray-400 mt-4">
                Bạn chưa có voucher nào.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                {groupedVoucherList.map((voucher) => (
                  <div
                    key={voucher.discount_code}
                    className="border rounded-xl p-6 shadow-sm bg-gradient-to-r from-white to-slate-50"
                  >
                    <h3 className="text-lg font-semibold text-primary mb-1">
                      {voucher.discount_name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {voucher.discount_description}
                    </p>
                    <div className="flex items-center justify-between mt-4">
                      <span className="font-mono text-sm bg-slate-100 px-2 py-1 rounded border border-slate-300">
                        {voucher.discount_code}
                        {voucher.quantity > 1 && (
                          <span className="ml-1 text-xs text-gray-500">x{voucher.quantity}</span>
                        )}
                      </span>
                      <span className="text-xs text-gray-400">
                        HSD: {new Date(voucher.discount_end_date).toLocaleDateString("vi-VN")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Divider line */}
            <hr className="border-t border-gray-300 my-8" />

            {/* Shop Vouchers */}
            <h2 className="text-xl font-semibold mb-4">Voucher miễn phí từ cửa hàng</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {voucherShop.map((voucher) => (
                <div
                  key={voucher.id}
                  className="border rounded-xl p-6 shadow-sm bg-gradient-to-r from-white to-slate-50 flex flex-col justify-between"
                >
                  <div>
                    <h3 className="text-lg font-semibold text-green-600 mb-1">
                      {voucher.discount_name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {voucher.discount_description}
                    </p>
                    <div className="flex items-center justify-between mt-4">
                      <span className="font-mono text-sm bg-slate-100 px-2 py-1 rounded border border-slate-300">
                        {voucher.discount_code}
                      </span>
                      <span className="text-xs text-gray-400">
                        HSD: {new Date(voucher.discount_end_date).toLocaleDateString("vi-VN")}
                      </span>
                    </div>
                  </div>
                  <button
                    className="mt-6 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md text-sm transition"
                    onClick={() => handleClaimsVoucher(voucher.id)}
                  >
                    Nhận
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </Layout>
  );
}

export default Voucher;

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}
