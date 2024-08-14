import React, { useEffect, useRef, useState } from 'react';
import { HiMenu } from 'react-icons/hi';
import { AiFillCloseCircle } from 'react-icons/ai';
import { Link, Route, Routes } from 'react-router-dom';

import { Sidebar, UserProfile } from '../components';
import Pins from './Pins';
import { userQuery } from '../utils/data';
import { client } from '../client';
import logo from '../assets/logo.png';
import { fetchUser } from '../utils/fetchUser';

const Home = () => {
  const [toggleSidebar, setToggleSidebar] = useState(false);
  const [user, setUser] = useState(null);

  const scrollRef = useRef(null);

  const userInfo = fetchUser();

  // --get user from sanity
  useEffect(() => {
    const query = userQuery(userInfo?.googleID);

    client.fetch(query)
      .then((data) => {
        setUser(data[0]);
      })
  }, []);

  // -- set the scroll to top
  useEffect(() => {
    scrollRef.current.scrollTo(0, 0);
  }, []);


  return (
    <section className='flex bg-gray-50 md:flex-row flex-col h-screen transition-height duration-75 ease-out'>
      <div className='hidden md:flex h-screen flex-initial'>
        {/* ---mobile sidebar-- */}
        {/* --- if user exist pass user--- */}
        <Sidebar user={user && user} />
      </div>

      <div className="flex md:hidden flex-row">
        <div className='p-2 w-full flex flex-row justify-between items-center shadow-md'>
          <HiMenu fontSize={40} className='cursor-pointer' onClick={() => setToggleSidebar(true)} />
          <Link to='/'>
            <img src={logo} alt="logo" className='w-28' />
          </Link>
          <Link to={`user-profile/${user?._id}`}>
            <img src={user?.image} alt="logo" className='w-14 rounded-full' />
          </Link>
        </div>
        {toggleSidebar && (
          <div className='fixed w-4/5 bg-white h-screen overflow-y-auto shadow-md z-10 animate-slide-in'>
            <div className='absolute w-full flex justify-end items-center p-2'>
              <AiFillCloseCircle fontSize={40} className='cursor-pointer' onClick={() => setToggleSidebar(false)} />
            </div>
            {/* --desktop sidebar-- */}
            {/* --- if user exist pass the user--- */}
            <Sidebar user={user && user} closeToggle={setToggleSidebar} />
          </div>
        )}
      </div>
      <div className="flex-1 pb-2 h-screen overflow-y-scroll" ref={scrollRef}>
        <Routes>
          <Route path='/user-profile/:userId' element={<UserProfile />} />
          {/* --if anythings else render that gone be pins container-- */}
          {/* --in pins container user is pass only if user exists */}
          <Route path='/*' element={<Pins user={user && user} />} />
        </Routes>
      </div>
    </section>
  )
}

export default Home;