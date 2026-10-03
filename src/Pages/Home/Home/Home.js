import React from "react";
import Banner from "../Banner/Banner";
import Packages from "../Packages/Packages";
import Success from "../Success/Success";
import Testimonials from "../Testimonials/Testimonials";

const Home = () => {
  return (
    <div>
      <Banner></Banner>
      <Packages></Packages>
      <Success></Success>
      <Testimonials></Testimonials>
    </div>
  );
};

export default Home;
