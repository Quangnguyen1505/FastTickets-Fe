import React, { useEffect, useState, useMemo } from 'react';
import { getSnacks } from '@/utils/https/snacks';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { orderAction } from '@/redux/slice/order';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { unlockSeat, updateSeatStatus } from '@/utils/https/seat';
import toast from 'react-hot-toast';
import { getAllSeatTypes } from '@/utils/https/seatTypes';
import Image from 'next/image';

export default function SnacksPage() {
    const router = useRouter();
    const showTimeId = router.query.showTimeId;
    const dispatch = useDispatch();
    const controller = useMemo(() => new AbortController(), []);
    const [snacks, setSnacks] = useState([]);
    const { user_order, expirationTime, checkoutPrice } = useSelector((state) => state.order);
    const { tokens, shop } = useSelector((state) => state.user.data);
    const [countdown, setCountdown] = useState(0);
    const [selectedSnacks, setSelectedSnacks] = useState([]);
    const [hasExpired, setHasExpired] = useState(false);
    const [seatTypeMap, setSeatTypeMap] = useState({});

    useEffect(() => {
      const fetchSeatTypes = async () => {
          try {
              const res = await getAllSeatTypes(controller);
              console.log("res",res);
              const types = res.data.metadata;
              const typeMap = types.reduce((acc, curr) => {
                  acc[curr.id] = curr.name.toLowerCase();
                  return acc;
              }, {});
              console.log("typeMap",typeMap);
              setSeatTypeMap(typeMap);
          } catch (error) {
              console.error("Error fetching seat types:", error);
          }
      };
      fetchSeatTypes();
    }, []);

    const getTypeNameFromId = (id) => {
      console.log("id",id);
      console.log("seatTypeMap",seatTypeMap);
      return seatTypeMap[id] || 'unknown';
    };  

    useEffect(() => {
        if (!expirationTime) return;
      
        const timer = setInterval(() => {
          const remaining = Math.round((expirationTime - Date.now()) / 1000);
          
          if (remaining <= 0) {
            clearInterval(timer);
            handleAutoCancel();
            router.push('/');
          } else {
            setCountdown(remaining);
          }
        }, 1000);
      
        return () => clearInterval(timer);
    }, [expirationTime]);
    
    const handleAutoCancel = async () => {
        if (hasExpired) return; 
        setHasExpired(true); 

        try {
          const accessToken = tokens?.accessToken;
          const userId = shop?.id;
      
          // Thêm các tham số cần thiết cho API
          await Promise.all(user_order.map(async (seat) => {
            await unlockSeat(
              userId,
              accessToken,
              seat.id,
              showTimeId,
              controller // Nếu cần
            );
            await updateSeatStatus(
                userId,
                accessToken,
                "available",
                seat.id,
                showTimeId,
                controller
            );
          }));
          
          dispatch(orderAction.resetOrder());
          toast.success('Đã huỷ chọn ghế');
          router.push('/');
        } catch (error) {
          toast.error('Huỷ ghế thất bại');
        }
    };

    const handleSelectSnack = (snack) => {
        setSelectedSnacks(prev => {
          const existing = prev.find(item => item.id === snack.id);
          if (existing) {
            return prev.map(item => 
              item.id === snack.id 
                ? {...item, quantity: item.quantity + 1} 
                : item
            );
          }
          return [...prev, {...snack, quantity: 1}];
        });
    };

    const totalPrice = checkoutPrice + selectedSnacks.reduce((sum, snack) => 
        sum + (snack.item_price * snack.quantity), 0
    );
      

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleCheckout = () => {
        if (!showTimeId) {
          toast.error('Không tìm thấy thông tin suất chiếu');
          return;
        }

        const user_order_nacks = user_order.map((seat) => ({
            type: getTypeNameFromId(seat.typeId), // ví dụ: "vip"
            location: `${seat.row}${seat.number}` // ví dụ: "D1"
        }));

        const snacksOrderFormatted = selectedSnacks.map(snack => ({
          snack_id: snack.id,
          quantity: snack.quantity
        }));

        dispatch(orderAction.addDataBookNow({
            user_order: user_order_nacks,
            checkoutPrice: totalPrice,
            show_time_id: showTimeId,
            snacks_order: snacksOrderFormatted,
            expirationTime: expirationTime,
        }));

        router.push(`/checkout-reviews/${showTimeId}`);
    };

    useEffect(() => {
        async function fetchSnacks() {
            const res = await getSnacks(controller);
            setSnacks(res.data.metadata.snacks || []);
        }

        fetchSnacks();
    }, []);

    const handleRemoveSnack = (snackId) => {
        setSelectedSnacks(prev => 
          prev.filter(item => item.id !== snackId)
        );
    };

  return (
    <div className="min-h-screen bg-[#f9f9f9]">
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-4xl font-bold text-center text-red-600 mb-10">
          Thực đơn Bắp Nước
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {snacks.map((snack) => (
            <div
              key={snack.id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition duration-300"
            >
              {/* <img
                src={snack.item_image_url}
                alt={snack.item_name}
                className="w-full h-56 object-cover rounded-t-2xl"
              /> */}
              <Image
                src={snack.item_image_url}
                alt={snack.item_name}
                width={400}
                height={224}
                className="w-full h-56 object-cover rounded-t-2xl"
                unoptimized={snack.item_image_url?.startsWith('http') ? false : undefined}
                // You may need to configure next.config.js for external domains
              />
              <div className="p-5">
                <h2 className="text-xl font-semibold text-gray-800">{snack.item_name}</h2>
                <p className="text-sm text-gray-500 mb-2">
                  Giá: <span className="font-medium text-red-500">{snack.item_price.toLocaleString()}₫</span>
                </p>
                <p className="text-sm text-gray-500">
                  Còn lại: <span className="font-medium">{snack.quantity_available}</span>
                </p>
                <div className="mt-4 flex justify-between items-center">
                    <span className="text-xs px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full">
                        {snack.category}
                    </span>
                    {(() => {
  const selected = selectedSnacks.find(item => item.id === snack.id);
  if (selected && selected.quantity > 0) {
    return (
      <div className="flex items-center space-x-2">
        <button
          onClick={() => {
            if (selected.quantity === 1) {
              handleRemoveSnack(snack.id);
            } else {
              setSelectedSnacks(prev =>
                prev.map(item =>
                  item.id === snack.id
                    ? { ...item, quantity: item.quantity - 1 }
                    : item
                )
              );
            }
          }}
          className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full text-black text-lg"
        >
          −
        </button>
        <span className="text-sm font-medium">{selected.quantity}</span>
        <button
          onClick={() => handleSelectSnack(snack)}
          className="w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full text-lg"
        >
          +
        </button>
      </div>
    );
  } else {
    return (
      <button
        onClick={() => handleSelectSnack(snack)}
        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition"
      >
        Chọn
      </button>
    );
  }
})()}

                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Thanh bar dưới cùng */}
        {user_order && user_order.length > 0 && (
            <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-300 shadow-lg z-50 px-4 py-3 flex flex-col md:flex-row justify-between items-center gap-3">
                <div className="text-sm md:text-base font-medium text-black">
                    Ghế đã chọn:{" "}
                    {user_order.map(seat => `${seat.row}${seat.number}`).join(', ')}
                </div>
                <p className="text-sm">Tổng tiền: {totalPrice.toLocaleString()}₫</p>
                <p className="text-sm">Thời gian còn lại: {formatTime(countdown)}</p>
                <div className="flex gap-2">
                    <button 
                        onClick={handleAutoCancel}
                        className="bg-red-500 text-white px-4 py-2 rounded"
                    >
                        Huỷ chọn
                    </button>
                    <button
                        onClick={handleCheckout}
                        className="bg-green-500 text-white px-4 py-2 rounded"
                    >
                        Tiếp tục thanh toán
                    </button>
                </div>
            </div>
        )}
        {selectedSnacks.length > 0 && (
            <div className="ml-4">
                <p className="text-sm">
                Snacks: {selectedSnacks.map(s => `${s.item_name} (x${s.quantity})`).join(', ')}
                </p>
            </div>
        )}
      </main>
      <Footer />
    </div>
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