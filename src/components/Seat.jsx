import { useEffect, useMemo, useState } from "react";
import { getAllSeatByRoomId } from "@/utils/https/seat";
import { getPriceShowTimeBySeatTypeId } from "@/utils/https/showtimes";
import { useRouter } from "next/router";
import { getAllSeatTypes } from "@/utils/https/seatTypes";
import { useDispatch } from "react-redux";
import { orderAction } from "@/redux/slice/order";
import toast from 'react-hot-toast';
import { FastTicketsAction } from "@/redux/slice/buyFastTicket";

function SeatRow({ blockName, seatNumbers, type, onSeatClick }) {
  const getColorByType = (type) => {
    switch (type) {
      case "normal":
        return "bg-gray-300 text-black";
      case "vip":
        return "bg-yellow-400 text-black";
      case "couple":
        return "bg-pink-400 text-white";
      default:
        return "bg-secondary text-black";
    }
  };

  return (
    <div className="w-full flex items-center gap-2 mb-2 justify-center">
      <p className="w-5 text-black text-xs md:font-semibold">{blockName}</p>
      <div className="flex gap-2 flex-wrap">
        {seatNumbers.map((seat) => (
          <div
            key={`${blockName}${seat.number}`}
            className={`w-6 h-6 md:w-8 md:h-8 flex justify-center items-center text-[10px] md:text-xs rounded-md cursor-pointer hover:opacity-80 ${getColorByType(type)}`}
            onClick={() =>
              onSeatClick({
                row: blockName,
                number: seat.number,
                typeId: seat.typeId,
              })
            }
          >
            {seat.number}
          </div>
        ))}
      </div>
    </div>
  );
}

function SeatLayout({ room_id, show_time_id }) {
  const controller = useMemo(() => new AbortController(), []);
  const dispatch = useDispatch();
  const [arrayRow, setArrayRow] = useState([]);
  const [prices, setPrices] = useState(null);
  const [seatTypeMap, setSeatTypeMap] = useState({});
  const [selectedSeats, setSelectedSeats] = useState([]);

  const router = useRouter();

  useEffect(() => {
    const fetchAllSeatByRoomId = async () => {
      const data = await getAllSeatByRoomId(room_id, controller);
      console.log("data ", data.data.metadata);
      
      setArrayRow(data.data.metadata);
    };
    fetchAllSeatByRoomId();
  }, [room_id]);

  useEffect(() => {
    const fetchAllSeatTypes = async () => {
      const data = await getAllSeatTypes(controller);
      const types = data.data.metadata;
  
      // Tạo map name -> id
      const typeMap = types.reduce((acc, curr) => {
        acc[curr.name.toLowerCase()] = curr.id;
        return acc;
      }, {});
      setSeatTypeMap(typeMap);
    };
  
    fetchAllSeatTypes();
  }, []);
  

  const groupedSeats = arrayRow.reduce((acc, seat) => {
    const row = seat.seat_row;
    if (!acc[row]) acc[row] = [];
    acc[row].push({
      number: seat.seat_number,
      typeId: seat.seat_type_id,
    });
    return acc;
  }, {});

  const processSeats = (seats) => {
    if (!Array.isArray(seats)) return [];
    return [...seats]
      .sort((a, b) => a.number - b.number)
      .map((seat) => ({
        number: seat.number,
        typeId: seat.typeId,
      }));
  };

  const handleSeatClick = async (seat) => {
    const exists = selectedSeats.some(
      (s) => s.row === seat.row && s.number === seat.number
    );

    let newSeats;
    if (exists) {
      newSeats = selectedSeats.filter(
        (s) => !(s.row === seat.row && s.number === seat.number)
      );
    } else {
      const res = await getPriceShowTimeBySeatTypeId(
        seat.typeId,
        show_time_id,
        controller
      );

      const seatWithPrice = {
        ...seat,
        price: res.data.metadata,
      };

      newSeats = [...selectedSeats, seatWithPrice];
    }

    setSelectedSeats(newSeats);

    if (newSeats.length > 0) {
      const lastPrice = newSeats[newSeats.length - 1]?.price || null;
      setPrices(lastPrice);
    } else {
      setPrices(null);
    }
  };

  
  const handleCheckoutNow = () => {
    const user_order = selectedSeats.map((seat) => ({
      type: getTypeNameFromId(seat.typeId), // ví dụ: "vip"
      location: `${seat.row}${seat.number}` // ví dụ: "D1"
    }));

    const checkoutPrice = selectedSeats.reduce((total, seat) => total + seat.price, 0);

    dispatch(orderAction.addDataBookNow({
      user_order,
      checkoutPrice,
      show_time_id,
    }));

    dispatch(FastTicketsAction.resetFastTickets());

    router.push(`/checkout-reviews/${show_time_id}`);
  };

  const getTypeNameFromId = (id) => {
    if (id === seatTypeMap["vip"]) return "vip";
    if (id === seatTypeMap["normal"]) return "normal";
    if (id === seatTypeMap["couple"]) return "couple";
    return "unknown";
  };  

  return (
    <>
      <div className="w-full max-w-xl mx-auto px-2 pb-28">
        <div className="w-full flex justify-between gap-2 mb-6">
          <p className="w-5" />
          <div className="w-full h-2 bg-neutral rounded-md" />
        </div>

        {Object.entries(groupedSeats).map(([rowName, seats]) => (
          <SeatRow
            key={rowName}
            blockName={rowName}
            seatNumbers={processSeats(seats)}
            type={
              seats[0]?.typeId === seatTypeMap["normal"]
                ? "normal"
                : seats[0]?.typeId === seatTypeMap["vip"]
                ? "vip"
                : seats[0]?.typeId === seatTypeMap["couple"]
                ? "couple"
                : "normal"
            }            
            onSeatClick={handleSeatClick}
          />
        ))}
        {/* ---- THÊM LEGEND Ở ĐÂY ---- */}
        <div className="flex flex-wrap justify-center items-center gap-4 mt-12">
          <div className="flex items-center gap-4">
            <div className="w-4 h-4 md:w-6 md:h-6 bg-gray-300 rounded-md" />
            <span className="text-xs md:text-sm text-black">Ghế thường</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-4 h-4 md:w-6 md:h-6 bg-yellow-400 rounded-md" />
            <span className="text-xs md:text-sm text-black">Ghế VIP</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-4 h-4 md:w-6 md:h-6 bg-pink-400 rounded-md" />
            <span className="text-xs md:text-sm text-black">Ghế đôi</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-4 h-4 md:w-6 md:h-6 bg-pink-400 rounded-md" />
            <span className="text-xs md:text-sm text-black">Ghế đã đặt</span>
          </div>
        </div>
        {/* ---- KẾT THÚC LEGEND ---- */}
      </div>
      {selectedSeats.length > 0 && (
        <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-300 shadow-lg z-50 px-4 py-3 flex flex-col md:flex-row justify-between items-center gap-3">
          <div className="text-sm md:text-base font-medium text-black">
            Ghế đã chọn:{" "}
            {selectedSeats.map((seat) => `${seat.row}${seat.number}`).join(", ")}
          </div>
          {prices && (
            <div className="text-sm text-black">
              Giá mỗi vé: <strong>{prices.toLocaleString()}₫</strong> &nbsp;|&nbsp;
              Tổng:{" "}
              <strong>
                {selectedSeats
                  .reduce((acc, curr) => acc + (curr.price || 0), 0)
                  .toLocaleString()}
                ₫
              </strong>
            </div>
          )}
          <div className="flex gap-2">
            <button
              onClick={() => {
                setSelectedSeats([]);
                setPrices(null);
              }}
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
            >
              Huỷ chọn
            </button>

            <button
              onClick={() => {
                // alert("Bạn đã chọn mua: " + selectedSeats.map(s => `${s.row}${s.number}`).join(", "));
                toast.success(
                  `Bạn đã chọn mua: ${selectedSeats.map(s => `${s.row}${s.number}`).join(", ")}`
                );
                handleCheckoutNow()
              }}
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
            >
              Mua ngay
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default SeatLayout;
