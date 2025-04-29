import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { getMovies } from "@/utils/https/movies";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import Layout from "./Layout";

export default function MainLayout({ children }) {
  const controller = useMemo(() => new AbortController(), []);
  const [phimDangChieuList, setPhimDangChieuList] = useState([]);

  useEffect(() => {
    const fetchAllMovies = async () => {
      try {
        const response = await getMovies({ limit: 3, movieStatus: "now-showing" }, controller);
        setPhimDangChieuList(response.data.metadata || []);
      } catch (error) {
        console.error("err fetch movies:", error);
      }
    };

    fetchAllMovies();
  }, []);

  return (
    <Layout title="Phim Hay Tháng">
      <Header />
      <main className="mw-global mt-12 md:mt-[5.5rem] global-px bg-accent min-h-16 py-10">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Nội dung bên trái (home hoặc event detail) */}
          <div className="lg:col-span-2">
            {children}
          </div>

          {/* Bên phải PHIM ĐANG CHIẾU */}
          <div>
            <h2 className="text-lg font-bold border-l-4 border-blue-600 pl-3 mb-4 uppercase">
              PHIM ĐANG CHIẾU
            </h2>
            <div className="flex flex-col gap-6">
              {phimDangChieuList.map((movie) => (
                <div key={movie.id} className="bg-white rounded shadow overflow-hidden">
                  <div className="relative">
                    <Image
                      src={movie.movie_image_url}
                      alt={movie.movie_title}
                      width={400}
                      height={240}
                      className="w-full h-60 object-cover"
                    />
                    <div className="absolute bottom-2 right-2 flex items-center gap-1">
                      <span className="bg-yellow-500 text-white text-sm font-semibold px-2 py-1 rounded shadow">
                        ★ 4.5
                      </span>
                      <span className="bg-orange-500 text-white text-xs px-2 py-0.5 rounded">
                        {movie.movie_age_rating}
                      </span>
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-semibold text-gray-800">
                      {movie.movie_title}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </Layout>
  );
}
