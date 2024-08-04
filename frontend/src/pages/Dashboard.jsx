// Dashboard component
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Logosmall from "../components/Logosmall";

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const handleSearchClick = () => {
    location.state = null;
    navigate("/");
  };

  return (
    <div className="mt-8 flex flex-col items-start mx-12">
      <div className="w-full flex items-between justify-between">
        <Logosmall />
        <button
          onClick={handleSearchClick}
          className="w-40 h-12 text-white font-semibold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg shadow-lg hover:scale-105 duration-200 hover:drop-shadow-2xl hover:shadow-purple-800 hover:cursor-pointer"
        >
          Back to Search
        </button>
      </div>
      <div className="h-full w-[95%] grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {location.state.searchData.matches?.length > 0 &&
          location.state.searchData.matches.map((item, index) => (
            <VideoCard key={index} item={item} />
          ))}
      </div>
    </div>
  );
};

const VideoCard = ({ item }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() =>
        navigate(
          `/video/${item.metadata.video_id}/${item.metadata.start_second}`
        )
      }
      className="relative rounded-md shadow-lg dark:shadow-gray-800 cursor-pointer"
      style={{ height: "350px" }}
    >
      <img
        className="rounded-t-md object-cover w-full h-48" // Adjusted thumbnail size
        src={item?.metadata?.thumbnail || "https://via.placeholder.com/150"}
        alt="video"
      />
      <div className="p-5">
        <h4 className="text-md h-10 text-start font-semibold">
          {item?.metadata?.title.length > 20
            ? `${item?.metadata?.title.slice(0, 60)}...`
            : item?.metadata?.title}
        </h4>
      </div>
      <div className="flex items-center px-4 py-2">
        Match Rate -
        <div className="rounded-lg h-7 ml-2 w-8 bg-red-500 text-white flex items-center justify-center">
          {item?.score && (
            <p className="text-sm text-start font-semibold">
              {Math.round(item.score * 10) / 10}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
