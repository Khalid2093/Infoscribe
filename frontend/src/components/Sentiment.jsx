import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Bars } from "react-loader-spinner";
import BACKEND_URL from "../commons";

const Sentiment = () => {
  const { id } = useParams();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchData = async () => {
      const url = `${BACKEND_URL}/sentiment/${id}`;
      try {
        const response = await axios.get(url);
        const { data } = response;

        setComments(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching sentiment analysis results:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getButtonColor = (label) => {
    switch (label) {
      case "positive":
        return "bg-green-300";
      case "negative":
        return "bg-red-300";
      case "neutral":
        return "bg-blue-300";
      default:
        return "bg-gray-300";
    }
  };

  const filterComments = (label) => {
    if (label === filter) {
      setFilter("all");
    } else {
      setFilter(label);
    }
  };

  // Calculate counts of positive and negative comments
  const positiveCount = comments.filter(
    (comment) => comment.label === "positive"
  ).length;
  const negativeCount = comments.filter(
    (comment) => comment.label === "negative"
  ).length;

  return (
    <div className="max-w-screen-lg mx-auto p-4">
      <h2 className="flex items-center justify-between text-3xl font-bold mb-6 text-center">
        Comments
        <span className="flex items-center ml-auto">
          <span className="mr-3 w-3 h-3 bg-green-500 rounded-full"></span>
          {positiveCount}
        </span>
        <span className="flex items-center">
          <span className="mx-3 w-3 h-3 bg-red-500 rounded-full"></span>
          {negativeCount}
        </span>
      </h2>
      <div className="flex justify-center space-x-4 mb-6">
        {["all", "positive", "negative", "neutral"].map((label) => (
          <button
            key={label}
            onClick={() => filterComments(label)}
            className={`btn ${getButtonColor(
              label
            )} rounded-full px-6 py-2 text-gray-900 hover:text-gray-200`}
          >
            {label.charAt(0).toUpperCase() + label.slice(1)}
          </button>
        ))}
      </div>
      <ul className="list-disc ml-8">
        {!loading ? (
          comments.map(
            (comment, index) =>
              (filter === "all" || filter === comment.label) && (
                <li key={index} className="text-left mb-4">
                  {comment.text}
                </li>
              )
          )
        ) : (
          <div className="flex justify-center">
            <Bars
              height={50}
              width={50}
              color="#4B5563"
              className="mx-auto"
              ariaLabel="bars-loading"
              visible={true}
            />
          </div>
        )}
      </ul>
    </div>
  );
};

export default Sentiment;
