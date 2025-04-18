'use client'

import { useEffect, useMemo, useState } from 'react'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import Layout from '@/components/Layout'
import { getMovies } from '@/utils/https/movies'
import { getShowTimeByMovieId } from '@/utils/https/showtimes'

const moviesValue = [
    {
      id: 1,
      title: "TÌM XÁC: MA KHÔNG ĐẦU",
      age: "T18",
      genre: "Hài, Kinh Dị",
      duration: 119,
      country: "Việt Nam",
      language: "VN",
      releaseDate: "18.04.2025",
      poster: "/images/movies/movie-1.png", // Thay bằng URL thật hoặc local image
      trailerUrl: "#", // hoặc link youtube
    },
    {
      id: 2,
      title: "LẬT MẶT 8: VÒNG TAY NẮNG",
      age: "K",
      genre: "Hành Động",
      releaseDate: "30.04.2025",
      poster: "/images/movies/movie-2.png",
      trailerUrl: "#",
    },
    {
      id: 3,
      title: "THÁM TỬ KIÊN: KỲ ÁN KHÔNG ĐẦU",
      age: "T18",
      genre: "Hình Sự",
      releaseDate: "30.04.2025",
      poster: "/images/movies/movie-3.png",
      trailerUrl: "#",
    },
    {
      id: 4,
      title: "ĐỊA ĐẠO: MẶT TRỜI TRONG BÓNG TỐI",
      age: "T16",
      genre: "Chiến Tranh",
      releaseDate: "04.04.2025",
      poster: "/images/movies/movie-1.png",
      trailerUrl: "#",
    },
  ];
  

export default function ContactPage() {
  const controller = useMemo(() => new AbortController(), [])

  const [selectedMovie, setSelectedMovie] = useState(null)
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [hovered, setHovered] = useState(null)

  const [movieOptions, setMovieOptions] = useState([])
  const [timeOptions, setTimeOptions] = useState([])
  const [dateOptions, setDateOptions] = useState([])

  const [showAll, setShowAll] = useState(false);

  const visibleMovies = showAll ? moviesValue : moviesValue.slice(0, 4);


  // Fetch movie list
  useEffect(() => {
    const fetchMovies = async () => {
      const params = { limit: 10, movieStatus: 'now-showing' }
      const res = await getMovies(params, controller)
      setMovieOptions(res.data.metadata.map(movie => ({
        id: movie.id,
        title: movie.movie_title
      })))
    }
    fetchMovies()
  }, [])

  // Generate 5 days from today
  useEffect(() => {
    const today = new Date()
    const days = []
    for (let i = 0; i < 5; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      days.push(date.toLocaleDateString('vi-VN')) // giữ nguyên format ngày kiểu Việt
    }
    setDateOptions(days)
  }, [])

  // Fetch showtimes when movie selected
  useEffect(() => {
    const fetchShowtimes = async () => {
      if (selectedMovie?.id) {
        const res = await getShowTimeByMovieId(selectedMovie.id, controller)
        const times = res.data.metadata.map(item => item.start_time)
        setTimeOptions(times)
      }
    }
    if (selectedMovie) fetchShowtimes()
  }, [selectedMovie])
  

  const dropdownStyle =
    'relative bg-white border border-blue-300 rounded-md shadow-md min-w-[180px] text-sm font-semibold text-blue-800 cursor-pointer'

  const optionStyle =
    'hover:bg-blue-100 px-4 py-2 transition duration-150 cursor-pointer'

  const renderDropdown = (label, options, selected, setSelected, canOpen, type) => {
    const isOpen = hovered === type && canOpen

    return (
      <div
        className={`${dropdownStyle} ${!canOpen ? 'pointer-events-none bg-gray-100 text-gray-400' : ''}`}
        onMouseEnter={() => canOpen && setHovered(type)}
        onMouseLeave={() => setHovered(null)}
      >
        <div className="px-4 py-2">
            {selected?.title || selected || label}
        </div>
        {isOpen && (
          <ul className="absolute left-0 top-full w-full bg-white z-10 rounded-b-md overflow-hidden border-t border-blue-100">
            {options.map((item, index) => (
                <li
                    key={index}
                    onClick={() => {
                    setSelected(item)
                    if (type === 'movie') {
                        setSelectedDate('')
                        setSelectedTime('')
                    } else if (type === 'date') {
                        setSelectedTime('')
                    }
                    setHovered(null)
                    }}
                    className={optionStyle}
                >
                    {item.title || item}
                </li>
            ))}
          </ul>
        )}
      </div>
    )
  }

  return (
    <Layout title="Contact">
      <Header />
      <main className="w-full mt-12 md:mt-[5.5rem] bg-white py-10">
        <div className="max-w-6xl mx-auto px-4">
          {/* Quick Ticket Booking Section */}
          <div className="bg-blue-50 p-6 rounded-xl flex flex-wrap gap-4 items-center justify-center mb-12 shadow-md border border-blue-200">
            <span className="text-lg font-bold text-blue-800">
              QUICK TICKET BOOKING
            </span>

            {/* Movie Dropdown */}
            {renderDropdown('1. Choose Movie', movieOptions, selectedMovie, setSelectedMovie, true, 'movie')}

            {/* Date Dropdown */}
            {renderDropdown('2. Choose Date', dateOptions, selectedDate, setSelectedDate, !!selectedMovie, 'date')}

            {/* Time Dropdown */}
            {renderDropdown('3. Choose Showtime', timeOptions, selectedTime, setSelectedTime, !!selectedDate, 'time')}

            {/* Book Button */}
            <button
              className={`bg-red-600 hover:bg-red-700 text-white font-bold text-sm px-6 py-2 rounded-md transition duration-300 shadow-md ${selectedMovie && selectedDate && selectedTime ? '' : 'opacity-50 cursor-not-allowed'}`}
              disabled={!(selectedMovie && selectedDate && selectedTime)}
            >
              BOOK NOW
            </button>
          </div>

          {/* Currently Showing Movies Text */}
          <h2 className="text-blue-800 text-3xl md:text-4xl font-extrabold text-center tracking-wide">
            CURRENTLY SHOWING MOVIES
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-10">
            {visibleMovies.map((movie, index) => (
                <div
                key={movie.id}
                className="bg-[#0e0c2c] rounded-xl overflow-hidden shadow-md border border-gray-700 hover:shadow-xl transition-all duration-300 flex flex-col"
                >
                {/* Tag tuổi */}
                <div className="absolute bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded top-2 left-2 z-10">
                    {movie.age}
                </div>

                {/* Ảnh poster */}
                <div className="relative group overflow-hidden">
                    <img
                    src={movie.poster}
                    alt={movie.title}
                    className="w-full h-[400px] object-cover transition-transform duration-300 group-hover:scale-105"
                    />

                    {/* Thông tin chi tiết khi hover */}
                    <div className="absolute inset-0 bg-black bg-opacity-70 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 p-4 text-sm flex flex-col justify-end space-y-2">
                    <div className="flex items-center gap-2">🎭 {movie.genre}</div>
                    <div className="flex items-center gap-2">⏱️ {movie.duration} phút</div>
                    <div className="flex items-center gap-2">🌏 {movie.country}</div>
                    <div className="flex items-center gap-2">🈯 {movie.language}</div>
                    </div>
                </div>

                {/* Thông tin tên và nút hành động */}
                <div className="p-4 flex flex-col justify-between flex-grow">
                    <p className="text-white font-bold text-center text-sm min-h-[3rem]">
                    {movie.title}
                    </p>
                    <div className="mt-2 flex items-center justify-between gap-2">
                    <a
                        href={movie.trailerUrl}
                        className="text-white text-sm flex items-center gap-1 hover:underline"
                    >
                        <span className="text-red-500">🔴</span> Xem Trailer
                    </a>
                    <button className="bg-yellow-400 text-black text-sm font-bold py-1 px-4 rounded hover:bg-yellow-500">
                        ĐẶT VÉ
                    </button>
                    </div>
                </div>
                </div>
            ))}
          </div>
            {!showAll && (
            <div className="mt-6 text-center">
                <button
                className="bg-yellow-400 text-black font-bold py-2 px-6 rounded hover:bg-yellow-500 transition"
                onClick={() => setShowAll(true)}
                >
                XEM THÊM
                </button>
            </div>
            )}
        </div>
      </main>
      <Footer />
    </Layout>
  )
}
