// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import { useAuth } from "../hooks/useAuth";
// import API from "../services/api";

// import {
//   Sparkles,
//   BookOpen,
//   FileText,
//   Award,
//   ChevronRight,
//   ArrowUpRight,
// } from "lucide-react";

// const Dashboard = () => {
//   const { user } = useAuth();

//   const [stats, setStats] = useState({
//     pyqCount: 0,
//     notesCount: 0,
//     scholarshipsCount: 0,
//     aiPredictor: "Live",
//   });

//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchDashboardData = async () => {
//       try {
//         setLoading(true);

//         const pyqRes = await API.get(
//           `/pyqs?branch=${user?.branch || ""}&semester=${user?.semester || ""}`
//         );

//         const notesRes = await API.get(
//           `/notes?branch=${user?.branch || ""}&semester=${user?.semester || ""}`
//         );

//         const schRes = await API.get("/scholarships");

//         setStats({
//           pyqCount: pyqRes.data.count || 0,
//           notesCount: notesRes.data.count || 0,
//           scholarshipsCount: schRes.data.count || 0,
//           aiPredictor: "Live",
//         });
//       } catch (error) {
//         console.error("Failed to load dashboard metrics", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (user) {
//       fetchDashboardData();
//     }
//   }, [user]);

//   const statCards = [
//     {
//       name: "PYQ Papers",
//       count: stats.pyqCount,
//       icon: FileText,
//       color:
//         "text-sky-400 bg-sky-500/10 border-sky-500/20",
//       link: "/pyqs",
//     },

//     {
//       name: "Semester Notes",
//       count: stats.notesCount,
//       icon: BookOpen,
//       color:
//         "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
//       link: "/notes",
//     },

//     {
//       name: "Scholarships",
//       count: stats.scholarshipsCount,
//       icon: Award,
//       color:
//         "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
//       link: "/scholarships",
//     },

//     {
//       name: "AI Predictor",
//       count: stats.aiPredictor,
//       icon: Sparkles,
//       color:
//         "text-violet-400 bg-violet-500/10 border-violet-500/20",
//       link: "/predictor",
//     },
//   ];

//   return (
//     <div className="max-w-7xl mx-auto p-5 md:p-7 space-y-6">

//       {/* =====================================================
//           WELCOME HERO
//       ====================================================== */}

//       <div className="relative overflow-hidden rounded-3xl border border-slate-800/80 bg-gradient-to-br from-sky-950/70 via-slate-900/80 to-indigo-950/50 p-7 md:p-8">

//         {/* Background glow */}
//         <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

//         <div className="relative">

//           <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-semibold mb-4">
//             <Sparkles className="w-3.5 h-3.5" />
//             Welcome Back, AKTU Exam Ready
//           </div>

//           <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
//             Hi, {user?.name}!
//           </h1>

//           <p className="mt-3 text-sm md:text-base text-slate-400 max-w-3xl leading-7">
//             Your academic portal for{" "}
//             <span className="text-slate-200 font-semibold">
//               {user?.branch}
//             </span>{" "}
//             (Semester {user?.semester}) is ready.
//             Explore previous year papers, analyze exam trends with AI, 
//             and discover scholarship opportunities for your academic journey.
//           </p>

//           <div className="flex flex-wrap gap-3 mt-6">

//             <Link
//               to="/predictor"
//               className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-semibold hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg shadow-blue-500/10"
//             >
//               <Sparkles className="w-4 h-4" />
//               Try AI Predictor
//               <ArrowUpRight className="w-4 h-4" />
//             </Link>

//             <Link
//               to="/pyqs"
//               className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900/70 border border-slate-700 text-slate-300 text-sm font-semibold hover:border-sky-500/30 hover:text-sky-400 transition-all"
//             >
//               <FileText className="w-4 h-4" />
//               Browse PYQs
//             </Link>

//           </div>
//         </div>
//       </div>


//       {/* =====================================================
//           STAT CARDS
//       ====================================================== */}

//       <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

//         {statCards.map((stat) => {

//           const IconComponent = stat.icon;

//           return (
//             <Link
//               key={stat.name}
//               to={stat.link}
//               className="group glass-card p-5 flex items-center justify-between hover:-translate-y-1 hover:border-slate-700 transition-all duration-300"
//             >

//               <div className="space-y-1">

//                 <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">
//                   {stat.name}
//                 </span>

//                 <p className="text-2xl lg:text-3xl font-extrabold text-slate-100">

//                   {loading ? (
//                     <span className="inline-block w-10 h-7 skeleton rounded" />
//                   ) : (
//                     stat.count
//                   )}

//                 </p>

//               </div>

//               <div
//                 className={`p-3 rounded-xl border ${stat.color} group-hover:scale-110 transition-transform duration-300`}
//               >
//                 <IconComponent className="w-6 h-6" />
//               </div>

//             </Link>
//           );
//         })}

//       </div>


//       {/* =====================================================
//           MAIN CONTENT
//       ====================================================== */}

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">


//         {/* ===================================================
//             LEFT SIDE
//         ==================================================== */}

//         <div className="lg:col-span-2 space-y-6">


//           {/* =================================================
//               SMART STUDY FEATURES
//           ================================================== */}

//           <div className="glass-panel rounded-3xl p-6">

//             <div className="flex items-center justify-between mb-5">

//               <h2 className="text-lg font-bold text-slate-200 flex items-center gap-2">
//                 <Sparkles className="w-5 h-5 text-primary-400" />
//                 Smart Study Features
//               </h2>

//               <span className="text-[10px] uppercase tracking-wider text-slate-600">
//                 Powered by AI
//               </span>

//             </div>


//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">


//               {/* AI PREDICTOR */}

//               <Link
//                 to="/predictor"
//                 className="relative overflow-hidden p-5 bg-gradient-to-br from-purple-500/10 via-slate-950/40 to-blue-500/5 rounded-2xl border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300 group"
//               >

//                 <div className="absolute -top-10 -right-10 w-24 h-24 bg-purple-500/10 blur-2xl rounded-full" />

//                 <div className="relative">

//                   <div className="flex items-center justify-between">

//                     <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">

//                       <Sparkles className="w-5 h-5 text-purple-400" />

//                     </div>

//                     <span className="px-2 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-bold uppercase text-emerald-400">
//                       Live
//                     </span>

//                   </div>

//                   <h3 className="mt-5 font-bold text-slate-200 group-hover:text-purple-400 transition-colors">
//                     AI Question Predictor
//                   </h3>

//                   <p className="text-xs text-slate-500 mt-2 leading-5">
//                     Analyze available previous year papers and discover
//                     repeated topics and likely exam questions using AI.
//                   </p>

//                   <div className="mt-5 flex items-center text-xs font-semibold text-purple-400">
//                     Launch Predictor
//                     <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
//                   </div>

//                 </div>

//               </Link>


//               {/* PYQ REPOSITORY */}

//               <Link
//                 to="/pyqs"
//                 className="p-5 bg-slate-950/40 hover:bg-slate-950/80 rounded-2xl border border-slate-800 hover:border-sky-500/20 transition-all group"
//               >

//                 <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center">

//                   <FileText className="w-5 h-5 text-sky-400" />

//                 </div>

//                 <h3 className="mt-5 font-bold text-slate-200 group-hover:text-sky-400 transition-colors">
//                   PYQ Repository
//                 </h3>

//                 <p className="text-xs text-slate-500 mt-2 leading-5">
//                   Browse and download AKTU previous year question
//                   papers by semester, year and subject.
//                 </p>

//                 <div className="mt-5 flex items-center text-xs font-semibold text-sky-400">

//                   Browse Papers

//                   <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />

//                 </div>

//               </Link>

//             </div>

//           </div>


//           {/* =================================================
//               QUICK ACTIONS
//           ================================================== */}

//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

//             <Link
//               to="/notes"
//               className="p-6 bg-slate-900 border border-slate-800/70 hover:border-indigo-500/25 rounded-2xl flex items-center justify-between group transition-all"
//             >

//               <div className="space-y-1">

//                 <div className="flex items-center gap-2">

//                   <BookOpen className="w-4 h-4 text-indigo-400" />

//                   <h3 className="font-bold text-slate-200">
//                     Study Resources
//                   </h3>

//                 </div>

//                 <p className="text-xs text-slate-500">
//                   Access semester notes and curated learning resources.
//                 </p>

//               </div>

//               <ChevronRight className="w-5 h-5 text-slate-500 group-hover:translate-x-1 transition-transform" />

//             </Link>


//             <Link
//               to="/scholarships"
//               className="p-6 bg-slate-900 border border-slate-800/70 hover:border-emerald-500/25 rounded-2xl flex items-center justify-between group transition-all"
//             >

//               <div className="space-y-1">

//                 <div className="flex items-center gap-2">

//                   <Award className="w-4 h-4 text-emerald-400" />

//                   <h3 className="font-bold text-slate-200">
//                     Scholarships
//                   </h3>

//                 </div>

//                 <p className="text-xs text-slate-500">
//                   Explore available financial aid and scholarship opportunities.
//                 </p>

//               </div>

//               <ChevronRight className="w-5 h-5 text-slate-500 group-hover:translate-x-1 transition-transform" />

//             </Link>

//           </div>

//         </div>


//         {/* ===================================================
//             RIGHT SIDE — AI PREDICTOR FEATURE
//         ==================================================== */}

//         <div className="relative overflow-hidden rounded-3xl border border-purple-500/20 bg-gradient-to-br from-purple-950/30 via-slate-900/80 to-blue-950/30 p-7">

//           {/* Glow */}

//           <div className="absolute -top-20 -right-20 w-48 h-48 bg-purple-500/10 blur-3xl rounded-full" />

//           <div className="relative flex flex-col h-full">

//             <div className="flex items-center justify-between">

//               <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">

//                 <Sparkles className="w-6 h-6 text-purple-400" />

//               </div>

//               <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-400 uppercase">
//                 Live
//               </span>

//             </div>


//             <h2 className="text-xl font-bold text-slate-100 mt-6">
//               AI Question Predictor
//             </h2>

//             <p className="text-sm text-slate-500 mt-2 leading-6">
//               Discover high-probability exam questions by analyzing
//               available AKTU previous year papers.
//             </p>


//             <div className="mt-6 space-y-3">

//               <div className="flex items-center gap-3 text-sm text-slate-300">
//                 <span className="text-emerald-400">✓</span>
//                 Repeated topic analysis
//               </div>

//               <div className="flex items-center gap-3 text-sm text-slate-300">
//                 <span className="text-emerald-400">✓</span>
//                 Frequently asked questions
//               </div>

//               <div className="flex items-center gap-3 text-sm text-slate-300">
//                 <span className="text-emerald-400">✓</span>
//                 Predicted questions
//               </div>

//               <div className="flex items-center gap-3 text-sm text-slate-300">
//                 <span className="text-emerald-400">✓</span>
//                 AI confidence analysis
//               </div>

//             </div>


//             <div className="mt-auto pt-8">

//               <Link
//                 to="/predictor"
//                 className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-semibold hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg shadow-purple-500/10"
//               >

//                 Launch AI Predictor

//                 <ArrowUpRight className="w-4 h-4" />

//               </Link>


//               <p className="text-[10px] text-slate-600 text-center mt-3">
//                 Analyze previous year papers for your selected subject
//               </p>

//             </div>

//           </div>

//         </div>

//       </div>


//       {/* =====================================================
//           FOOTER ACTION
//       ====================================================== */}

//       <div className="flex justify-center pt-1">

//         <Link
//           to="/scholarships"
//           className="inline-flex items-center text-xs font-bold text-emerald-400 hover:text-emerald-300 group"
//         >

//           <Award className="w-3.5 h-3.5 mr-1.5" />

//           <span>Track Scholarship Opportunities</span>

//           <ChevronRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />

//         </Link>

//       </div>

//     </div>
//   );
// };

// export default Dashboard;
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import API from "../services/api";

import {
  Sparkles,
  FileText,
  Gift,
  ChevronRight,
  ArrowUpRight,
  GraduationCap,
  BookOpen,
} from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();

  const [stats, setStats] = useState({
    pyqCount: 0,
    scholarshipsCount: 0,
    aiPredictor: "Live",
  });

  const [loading, setLoading] = useState(true);

  // =========================================================
  // FETCH DASHBOARD DATA
  // =========================================================

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        const pyqRes = await API.get(
          `/pyqs?branch=${user?.branch || ""}&semester=${
            user?.semester || ""
          }`
        );

        const schRes = await API.get("/scholarships");

        setStats({
          pyqCount: pyqRes.data.count || 0,
          scholarshipsCount: schRes.data.count || 0,
          aiPredictor: "Live",
        });
      } catch (error) {
        console.error(
          "Failed to load dashboard metrics:",
          error
        );

        setStats({
          pyqCount: 0,
          scholarshipsCount: 0,
          aiPredictor: "Live",
        });
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  // =========================================================
  // STAT CARDS
  // =========================================================

  const statCards = [
    {
      name: "PYQ PAPERS",
      count: stats.pyqCount,
      subtitle: "For your semester",
      icon: FileText,
      color:
        "text-sky-400 bg-sky-500/10 border-sky-500/20",
      link: "/pyqs",
    },

    {
      name: "SCHOLARSHIPS",
      count: stats.scholarshipsCount,
      subtitle: "Available now",
      icon: Gift,
      color:
        "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
      link: "/scholarships",
    },

    {
      name: "AI PREDICTOR",
      count: stats.aiPredictor,
      subtitle: "Smart predictions",
      icon: Sparkles,
      color:
        "text-violet-400 bg-violet-500/10 border-violet-500/20",
      link: "/predictor",
    },
  ];

  return (
    <div className="w-full">

      {/* =====================================================
          WELCOME HERO
      ====================================================== */}

      <section
        className="
          relative
          overflow-hidden
          rounded-3xl
          border
          border-slate-800/80
          bg-gradient-to-br
          from-sky-950/70
          via-slate-950
          to-purple-950/40
          p-7
          md:p-8
        "
      >

        {/* Background Glow */}

        <div
          className="
            absolute
            -top-32
            -right-20
            w-80
            h-80
            rounded-full
            bg-purple-500/10
            blur-3xl
            pointer-events-none
          "
        />

        <div
          className="
            absolute
            -bottom-32
            -left-20
            w-72
            h-72
            rounded-full
            bg-sky-500/10
            blur-3xl
            pointer-events-none
          "
        />

        <div className="relative flex flex-col lg:flex-row items-center justify-between gap-8">

          {/* LEFT SIDE */}

          <div className="flex-1">

            {/* Welcome Badge */}

            <div
              className="
                inline-flex
                items-center
                gap-2
                px-3
                py-1.5
                rounded-full
                bg-sky-500/10
                border
                border-sky-500/20
                text-sky-400
                text-xs
                font-semibold
                mb-5
              "
            >
              <Sparkles className="w-3.5 h-3.5" />

              Welcome Back, AKTU Exam Ready
            </div>

            {/* Heading */}

            <h1
              className="
                text-3xl
                md:text-4xl
                lg:text-[38px]
                font-extrabold
                text-white
                tracking-tight
              "
            >
              Hi, {user?.name}!
            </h1>

            {/* Description */}

            <p
              className="
                mt-4
                text-sm
                md:text-base
                text-slate-400
                max-w-2xl
                leading-7
              "
            >
              Your academic portal for{" "}

              <span className="text-purple-400 font-semibold">
                {user?.branch}
              </span>{" "}

              (Semester {user?.semester}) is ready.

              Explore previous year papers, analyze exam trends
              with AI, and discover scholarship opportunities
              for your academic journey.
            </p>

            {/* Buttons */}

            <div className="flex flex-wrap gap-3 mt-7">

              {/* AI BUTTON */}

              <Link
                to="/predictor"
                className="
                  inline-flex
                  items-center
                  gap-2
                  px-5
                  py-3
                  rounded-xl
                  bg-gradient-to-r
                  from-blue-500
                  to-purple-600
                  text-white
                  text-sm
                  font-semibold
                  hover:from-blue-600
                  hover:to-purple-700
                  transition-all
                  shadow-lg
                  shadow-purple-500/10
                "
              >
                <Sparkles className="w-4 h-4" />

                Try AI Predictor

                <ArrowUpRight className="w-4 h-4" />
              </Link>

              {/* PYQ BUTTON */}

              <Link
                to="/pyqs"
                className="
                  inline-flex
                  items-center
                  gap-2
                  px-5
                  py-3
                  rounded-xl
                  bg-slate-900/70
                  border
                  border-slate-700
                  text-slate-300
                  text-sm
                  font-semibold
                  hover:border-sky-500/30
                  hover:text-sky-400
                  transition-all
                "
              >
                <FileText className="w-4 h-4" />

                Browse PYQs
              </Link>

            </div>

          </div>


          {/* =================================================
              RIGHT SIDE — ACADEMIC ILLUSTRATION
          ================================================= */}

          {/* ================= GRADUATION IMAGE ================= */}

<div
  className="
    hidden
    lg:flex
    w-72
    h-64
    relative
    items-center
    justify-center
    flex-shrink-0
  "
>
  {/* Decorative Stars */}

  <div className="absolute top-4 right-8 text-purple-400 text-lg">
    ✦
  </div>

  <div className="absolute top-16 left-5 text-purple-500/50 text-sm">
    ✦
  </div>

  <div className="absolute bottom-10 right-2 text-purple-400/60 text-sm">
    ✦
  </div>

  {/* Graduation Cap + Books Image */}

  <img
  src="/graduationcap.png"
  alt="Graduation cap and books"
  className="w-72 h-auto object-contain"
/>

</div>
        

        </div>

      </section>


      {/* =====================================================
          STAT CARDS
      ====================================================== */}

      <section className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-8">

        {statCards.map((stat) => {

          const IconComponent = stat.icon;

          return (
            <Link
              key={stat.name}
              to={stat.link}
              className="
                group
                relative
                overflow-hidden
                rounded-2xl
                border
                border-slate-800
                bg-slate-950/60
                p-6
                hover:-translate-y-1
                hover:border-slate-700
                transition-all
                duration-300
              "
            >

              <div className="flex items-start gap-5">

                {/* ICON */}

                <div
                  className={`
                    w-14
                    h-14
                    shrink-0
                    rounded-xl
                    border
                    flex
                    items-center
                    justify-center
                    ${stat.color}
                    group-hover:scale-105
                    transition-transform
                    duration-300
                  `}
                >
                  <IconComponent className="w-7 h-7" />
                </div>

                {/* TEXT */}

                <div>

                  <span
                    className="
                      text-xs
                      text-slate-500
                      font-semibold
                      tracking-wide
                    "
                  >
                    {stat.name}
                  </span>

                  <p
                    className="
                      text-3xl
                      font-extrabold
                      text-slate-100
                      mt-1
                    "
                  >
                    {loading ? (
                      <span className="inline-block w-14 h-8 skeleton rounded" />
                    ) : (
                      stat.count
                    )}
                  </p>

                  <p className="text-sm text-slate-500 mt-1">
                    {stat.subtitle}
                  </p>

                </div>

              </div>

            </Link>
          );
        })}

      </section>


      {/* =====================================================
          SMART STUDY FEATURES
      ====================================================== */}

      <section
        className="
          mt-6
          rounded-3xl
          border
          border-slate-800
          bg-slate-950/50
          p-6
          md:p-7
        "
      >

        {/* SECTION HEADER */}

        <div className="flex items-center justify-between mb-5">

          <h2
            className="
              text-lg
              font-bold
              text-slate-200
              flex
              items-center
              gap-2
            "
          >
            <Sparkles className="w-5 h-5 text-blue-400" />

            Smart Study Features
          </h2>

          <span
            className="
              text-[10px]
              uppercase
              tracking-wider
              font-semibold
              text-purple-400
            "
          >
            Powered by AI
          </span>

        </div>


        {/* FEATURE CARDS */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          {/* =================================================
              AI PREDICTOR CARD
          ================================================== */}

          <Link
            to="/predictor"
            className="
              relative
              overflow-hidden
              p-6
              rounded-2xl
              border
              border-purple-500/20
              bg-gradient-to-br
              from-purple-950/60
              via-purple-950/30
              to-slate-950/70
              hover:border-purple-400/40
              transition-all
              duration-300
              group
            "
          >

            {/* Glow */}

            <div
              className="
                absolute
                -top-16
                -right-16
                w-36
                h-36
                bg-purple-500/10
                rounded-full
                blur-3xl
              "
            />

            <div className="relative">

              {/* TOP */}

              <div className="flex items-center justify-between">

                <div
                  className="
                    w-12
                    h-12
                    rounded-xl
                    bg-purple-500/10
                    border
                    border-purple-500/20
                    flex
                    items-center
                    justify-center
                  "
                >
                  <Sparkles className="w-6 h-6 text-purple-400" />
                </div>

                <span
                  className="
                    px-3
                    py-1
                    rounded-full
                    bg-purple-500/10
                    text-purple-300
                    text-[10px]
                    font-bold
                    uppercase
                  "
                >
                  Live
                </span>

              </div>

              {/* TITLE */}

              <h3
                className="
                  mt-6
                  text-xl
                  font-bold
                  text-slate-100
                  group-hover:text-purple-400
                  transition-colors
                "
              >
                AI Question Predictor
              </h3>

              {/* DESCRIPTION */}

              <p
                className="
                  text-sm
                  text-slate-400
                  mt-2
                  leading-6
                  max-w-md
                "
              >
                Discover high-probability exam questions by
                analyzing previous year papers with AI.
              </p>

              {/* ACTION */}

              <div
                className="
                  mt-6
                  flex
                  items-center
                  text-sm
                  font-semibold
                  text-purple-400
                "
              >
                Get Predictions

                <ArrowUpRight
                  className="
                    w-4
                    h-4
                    ml-2
                    group-hover:translate-x-1
                    group-hover:-translate-y-1
                    transition-transform
                  "
                />
              </div>

            </div>

          </Link>


          {/* =================================================
              PYQ REPOSITORY CARD
          ================================================== */}

          <Link
            to="/pyqs"
            className="
              relative
              overflow-hidden
              p-6
              rounded-2xl
              border
              border-sky-500/20
              bg-gradient-to-br
              from-sky-950/50
              via-slate-950/50
              to-slate-950
              hover:border-sky-400/40
              transition-all
              duration-300
              group
            "
          >

            {/* Glow */}

            <div
              className="
                absolute
                -top-16
                -right-16
                w-36
                h-36
                bg-sky-500/10
                rounded-full
                blur-3xl
              "
            />

            <div className="relative">

              {/* TOP */}

              <div className="flex items-center justify-between">

                <div
                  className="
                    w-12
                    h-12
                    rounded-xl
                    bg-sky-500/10
                    border
                    border-sky-500/20
                    flex
                    items-center
                    justify-center
                  "
                >
                  <FileText className="w-6 h-6 text-sky-400" />
                </div>

                <span
                  className="
                    px-3
                    py-1
                    rounded-full
                    bg-sky-500/10
                    text-sky-400
                    text-[10px]
                    font-bold
                    uppercase
                  "
                >
                  Live
                </span>

              </div>

              {/* TITLE */}

              <h3
                className="
                  mt-6
                  text-xl
                  font-bold
                  text-slate-100
                  group-hover:text-sky-400
                  transition-colors
                "
              >
                PYQ Repository
              </h3>

              {/* DESCRIPTION */}

              <p
                className="
                  text-sm
                  text-slate-400
                  mt-2
                  leading-6
                  max-w-md
                "
              >
                Search and download previous year papers
                by subject, semester and year.
              </p>

              {/* ACTION */}

              <div
                className="
                  mt-6
                  flex
                  items-center
                  text-sm
                  font-semibold
                  text-sky-400
                "
              >
                Explore PYQs

                <ArrowUpRight
                  className="
                    w-4
                    h-4
                    ml-2
                    group-hover:translate-x-1
                    group-hover:-translate-y-1
                    transition-transform
                  "
                />
              </div>

            </div>

          </Link>

        </div>
        <footer className="text-center py-6 mt-10 border-t border-slate-800">
  <p className="text-sm text-slate-500">
    Made by Pallavi Tripathi
  </p>
</footer>

      </section>

    </div>
  );
};

export default Dashboard;