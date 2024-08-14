import React, { useState, useEffect } from 'react';
import { MdDownloadForOffline } from 'react-icons/md';
import { Link, useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import { client, urlFor } from '../client';
import MasonryLayout from './MasonryLayout';
import Spinner from './Spinner';
import { pinDetailMorePinQuery, pinDetailQuery } from '../utils/data';


const PinDetail = ({ user }) => {
  const [pins, setPins] = useState(null);
  const [pinDetail, setPinDetail] = useState(null);
  const [comment, setComment] = useState('');
  const [addingComment, setAddingComment] = useState(false);
  /**
   * --pinId is set as dynamic paramete in path of pin-details route 
   * --Get the pin ID from the URL parameter
   */
  const { pinId } = useParams();

  const addComment = () => {
    if (comment) {
      setAddingComment(true);
      client
        .patch(pinId)
        .setIfMissing({ comments: [] })
        .insert('after', 'comments[-1]', [{
          comment,
          _key: uuidv4(),
          postedBy: {
            _type: 'PostedBy',
            _ref: user._id
          },
        }])
        .commit()
        .then(() => {
          fetchPinDetails();
          setComment('');
          setAddingComment(false);
        })
    }
  }


  // --Fetch the pin details and related pins from the server.
  const fetchPinDetails = () => {
    let query = pinDetailQuery(pinId);
    client.fetch(query)
      .then((data) => {
        setPinDetail(data[0]);
        // --Fetch related pins 
        if (data[0]) {
          query = pinDetailMorePinQuery(data[0]);
          client.fetch(query)
            .then((res) => {
              setPins(res);
            })
        }
      })
  };

  useEffect(() => {
    fetchPinDetails();
  }, [pinId]);

  // --If pin details are not available, display a loader.
  if (!pinDetail) return <Spinner message="Loading pin details..." />


  return (
    <>
      <section className="flex xl:flex-row flex-col m-auto bg-white" style={{ maxWidth: '1500px', borderRadius: '32px' }}>
        <div className="flex justify-center items-center md:items-start flex-initial">
          <img src={pinDetail?.image && urlFor(pinDetail.image).url()} alt="user-post" height={320} width={320} className='rounded-t-3xl rounded-b-lg' />
        </div>
        <div className="w-full p-5 flex-1 xl:min-w-620">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <a
                href={`${pinDetail.image?.asset?.url}?dl=`}
                download
                onClick={(e) => e.stopPropagation()}
                className='bg-green-200 w-9 h-9 rounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none'
              >
                <MdDownloadForOffline color='red' />
              </a>
            </div>
            <a
              href={pinDetail.destination}
              target='_blank'
              rel='noreferrer'
            >
              {pinDetail.destination}
            </a>
          </div>

          <div>
            <h1 className="text-4xl font-bold break-words mt-3">
              {pinDetail.title}
            </h1>
            <p className="mt-e">
              {pinDetail.about}
            </p>
          </div>
          <Link
            to={`user-profile/${pinDetail.postedBy?._id}`}
            className='flex items-center gap-2 mt-5 bg-white rounded-lg'
          >
            <img src={pinDetail.postedBy?.image} alt="user-profile" className="w-8 h-8 rounded-full object-cover" />
            <p className="font-semibold capitalize">{pinDetail.postedBy?.username}</p>
          </Link>
          <h2 className="mt-5 text-2xl">Comments</h2>
          <div className="max-h-370 overflow-y-auto">
            {pinDetail?.comments?.map((comment, index) => (
              <div className="flex gap-2 items-center mt-5 bg-white rounded-lg" key={index}>
                <img src={comment?.postedBy?.image} alt="user-profile" className="w-10 h-10 rounded-full cursor-pointer" />

                <div className="flex flex-col">
                  <p className="font-bold">
                    {comment?.postedBy?.username}

                  </p>
                  <p>{comment?.comment}</p>

                </div>
              </div>
            ))}
          </div>

          {/* --comment container-- */}
          <div className="flex flex-wrap mt-6 gap-3">
            <Link
              to={`user-profile/${pinDetail.postedBy?._id}`}

            >
              <img src={pinDetail.postedBy?.image} alt="user-profile" className="w-10 h-10 rounded-full cursor-pointer" />

            </Link>
            <input type="text"
              className='flex-1 border-2 border-gray-100 outline-none p-2 rounded-2xl focus:border-gray-300'
              placeholder='Add a comment'
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button
              type='button'
              className='bg-red-500 text-white rounded-full px-6 py-2 font-semibold text-base outline-none'
              onClick={addComment}
            >
              {addingComment ? 'Posting the comment...' : 'Post'}
            </button>
          </div>
        </div>
      </section>
      
      {
        // --check pin exist , in that case return react fragment
        pins?.length > 0 ? (
          <>
            <h2 className="text-center font-bold text-2xl mt-8 mb-4">
              More like this
            </h2>
            <MasonryLayout pins={pins} />
          </>
        ) : (
          <Spinner message='Loading more pins...' />
        )}
    </>
  )
}

export default PinDetail;