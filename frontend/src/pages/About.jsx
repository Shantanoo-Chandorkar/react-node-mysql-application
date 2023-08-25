const About = () => {
  return (
    <>
      <div className="container">
        <div className="flex flex-col justify-center items-center">
          <h1 className="text-subheaderColor text-[42px] md:text-[42px] lg:text-[56px]  text-center font-[600]">
            Hello, My name is{" "}
            <span className="text-prdDetailsColor">Shantanoo Chandorkar!</span>
          </h1>
          <h3 className="text-neutralColor2 text-[24px] text-center font-[400] mt-4">
            This is a mini project on React, React-Redux, Reduxjs/Toolkit, RTK
            Query, ExpressJs and MySql.
          </h3>
          <p className="text-paraColor text-center font-[400] mt-4">
            This project is still on-going. I will add more features such as
            admin panel, a blog post, and many more, as I learn more about web
            development. Thank you!
          </p>
        </div>
      </div>
    </>
  );
};

export default About;
