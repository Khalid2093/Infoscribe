import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Logo from "../components/Logo";
import { Bars } from "react-loader-spinner";
import BACKEND_URL from "../commons";

const Home = () => {
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSearchClick = async () => {
    if (inputValue === "") return;
    try {
      setLoading(true);
      const response = await axios.post(
        `${BACKEND_URL}/search`,
        { query: inputValue },
        { headers: { "Content-Type": "application/json" } }
      );

      const responseData = response.data;
      setLoading(false);
      navigate("/dashboard", { state: { searchData: responseData } });
    } catch (error) {
      console.error("Error in search:", error);
    }
  };

  return (
    <>
      <div>
        <Logo />
        {!loading ? (
          <div className="flex mt-4">
            <input
              type="text"
              onKeyDown={(e) => e.key === "Enter" && handleSearchClick()}
              placeholder="Search for video/ Paste video url"
              value={inputValue}
              onChange={handleInputChange}
              className="p-2 border-none rounded flex-grow
          outline-none 
          ring-2 ring-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400
          "
            />
            <button
              onClick={handleSearchClick}
              className="ml-2 p-2 bg-blue-500 text-white rounded
          bg-gradient-to-r from-purple-400 to-pink-600
          hover:from-pink-500 hover:to-purple-500 hover:shadow-lg hover:scale-2 transition duration-300 ease-in-out
          "
            >
              Search
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-1">
            <p> getting your results...</p>

            <div className="">
              <Bars
                height="30"
                width="30"
                color="#FF00FF"
                ariaLabel="bars-loading"
                wrapperStyle={{}}
                wrapperClass=""
                visible={true}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Home;
