import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { aiService } from "../services/api";

const Predictor = () => {
  const [subject, setSubject] = useState("");
  const [prediction, setPrediction] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePredict = async () => {
    if (!subject.trim()) {
      alert("Please enter a subject name");
      return;
    }

    try {
      setLoading(true);
      setPrediction("");

      const res = await aiService.predict(subject.trim());

      console.log("SUCCESS RESPONSE:", res);
      console.log("PREDICTION:", res.data.prediction);

      setPrediction(res.data.prediction);
    } catch (err) {
      console.log("FULL ERROR:", err);
      console.log("STATUS:", err.response?.status);
      console.log("DATA:", err.response?.data);

      alert(
        err.response?.data?.message ||
          err.message ||
          "Prediction failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-8 pt-3 pb-8 space-y-6">

      {/* ================= PAGE HEADER ================= */}
      <div className="mb-8">

        <div className="flex items-center gap-3 mb-3">

          <div className="
            w-11 h-11
            rounded-xl
            bg-purple-500/10
            border border-purple-500/20
            flex items-center justify-center
            text-xl
          ">
            🤖
          </div>

          <div>
            <p className="text-sm font-semibold text-blue-400">
              AI-POWERED EXAM ANALYSIS
            </p>

            <h1 className="
              text-3xl md:text-4xl
              font-bold
              text-white
            ">
              AI Question Predictor
            </h1>
          </div>

        </div>

        <p className="
          text-slate-400
          max-w-2xl
          leading-6
        ">
          Analyze previous year question papers and discover the
          most important topics and questions for your next AKTU exam.
        </p>

      </div>


      {/* ================= SUBJECT INPUT ================= */}
      <div className="
        bg-slate-900/60
        border border-slate-800
        rounded-2xl
        p-5
        mb-8
      ">

        <label className="
          block
          text-sm
          font-semibold
          text-slate-300
          mb-2
        ">
          Enter Subject
        </label>

        <div className="
          flex
          flex-col
          md:flex-row
          gap-3
        ">

          <input
            type="text"
            placeholder="Enter subject name e.g. Data Structures"
            className="
              flex-1
              bg-slate-950/70
              border border-slate-700
              rounded-xl
              px-4 py-3
              text-slate-200
              placeholder-slate-600
              outline-none
              focus:border-blue-500
              focus:ring-2
              focus:ring-blue-500/10
              transition
            "
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handlePredict();
              }
            }}
          />

          <button
            onClick={handlePredict}
            disabled={loading}
            className="
              px-6
              py-3
              rounded-xl
              font-semibold
              text-white
              bg-gradient-to-r
              from-blue-500
              to-purple-600
              hover:from-blue-600
              hover:to-purple-700
              disabled:opacity-50
              disabled:cursor-not-allowed
              transition
              shadow-lg
              shadow-blue-500/10
            "
          >
            {loading ? "Analyzing..." : "Predict Questions"}
          </button>

        </div>

        <p className="
          text-xs
          text-slate-500
          mt-3
        ">
          The AI analyzes available previous year papers for the selected subject.
        </p>

      </div>


      {/* ================= LOADING ================= */}
      {loading && (
        <div className="
          bg-slate-900/60
          border border-slate-800
          rounded-2xl
          p-8
        ">

          <div className="flex items-center gap-4">

            <div className="
              w-10
              h-10
              rounded-full
              border-4
              border-slate-700
              border-t-blue-500
              animate-spin
            " />

            <div>

              <h2 className="
                text-lg
                font-semibold
                text-white
              ">
                Analyzing Previous Year Papers
              </h2>

              <p className="
                text-sm
                text-slate-400
                mt-1
              ">
                AI is identifying repeated topics and likely questions...
              </p>

            </div>

          </div>

        </div>
      )}


      {/* ================= RESULT ================= */}
      {prediction && !loading && (
        <div className="
          bg-slate-900/60
          border border-slate-800
          rounded-2xl
          overflow-hidden
        ">

          {/* RESULT HEADER */}
          <div className="
            p-5
            border-b
            border-slate-800
          ">

            <div className="flex items-center gap-3">

              <div className="
                w-11
                h-11
                rounded-xl
                bg-purple-500/10
                border border-purple-500/20
                flex items-center justify-center
                text-xl
              ">
                🤖
              </div>

              <div>

                <h2 className="
                  text-xl
                  font-bold
                  text-white
                ">
                  AI Exam Prediction
                </h2>

                <p className="
                  text-xs
                  text-slate-400
                  mt-1
                ">
                  Based on analysis of available previous year papers
                </p>

              </div>

            </div>

          </div>


          {/* MARKDOWN RESULT */}
          <div className="
            p-6
            md:p-8
          ">

            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{

                /* MAIN HEADINGS */
                h1: ({ children }) => (
                  <h1 className="
                    text-xl
                    md:text-2xl
                    font-bold
                    text-blue-400
                    mt-8
                    mb-4
                    first:mt-0
                  ">
                    {children}
                  </h1>
                ),

                /* SECONDARY HEADINGS */
                h2: ({ children }) => (
                  <div className="mt-8 mb-4">

                    <h2 className="
                      text-xl
                      font-bold
                      text-blue-400
                    ">
                      {children}
                    </h2>

                    <div className="
                      mt-2
                      h-px
                      bg-gradient-to-r
                      from-blue-500/40
                      to-transparent
                    " />

                  </div>
                ),

                /* SMALL HEADINGS */
                h3: ({ children }) => (
                  <h3 className="
                    text-lg
                    font-semibold
                    text-purple-400
                    mt-6
                    mb-3
                  ">
                    {children}
                  </h3>
                ),

                /* PARAGRAPHS */
                p: ({ children }) => (
                  <p className="
                    text-slate-300
                    leading-7
                    mb-4
                  ">
                    {children}
                  </p>
                ),

                /* BULLET LIST */
                ul: ({ children }) => (
                  <ul className="
                    list-disc
                    ml-6
                    space-y-2
                    text-slate-300
                    mb-6
                  ">
                    {children}
                  </ul>
                ),

                /* NUMBERED LIST */
                ol: ({ children }) => (
                  <ol className="
                    list-decimal
                    ml-6
                    space-y-3
                    text-slate-300
                    mb-6
                  ">
                    {children}
                  </ol>
                ),

                /* LIST ITEMS */
                li: ({ children }) => (
                  <li className="
                    pl-2
                    leading-7
                  ">
                    {children}
                  </li>
                ),

                /* BOLD TEXT */
                strong: ({ children }) => (
                  <strong className="
                    font-bold
                    text-white
                  ">
                    {children}
                  </strong>
                ),

                /* ITALIC TEXT */
                em: ({ children }) => (
                  <em className="
                    text-slate-200
                  ">
                    {children}
                  </em>
                ),

                /* HORIZONTAL LINE */
                hr: () => (
                  <hr className="
                    my-7
                    border-slate-800
                  " />
                ),

                /* QUOTE */
                blockquote: ({ children }) => (
                  <blockquote className="
                    border-l-4
                    border-blue-500
                    pl-4
                    my-5
                    text-slate-400
                  ">
                    {children}
                  </blockquote>
                ),

                /* INLINE CODE */
                code: ({ children }) => (
                  <code className="
                    px-2
                    py-1
                    rounded-md
                    bg-slate-950
                    border
                    border-slate-800
                    text-cyan-400
                    text-sm
                  ">
                    {children}
                  </code>
                ),

                /* LINKS */
                a: ({ children, href }) => (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="
                      text-blue-400
                      hover:text-blue-300
                      underline
                    "
                  >
                    {children}
                  </a>
                ),

              }}
            >
              {prediction}
            </ReactMarkdown>

          </div>

        </div>
      )}

    </div>
  );
};

export default Predictor;