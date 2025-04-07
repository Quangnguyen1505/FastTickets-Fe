import { orderAction } from "@/redux/slice/order";
import { getAllSeatByRoomId } from "@/utils/https/seat";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

function SeatRow({ blockName, seatNumbers, type }) {
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
    <div className="`w-full flex items-center gap-2 mb-2 justify-center">
      <p className="w-5 text-black text-xs md:font-semibold">{blockName}</p>
      <div className="flex gap-2 flex-wrap">
        {seatNumbers.map((number) => (
          <div
            key={`${blockName}${number}`}
            className={`w-6 h-6 md:w-8 md:h-8 flex justify-center items-center text-[10px] md:text-xs rounded-md ${getColorByType(
              type
            )}`}
          >
            {number}
          </div>
        ))}
      </div>
    </div>
  );
}

function SeatLayout({ room_id }) {
  const controller = useMemo(() => new AbortController(), []);
  const [arrayRow, setarrayRow] = useState([]);
  console.log("room_id", room_id)
  useEffect(() => {
    const fetchAllSeatByRoomId = async () => {
      const data = await getAllSeatByRoomId(room_id, controller)
      console.log("data seat ", data)
      setarrayRow(data.data.metadata)
    }

    fetchAllSeatByRoomId()
  }, [room_id])
  const groupedSeats = arrayRow.reduce((acc, seat) => {
    const row = seat.seat_row;
    if (!acc[row]) acc[row] = [];
    acc[row].push(seat.seat_number);
    return acc;
  }, {});

  const processSeats = (seatNumbers) => {
    const sorted = [...new Set(seatNumbers)].map(Number).sort((a, b) => a - b);
    return sorted;
  };
  const seatRows = {
    A: { type: "normal", seats: processSeats(groupedSeats.A) || []},
    B: { type: "normal", seats: processSeats(groupedSeats.B) || []},
    C: { type: "normal", seats: processSeats(groupedSeats.C) || []},
    D: { type: "vip", seats: processSeats(groupedSeats.D) || []},
    E: { type: "vip", seats: processSeats(groupedSeats.E) || []},
    F: { type: "vip", seats: processSeats(groupedSeats.F) || []},
    G: { type: "vip", seats: processSeats(groupedSeats.G) || []},
    H: { type: "couple", seats: processSeats(groupedSeats.H) || []},
  };

  return (
    <div className="w-full max-w-xl mx-auto px-2">
      {/* Màn hình */}
      <div className="w-full flex justify-between gap-2 mb-6">
        <p className="w-5" />
        <div className="w-full h-2 bg-accent rounded-md" />
      </div>

      {/* Hiển thị các hàng ghế */}
      {Object.entries(seatRows).map(([rowName, { type, seats }]) => (
        <SeatRow
          key={rowName}
          blockName={rowName}
          seatNumbers={seats}
          type={type}
        />
      ))}
    </div>
  );
}

export default SeatLayout;
