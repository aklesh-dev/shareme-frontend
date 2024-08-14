import React, { useState, useEffect } from 'react'
import { AiOutlineLogout } from 'react-icons/ai';
import { useParams, useNavigate } from 'react-router-dom';
import { googleLogout } from '@react-oauth/google';

import { userCreatedPinsQuery, userQuery, userSavedPinsQuery } from '../utils/data';
import { client } from '../client';
import MasonryLayout from './MasonryLayout';
import Spinner from './Spinner';


const activeBtnStyles = 'bg-red-500 text-white font-bold p-2 rounded-full outline-none w-20';
const notActiveBtnStyles = 'bg-primary text-black font-bold mr-4 p-2 rounded-full outline-none w-20';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [pins, setPins] = useState(null);
  const [text, setText] = useState('Created');
  const [activeBtn, setActiveBtn] = useState('created');
  const navigate = useNavigate();
  const { userId } = useParams();

  useEffect(() => {
    const query = userQuery(userId);
    client.fetch(query)
      .then(data => setUser(data[0]))
  }, [userId]);

  // --recall when text or userId changes
  useEffect(() => {
    if (text === 'Created') {
      const createdPinsQuery = userCreatedPinsQuery(userId);
      client.fetch(createdPinsQuery)
        .then(data => setPins(data))
    } else {
      const savedPinsQuery = userSavedPinsQuery(userId);
      client.fetch(savedPinsQuery)
        .then(data => setPins(data))
    }
  }, [text, userId]);




  const handleLogout = () => {
    googleLogout();
    localStorage.clear();
    navigate('/login');

    console.log('User logged out');
  };

  if (!user) {
    return <Spinner message="Loading profile ...." />
  }


  return (
    <section className="relative pb-2 h-full">
      <div className="flex flex-col pb-5 ">
        <div className="relative flex flex-col mb-7">
          <div className="flex flex-col justify-center items-center">
            <img src="https://images.unsplash.com/photo-1572705691113-72d5bbd51844?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              className='w-full h-370 2xl:h-510 shadow-lg object-cover'
              alt="banner-pic"
            />
            <img src={user.image} alt="user-pic" className="rounded-full w-20 h-20 -mt-10 shadow-lg" />
          </div>
          <h1 className="font-bold text-3xl text-center mt-3">
            {user.username}
          </h1>
          <div className="absolute top-0 z-1 right-0 p-2">
            {userId === user?._id && (
              <button
                type='button'
                className='bg-white p-2 rounded-full cursor-pointer'
                onClick={handleLogout}
              >
                <AiOutlineLogout color='red' fontSize={21} />
              </button>
            )}
          </div>
        </div>

        <div className="text-center mb-7">
          <button
            type='button'
            onClick={(e) => {
              setText(e.target.textContent);
              setActiveBtn('created')
            }}
            className={`${activeBtn === 'created' ? activeBtnStyles : notActiveBtnStyles}`}
          >
            Created
          </button>
          <button
            type='button'
            onClick={(e) => {
              setText(e.target.textContent);
              setActiveBtn('saved')
            }}
            className={`${activeBtn === 'saved' ? activeBtnStyles : notActiveBtnStyles}`}
          >
            Saved
          </button>
        </div>

        <div className="px-2 ">
          <MasonryLayout pins={pins} />
        </div>

        {pins?.length === 0 && (
          <div className="flex justify-center items-center font-bold w-full text-xl mt-2">
            <p>No Pins Found</p>
          </div>
        )}

      </div>
    </section>
  )
}

export default UserProfile;