import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { MdDownloadForOffline } from 'react-icons/md';
import { AiTwotoneDelete } from 'react-icons/ai';
import { BsFillArrowUpRightCircleFill } from 'react-icons/bs';

import { client, urlFor } from '../client';
import { fetchUser } from '../utils/fetchUser';

const Pin = ({ pin: { postedBy, _id, image, destination, save } }) => {
    const [postHovered, setPostHovered] = useState(false);
    // const [savingPost, setSavingPost] = useState(false);

    const navigate = useNavigate();

    const user = fetchUser();

    // console.log(save)

    // --return boolean expression to check saved or not save post--
    const alreadySaved = !!(save?.filter((item) => item.postedBy._id === user?.googleID))?.length;

    const savePin = (id) => {
        if (!alreadySaved) {
            // setSavingPost(true);

            client
                .patch(id)
                .setIfMissing({ save: [] })
                .insert('after', 'save[-1]', [{
                    _key: uuidv4(),
                    userId: user?.googleID,
                    postedBy: {
                        _type: 'postedBy',
                        _ref: user?.googleID
                    }
                }])
                .commit()
                .then(() => {
                    window.location.reload();
                    // setSavingPost(false);
                })
        }
    };

    const deletePin = (id) => {
        client
            .delete(id)
            .then(() => {
                window.location.reload();
            })
    };

    

    return (
        <section className="m-2">
            <div
                onMouseEnter={() => setPostHovered(true)}
                onMouseLeave={() => setPostHovered(false)}
                onClick={() => navigate(`/pin-detail/${_id}`)}
                className='relative cursor-zoom-in w-auto hover:shadow-lg rounded-lg overflow-hidden transition-all duration-500 ease-in-out'
            >
                <img src={urlFor(image).width(250).url()} alt="user-post" className="rounded-lg w-full shadow-sm" />
                {/* --if post hovered then show */}
                {postHovered && (
                    <div className="absolute top-0 w-full h-full flex flex-col justify-between p-1 py-2 pr-2 z-50">
                        <div className="flex justify-between items-center">
                            {/* --download icon-- */}
                            <div className="flex gap-2">
                                <a
                                    href={`${image?.asset?.url}?dl=`}
                                    download
                                    onClick={(e) => e.stopPropagation()}
                                    className='bg-green-200 w-9 h-9 rounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none'
                                >
                                    <MdDownloadForOffline color='red' />
                                </a>
                            </div>
                            {/* --check if user have already save the icon or not-- */}
                            {alreadySaved ? (
                                <button type='button' className='bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none'>
                                    {/* --no of people saved the post-- */}
                                    {save?.length}  Saved
                                </button>
                            ) : (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        savePin(_id);
                                    }}
                                    type='button'
                                    className='bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none'>
                                    Save
                                </button>
                            )}
                        </div>

                        {/*  */}
                        <div className="flex justify-between items-center gap-2 w-full">
                            {/* --check if destination exist then render url-- */}
                            {destination && (
                                <a
                                    href={destination}
                                    target="_blank"
                                    rel='noreferrer'
                                    className='bg-green-200 flex items-center gap-2 text-black font-bold p-2 px-4 rounded-full opacity-70 hover:opacity-100 hover:shadow-md'
                                >
                                    <BsFillArrowUpRightCircleFill color='red' />
                                    {destination.length > 15 ? `${destination.slice(0, 14)}...` : destination }
                                </a>
                            )}
                            {/* --check postedBy then render delete icon-- */}
                            {postedBy?._id === user?.googleID && (

                                <button
                                    type='button'
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        deletePin(_id);
                                    }}
                                    className='bg-green-200 p-2 opacity-70 hover:opacity-100 font-bold text-base rounded-3xl hover:shadow-md outline-none'
                                >
                                    <AiTwotoneDelete color='red' />
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
            {/* --Link to the profile of the user who created the pin-- */}
            <Link
                to={`user-profile/${postedBy?._id}`}
                className='flex items-center gap-2 mt-2'    
            >
                <img src={postedBy?.image} alt="user-profile" className="w-8 h-8 rounded-full object-cover" />
                <p className="font-semibold capitalize">{postedBy?.username}</p>
            </Link>

        </section>
    )
}

export default Pin;