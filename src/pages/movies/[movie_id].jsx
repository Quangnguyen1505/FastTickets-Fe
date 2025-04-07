import 'react-loading-skeleton/dist/skeleton.css';

import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import Image from 'next/image';
import { useRouter } from 'next/router';
import Skeleton from 'react-loading-skeleton';

import placeholder from '@/Assets/profile/poster.png';
import CardCinema from '@/components/CardCinema';
import Seat from '@/components/Seat';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import Layout from '@/components/Layout';
import {
  getMovieDetails,
} from '@/utils/https/movies';
import { getShowTimeByMovieId } from '@/utils/https/showtimes';

function ListDate(props) {
  // console.log(props);
  const date = new Date(props.date);
  const year = date.getFullYear();
  const mounth = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const formatedDate = `${year}-${mounth}-${day}`;

  return (
    <li onClick={() => props.isClick(formatedDate)}>
      <a>{formatedDate}</a>
    </li>
  );
}

function MovieDetails() {
  const router = useRouter();
  const controller = useMemo(() => new AbortController(), []);
  const [selectDate, setSelectDate] = useState(
    new Date().toISOString().split("T")[0] 
  );
  const [dataMovie, setDataMovie] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const movieId = router.query.movie_id;

  const [showtimesData, setShowtimesData] = useState([]);

  const [dataDate, setDataDate] = useState([
    { open_date: '2025-04-02' },
    { open_date: '2025-04-03' },
    { open_date: '2025-04-04' },
    { open_date: '2025-04-05' },
  ]);

  useEffect(() => {
    fetchShowtimes();
  }, [selectDate]);

  const fetchShowtimes = async () => {
    const data = await getShowTimeByMovieId(movieId, controller);
    setShowtimesData(data.data.metadata.filter((showtime) => showtime.show_date === selectDate));
  };
  

  // Định nghĩa hàm handleSelectDate để xử lý sự kiện khi người dùng chọn ngày
  const handleSelectDate = (date) => {
    setSelectDate(date); // Cập nhật giá trị selectDate với ngày người dùng đã chọn
  };

  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const handleClick = (showtime) => {
    console.log("show time ", showtime)
    setSelectedShowtime(showtime); // Cập nhật state để mở seat
  };

  const fetching = async () => {
    try {
      const result = await getMovieDetails(movieId, controller);
      // console.log(result);
      setDataMovie(result.data.metadata);
      setIsLoading(false);
    } catch (error) {
      router.push("/movies");
      console.log(error);
    }
  };

  useEffect(() => {
    if (!router.isReady) return;
    fetching();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady]);

  let date = new Date(dataMovie.release_date);
  let options = { year: "numeric", month: "long", day: "numeric" };
  let new_date = date.toLocaleDateString("en-US", options);
  
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
          <div className="relative pb-[56.25%] h-0 overflow-hidden rounded-xl">
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
                      <div className="w-60 h-[22.5rem] relative">
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
                      {dataMovie.movie_categories.map((cate) => (
                        <span key={cate.cate_id} className="text-[#4E4B66] text-lg">
                          {cate.category?.cate_name || "category"}
                        </span>
                      ))}
                    </div>

                    {/* <p className="text-[#4E4B66] text-lg">
                      {dataMovie.movie_categories.category.cate_name || "category"}
                    </p> */}
                    <div className="mt-8">
                      <p className="text-[#8692A6] text-sm">Release date</p>
                      <p className="text-base">{`${dataMovie.movie_release_date}` || "don't update"}</p>
                    </div>
                    <div className="mt-8">
                      <p className="text-[#8692A6] text-sm">Duration</p>
                      <p className="text-base">
                        {`${dataMovie.movie_time} minutes` ||
                          "0 minutes"}
                      </p>
                    </div>
                    <div className="mt-8">
                      <p className="text-[#8692A6] text-sm">Directed by</p>
                      <p className="text-base">
                        {dataMovie.movie_director || "director"}
                      </p>
                    </div>
                    <div className="mt-8">
                      <p className="text-[#8692A6] text-sm">Casts</p>
                      <p className="text-base">
                        {dataMovie.movie_performer || "actors"}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-14">
                  <h2 className="font-semibold text-xl">Movie content</h2>
                  <p className="text-base">
                    {dataMovie.movie_content || "synopsis"}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center mt-16">
                <h1 className="text-2xl font-bold">Showtimes and Tickets</h1>
                <div className="flex items-center mt-10 gap-6">
                  <div className="form-control flex-1">
                    <div className="w-full flex flex-col gap-5">
                      {/* SET DATE */}
                      <div className="dropdown z-0">
                        <label
                          tabIndex={0}
                          className="btn btn-outline btn-primary w-[10rem] md:w-[16.375rem] rounded"
                        >
                          {selectDate === "" ? "Select Date" : selectDate}
                        </label>
                        <ul
                          tabIndex={0}
                          className="dropdown-content menu menu-compact p-2 shadow bg-base-100 rounded-lg w-full"
                        >
                          {dataDate.map((date, idx) => (
                            <ListDate
                              isClick={handleSelectDate}
                              key={idx}
                              date={date.open_date}
                            />
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="justify-between gap-y-5 w-full mt-16">
                  <h1 className="text-2xl font-bold">Fast Sticket</h1>
                  <div className="flex flex-row">
                    {showtimesData.map((showtime, idx) => (
                      <div key={idx} className="card p-5">
                        {/* <p>{showtime.Room.room_name}</p> */}
                        <button 
                          className='btn btn-primary'
                          onClick={() => handleClick(showtime)}
                        >{showtime.start_time}</button>
                        {/* <p>
                          {showtime.start_time} - {showtime.end_time}
                        </p> */}
                        {/* <p>{showtime.show_date}</p> */}
                      </div>
                    ))}
                  </div>
                  {selectedShowtime && (
                    <div className="mt-5">
                      <h2 className="text-lg font-bold">Chọn Ghế Cho Suất Chiếu: {selectedShowtime.start_time}</h2>
                      <Seat room_id={selectedShowtime.Room?.id}/>
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
