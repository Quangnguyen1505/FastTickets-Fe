import 'react-loading-skeleton/dist/skeleton.css';

import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import _ from 'lodash';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Skeleton from 'react-loading-skeleton';

import Footer from '@/components/Footer';
import Header from '@/components/Header';
import Layout from '@/components/Layout';
import {
  getGenre,
  getMovies,
} from '@/utils/https/movies';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import ChatbotUI from '@/components/Chatbot';

function Movies() {
  const { t } = useTranslation('common');
  const controller = useMemo(() => new AbortController(), []);
  const [movieStatus, setMovieStatus] = useState('now-showing')
  const [dataMovies, setDataMovies] = useState([]);
  const [meta, setMeta] = useState({
    totalpage: 1,
    limit: "8",
    page: 1,
    totaldata: 0,
  });
  const router = useRouter();
  const { query, push } = router;
  const { search = "", sort, page, movie_status } = query;  
  const [cat, setCat] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [catLoad, setCatLoad] = useState(true);

  const moviesController = useMemo(
    () => new AbortController(),
    [sort, page, search]
  );
  const handleNavigate = (url) => router.push(url);

  const fetching = async (page = 1, search = "", sort = "") => {
    const params = {
      limit: 100,
      page,
      search,
      sort,
      movieStatus: movieStatus
    };
    try {
      setLoading(true);
      console.log(`page : ${page}`);
      const result = await getMovies(params, moviesController);
      console.log(result);
      setDataMovies(result.data.metadata.movies);
      setMeta({
        ...meta,
        limit: result.data.limit,
        page: result.data.page,
        totalpage: result.data.totalpage,
        totaldata: result.data.totaldata,
      });
      setLoading(false);
    } catch (error) {
      setLoading(false);
      // console.log(error);
    }
  };

  const addMovie = (id, name) => {
    // dispatch(orderAction.resetOrder());
    // const payload = { id: id, name: name };
    // dispatch(orderAction.addMovieId(payload));
    handleNavigate(`/movies/${id}`);
  };

  useEffect(() => {
    if (!router.isReady) return;
    setLoading(true);
    fetching(page, search, sort);
  }, [sort, page, search, router.isReady, movieStatus]);

  useEffect(() => {
    if (movie_status && typeof movie_status === 'string') {
      setMovieStatus(movie_status);
    }
  }, [movie_status]);

  useEffect(() => {
    getGenre(controller)
      .then((result) => {
        setCat(result.data.data);
        setCatLoad(false);
      })
      .catch((err) => {
        setCatLoad(false);
        console.log(err);
      });
  }, []);

  if (!isLoading && page > meta.totalpage)
    push({ query: { ...router.query, page: 1 } });

  if (page < 1) {
    moviesController.abort();
    push({ query: { ...router.query, page: 1 } });
  }

  return (
    <>
      <Layout title={"All Movies"}>
        <Header />
        <main className="w-full mt-12 md:mt-[5.5rem] bg-accent py-10">
          <section className="mw-global global-px h-auto">
            <div className="border-l-4 border-blue-500 pl-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                <h1 className="text-2xl font-bold">{t("title_movie")}</h1>
                <div className="flex gap-6 mt-2">
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
              <select
                className="select w-52 max-w-xs"
                value={sort}
                onChange={(e) => {
                  if (sort === e.target.value) return;
                  push({
                    query: { ...router.query, sort: e.target.value },
                  });
                }}
              >
                <option value={""}>{t("sort")}</option>
                <option value={"asc"}>{t("sort_movie")} (A-Z)</option>
                <option value={"dsc"}>{t("sort_movie")} (Z-A)</option>
              </select>
            </div>
          </section>

          <div className="mw-global global-px flex gap-4 mt-6 pb-16 overflow-x-scroll no-scrollbar">
            {catLoad ? (
              <>
                {Array("", "", "", "", "", "", "").map((item, idx) => (
                  <Skeleton key={idx} width={128} height={48} />
                ))}
              </>
            ) : (
              <>
                <button
                  className={`${
                    search !== ""
                      ? "bg-white hover:bg-gray-200 border-primary text-primary"
                      : `btn-primary text-white`
                  } btn btn-sm h-12  min-w-[8rem]`}
                  onClick={() =>
                    push({
                      query: {
                        ...router.query,
                        search: "",
                      },
                    })
                  }
                >
                  {t("all")}
                </button>
                {cat && cat.map(({ id, genre_name }) => (
                  <button
                    className={`${
                      _.isEqual(search.toLowerCase(), genre_name.toLowerCase())
                        ? `btn-primary text-white`
                        : `bg-white hover:bg-gray-200 border-primary text-primary`
                    } btn btn-sm h-12 min-w-[8rem]`}
                    key={id}
                    onClick={() =>
                      handleNavigate({
                        query: {
                          ...router.query,
                          search: genre_name.toLowerCase(),
                        },
                      })
                    }
                  >
                    {genre_name}
                  </button>
                ))}
              </>
            )}
          </div>
          <div className="container mx-auto p-5 ">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {isLoading ? (
                Array(8).fill(0).map((_, idx) => (
                  <div key={idx} className="flex flex-col items-center bg-white">
                    <Skeleton height={320} width={"100%"} />
                    <Skeleton height={24} width={"80%"} className="mt-2" />
                  </div>
                ))
              ) : (
                dataMovies.map((movie, index) => {
                  const isLastOdd =
                    dataMovies.length % 2 === 1 && index === dataMovies.length - 1;
                  
                  return (
                    <div 
                      key={index} 
                      className={`flex flex-col items-center cursor-pointer ${
                        isLastOdd ? 'col-span-2 md:col-span-1' : ''
                      }`}
                      onClick={() => addMovie(movie.id, movie.movie_title)}
                    >
                      <div className="relative group rounded-xl overflow-hidden shadow-md w-full h-[450px]">
                        <Image 
                          src={movie.movie_image_url || "/images/avatar-2-movie.jpg"} 
                          alt={movie.movie_title} 
                          width={300} 
                          height={450} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                        />
                        
                        {/* Overlay hover */}
                        <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="flex items-center gap-2 bg-[#f97316] hover:bg-[#fb923c] text-white px-4 py-2 rounded shadow">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M8 16h8M8 12h8m-6-4h6M4 6h16v12H4z" />
                            </svg>
                            {t("buy_ticket_index")}
                          </button>
                          <button className="flex items-center gap-2 border border-white text-white px-4 py-2 rounded shadow hover:bg-white hover:text-black transition">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M6.5 5.5v9l7-4.5-7-4.5z" />
                            </svg>
                            Trailer
                          </button>
                        </div>
                      </div>

                      <h3 className="mt-2 text-lg font-semibold text-center">{movie.movie_title}</h3>
                    </div>
                  )}
                )
              )}
            </div>
          </div>
        </main>
        <Footer />
        <ChatbotUI />
      </Layout>
    </>
  );
}

export default Movies;

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };  
}