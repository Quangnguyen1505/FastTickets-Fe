import { useEffect, useMemo, useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import debounce from 'lodash/debounce';

import Logout from './Logout';
import SearchBar from './SearchBar';
import { getProfile } from '@/utils/https/user';
import { usersAction } from '@/redux/slice/users';

import { useTranslation } from 'next-i18next';
import { getNotifications } from '@/utils/https/notification';
import useSocket from '@/hook/useSocket';
import { getMovies } from '@/utils/https/movies';

function Header() {
  const { t } = useTranslation('common');
  const navLists = t('nav');
  console.log("navList:", navLists);
  const navList = useMemo(() => t('nav', { returnObjects: true }) || [], [t]);
  const languages = useMemo(() => t('languages', { returnObjects: true }) || [], [t]);
  
  const router = useRouter();

  const changeLanguage = (lang) => {
    const { pathname, asPath, query } = router;
    router.push({ pathname, query }, asPath, { locale: lang });
  };

  const dispatch = useDispatch();
  const controller = useMemo(() => new AbortController(), []);
  const userStore = useSelector((state) => state.user.data);
  const token = userStore.tokens?.accessToken;
  const userId = userStore.shop?.id;
  console.log("Languages data:", languages);
  const [search, setSearch] = useState("");
  const [searchBar, setSearchBar] = useState(false);
  const [drawer, setDrawer] = useState(false);

  const [logout, setLogout] = useState(false);

  const [isOpen, setIsOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);

  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const notificationCount = notifications.length;

  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const moviesController = useMemo(
    () => new AbortController(),
    [search]
  );

  const backendNotificationUrl = process.env.NEXT_PUBLIC_BACKEND_NOTIFICATION_URL || "http://localhost:8001";
  const { socket, messages: receivedMessages } = useSocket(backendNotificationUrl, "/socket.io", "notification");
  useEffect(() => {
    if (receivedMessages.length === 0) return;

    const latestMessage = receivedMessages[receivedMessages.length - 1];

    setNotifications((prevNotifications) => [
      {
        id: Math.random().toString(36).slice(2), // Tạo ID ngẫu nhiên
        content: latestMessage.content,
        type: latestMessage.type,
        createdAt: new Date(latestMessage.createdAt),
        options: latestMessage.options || {},
      },
      ...prevNotifications,
    ]);
  }, [receivedMessages]);

  useEffect(() => {
      const handleProfileUpdate = () => {
        if (token) fetchProfile();
      };  

      const fetchProfile = async () => {
        try {
          const res = await getProfile(token, userId, controller);
          console.log("res ", res);
          
          if (res.data.status === 200) {
            const userData = res.data.metadata;
            let first_name = userData.usr_first_name;
        
            let last_name = userData.usr_last_name;
            if (first_name === "null") {
              first_name = null;
            }
            if (last_name === "null") {
              last_name = null;
            }
  
            const image = userData.usr_avatar_url;
  
            let phone = userData.usr_phone;
            if (phone === "null") {
              phone = null;
            }

            const email = userData.usr_email;
            dispatch(usersAction.setProfile({first_name, last_name, email, image, phone})); 
          }
        } catch (error) {
          console.error("error get profile:", error);
        }
      };

      const fetchNotifications = async () => {
        try {
          const res = await getNotifications(userId, token, controller);
          console.log("res noti", res);
          if (res.data && res.data.metadata && res.data.metadata.notifications) {
            setNotifications(res.data.metadata.notifications.map(noti => ({
              id: noti.id,
              content: noti.noti_content,
              type: noti.noti_type,
              createdAt: new Date(noti.created_at),
              options: noti.noti_options
            })));
          }
        } catch (error) {
          console.error("error get notifications:", error);
        }
      }


  
    if (token) {
      fetchProfile();
      fetchNotifications();
    }
    window.addEventListener('profileUpdated', handleProfileUpdate);
    return () => window.removeEventListener('profileUpdated', handleProfileUpdate);
    }, [token, dispatch]);

    const formatTimeAgo = (date) => {
      const now = new Date();
      const diffInSeconds = Math.floor((now - date) / 1000);
      
      if (diffInSeconds < 60) return 'Vừa xong';
      if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} phút trước`;
      if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} giờ trước`;
      return `${Math.floor(diffInSeconds / 86400)} ngày trước`;
    }; 

  const handleMenuToggle = () => {
    setIsOpen(!isOpen);
  };
  const user = useSelector((state) => state.user);

  const navigate = (path, options = "") => {
    return router.push(path, options);
  };

  const handleNotificationClick = (notification) => {
    console.log("notification ", notification);
    const typeNotiPath = {
      Movies: '/movies',
      Events: '/events',
      Profile: '/profile/history'
    };
    if (notification.type === "MOVIE") {
      router.push(`${typeNotiPath.Movies}/${notification.options.id}`);
    }
    else if (notification.type === "EVENT") {
      router.push(`${typeNotiPath.Events}/${notification.options.id}`);
    }
    else if (notification.type === "BOOKING") {
      router.push(typeNotiPath.Profile);
    }
  };

  const searchMovies = debounce(async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    
    try {
      console.log('Searching for:', query);
      const params = {
        limit: 100,
        page: 1,
        search: query,
      }
      const res = await getMovies(params, moviesController);
      setSearchResults(res.data.metadata);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  }, 500);

  useEffect(() => {
    if (search) {
      setIsSearching(true);
      searchMovies(search);
    } else {
      setSearchResults([]);
      setIsSearching(false);
    }
  }, [search]);

  useEffect(() => {
    return () => {
      searchMovies.cancel();
    };
  }, []);

  return (
    <>
      <Logout isOpen={logout} onClose={() => setLogout(false)} />
      <header className="fixed top-0 w-full z-40">
        <div className="mw-global w-full global-px flex py-4 md:py-7 justify-between items-center bg-white lg:bg-opacity-90 lg:backdrop-blur-sm z-20 ">
          <div className="flex items-center gap-14">
            <Link href={"/"}>
              <Image
                src="/images/img-title.svg"
                width={128}
                height={32}
                alt={`Tickits`}
                className="w-24 md:w-32"
              />
            </Link>
            <nav className="hidden lg:flex gap-7 lg:gap-8 xl:gap-12 2xl:gap-14 list-none">
              {navList.map((item) => (
                <li key={item.title}>
                  {item.subMenu ? (
                    <div className="dropdown dropdown-hover">
                      <label
                        tabIndex={0}
                        className="font-medium flex items-center gap-2 cursor-pointer"
                      >
                        <Link href={item.url} className="flex items-center gap-2">
                          {item.title}
                          <svg
                            width="10"
                            height="6"
                            viewBox="0 0 10 6"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M8.96718 0.982517C8.89779 0.912989 8.81538 0.857828 8.72465 0.820192C8.63392 0.782556 8.53665 0.763184 8.43843 0.763184C8.3402 0.763184 8.24294 0.782556 8.15221 0.820192C8.06148 0.857828 7.97906 0.912989 7.90968 0.982517L4.99968 3.89252L2.08968 0.982516C1.94945 0.842283 1.75925 0.763501 1.56093 0.763501C1.36261 0.763501 1.17241 0.842283 1.03218 0.982516C0.891945 1.12275 0.813164 1.31295 0.813164 1.51127C0.813164 1.70959 0.891945 1.89978 1.03218 2.04002L4.47468 5.48252C4.54406 5.55204 4.62648 5.6072 4.71721 5.64484C4.80794 5.68248 4.9052 5.70185 5.00343 5.70185C5.10165 5.70185 5.19892 5.68248 5.28965 5.64484C5.38038 5.6072 5.46279 5.55204 5.53218 5.48252L8.97468 2.04002C9.25968 1.75502 9.25968 1.27502 8.96718 0.982517Z"
                              fill="#14142B"
                            />
                          </svg>
                        </Link>
                      </label>
                      <ul
                        tabIndex={0}
                        className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
                      >
                        {item.subMenu.map((subItem) => (
                          <li key={subItem.title}>
                            <Link href={subItem.url}>{subItem.title}</Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <Link href={item.url} className="font-medium flex items-center gap-2">
                      <p>{item.title}</p>
                    </Link>
                  )}
                </li>
              ))}
            </nav>
          </div>
          <div className="hidden lg:flex  items-center gap-8">
            <div className="dropdown dropdown-hover bg-transparent">
              <label
                tabIndex={0}
                className="font-medium flex items-center gap-3"
              >
                <svg 
                  style={{ marginRight: "-20px" }}
                  width="60px" 
                  height="25px" 
                  viewBox="0 0 25 25" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M5.5 16.5H19.5M5.5 8.5H19.5M4.5 12.5H20.5M12.5 20.5C12.5 20.5 8 18.5 8 12.5C8 6.5 12.5 4.5 12.5 4.5M12.5 4.5C12.5 4.5 17 6.5 17 12.5C17 18.5 12.5 20.5 12.5 20.5M12.5 4.5V20.5M20.5 12.5C20.5 16.9183 16.9183 20.5 12.5 20.5C8.08172 20.5 4.5 16.9183 4.5 12.5C4.5 8.08172 8.08172 4.5 12.5 4.5C16.9183 4.5 20.5 8.08172 20.5 12.5Z" stroke="#121923" stroke-width="1.2"/>
                </svg>
                <p>{t('language_label')}</p>
                <svg
                  width="10"
                  height="6"
                  viewBox="0 0 10 6"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8.96718 0.982517C8.89779 0.912989 8.81538 0.857828 8.72465 0.820192C8.63392 0.782556 8.53665 0.763184 8.43843 0.763184C8.3402 0.763184 8.24294 0.782556 8.15221 0.820192C8.06148 0.857828 7.97906 0.912989 7.90968 0.982517L4.99968 3.89252L2.08968 0.982516C1.94945 0.842283 1.75925 0.763501 1.56093 0.763501C1.36261 0.763501 1.17241 0.842283 1.03218 0.982516C0.891945 1.12275 0.813164 1.31295 0.813164 1.51127C0.813164 1.70959 0.891945 1.89978 1.03218 2.04002L4.47468 5.48252C4.54406 5.55204 4.62648 5.6072 4.71721 5.64484C4.80794 5.68248 4.9052 5.70185 5.00343 5.70185C5.10165 5.70185 5.19892 5.68248 5.28965 5.64484C5.38038 5.6072 5.46279 5.55204 5.53218 5.48252L8.97468 2.04002C9.25968 1.75502 9.25968 1.27502 8.96718 0.982517Z"
                    fill="#14142B"
                  />
                </svg>
              </label>
              <ul
                tabIndex={0}
                className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
              >
                {languages?.map(({ key, title, flag }) => (
                  <li key={key}>
                    <div 
                      className="flex items-center justify-between px-4 py-2 cursor-pointer hover:bg-gray-100"
                      onClick={() => changeLanguage(key)}
                    >
                      <span>{title}</span>
                      <Image
                        src={`/images/${flag}`}
                        width={23}
                        height={23}
                        alt="Flags"
                        className="w-23 h-23 md:w-5 md:h-5"
                        style={{ width: "23px", height: "23px" }} 
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <button
                className="flex items-center rounded-full hover:bg-gray-300 transition-colors p-2"
                onClick={() => setSearchBar(!searchBar)}
                key={"search-btn"}
              >
                <svg
                  width="19"
                  height="19"
                  viewBox="0 0 19 19"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8 16C9.77498 15.9996 11.4988 15.4054 12.897 14.312L17.293 18.708L18.707 17.294L14.311 12.898C15.405 11.4997 15.9996 9.77544 16 8C16 3.589 12.411 0 8 0C3.589 0 0 3.589 0 8C0 12.411 3.589 16 8 16ZM8 2C11.309 2 14 4.691 14 8C14 11.309 11.309 14 8 14C4.691 14 2 11.309 2 8C2 4.691 4.691 2 8 2Z"
                    className="fill-primary-label"
                  />
                </svg>
              </button>
              <div
                className={`absolute bg-white shadow rounded-md right-0 top-[4.5rem] p-3 ${
                  searchBar
                    ? "dropdown transition duration-300 ease-in-out opacity-100 transform translate-y-1"
                    : "dropdown transition duration-200 ease-in-out opacity-0 transform -translate-y-1 invisible"
                }`}
              >
                <SearchBar
                  search={search}
                  setValue={setSearch}
                  className="w-52"
                />

                {search && (
                  <div className="mt-2 w-64 max-h-96 overflow-y-auto">
                    {isSearching ? (
                      <div className="p-4 text-center">
                        <span className="loading loading-spinner text-primary"></span>
                      </div>
                    ) : searchResults.length > 0 ? (
                      searchResults.map((movie) => (
                        <Link
                          key={movie.id}
                          href={`/movies/${movie.id}`}
                          className="flex items-center p-3 hover:bg-gray-100 transition-colors gap-3"
                          onClick={() => setSearchBar(false)}
                        >
                          <img 
                            src={movie.movie_image_url || "/images/avatar-2-movie.jpg"} 
                            alt={movie.movie_title}
                            className="w-10 h-14 object-cover rounded" 
                          />
                          <div>
                            <p className="font-medium text-sm">{movie.movie_title}</p>
                            {/* <p className="text-xs text-gray-500">
                              {movie.genres.join(', ')}
                            </p> */}
                          </div>
                        </Link>
                      ))
                    ) : (
                      <div className="p-3 text-gray-500 text-sm">
                        Không tìm thấy kết quả
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            {user.isFulfilled && (
              <div className="relative">
                <button 
                  className="flex items-center p-2 hover:bg-gray-100 rounded-full relative transition-colors"
                  onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                >
                  <svg 
                    width="24" 
                    height="24" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-gray-700"
                  >
                    <path 
                      d="M12 22C13.1 22 14 21.1 14 20H10C10 21.1 10.9 22 12 22ZM18 16V11C18 7.93 16.37 5.36 13.5 4.68V4C13.5 3.17 12.83 2.5 12 2.5C11.17 2.5 10.5 3.17 10.5 4V4.68C7.64 5.36 6 7.92 6 11V16L4 18V19H20V18L18 16Z" 
                      fill="currentColor"
                    />
                  </svg>
                  
                  {notificationCount > 0 && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center transform translate-x-1 -translate-y-1">
                      {notificationCount}
                    </span>
                  )}
                </button>

                <div 
                  className={`absolute right-0 mt-2 w-72 bg-white shadow-lg rounded-lg overflow-hidden ${
                    isNotificationOpen ? 'block' : 'hidden'
                  }`}
                >
                  <div className="p-4 border-b border-gray-200">
                    <h3 className="font-semibold text-lg">Thông báo</h3>
                  </div>
                  
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map((notification) => (
                        <div 
                          key={notification.id}
                          className="p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0 cursor-pointer"
                          onClick={() => handleNotificationClick(notification)}
                        >
                          <p className="text-gray-700">{notification.content}</p>
                          {notification.options?.title && (
                            <p className="text-sm text-gray-500 mt-1">{notification.options.title}</p>
                          )}
                          <span className="text-xs text-gray-500 mt-1 block">
                            {formatTimeAgo(notification.createdAt)}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-gray-500">
                        Không có thông báo mới
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="m-auto relative min-w-[3rem] min-h-[1rem]">
              {user.isFulfilled ? (
                <div>
                  <div
                    className="avatar absolute h-full -translate-y-5 cursor-pointer"
                    onClick={handleMenuToggle}
                  >
                    <div className="w-14 h-14 rounded-full">
                      <Image
                        src={user.data?.image ? `${user.data.image}?${Date.now()}` : "/images/profile.png"}
                        alt="photo"
                        width={56}
                        height={56}
                        key={user.data?.image} // Thêm key này
                        onError={(e) => {
                          e.target.src = "/images/profile.png";
                        }}
                      />
                    </div>
                  </div>

                  <div
                    className={`${
                      isOpen
                        ? "dropdown transition duration-300 ease-in-out opacity-100 transform translate-y-2"
                        : "dropdown transition duration-200 ease-in-out opacity-0 transform -translate-y-0 invisible"
                    }  absolute right-0 z-10 mt-2 top-8 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none`}
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="menu-button"
                    tabIndex="-1"
                  >
                    <div className="py-1" role="none">
                      <Link
                        href="/profile"
                        className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100 hover:text-gray-900 transition-colors"
                        role="menuitem"
                        tabIndex="-1"
                        id="menu-item-0"
                      >
                        Profile
                      </Link>
                      {user.data.role_id === "2" && (
                        <Link
                          href="/admin"
                          className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100 hover:text-gray-900 transition-colors"
                          role="menuitem"
                          tabIndex="-1"
                          id="menu-item-0"
                        >
                          Admin Panel
                        </Link>
                      )}

                      {/* <form method="POST" action="#" role="none"> */}
                      <button
                        // type="submit"
                        className="text-gray-700 block w-full px-4 py-2 text-left text-sm hover:bg-gray-100 hover:text-gray-900 transition-colors"
                        role="menuitem"
                        tabIndex="-1"
                        id="menu-item-3"
                        onClick={() => {
                          setIsOpen(false);
                          setLogout(true);
                        }}
                      >
                        Logout
                      </button>
                      {/* </form> */}
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <button
                    className="btn btn-primary text-white btn-sm h-10 m-auto"
                    onClick={() => navigate("/signup")}
                  >
                    {t('sign_up')}
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="flex lg:hidden" key={"drawerBtnParent"}>
            <button
              className="flex p-2 hover:bg-gray-300 rounded-full transition-colors"
              onClick={() => setDrawer(!drawer)}
            >
              <svg
                width="16"
                height="14"
                viewBox="0 0 16 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0 1C0 0.734784 0.105357 0.48043 0.292893 0.292893C0.48043 0.105357 0.734784 0 1 0H15C15.2652 0 15.5196 0.105357 15.7071 0.292893C15.8946 0.48043 16 0.734784 16 1C16 1.26522 15.8946 1.51957 15.7071 1.70711C15.5196 1.89464 15.2652 2 15 2H1C0.734784 2 0.48043 1.89464 0.292893 1.70711C0.105357 1.51957 0 1.26522 0 1Z"
                  fill="black"
                />
                <path
                  d="M0 13C0 12.7348 0.105357 12.4804 0.292893 12.2929C0.48043 12.1054 0.734784 12 1 12H15C15.2652 12 15.5196 12.1054 15.7071 12.2929C15.8946 12.4804 16 12.7348 16 13C16 13.2652 15.8946 13.5196 15.7071 13.7071C15.5196 13.8946 15.2652 14 15 14H1C0.734784 14 0.48043 13.8946 0.292893 13.7071C0.105357 13.5196 0 13.2652 0 13Z"
                  fill="black"
                />
                <path
                  d="M7 6C6.73478 6 6.48043 6.10536 6.29289 6.29289C6.10536 6.48043 6 6.73478 6 7C6 7.26522 6.10536 7.51957 6.29289 7.70711C6.48043 7.89464 6.73478 8 7 8H15C15.2652 8 15.5196 7.89464 15.7071 7.70711C15.8946 7.51957 16 7.26522 16 7C16 6.73478 15.8946 6.48043 15.7071 6.29289C15.5196 6.10536 15.2652 6 15 6H7Z"
                  fill="black"
                />
              </svg>
            </button>
          </div>
        </div>
        <div
          className={`h-screen bg-black transition-all ${
            drawer ? `bg-opacity-80 visible ` : `bg-opacity-0 invisible hidden`
          } lg:hidden`}
          onClick={() => setDrawer(!drawer)}
        >
          <div
            className={`h-full bg-white w-full flex flex-col transform-gpu transition-all z-10 ${
              drawer ? `translate-x-0` : `-translate-x-full`
            }  `}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <div className="global-px mw-global w-full pt-3 pb-10 border-gray-200">
              <SearchBar
                value={search}
                setValue={setSearch}
                className={`w-full`}
              />
            </div>
            {navList?.map((item) => (
              <div key={item.title}>
                <hr />
                <div className="global-px mw-global">
                  {item.subMenu ? (
                    <div className="flex flex-col">
                      <Link
                        href={item.url}
                        onClick={(e) => {
                          e.preventDefault(); // Ngăn chuyển trang khi mở submenu
                          setOpenMenu(openMenu === item.title ? null : item.title);
                        }}
                        className="font-semibold py-4 flex justify-center items-center gap-2"
                      >
                        {item.title}
                        {/* Thêm mũi tên dropdown */}
                        <svg
                          width="10"
                          height="6"
                          viewBox="0 0 10 6"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className={`transform transition-transform duration-300 ${
                            openMenu === item.title ? "rotate-180" : ""
                          }`}
                        >
                          <path
                            d="M8.96718 0.982517C8.89779 0.912989 8.81538 0.857828 8.72465 0.820192C8.63392 0.782556 8.53665 0.763184 8.43843 0.763184C8.3402 0.763184 8.24294 0.782556 8.15221 0.820192C8.06148 0.857828 7.97906 0.912989 7.90968 0.982517L4.99968 3.89252L2.08968 0.982516C1.94945 0.842283 1.75925 0.763501 1.56093 0.763501C1.36261 0.763501 1.17241 0.842283 1.03218 0.982516C0.891945 1.12275 0.813164 1.31295 0.813164 1.51127C0.813164 1.70959 0.891945 1.89978 1.03218 2.04002L4.47468 5.48252C4.54406 5.55204 4.62648 5.6072 4.71721 5.64484C4.80794 5.68248 4.9052 5.70185 5.00343 5.70185C5.10165 5.70185 5.19892 5.68248 5.28965 5.64484C5.38038 5.6072 5.46279 5.55204 5.53218 5.48252L8.97468 2.04002C9.25968 1.75502 9.25968 1.27502 8.96718 0.982517Z"
                            fill="#14142B"
                          />
                        </svg>
                      </Link>
                      {openMenu === item.title && (
                        <div className="flex flex-col text-center">
                          {item.subMenu.map((subItem) => (
                            <Link
                              key={subItem.title}
                              href={subItem.url}
                              className="py-2 text-gray-600 hover:text-gray-900"
                            >
                              {subItem.title}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      href={item.url}
                      className="font-semibold py-4 flex justify-center items-center gap-2"
                    >
                      {item.title}
                    </Link>
                  )}
                </div>
              </div>
            ))}
            <hr />

            {user.isFulfilled ? (
              <>
                <div className="flex global-px py-4">
                  <div
                    className="flex flex-col gap-3 mx-auto items-center  cursor-pointer"
                    onClick={() => navigate("/profile")}
                  >
                    <div className="avatar h-full">
                      <div className="w-10 h-10 rounded-full">
                        <Image
                          src={user.data.image || "/images/profile.png"}
                          alt="photo"
                          width={56}
                          height={56}
                        />
                      </div>
                    </div>
                    <div className="">
                      <p className="font-semibold">{`${
                        user.data.first_name !== null
                          ? user.data.first_name
                          : ""
                      } ${
                        user.data.last_name !== null ? user.data.last_name : ""
                      }`}</p>
                    </div>
                  </div>
                </div>
                {user.data.role_id === "2" && <></>}
                <hr />
                <div className="flex justify-center text-center">
                  {user.data.role_id === "2" && (
                    <div
                      className="flex-1 font-semibold py-4 flex justify-center items-center gap-2 cursor-pointer border-r"
                      onClick={() => {
                        navigate("/admin");
                      }}
                    >
                      Admin Panel
                    </div>
                  )}
                  <div
                    className="flex-1 font-semibold py-4 flex justify-center items-center gap-2 cursor-pointer"
                    onClick={() => {
                      setDrawer(false);
                      setLogout(true);
                    }}
                  >
                    Logout
                  </div>
                </div>
              </>
            ) : (
              <div className="global-px flex flex-col py-4 gap-4">
                <button
                  className="btn btn-block btn-accent  m-auto"
                  onClick={() => navigate("/login")}
                >
                  Login
                </button>
                <button
                  className="btn btn-block text-white m-auto"
                  onClick={() => navigate("/signup")}
                >
                  Sign Up
                </button>
              </div>
            )}
            <hr />
            <div className="global-px mw-global pt-8 pb-4 text-primary-label text-center text-sm">
              © {new Date().getFullYear()} Tickitz. All Rights Reserved.
            </div>
          </div>
        </div>
      </header>
    </>
  );
}

export default Header;
