import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

function SideForAuth() {
  const router = useRouter();
  const { t } = useTranslation('auth');
  return (
    <>
      <div className="md:flex-[0.8] lg:flex-[1] w-full">
        <div className="bg-hero-pattern bg-[#4f3c81] bg-cover w-full h-full bg-no-repeat hidden md:inline-block bg-slate-300/20">
          <div className="bg-auth/100 h-full  ">
            {router.pathname === "/signup" && (
              <>
                <div className="pt-20 md:ml-6 lg:ml-14 min-[1440px]:ml-28">
                  <div className="">
                    <Link href={"/"}>
                      <Image
                        src="/images/img-title.svg"
                        width={276}
                        height={104}
                        alt="icon"
                      />
                    </Link>
                  </div>
                  <div className="flex items-start">
                    <div className="mt-10">
                      <Link href={"/"}>
                        <Image
                          src="/images/signup.png"
                          width={276}
                          height={104}
                          alt="icon"
                        />
                      </Link>
                    </div>
                    <div>
                      <p 
                      className="text-black bg-auth md:text-3xl lg:text-5xl mt-[101px] md:w-[99%]"
                      >
                        {t('left.title_firt')} <br></br> {t('left.title_second')}
                      </p>
                      <p className="text-black/70 bg-auth mt-[22px] md:text-lg lg:text-2xl md:w-[80%]">
                        {t('left.description')} 
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
            {router.pathname === "/login" && (
              <>
                <div className="pt-20 md:ml-6 lg:ml-14 min-[1440px]:ml-28">
                  <div className="">
                    <Link href={"/"}>
                      <Image
                        src="/images/img-title.svg"
                        width={276}
                        height={104}
                        alt="icon"
                      />
                    </Link>
                  </div>
                  <div className="flex items-start">
                    <div className="mt-10">
                      <Link href={"/"}>
                        <Image
                          src="/images/signup-v3.png"
                          width={250}
                          height={90}
                          alt="icon"
                        />
                      </Link>
                    </div>
                    <div className="ml-">
                      <p className="text-black bg-auth md:text-3xl lg:text-5xl mt-[101px] md:w-[99%]">
                        {t('left.title_firt')} <br></br> {t('left.title_second')}
                      </p>
                      <p className="text-black/70 bg-auth mt-[22px] md:text-lg lg:text-2xl md:w-[80%]">
                        {t('left_login.description')}
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
            {router.pathname === "/reset-password" && (
              <>
                <div className="pt-20 md:ml-6 lg:ml-14 min-[1440px]:ml-28">
                  <div className="">
                    <Link href={"/"}>
                      <Image
                        src="/images/img-title.svg"
                        width={276}
                        height={104}
                        alt="icon"
                      />
                    </Link>
                  </div>
                  <div className="flex items-start">
                    <div className="mt-10">
                      <Link href={"/"}>
                        <Image
                          src="/images/login.png"
                          width={400}
                          height={200}
                          alt="icon"
                        />
                      </Link>
                    </div>
                    <div className="ml-[30px]">
                      <p className="text-black bg-auth md:text-3xl lg:text-5xl mt-[90px] md:w-[99%]">
                        {t('left_forgot_password.title')}
                      </p>
                      <p className="text-black/70 bg-auth mt-[22px] md:text-lg lg:text-2xl md:w-[80%]">
                        {t('left_forgot_password.description')}
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
            {router.pathname === "/reset-password/[otp]" && (
              <>
                <div className="pt-20 md:ml-6 lg:ml-14 min-[1440px]:ml-28">
                  <div className="">
                    <Link href={"/"}>
                      <Image
                        src="/images/img-title.svg"
                        width={276}
                        height={104}
                        alt="icon"
                      />
                    </Link>
                  </div>
                  <div className="flex items-start">
                    <div className="mt-10">
                      <Link href={"/"}>
                        <Image
                          src="/images/login.png"
                          width={400}
                          height={200}
                          alt="icon"
                        />
                      </Link>
                    </div>
                    <div className="ml-[30px]">
                      <p className="text-black bg-auth md:text-3xl lg:text-5xl mt-[90px] md:w-[99%]">
                        {t('left_reset_password.title')}
                      </p>
                      <p className="text-black/70 bg-auth mt-[22px] md:text-lg lg:text-2xl md:w-[80%]">
                        {t('left_reset_password.description')}
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default SideForAuth;
