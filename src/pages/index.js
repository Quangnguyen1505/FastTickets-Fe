import { useState } from 'react';

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

function Home({ movies, error }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const handleNavigate = (url) => router.push(url);
  const addMovie = (id, name) => {
    const payload = { id: id, name: name };
    dispatch(orderAction.addMovieId(payload));
    handleNavigate(`/movies/${id}`);
  };

  const reviews = [
    {
      title: "[Review] Âm Dương Lộ: Tôn Vinh Tài Xế Xe Cứu Thương Thông Qua Truyền Thuyết Đô Thị",
      image: "/images/avatar-2-movie.jpg",
      likes: 280,
      featured: true,
    },
    {
      title: "[Review] Snow White: Disney Viết Lại Cổ Tích Theo Cách Hợp Lí Hơn?",
      image: "/images/avatar-2-movie.jpg",
      likes: 306,
      featured: false,
    },
    {
      title: "[Review] Mickey 17: Châm Biếm Trò Hề Của Tư Bản?",
      image: "/images/avatar-2-movie.jpg",
      likes: 318,
      featured: false,
    },
    {
      title: "[Review] Hitman 2: Sát Thủ Sang Kwon Sang Woo Tấu Hài Cùng Lee Yi Kyung",
      image: "/images/avatar-2-movie.jpg",
      likes: 189,
      featured: false,
    },
  ];


  const [email, setEmail] = useState("");
  const [activeIndex, setActiveIndex] = useState(0)
  
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
                <div className="font-bold text-1xl flex flex-col gap-3">
                  <p className="translate-y-1">Now Showing</p>
                  <div className="h-[3px] w-[65%] bg-primary mx-auto rounded-lg" />
                </div>
                <div className="text-black text-1xl flex flex-col gap-3">
                  <p className="translate-y-1">Up Showing</p>
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
              {movies && movies.map((movie, index) => (
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
                {movies[activeIndex]?.movie_title}
              </h2>
              <div className="text-orange-400 text-lg mb-2">
                {movies[activeIndex]?.movie_director}
              </div>
              <p className="text-gray-300 text-base leading-relaxed line-clamp-3">
                {movies[activeIndex]?.movie_content}
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
            {reviews.filter(review => review.featured).map((review, index) => (
              <div key={index} className="md:col-span-2">
                <Image src={review.image} alt={review.title} width={730} height={450} className="rounded-lg h-[400px] object-cover" />
                <h2 className="mt-4 text-xl font-bold">{review.title}</h2>
              </div>
            ))}
            <div className="space-y-4">
              {reviews.filter(review => !review.featured).map((review, index) => (
                <div key={index} className="flex space-x-2 border-b pb-2">
                  <Image src={review.image} alt={review.title} width={120} height={120} className="rounded h-[120px]" />
                  <div>
                    <h3 className="text-sm font-semibold">{review.title}</h3>
                    <p className="text-xs">👍 {review.likes}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="col-span-3 flex justify-center mt-1">
              <button className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition">Xem thêm</button>
            </div>
          </div>
        </div>

 
        <section className="mw-global global-px my-20">
          <div className="flex flex-col gap-12 p-10 rounded-lg items-center justify-center shadow-[0px_16px_32px_0px_#BABABA4D] text-center">
            <div className="flex flex-col items-center justify-center gap-2">
              <p className="text-body text-2xl tracking-wide">
                Be the vanguard of the
              </p>
              <p className="text-primary text-5xl font-bold">Moviegoers</p>
            </div>
            <form
              className="flex flex-col md:flex-row gap-4"
              onSubmit={submitHandler}
            >
              <input
                className="px-4 border-primary-line border-2 h-12 rounded-md w-72 text-sm tracking-wider"
                placeholder="Type your email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button type="submit" className="btn btn-primary text-white">
                Join now
              </button>
            </form>
            <div className="text-primary-label text-sm  tracking-wider">
              <p>By joining you as a Tickitz member,</p>
              <p>we will always send you the latest updates via email .</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </Layout>
  );
}

export async function getStaticProps(ctx) {
  try {
    const controller = new AbortController();
    const result = await getMovies(
      { limit: 10, page: 1, search: "" },
      controller
    );
    
    return {
      props: {
        error: "",
        movies: result.data.metadata || "",
      },
    };
  } catch (error) {
    return {
      props: {
          error: {
              message: error.message
          }
      }
    };
  }
}

export default Home;
