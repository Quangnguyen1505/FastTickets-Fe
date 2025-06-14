import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

function Footer() {
  const { t } = useTranslation('common');
  const router = useRouter();
  return (
    <footer className="top-0 w-full">
      <div className="mw-global w-full global-px flex flex-wrap flex-col md:flex-row pt-16 pb-10 justify-between gap-10">
        <div className="flex flex-col gap-7 lg:max-w-xs w-screen max-w-xs md:max-w-4xl lg:w-auto">
            <div className="w-full flex justify-center gap-x-5 md:justify-start">
              <Link
                href={"/"}
                className="flex gap-5 mb-3 items-center text-primary"
              >
                <svg
                  width="18"
                  height="21"
                  viewBox="0 0 13 21"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8 20.3476H4C3.73478 20.3476 3.48043 20.2432 3.29289 20.0574C3.10536 19.8716 3 19.6195 3 19.3567V13.2127H1C0.734784 13.2127 0.48043 13.1082 0.292893 12.9224C0.105357 12.7366 0 12.4845 0 12.2217V8.65419C0 8.39137 0.105357 8.13931 0.292893 7.95347C0.48043 7.76763 0.734784 7.66322 1 7.66322H3V5.97857C3.0701 4.46868 3.74062 3.04772 4.86497 2.02637C5.98932 1.00502 7.47602 0.466384 9 0.528231H12C12.2652 0.528231 12.5196 0.632637 12.7071 0.81848C12.8946 1.00432 13 1.25638 13 1.5192V5.0867C13 5.34952 12.8946 5.60158 12.7071 5.78742C12.5196 5.97326 12.2652 6.07767 12 6.07767H9V7.66322H12C12.1544 7.66206 12.307 7.69635 12.4458 7.7634C12.5846 7.83045 12.7058 7.92845 12.8 8.0497C12.8931 8.17277 12.9561 8.31565 12.9839 8.46701C13.0116 8.61837 13.0035 8.77406 12.96 8.92175L11.96 12.4892C11.8995 12.7036 11.768 12.8915 11.5866 13.0228C11.4052 13.154 11.1844 13.2209 10.96 13.2127H9V19.3567C9 19.6195 8.89464 19.8716 8.70711 20.0574C8.51957 20.2432 8.26522 20.3476 8 20.3476ZM5 18.3657H7V12.2217C7 11.9589 7.10536 11.7068 7.29289 11.521C7.48043 11.3351 7.73478 11.2307 8 11.2307H10.24L10.68 9.64516H8C7.73478 9.64516 7.48043 9.54075 7.29289 9.35491C7.10536 9.16907 7 8.91701 7 8.65419V5.97857C7.02568 5.47029 7.24767 4.99127 7.62 4.64076C7.99233 4.29024 8.48645 4.09509 9 4.09573H11V2.51017H9C8.00681 2.45021 7.02982 2.78074 6.28098 3.43005C5.53214 4.07937 5.07186 4.9951 5 5.97857V8.65419C5 8.91701 4.89464 9.16907 4.70711 9.35491C4.51957 9.54075 4.26522 9.64516 4 9.64516H2V11.2307H4C4.26522 11.2307 4.51957 11.3351 4.70711 11.521C4.89464 11.7068 5 11.9589 5 12.2217V18.3657Z"
                    className="fill-primary"
                  />
                </svg>
              </Link>
              <Link
                href={"/"}
                className="flex gap-5 mb-3 items-center text-primary"
              >
                <svg
                  width="19"
                  height="18"
                  viewBox="0 0 19 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8.999 4.4231C7.77264 4.4231 6.59651 4.90587 5.72934 5.76521C4.86217 6.62454 4.375 7.79006 4.375 9.00534C4.375 10.2206 4.86217 11.3861 5.72934 12.2455C6.59651 13.1048 7.77264 13.5876 8.999 13.5876C10.2254 13.5876 11.4015 13.1048 12.2687 12.2455C13.1358 11.3861 13.623 10.2206 13.623 9.00534C13.623 7.79006 13.1358 6.62454 12.2687 5.76521C11.4015 4.90587 10.2254 4.4231 8.999 4.4231ZM8.999 11.9812C8.20229 11.9812 7.43821 11.6676 6.87485 11.1093C6.31149 10.551 5.995 9.79387 5.995 9.00435C5.995 8.21484 6.31149 7.45766 6.87485 6.89938C7.43821 6.34111 8.20229 6.02748 8.999 6.02748C9.79571 6.02748 10.5598 6.34111 11.1231 6.89938C11.6865 7.45766 12.003 8.21484 12.003 9.00435C12.003 9.79387 11.6865 10.551 11.1231 11.1093C10.5598 11.6676 9.79571 11.9812 8.999 11.9812Z"
                    className="fill-primary"
                  />
                  <path
                    d="M13.8055 5.32306C14.4009 5.32306 14.8835 4.84478 14.8835 4.25479C14.8835 3.6648 14.4009 3.18652 13.8055 3.18652C13.2102 3.18652 12.7275 3.6648 12.7275 4.25479C12.7275 4.84478 13.2102 5.32306 13.8055 5.32306Z"
                    className="fill-primary"
                  />
                  <path
                    d="M17.533 3.16853C17.3015 2.57611 16.9477 2.03811 16.4943 1.58898C16.0409 1.13985 15.4979 0.789479 14.9 0.560296C14.2003 0.300025 13.4611 0.159291 12.714 0.144088C11.751 0.102468 11.446 0.0905762 9.00395 0.0905762C6.56195 0.0905762 6.24895 0.0905761 5.29395 0.144088C4.54734 0.158514 3.80871 0.299276 3.10995 0.560296C2.51189 0.789212 1.96872 1.13949 1.51529 1.58865C1.06186 2.03782 0.708182 2.57595 0.476953 3.16853C0.214258 3.86183 0.0725676 4.59438 0.0579531 5.33479C0.0149531 6.28811 0.00195312 6.59035 0.00195312 9.01129C0.00195312 11.4312 0.00195312 11.7394 0.0579531 12.6878C0.0729531 13.429 0.213953 14.1604 0.476953 14.855C0.708831 15.4474 1.06285 15.9853 1.51639 16.4344C1.96993 16.8835 2.51302 17.2339 3.11095 17.4633C3.80839 17.734 4.54732 17.8848 5.29595 17.9092C6.25895 17.9508 6.56395 17.9637 9.00595 17.9637C11.448 17.9637 11.761 17.9637 12.716 17.9092C13.4631 17.8942 14.2022 17.7538 14.902 17.494C15.4997 17.2643 16.0426 16.9136 16.4959 16.4644C16.9493 16.0151 17.3031 15.4771 17.535 14.8848C17.798 14.1911 17.939 13.4598 17.954 12.7185C17.997 11.7652 18.01 11.463 18.01 9.04201C18.01 6.62107 18.01 6.31387 17.954 5.36551C17.9423 4.61463 17.7999 3.87138 17.533 3.16853V3.16853ZM16.315 12.6145C16.3085 13.1856 16.2033 13.7513 16.004 14.2872C15.8538 14.6726 15.6239 15.0225 15.329 15.3145C15.0342 15.6066 14.6809 15.8342 14.292 15.9828C13.7572 16.1794 13.1923 16.2837 12.622 16.291C11.672 16.3346 11.404 16.3455 8.96795 16.3455C6.52995 16.3455 6.28095 16.3455 5.31295 16.291C4.74288 16.2841 4.17828 16.1798 3.64395 15.9828C3.25364 15.8351 2.89895 15.6079 2.60284 15.3158C2.30673 15.0237 2.07579 14.6733 1.92495 14.2872C1.7284 13.7571 1.62326 13.198 1.61395 12.6333C1.57095 11.6919 1.56095 11.4263 1.56095 9.01229C1.56095 6.59729 1.56095 6.35054 1.61395 5.39029C1.62042 4.81951 1.72561 4.25406 1.92495 3.71852C2.22995 2.93664 2.85495 2.32125 3.64395 2.02198C4.17854 1.8259 4.74298 1.72168 5.31295 1.71379C6.26395 1.67117 6.53095 1.65928 8.96795 1.65928C11.405 1.65928 11.655 1.65928 12.622 1.71379C13.1924 1.72059 13.7573 1.82485 14.292 2.02198C14.6809 2.17089 15.0341 2.39875 15.3289 2.69091C15.6238 2.98308 15.8537 3.3331 16.004 3.71852C16.2005 4.24864 16.3056 4.80776 16.315 5.37245C16.358 6.31486 16.369 6.57945 16.369 8.99445C16.369 11.4085 16.369 11.6681 16.326 12.6155H16.315V12.6145Z"
                    className="fill-primary"
                  />
                </svg>
              </Link>
              <Link
                href={"/"}
                className="flex gap-5 mb-3 items-center text-primary"
              >
                <svg
                  width="18"
                  height="16"
                  viewBox="0 0 20 17"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6.5096 16.4988H6.4296C4.81796 16.4848 3.22963 16.1159 1.7796 15.4187C1.51288 15.2945 1.29326 15.089 1.15291 14.8322C1.01255 14.5754 0.958829 14.2809 0.999603 13.9917C1.04395 13.7005 1.17999 13.4306 1.38831 13.2206C1.59663 13.0107 1.86657 12.8712 2.1596 12.8223C3.05821 12.7035 3.92269 12.4034 4.6996 11.9404C3.35076 10.8953 2.31235 9.50811 1.69442 7.92576C1.07649 6.34341 0.902054 4.62488 1.1896 2.95228C1.22859 2.68734 1.34357 2.43909 1.52085 2.23705C1.69813 2.03502 1.93026 1.88771 2.1896 1.81266C2.44192 1.73414 2.71195 1.73078 2.96617 1.80301C3.22039 1.87524 3.44761 2.01988 3.6196 2.21896C4.20361 2.97783 4.9375 3.61084 5.77651 4.07937C6.61552 4.5479 7.54206 4.84214 8.4996 4.94412C8.54534 3.77662 9.05164 2.67353 9.9096 1.87212C10.338 1.4656 10.8438 1.14763 11.3974 0.936752C11.9511 0.725871 12.5415 0.626291 13.1344 0.643815C13.7273 0.661339 14.3107 0.795617 14.8507 1.03882C15.3907 1.28203 15.8764 1.6293 16.2796 2.0604C16.3846 2.15243 16.5152 2.21108 16.6542 2.22875C16.7933 2.24642 16.9345 2.22229 17.0596 2.1595C17.298 2.04806 17.5635 2.00611 17.8251 2.03855C18.0867 2.07098 18.3336 2.17646 18.5369 2.34268C18.7403 2.50889 18.8918 2.729 18.9737 2.9773C19.0556 3.22561 19.0646 3.49188 18.9996 3.74505C18.769 4.68659 18.3319 5.56625 17.7196 6.32157C17.5846 9.14063 16.3305 11.7925 14.2305 13.699C12.1306 15.6054 9.35527 16.6119 6.5096 16.4988ZM6.5096 14.5169H6.5896C7.75227 14.5565 8.91131 14.367 9.99953 13.9594C11.0878 13.5518 12.0835 12.9342 12.929 12.1424C13.7746 11.3506 14.4531 10.4003 14.9253 9.34669C15.3974 8.29306 15.6538 7.15703 15.6796 6.00446C15.6961 5.68859 15.8276 5.38935 16.0496 5.16214C16.2935 4.85617 16.5015 4.52371 16.6696 4.17117C16.3094 4.17185 15.953 4.09717 15.6239 3.95202C15.2948 3.80687 15.0002 3.59452 14.7596 3.32884C14.5282 3.10147 14.2534 2.92213 13.9511 2.80132C13.6489 2.6805 13.3254 2.62065 12.9996 2.62526C12.6705 2.61682 12.343 2.67289 12.0358 2.79023C11.7286 2.90757 11.4478 3.08387 11.2096 3.30903C10.8882 3.61127 10.6525 3.99187 10.5261 4.41273C10.3998 4.8336 10.3872 5.27996 10.4896 5.70717L10.7496 6.83688L9.5796 6.91615C8.3807 7.01303 7.17487 6.85051 6.04562 6.43985C4.91637 6.02919 3.89069 5.3802 3.0396 4.53783C3.0031 5.84234 3.3324 7.13132 3.9909 8.26147C4.64939 9.39161 5.61127 10.3186 6.7696 10.9395L7.7196 11.4746L7.0896 12.3665C6.4083 13.2519 5.47479 13.9147 4.4096 14.2691C5.09292 14.4389 5.79517 14.5221 6.4996 14.5169H6.5096Z"
                    className="fill-primary"
                  />
                </svg>
              </Link>
              <Link
                href={"/"}
                className="flex gap-5 mb-3 items-center text-primary"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M22.5396 3.60811C22.4208 3.1378 22.1789 2.70689 21.8382 2.3589C21.4976 2.0109 21.0703 1.75815 20.5996 1.62617C18.8796 1.20996 11.9996 1.20996 11.9996 1.20996C11.9996 1.20996 5.1196 1.20996 3.3996 1.66581C2.92884 1.79779 2.50157 2.05054 2.16094 2.39854C1.82031 2.74653 1.57838 3.17744 1.4596 3.64775C1.14481 5.37754 0.990831 7.13231 0.999595 8.88998C0.988374 10.6609 1.14236 12.429 1.4596 14.1719C1.59055 14.6276 1.8379 15.0421 2.17774 15.3754C2.51758 15.7087 2.93842 15.9495 3.3996 16.0745C5.1196 16.5304 11.9996 16.5304 11.9996 16.5304C11.9996 16.5304 18.8796 16.5304 20.5996 16.0745C21.0703 15.9425 21.4976 15.6898 21.8382 15.3418C22.1789 14.9938 22.4208 14.5629 22.5396 14.0926C22.852 12.3758 23.0059 10.6344 22.9996 8.88998C23.0108 7.11907 22.8568 5.35093 22.5396 3.60811V3.60811Z"
                    className="stroke-primary"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M9.75 12.1304L15.5 8.88989L9.75 5.64941V12.1304Z"
                    className="stroke-primary"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            </div>
              
          <Link href={"/"} className="mx-auto md:mx-0">
            <Image
              src="/images/img-title.svg"
              width={128}
              height={32}
              alt={`Tickits`}
            />
          </Link>
          <p className="text-primary-label text-sm md:text-base text-center md:text-left px-4 md:px-0">
            {t("footer.description")}
          </p>
        </div>
        <div className="flex-1 flex flex-col gap-3">
          <p className="font-bold mb-3 md:mb-5 text-center md:text-left">{t("footer.title_contact")}</p>
          <div className="flex flex-col gap-2 md:gap-3 text-sm md:text-base text-center md:text-left">
            <p>Địa chỉ: Số 2 Trường Sa, P.17, Q. Bình Thạnh
            Tp. Hồ Chí Minh</p>
            <p>Điện thoại: (84).28.38400532</p>
            <p>Fax: (84).28.38400542</p>
            <p>Email: phanhieu@tlu.edu.vn</p>
          </div>
        </div>
        <div className="flex flex-col gap-2 md:gap-3 text-sm md:text-base text-center md:text-left">
          <p className="font-bold mb-3 md:mb-5 text-black text-center md:text-left">{t("footer.title_tags")}</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              <button 
              className="btn btn-primary text-white" 
              onClick={() => router.push(`/signup`)}
              >{t("footer.tags_button_signup")}</button>
              <button 
              className="btn btn-primary text-white "
              onClick={() => router.push(`/signin`)}
              >{t("footer.tags_button_login")}</button>
              <button 
              className="btn btn-primary text-white "
              onClick={() => router.push(`/movies`)}
              >{t("footer.tags_button_movies")}</button>
              <button 
              className="btn btn-primary text-white "
              onClick={() => router.push(`/buy-tickets`)}
              >{t("footer.tags_button_buy_ticket")}</button>
              <button 
              className="btn btn-primary text-white "
              onClick={() => router.push(`/events`)}
              >{t("footer.tags_button_event")}</button>
              <button 
              className="btn btn-primary text-white "
              onClick={() => router.push(`/contact`)}
              >{t("footer.tags_button_contact")}</button>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center text-center px-4 md:px-10 pb-6 md:pb-10 text-sm md:text-base">
        © 2025 FastTicket. All Rights Reserved.
      </div>
    </footer>
  );
}

export default Footer;
