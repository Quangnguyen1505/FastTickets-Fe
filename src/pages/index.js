import { useEffect, useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';


import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectCoverflow, Navigation, Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import Footer from '@/components/Footer';
import Header from '@/components/Header';
import Layout from '@/components/Layout';
import { orderAction } from '@/redux/slice/order';
import { getMovies } from '@/utils/https/movies';
import { getEvents } from '@/utils/https/events';

function Home({ movies, events, error }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const handleNavigate = (url) => router.push(url);
  const addMovie = (id, name) => {
    const payload = { id: id, name: name };
    dispatch(orderAction.addMovieId(payload));
    handleNavigate(`/movies/${id}`);
  };

  const [email, setEmail] = useState("");
  const [activeIndex, setActiveIndex] = useState(0)
  const [movieStatus, setMovieStatus] = useState("now-showing");
  const [movieList, setMovieList] = useState(movies || []);

  useEffect(() => {
    const controller = new AbortController();
    const fetchMovies = async () => {
      try {
        const res = await getMovies({ limit: 10, page: 1, movieStatus }, controller);
        setMovieList(res.data.metadata || []);
      } catch (err) {
        console.error("Failed to fetch movies", err.message);
      }
    };
  
    fetchMovies();
  
    return () => controller.abort();
  }, [movieStatus]);
  
  const submitHandler = (e) => {
    e.preventDefault();
    router.push(
      {
        pathname: "/signup",
        query: {
          email,
        },
      },
      "/signup"
    );
    console.log(email);
  };

  return (
    <Layout>
      <Header />

      <main>
        <section className="mw-global global-px bg-white">
          <div className="min-h-screen flex flex-col md:flex-row pt-28 md:pt-0 gap-5 w-full md:items-center md:gap-10 lg:gap-40">
            <div className="md:flex-1 flex  flex-col gap-2 md:gap-4">
              <p className="text-primary-placeholder text-base md:text-2xl">
                Nearest Cinema, Newest Movie,
              </p>
              <p className="font-bold text-primary text-3xl md:text-[3.5rem]">
                Find out now!
              </p>
            </div>
            <div className="flex-1 flex gap-7 relative scale-90 md:scale-100">
              <div className="w-28 h-96 relative top-20 rounded-xl bg-black shadow-movie-landing-hero">
                <Image
                  src={"/images/movies/movie-1.png"}
                  alt="spiderman"
                  fill
                  className="object-cover rounded-xl opacity-75"
                  sizes="100kb"
                />
              </div>
              <div className="w-28 h-96 relative top-10 rounded-xl bg-black shadow-movie-landing-hero">
                <Image
                  src={"/images/movies/movie-2.png"}
                  alt="spiderman"
                  fill
                  className="object-cover rounded-xl opacity-75"
                  sizes="100kb"
                />
              </div>

              <div className="w-28 h-96 relative -top-2 rounded-xl bg-black shadow-movie-landing-hero">
                <Image
                  src={"/images/movies/movie-3.png"}
                  alt="spiderman"
                  fill
                  className="object-cover rounded-xl opacity-75"
                  sizes="100kb"
                />
              </div>
            </div>
          </div>
        </section>
        <section className="mw-global global-px bg-accent min-h-16 py-10">
          <div className="flex justify-between text-primary py-5">
            <div className="flex items-center gap-8 border-l-4 border-blue-500 pl-4">
              <p className="font-bold text-2xl">Movies</p>
              <div className="flex gap-8">
                <div
                  onClick={() => setMovieStatus("now-showing")}
                  className={`font-bold text-1xl flex flex-col gap-3 cursor-pointer ${
                    movieStatus === "now-showing" ? "text-primary" : "text-black"
                  }`}
                >
                  <p className="translate-y-1">Now Showing</p>
                  {movieStatus === "now-showing" && (
                    <div className="h-[3px] w-[65%] bg-primary mx-auto rounded-lg" />
                  )}
                </div>
                <div
                  onClick={() => setMovieStatus("upcoming-movies")}
                  className={`font-bold text-1xl flex flex-col gap-3 cursor-pointer ${
                    movieStatus === "upcoming-movies" ? "text-primary" : "text-black"
                  }`}
                >
                  <p className="translate-y-1">Upcomming</p>
                  {movieStatus === "upcoming-movies" && (
                    <div className="h-[3px] w-[65%] bg-primary mx-auto rounded-lg" />
                  )}
                </div>
              </div>
            </div>
            <div className="">
              <Link href={"/movies"} className="font-bold">
                view all
              </Link>
            </div>
          </div>
        </section>
        <div className="relative py-20 bg-gray-900 min-h-screen flex flex-col items-center">
          {/* Image Slider */}
          <div className="w-full max-w-6xl px-4">
            <Swiper
              effect={'coverflow'}
              grabCursor={true}
              centeredSlides={true}
              loop={true}
              slidesPerView={5}
              spaceBetween={-80}
              coverflowEffect={{
                rotate: 0,
                stretch: -120,
                depth: 200,
                modifier: 2,
                slideShadows: false,
              }}
              navigation={true}
              modules={[EffectCoverflow, Navigation]}
              className="mySwiper"
              onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
            >
              {movieList && movieList.map((movie, index) => (
                <SwiperSlide 
                  key={index} 
                  className="max-w-[300px] aspect-[3/4] transition-transform duration-300"
                >
                  <div 
                    className="relative h-full mx-2 group" 
                    onClick={() => {
                      addMovie(movie.id, movie.movie_title);
                    }}
                  >
                    <div className="absolute inset-0 rounded-3xl overflow-hidden shadow-xl">
                      <Image
                        src={movie.movie_image_url || "/images/avatar-2-movie.jpg"}
                        alt={movie.movie_title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="absolute inset-0 border-2 border-transparent rounded-3xl transition-all swiper-slide-active:border-orange-400" />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Content Display */}
          <div className="mt-12 w-full max-w-2xl px-4 text-center">
            <div className="animate-fade-in">
              <h2 className="text-3xl font-bold text-white mb-4">
                {movieList[activeIndex]?.movie_title || 'please, waiting...'}
              </h2>
              <div className="text-orange-400 text-lg mb-2">
                {movieList[activeIndex]?.movie_director || 'please, waiting...'}
              </div>
              <p className="text-gray-300 text-base leading-relaxed line-clamp-3">
                {movieList[activeIndex]?.movie_content || 'please, waiting...'}
              </p>
            </div>
          </div>
        </div>
        
        
        <section className="mw-global global-px pt-16 bg-white">
          <div className="flex justify-between text-primary py-5">
            <div className="border-l-4 border-blue-500 pl-4 font-bold text-2xl flex flex-col gap-3 text-primary-title">
              <p>EVENT</p>
            </div>
            <div className="">
              <Link href={"/movies"} className="font-bold">
                view all
              </Link>
            </div>
          </div>
        </section>
        <div className="mw-global global-px flex gap-4 mt-6 pb-16 overflow-x-scroll bg-white no-scrollbar">
          <button className="btn btn-primary text-white btn-sm h-12  min-w-[8rem]">
            September
          </button>
          <button className="btn bg-white hover:bg-gray-200 border-primary text-primary  btn-sm h-12  min-w-[8rem]">
            October
          </button>
          <button className="btn bg-white hover:bg-gray-200 border-primary text-primary  btn-sm h-12  min-w-[8rem]">
            November
          </button>
          <button className="btn bg-white hover:bg-gray-200 border-primary text-primary  btn-sm h-12  min-w-[8rem]">
            December
          </button>
          <button className="btn bg-white hover:bg-gray-200 border-primary text-primary  btn-sm h-12  min-w-[8rem]">
            January
          </button>
          <button className="btn bg-white hover:bg-gray-200 border-primary text-primary  btn-sm h-12  min-w-[8rem]">
            February
          </button>
          <button className="btn bg-white hover:bg-gray-200 border-primary text-primary  btn-sm h-12  min-w-[8rem]">
            March
          </button>
          <button className="btn bg-white hover:bg-gray-200 border-primary text-primary  btn-sm h-12  min-w-[8rem]">
            April
          </button>
          <button className="btn bg-white hover:bg-gray-200 border-primary text-primary  btn-sm h-12  min-w-[8rem]">
            May
          </button>
        </div>
        <div className="max-w-6xl mx-auto p-4">
          <div className="grid md:grid-cols-3 gap-4">
            {/* Hiển thị featured event đầu tiên */}
            {events.length > 0 && (
              <div className="md:col-span-2">
                <Image
                  src={events[0].EventImageUrl}
                  alt={events[0].EventName}
                  width={730}
                  height={450}
                  className="rounded-lg h-[400px] object-cover"
                />
                <h2 className="mt-4 text-xl font-bold">{events[0].EventName}</h2>
                <p className="text-sm text-gray-600">{events[0].EventDescription}</p>
              </div>
            )}

            {/* Danh sách các event còn lại */}
            <div className="space-y-4">
              {events.slice(1).map((event, index) => (
                <div key={index} className="flex space-x-2 border-b pb-2">
                  <Image
                    src={event.EventImageUrl}
                    alt={event.EventName}
                    width={120}
                    height={120}
                    className="rounded h-[120px]"
                  />
                  <div>
                    <h3 className="text-sm font-semibold">{event.EventName}</h3>
                    <p className="text-xs text-gray-600">{event.EventDescription}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="col-span-3 flex justify-center mt-1">
              <button 
              className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition"
              onClick={() => handleNavigate("/events")}
              >
                Xem thêm
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </Layout>
  );
}

export async function getStaticProps() {
  const controller = new AbortController();

  let movies = [];
  let events = [];
  let error = null;

  try {
    const movieRes = await getMovies({ limit: 10, page: 1, movieStatus: "now-showing" }, controller);
    movies = movieRes.data.metadata || [];
  } catch (err) {
    error = `Movies error: ${err.message}`;
  }

  try {
    const eventRes = await getEvents({ limit: 4, page: 1 }, controller);
    events = eventRes.data.data || [];
  } catch (err) {
    error = error ? `${error} | Events error: ${err.message}` : `Events error: ${err.message}`;
  }

  return {
    props: {
      movies,
      events,
      error,
    },
  };
}


export default Home;
