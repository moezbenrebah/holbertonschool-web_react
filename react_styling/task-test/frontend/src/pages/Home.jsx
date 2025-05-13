import React, { useState } from "react";
import { Link } from "react-router-dom";

const Home = () => {

  return (
    <div className="min-h-screen px-6 py-4">
      {/* Header */}
      <header className="flex justify-between items-center mb-12">
        <div className="flex items-center space-x-2">
        </div>
      </header>

      {/* Headline Main content */}
      <main className="text-center ">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold mb-3 text-black">
        SHARE YOUR EVENTS MEMORIES.</h1>

        {/* Sub heading */}
         <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl mb-6">
          Create a unique gallery for your event and let everyone contribute their photos</p>
        
        {/* Signup button linking to signup route */}
        <Link to="/Signup">
          <button className="border-2 border-black text-black py-2 px-6 rounded-lg font-medium 
          hover:bg-gradient-to-br from-green-100 to-blue-100 hover:text-black transition">
            Get started
          </button>
        </Link>


        {/* --- picture Layout section --- */}
        <div className="flex flex-col md:flex-row justify-center gap-4 mt-12 px-2 md:px-6">
        
        {/* ----- Left column ----- */}
        <div className="flex flex-col space-y-4">
          <img src="/images/photo1.jpg" alt="Side 1"
            className="w-40 md:w-48 lg:w-52 h-auto object-contain rounded-lg shadow-md hover:grayscale cursor-pointer transition-all"
            />
           
           <img src="/images/photo7.jpg" alt="Side 1"
            className="w-40 md:w-48 lg:w-52 rounded-lg shadow-xs h-full hover:grayscale cursor-pointer transition-all" />

          </div>

  {/* ---- Center grid with fixed width ---- */}
  <div className="grid grid-cols-2 gap-4 justify-items-center ">
    <img src="/images/photo3.jpg" alt="top 1"
      className="w-full max-w-xs rounded-lg shadow-lg hover:grayscale cursor-pointer transition-all" />


    <img src="/images/photo4.jpg" alt="top 2"
      className="w-full max-w-xs rounded-lg shadow-lg hover:grayscale cursor-pointer transition-all" />

    <img src="/images/photo5.jpg" alt="Bottom 1"
      className="w-full max-w-xs rounded-lg shadow-lg  hover:grayscale cursor-pointer transition-all"/>

    <img src="/images/photo6.jpg" alt="Bottom 2"
      className="w-full max-w-xs rounded-lg shadow-lg hover:grayscale cursor-pointer transition-all" />
  </div>

  {/* --- Right column --- */}
  <div className="flex flex-col space-y-4 ">
    <img src="/images/photo2.jpeg" alt="Side 3"
      className="w-40 md:w-48 lg:w-52 rounded-lg shadow-xs h-full hover:grayscale cursor-pointer transition-all" />

    <img src="/video/video2.gif" alt="Side 4"
      className="w-40 md:w-48 lg:w-52 max-h-64 rounded-lg shadow-md hover:grayscale cursor-pointer transition-all"/>
  </div>
</div>

      </main>
    </div>
  );
};

export default Home;