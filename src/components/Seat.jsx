"use client";
import { getAllSeatByRoomId } from "@/utils/https/seat";
import { getPriceShowTimeBySeatTypeId } from "@/utils/https/showtimes";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";

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
  const [arrayRow, setarrayRow] = useState([]);
  const [prices, setPrices] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);

  const router = useRouter();

  useEffect(() => {
    const fetchAllSeatByRoomId = async () => {
      const data = await getAllSeatByRoomId(room_id, controller);
      setarrayRow(data.data.metadata);
    };
    fetchAllSeatByRoomId();
  }, [room_id]);

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

  const seatRows = {
    A: { type: "normal", seats: processSeats(groupedSeats.A) || [] },
    B: { type: "normal", seats: processSeats(groupedSeats.B) || [] },
    C: { type: "normal", seats: processSeats(groupedSeats.C) || [] },
    D: { type: "vip", seats: processSeats(groupedSeats.D) || [] },
    E: { type: "vip", seats: processSeats(groupedSeats.E) || [] },
    F: { type: "vip", seats: processSeats(groupedSeats.F) || [] },
    G: { type: "vip", seats: processSeats(groupedSeats.G) || [] },
    H: { type: "couple", seats: processSeats(groupedSeats.H) || [] },
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

  return (
    <>
      <div className="w-full max-w-xl mx-auto px-2 pb-28">
        <div className="w-full flex justify-between gap-2 mb-6">
          <p className="w-5" />
          <div className="w-full h-2 bg-accent rounded-md" />
        </div>

        {Object.entries(seatRows).map(([rowName, { type, seats }]) => (
          <SeatRow
            key={rowName}
            blockName={rowName}
            seatNumbers={seats}
            type={type}
            onSeatClick={handleSeatClick}
          />
        ))}
      </div>

      {/* THANH CỐ ĐỊNH */}
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
                alert("Bạn đã chọn mua: " + selectedSeats.map(s => `${s.row}${s.number}`).join(", "));
                router.push("/checkout-reviews");
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
