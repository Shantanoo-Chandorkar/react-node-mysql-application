import React from "react";
import { AiOutlinePlus, AiOutlineCheck } from "react-icons/ai";
import { BsPlusLg, BsCheck2 } from "react-icons/bs";
import { PiCheck, PiPlusLight } from "react-icons/pi";

const MealCard = ({ id, name, img }) => {
  // console.log("MealCard props:", id, name, img);
  return (
    <div className="flex flex-col space-y-1 p-3 m-3">
      <div className="w-[300px] h-auto">
        <img
          className="w-[100%] h-[100%] object-fill cursor-pointer"
          src={`${img}/preview`}
          alt=""
        />
      </div>
      <div className="w-[300px] h-auto">
        <h1 className="text-paraColor text-[20px] cursor-pointer">{name}</h1>
      </div>
    </div>
    // <h1>Meal Card</h1>
  );
};

export default MealCard;
