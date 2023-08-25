import { Link } from "react-router-dom";
const Home = () => {
  return (
    <>
      <div className="">
        <div className="flex flex-col sm:flex-col xs-flex-col md:flex-col lg:flex-row  justify-center items-center lg:items-start">
          <div className="flex-1">
            <img
              className="w-[500px] h-[500px] xs:[400px] xs:[400px] md:w-[650px] md:h-[650px] object-fill rounded-b-lg"
              src="https://source.unsplash.com/random/900×700/?food"
              alt=""
            />
          </div>
          <div className="flex flex-col justify-center items-center flex-1 p-5">
            <h1 className="text-subheaderColor text-[42px] md:text-[42px] lg:text-[56px]  text-center font-[600]">
              Enjoy a delicious meal at home now!
            </h1>
            <h5 className="text-paraColor text-[24px] text-center font-[400] mt-4">
              Click on <span className="text-prdDetailsColor">explore</span> and
              cook your favorite delicious meal!
            </h5>
            <Link to="/explore">
              <button className="btn">Explore</button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
