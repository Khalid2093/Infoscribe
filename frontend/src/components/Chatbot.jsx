import React, { useRef, useEffect, useState, useCallback } from "react";

import * as tf from "@tensorflow/tfjs";

import * as qna from "@tensorflow-models/qna";

const ChatBot = ({ data, place }) => {
  const questionRef = useRef(null);
  const [model, setModel] = useState(null);
  const [loading, setLoading] = useState(false);

  // 4. Load Tensorflow Model
  const loadModel = async () => {
    const loadedModel = await qna.load();
    setModel(loadedModel);
    console.log("Model loaded.", loadedModel);
  };


  const load = useCallback(() => {
    loadModel();
  }, [data]);

  useEffect(() => {
    load();
   
  }, [data]);


  const [yourQues, setYourQues] = useState([]);

  // 5. Handle Questions
  const answerQuestion = async (e) => {
    if (e.which === 13 && model !== null) {
      console.log("Question submitted.");

      const question = questionRef.current.value;
      setYourQues([
        ...yourQues,
        {
          by: "you",
          q: question,
        },
      ]);

      console.log("question", question);

      const answers = await model.findAnswers(question, data);
      if (answers.length === 0) {
        setYourQues((prev) => [
          ...prev,
          {
            by: "bot",
            answered: "Sorry, I don't know the answer to that question.",
          },
        ]);
        return;
      }
      let ans = answers[0].score;
      let ansIndex = answers[0];

      answers.forEach((element, index) => {
        console.log(`element ${index}`, element.score);
        if (element.score > ans) {
          ans = element.score;
          ansIndex = element;
        }
      });

      if (answers.length > 0) {
        setYourQues((prev) => [
          ...prev,
          {
            by: "bot",
            answered: ansIndex.text,
          },
        ]);
      }
      questionRef.current.value = "";
    }
  };

  // 2. Setup input, question and result area
  return (
    <div className=" h-2/3 bg-[#000004] w-full text-white text-center">
      <header className="w-full px-4  flex flex-col justify-end items-end">
        {model == null ? (
          <div className="h-2/3 w-full text-center">
            <div> Loading...</div>
            {/* <Loader
            type="Puff"
            color="#00BFFF"
            height={100}
            width={100}/> */}
          </div>
        ) : (
          <React.Fragment>
            <br />

            <div className="h-full overflow-y-scroll no-scrollbar w-full">
              {yourQues.length > 0 &&
                yourQues.map((q, i) => {
                 
                  return (
                    <div key={i} className="w-full">
                      {q.by === "you" ? (
                        <div className="chat chat-end">
                          <p type="text" className="chat-bubble my-2">
                            {q.q}
                          </p>
                        </div>
                      ) : (
                        <div className="chat chat-start flex items-center">
                          <img
                            className="h-14 w-14 rounded-full"
                            src="https://www.shutterstock.com/image-vector/chat-bot-logo-design-concept-600nw-1938811039.jpg"
                            alt=""
                          />
                          <p type="text" className="chat-bubble my-2 text-start">
                            {q.answered}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
            <div
              className="sticky
           -bottom-8
            flex flex-col justify-end items-end"
            >
              <input
                ref={questionRef}
                type="text"
                className="
            px-2 py-1 w-[50%] mt-auto
            text-black ml-auto block rounded-md outline-none"
                onKeyPress={answerQuestion}
                size="80"
              ></input>
              <p className="flex items-center gap-2 mt-1">
                you
                {/* {user && (
                  <img
                    className="h-10 w-10 rounded-full"
                    src={user.imageUrl}
                    alt="user"
                  />
                )} */}
              </p>
            </div>
          </React.Fragment>
        )}
      </header>
    </div>
  );
};

export default ChatBot;
