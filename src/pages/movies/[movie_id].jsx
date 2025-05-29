import 'react-loading-skeleton/dist/skeleton.css';

import {
  useEffect,
  useMemo,
  useState,
  useRef
} from 'react';

import Image from 'next/image';
import { useRouter } from 'next/router';
import Skeleton from 'react-loading-skeleton';

import placeholder from '@/Assets/profile/poster.png';
import Seat from '@/components/Seat';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import Layout from '@/components/Layout';
import {
  getMovieDetails,
} from '@/utils/https/movies';
import { getShowTimeByMovieId } from '@/utils/https/showtimes';
import { getAvailableDates } from '@/utils/https/dates';
import { useSelector } from 'react-redux';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

function ListDate({ date, isClick, isActive }) {
  const d = new Date(date);
  const formatted = `${String(d.getDate()).padStart(2, "0")}/${String(
    d.getMonth() + 1
  ).padStart(2, "0")}`;

  return (
    <div
      onClick={() => isClick(date)}
      className={`px-4 py-2 rounded cursor-pointer ${
        isActive ? "bg-blue-700 text-white font-semibold" : "text-gray-700"
      } hover:bg-blue-500 hover:text-white transition`}
    >
      {formatted}
    </div>
  );
}


function MovieDetails() {
  const router = useRouter();
  const controller = useMemo(() => new AbortController(), []);
  const buyFastTicketsStore = useSelector((state) => state.fastTickets);
  const seatSectionRef = useRef(null);

  const [selectDate, setSelectDate] = useState(
    new Date().toISOString().split("T")[0] 
  );
  const [dataMovie, setDataMovie] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [selectedShowtime, setSelectedShowtime] = useState(null);

  const movieId = router.query.movie_id;

  const [showtimesData, setShowtimesData] = useState([]);

  const [dataDate, setDataDate] = useState([]);

  useEffect(() => {
    if (!movieId || !selectDate) return;
  
    const fetchShowtimes = async () => {
      try {
        const data = await getShowTimeByMovieId(movieId, selectDate, controller);
        const filtered = data.data.metadata
        setShowtimesData(filtered);

        if (
          buyFastTicketsStore?.movieId === movieId && 
          buyFastTicketsStore?.show_time) {
          const matchedShowtime = filtered.find(
            (show) => show.start_time === buyFastTicketsStore.show_time
          );
          if (matchedShowtime) {
            setSelectedShowtime(matchedShowtime);
          }
        }
      } catch (error) {
        console.error("Error fetching showtimes:", error);
      }
    };
  
    fetchShowtimes();
  }, [movieId, selectDate, buyFastTicketsStore]);

  useEffect(() => {
    if (
      buyFastTicketsStore?.movieId === movieId && 
      selectedShowtime) {
      seatSectionRef.current?.scrollIntoView({ 
        behavior: "smooth", 
        block: "start" 
      });
    }
  }, [selectedShowtime, buyFastTicketsStore, movieId]);
  
  const handleSelectDate = (date) => {
    console.log("data ", date);
    
    setSelectDate(date); // Cập nhật giá trị selectDate với ngày người dùng đã chọn
    setSelectedShowtime(null);
  };

  const handleClick = (showtime) => {
    console.log("show time ", showtime)
    setSelectedShowtime(showtime); // Cập nhật state để mở seat
  };

  useEffect(() => {
    if (!router.isReady || !movieId) return;
  
    const fetchInitialData = async () => {
      try {
        const [dateRes, movieRes] = await Promise.all([
          getAvailableDates(),
          getMovieDetails(movieId, controller),
        ]);
        
        const today = new Date().toISOString().split("T")[0];
  
        setDataDate(dateRes.data);
        setDataMovie(movieRes.data.metadata);
        setIsLoading(false);
  
        // Nếu ngày hôm nay có trong danh sách thì set
        if (
          buyFastTicketsStore?.movieId === movieId && 
          buyFastTicketsStore?.date) {
          setSelectDate(buyFastTicketsStore.date);
        } else {
          // Nếu không thì set mặc định hôm nay
          const todayInDates = dateRes.data.find(d => {
            return new Date(d.open_date).toISOString().split("T")[0] === today;
          });
          if (todayInDates) {
            setSelectDate(today);
          } else {
            setSelectDate(dateRes.data[0]?.open_date); // fallback
          }
        }
  
      } catch (error) {
        console.error("Init error:", error);
        router.push("/movies");
      }
    };
  
    fetchInitialData();
  }, [router.isReady, movieId, buyFastTicketsStore]);
  
  
  return (
    <Layout title={"Movie Details"}>
      <Header />
      <main className="global-px py-[3.75rem] mt-16 select-none bg-slate-300/20">
        {isLoading ? (
          <>
            <div>
              <div className="flex flex-col md:flex-row gap-14">
                <Skeleton width={282} height={402} />
                <div>
                  <Skeleton width={250} height={30} />

                  <Skeleton width={150} height={24} />

                  <div className="mt-8">
                    <Skeleton width={150} height={18} />
                    <Skeleton width={250} height={20} />
                  </div>
                  <div className="mt-8">
                    <Skeleton width={150} height={18} />
                    <Skeleton width={250} height={20} />
                  </div>
                  <div className="mt-8">
                    <Skeleton width={150} height={18} />
                    <Skeleton width={250} height={20} />
                  </div>
                  <div className="mt-8">
                    <Skeleton width={150} height={18} />
                    <Skeleton width={250} height={20} />
                  </div>
                </div>
              </div>
              <div className="mt-14">
                <Skeleton width={150} height={18} />
                <Skeleton className="w-full" height={100} />
              </div>
              <div className="flex flex-col items-center mt-36">
                <Skeleton width={300} height={48} />
                <div className="flex items-center mt-10 gap-6">
                  <div className="form-control flex-1 ">
                    <div className="w-full flex flex-col gap-5 ">
                      {/* SET DATE */}
                      <div className="dropdown z-0">
                        <Skeleton width={250} height={48} />
                      </div>
                    </div>
                  </div>
                  <div className="w-full flex flex-col gap-5 ">
                    <div className="dropdown z-0">
                      <Skeleton width={250} height={48} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
          <div className="relative pb-[56.25%] h-0 overflow-hidden rounded-xl mb-10">
              <iframe
                src={`https://www.youtube.com/embed/${dataMovie.movie_video_trailer_code}`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute top-0 left-0 w-full h-full"
              ></iframe>
            </div>
            <section className="w-full gap-6 justify-between">
              <div>
                <div className="flex flex-col md:flex-row gap-14">
                  <div className="max-w-[283px]">
                    <div className="p-5 border border-primary rounded-2xl">
                      <div className="w-60 h-[22.5rem] relative cursor-pointer">
                        <Image
                          src={dataMovie.movie_image_url || placeholder}
                          alt="img-movie"
                          fill
                          className=" object-cover"
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <h1 className="font-bold text-2xl">
                      {dataMovie.movie_title || "Title Movie"}
                    </h1>
                
                    <div className="flex flex-row flex-wrap gap-2">
                      {dataMovie.movie_categories?.map((cate) => (
                        <span 
                        key={cate.cate_id} 
                        className="px-3 py-1 border border-gray-300 hover:border-orange-500 text-black rounded-xl font-medium transition-colors cursor-pointer">
                          {cate.category?.cate_name || "category"}
                        </span>
                      ))}
                    </div>

                    {/* <p className="text-[#4E4B66] text-lg">
                      {dataMovie.movie_categories.category.cate_name || "category"}
                    </p> */}
                    <div className="mt-6">
                      <p className="text-[#8692A6] text-sm">Release date</p>
                      <p className="text-base">{`${dataMovie.movie_release_date}` || "don't update"}</p>
                    </div>
                    <div className="mt-6">
                      <p className="text-[#8692A6] text-sm">Duration</p>
                      <p className="text-base">
                        {`${dataMovie.movie_time} minutes` ||
                          "0 minutes"}
                      </p>
                    </div>
                    <div className="mt-6">
                      <p className="text-[#8692A6] text-sm">Directed by</p>
                      <p className="text-base">
                        {dataMovie.movie_director || "director"}
                      </p>
                    </div>
                    <div className="mt-6">
                      <p className="text-[#8692A6] text-sm">Casts</p>
                      <p className="text-base">
                        {dataMovie.movie_performer || "actors"}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-8">
                  <h2 className="font-semibold text-xl">Movie content</h2>
                  <p className="text-base">
                    {dataMovie.movie_content || "synopsis"}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center mt-11">
                <h1 className="text-2xl font-bold">Showtimes and Tickets</h1>
                <div className="flex items-center mt-10 gap-6">
                  <div className="form-control flex-1">
                    <div className="w-full flex flex-col gap-5">
                      {/* SET DATE */}
                      <div className="dropdown z-0">
                        {/* <label
                          tabIndex={0}
                          className="btn btn-outline btn-primary w-[10rem] md:w-[16.375rem] rounded"
                        >
                          {selectDate === "" ? "Select Date" : selectDate}
                        </label> */}
                        <div className="border border-blue-500 rounded-md p-2 flex justify-center gap-4">
                          {dataDate.map((dateObj, idx) => {
                            const dateStr = new Date(dateObj.open_date)
                              .toISOString()
                              .split("T")[0];
                            return (
                              <ListDate
                                key={idx}
                                date={dateObj.open_date}
                                isClick={handleSelectDate}
                                isActive={dateStr === selectDate}
                              />
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div 
                className="justify-between gap-y-5 w-full mt-16"
                ref={seatSectionRef}
                >
                  <h1 className="text-2xl font-bold">Fast Ticket</h1>
                  <div className="flex flex-row">
                    {showtimesData.length > 0 ? (
                      showtimesData.map((showtime, idx) => (
                        <div key={idx} className="card p-5">
                          <button 
                            className='btn btn-primary'
                            onClick={() => handleClick(showtime)}
                          >
                            {showtime.start_time}
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="text-gray-600 font-medium italic text-center w-full">
                        Currently, there are no showtimes available for this date.
                      </div>
                    )}
                  </div>
                  {showtimesData.length > 0 && selectedShowtime && (
                    <div 
                    className="mt-5"
                    >
                      <h2 className="text-lg font-bold">Chọn Ghế Cho Suất Chiếu: {selectedShowtime.start_time}</h2>
                      <p className="mb-2 text-center font-semibold">Screen</p>
                      <Seat room_id={selectedShowtime.Room?.id} show_time_id={selectedShowtime.id}/>
                    </div>
                  )}
                </div>
              </div>
            </section>
          </>
        )}
      </main>
      <Footer />
    </Layout>
  );
}

export default MovieDetails;

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'signup'])),
    },
  };  
}

export async function getStaticPaths() {
  return { paths: [], fallback: 'blocking' };
}