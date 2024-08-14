import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { client } from '../client';
import MasonryLayout from './MasonryLayout';
import Spinner from './Spinner';
import { feedQuery, searchQuery } from '../utils/data';


const Feed = () => {
  const [loading, setLoading] = useState(false);
  const [pins, setPins] = useState(null);

  const { categoryId } = useParams();

  useEffect(() => {
    setLoading(true);

    if (categoryId) {
      const query = searchQuery(categoryId);

      client.fetch(query)
        .then((data) => {
          setPins(data);
          // --stop the loading
          setLoading(false);
        })
    } else {
      client.fetch(feedQuery)
        .then((data) => {
          setPins(data);
          setLoading(false);
        })
    }

  }, [categoryId]); // --recall useEffect everytime category changes--


  if (loading) {
    return <Spinner message="We are adding new ideas to your feed!" />
  }

  if(!pins?.length) return <h1>No pins available</h1>

  return (
    <section className="">
      {/* --if pin exist then render masonry layout-- */}
      {pins && <MasonryLayout pins={pins} />}
    </section>
  )
}

export default Feed;