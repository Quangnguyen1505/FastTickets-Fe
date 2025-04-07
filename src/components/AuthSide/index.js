import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

function SideForAuth() {
  const router = useRouter();
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
                      <p className="text-black bg-auth md:text-3xl lg:text-5xl mt-[101px] md:w-[99%]">
                        Welcome to <br></br> Fast Ticket
                      </p>
                      <p className="text-black/70 bg-auth mt-[22px] md:text-lg lg:text-2xl md:w-[80%]">
                        Please Register to use more of our functions
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
                        Welcome to <br></br> Fast Ticket
                      </p>
                      <p className="text-black/70 bg-auth mt-[22px] md:text-lg lg:text-2xl md:w-[80%]">
                        Please Login to use more of our functions
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
                        Lets reset your password
                      </p>
                      <p className="text-black/70 bg-auth mt-[22px] md:text-lg lg:text-2xl md:w-[80%]">
                        To be able to use your account again, please complete the
                        following steps.
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
                        src="/images/logo-white.svg"
                        width={276}
                        height={104}
                        alt="icon"
                      />
                    </Link>
                  </div>
                  <p className="text-white md:text-3xl lg:text-5xl mt-[101px] md:w-[99%]">
                    Lets reset your password
                  </p>
                  <p className="text-white/70 mt-[22px] md:text-lg lg:text-2xl md:w-[80%]">
                    To be able to use your account again, please complete the
                    following steps.
                  </p>
                  <div className="flex mt-[58px]">
                    <p className="bg-white text-[#29034180]/50 w-[50px] h-[50px] text-[24px] rounded-full flex items-center justify-center">
                      1
                    </p>
                    <p className="text-white flex items-center justify-center ml-6 md:text-xl lg:text-[24px]">
                      Fill your complete email
                    </p>
                  </div>
                  <div className="h-12 w-[2px] bg-white md:ml-6"></div>
                  <div className="flex">
                    <p className="border-2 border-solid border-white  bg-opacity-0 text-white w-[50px] h-[50px] text-[24px] rounded-full flex items-center justify-center">
                      2
                    </p>
                    <p className="text-white/60 flex items-center justify-center ml-6  md:text-xl lg:text-[24px]">
                      Activate your email
                    </p>
                  </div>
                  <div className="h-12 w-[2px] bg-white md:ml-6"></div>
                  <div className="flex">
                    <p className="border-2 border-solid border-white  bg-opacity-0 text-white w-[50px] h-[50px] text-[24px] rounded-full flex items-center justify-center">
                      3
                    </p>
                    <p className="text-white/60 flex items-center justify-center ml-6  md:text-xl lg:text-[24px]">
                      Enter your new password
                    </p>
                  </div>
                  <div className="h-12 w-[2px] bg-white md:ml-6"></div>
                  <div className="flex">
                    <p className="border-2 border-solid border-white  bg-opacity-0 text-white w-[50px] h-[50px] text-[24px] rounded-full flex items-center justify-center">
                      4
                    </p>
                    <p className="text-white/60 flex items-center justify-center ml-6  md:text-xl lg:text-[24px]">
                      Done
                    </p>
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
