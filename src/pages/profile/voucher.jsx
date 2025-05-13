import Image from "next/image";
import Link from "next/link";
import { useSelector } from "react-redux";

import placeholder from "@/Assets/profile/placeholder.png";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Layout from "@/components/Layout";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

function Voucher() {
  const userStore = useSelector((state) => state.user.data);
  const image = userStore.image;
  const firstName = userStore.first_name;
  const lastName = userStore.last_name;

  // ✅ Gán tĩnh danh sách voucher
  const voucherList = [
    {
      id: 1,
      title: "Giảm 50%",
      description: "Áp dụng cho tất cả các vé 2D",
      code: "GIAM50",
      expiry_date: "2025-12-31",
    },
    {
      id: 2,
      title: "Giảm 30k",
      description: "Cho đơn hàng từ 150k trở lên",
      code: "30KOFF",
      expiry_date: "2025-10-01",
    },
    {
      id: 3,
      title: "Tặng Combo Bắp + Nước",
      description: "Khi đặt vé vào thứ 3 hàng tuần",
      code: "COMBOTUE",
      expiry_date: "2025-08-15",
    },
  ];

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
                  320 <span className="text-xs">points</span>
                </p>
              </div>
              <p className="mt-8">180 points become a master</p>
              <progress
                className="progress progress-primary w-56"
                value="40"
                max="100"
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

            {voucherList.length === 0 ? (
              <p className="text-center text-gray-400 mt-10">
                Bạn chưa có voucher nào.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {voucherList.map((voucher) => (
                  <div
                    key={voucher.id}
                    className="border rounded-xl p-6 shadow-sm bg-gradient-to-r from-white to-slate-50"
                  >
                    <h3 className="text-lg font-semibold text-primary mb-1">
                      {voucher.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {voucher.description}
                    </p>
                    <div className="flex items-center justify-between mt-4">
                      <span className="font-mono text-sm bg-slate-100 px-2 py-1 rounded border border-slate-300">
                        {voucher.code}
                      </span>
                      <span className="text-xs text-gray-400">
                        HSD: {voucher.expiry_date}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
