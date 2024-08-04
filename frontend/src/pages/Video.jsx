import React from "react";
import Sentiment from "../components/sentiment";
import axios from "axios";
import { useEffect, useState } from "react";
import BACKEND_URL from "../commons";
import { Bars } from "react-loader-spinner";
import ChatBot from "../components/Chatbot";

const Video = () => {
  return (
    <div className="w-[calc(100vw-2rem)] h-full">
      <VideoDetails />

      <Sentiment />
    </div>
  );
};

const VideoDetails = () => {
  const location = window.location.href;
  const id = location.split("/")[4];
  const st_time = location.split("/")[5];

  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState("");
  const [transcript, setTranscript] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const url = `${BACKEND_URL}/summary/${id}`;
      try {
        const response = await axios.get(url);
        const transcript = await axios.get(`${BACKEND_URL}/transcript/${id}`);

        const { data } = response;
        const { data: transcriptData } = transcript;
        console.log(transcript);
        setSummary(data.summary);
        setTranscript(transcriptData.transcript);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching video details:", error);
        setSummary("Error fetching video details");
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="flex flex-col">
      <div className="px-3 md:px-12 pt-8 h-screen w-full flex items-start justify-center gap-4 md:gap-12 text-white text-start">
        <div className="w-2/3 h-full p-0 m-0">
          <iframe
            src={`https://www.youtube.com/embed/${id}?start=${st_time}`}
            frameBorder="0"
            width="100%%"
            height="90%"
          ></iframe>
        </div>
        <div className="summary w-[30%] mt-4">
          <h2 className="text-3xl font-bold mb-6 text-center">Summary</h2>
          {loading ? (
            <div className="flex items-center justify-center">
              <Bars color="#00BFFF" height={50} width={50} />
            </div>
          ) : (
            <div>
              <p>{summary}</p>
            </div>
          )}
        </div>
      </div>
      {/* <div className="flex-1 text-white font-bold text-3xl">
        <img
          onClick={(e) => {
            e.preventDefault();
            document.getElementById("my_modal_5").showModal();
          }}
          className="
            h-12 w-12 rounded-full bg-slate-200 shadow p-2 hover:cursor-pointer"
          src="https://cdn-icons-png.freepik.com/512/8943/8943377.png"
          alt=""
        />
      </div> */}
      {/* <dialog id="my_modal_5" className="modal">
        <div className="modal-box bg-[#000004] h-2/3 no-scrollbar flex flex-col items-center">
          <form method="dialog" className="ml-1/2">
            <h2 className="mb-6 mt-3 font-bold text-white text-center mx-auto">
              Ask question related to this Location
            </h2>
            <button className="btn text-white btn-lg btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <ChatBot data={summary} />
        </div>
      </dialog> */}
    </div>
  );
};

export default Video;
