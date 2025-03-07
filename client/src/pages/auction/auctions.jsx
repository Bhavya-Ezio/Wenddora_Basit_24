import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Auctions = () => {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/auction/auctions');
        console.log(response)
        setAuctions(response.data.auctions);
      } catch (err) {
        console.error('Failed to fetch auctions', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAuctions();
  }, []);

  if (loading) return <p className="text-center text-lg">Loading auctions...</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Available Auctions</h1>
      <ul className="space-y-4">
        {auctions.map((auction) => (
          <li key={auction._id} className="border p-4 rounded shadow">
            <h2 className="text-xl font-semibold">{auction.itemName}</h2>
            <p className="text-gray-700">{auction.description}</p>
            <p className="text-lg">Starting Price: <span className="font-bold">${auction.startPrice}</span></p>
            <p className="text-sm text-gray-500">Status: {auction.status}</p>
            <button 
              className="mt-2 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              onClick={() => window.location.href =` /auction/${auction._id}`}>
              View Auction
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Auctions;