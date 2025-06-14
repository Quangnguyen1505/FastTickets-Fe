import { useEffect, useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { FiArrowRight } from "react-icons/fi";


import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Navigation } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import Footer from '@/components/Footer';
import Header from '@/components/Header';
import Layout from '@/components/Layout';
import { getMovies } from '@/utils/https/movies';
import { getEvents } from '@/utils/https/events';

import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';

import useSocket from "@/hook/useSocket";
import ChatbotUI from '@/components/Chatbot';

function Home({ movies, events, error }) {
  const { t } = useTranslation('common');
  const router = useRouter();
  const handleNavigate = (url) => router.push(url);
  const addMovie = (id, name) => {
    handleNavigate(`/movies/${id}`);
  };

  const [activeIndex, setActiveIndex] = useState(0)
  const [movieStatus, setMovieStatus] = useState("now-showing");
  const [movieList, setMovieList] = useState(movies || []);

  useEffect(() => {
    const controller = new AbortController();
    const fetchMovies = async () => {
      try {
        const res = await getMovies({ limit: 10, page: 1, movieStatus }, controller);
        setMovieList(res.data.metadata.movies || []);
      } catch (err) {
        console.error("Failed to fetch movies", err.message);
      }
    };
  
    fetchMovies();
  
    return () => controller.abort();
  }, [movieStatus]);

  // const { socket, messages: receivedMessages } = useSocket("http://localhost:8001", "/socket.io", "message");
  // useEffect(() => {
  //   console.log("socket", socket);
  //   console.log("receivedMessages hhh", receivedMessages);
  // }, [socket]);

  return (
    <Layout>
      <Header />

      <main>
        <section className="mw-global global-px bg-white">
          <div className="min-h-screen flex flex-col md:flex-row pt-28 md:pt-0 gap-5 w-full md:items-center md:gap-10 lg:gap-40">
            <div className="md:flex-1 flex  flex-col gap-2 md:gap-4">
              <p className="text-primary-placeholder text-base md:text-2xl">
                {t("title_banner_first")}
              </p>
              <p className="font-bold text-primary text-3xl md:text-[3.5rem]">
                {t("title_banner_second")}
              </p>
            </div>
            <div className="flex-1 flex gap-7 relative scale-90 md:scale-100">
              {/* <div className="w-28 h-96 relative top-20 rounded-xl bg-black shadow-movie-landing-hero">
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
              </div> */}
              {movieList.slice(0, 3).map((movie, index) => {

                // Tạo hiệu ứng top tương tự từng ảnh
                const topOffset = [20, 10, -2]; // giống như top-20, top-10, -top-2
                return (
                  <div
                    key={index}
                    className={`w-28 h-96 relative top-${topOffset[index]} rounded-xl bg-black shadow-movie-landing-hero`}
                  >
                    <Image
                      src={movie.movie_image_url || "/images/avatar-2-movie.jpg"}
                      alt={movie.movie_title}
                      fill
                      className="object-cover rounded-xl opacity-75"
                      sizes="100kb"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </section>
        <section className="mw-global global-px bg-accent min-h-16 py-10">
          <div className="flex justify-between text-primary py-5">
            <div className="flex items-center gap-8 border-l-4 border-blue-500 pl-4">
              <p className="font-bold text-2xl">{t("title_movie")}</p>
              <div className="flex gap-8">
                <div
                  onClick={() => setMovieStatus("now-showing")}
                  className={`font-bold text-1xl flex flex-col gap-3 cursor-pointer ${
                    movieStatus === "now-showing" ? "text-primary" : "text-black"
                  }`}
                >
                  <p className="translate-y-1">{t("title_movie_now_showing")}</p>
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
                  <p className="translate-y-1">{t("title_movie_up_comming")}</p>
                  {movieStatus === "upcoming-movies" && (
                    <div className="h-[3px] w-[65%] bg-primary mx-auto rounded-lg" />
                  )}
                </div>
              </div>
            </div>
            <div className="">
              <Link href={"/movies"} className="font-bold">
                {t("title_movie_more")}
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
              <p>{t("title_event")}</p>
            </div>
            <div className="">
              <Link href={"/events"} className="font-bold">
                {t("title_event_more")}
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
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    {/* Featured event - full width on mobile, 2 cols on tablet+ */}
    {events && events.length > 0 && (
      <div 
        className="md:col-span-2 cursor-pointer" 
        onClick={() => router.push(`/events/${events[0].ID}`)}
      >
        <Image
          src={events[0].EventImageUrl}
          alt={events[0].EventName}
          width={730}
          height={450}
          className="rounded-lg w-full h-[200px] md:h-[400px] object-cover"
        />
        <h2 className="mt-4 text-xl font-bold">{events[0].EventName}</h2>
        <p className="text-sm text-gray-600 line-clamp-3">{events[0].EventDescription}</p>
      </div>
    )}

    {/* Event list - vertical on mobile, side column on tablet+ */}
    <div className="space-y-4">
      {events && events.slice(1).map((event, index) => (
        <div 
          key={index} 
          className="flex flex-col sm:flex-row sm:space-x-2 h-auto sm:h-[140px] cursor-pointer border-b pb-4 sm:pb-2"
          onClick={() => router.push(`/events/${event.ID}`)}
        >
          <Image
            src={event.EventImageUrl}
            alt={event.EventName}
            width={120}
            height={120}
            className="rounded object-cover w-full h-48 sm:h-[120px] sm:w-[120px] flex-shrink-0"
          />
          <div className="flex-1 min-w-0 mt-2 sm:mt-0">
            <h3 className="text-sm font-semibold line-clamp-2">{event.EventName}</h3>
            <p className="text-xs text-gray-600 line-clamp-2 sm:line-clamp-3">{event.EventDescription}</p>
          </div>
        </div>
      ))}
    </div>

    {/* Button - full width on mobile, auto width on tablet+ */}
    <div className="col-span-1 md:col-span-3 flex justify-center mt-1">
      <button 
        className="px-6 py-3 rounded-lg border border-orange-500 text-orange-500 bg-white 
                  hover:bg-orange-500 hover:text-white transition font-medium flex items-center gap-2
                  w-full sm:w-auto justify-center"
        onClick={() => handleNavigate("/events")}
      >
        {t("title_event_more_button")}
        <FiArrowRight size={18} />
      </button>
    </div>
  </div>
</div>
      </main>
      <Footer />
      <ChatbotUI />
    </Layout>
  );
}

export async function getStaticProps({ locale }) {
  const controller = new AbortController();

  let movies = [];
  let events = [];
  let error = null;

  try {
    const movieRes = await getMovies({ limit: 10, page: 1, movieStatus: "now-showing" }, controller);
    movies = movieRes.data.metadata.movies || [];
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
      ...(await serverSideTranslations(locale, ['common', 'auth'])),
    },
  };  
}


export default Home;
