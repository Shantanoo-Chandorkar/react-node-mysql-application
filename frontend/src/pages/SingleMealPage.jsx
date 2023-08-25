import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchMealDetailsById } from "../store/mealDetailsByIdSlice";
import {
  useAddMealMutation,
  useDeleteMealMutation,
} from "../store/userApiSlice";
import DotLoader from "react-spinners/DotLoader";
import { AiOutlinePlus, AiOutlineCheck } from "react-icons/ai";
import { setMeals } from "../store/userProfileSlice";

const SingleMealPage = () => {
  const [ingArray, setIngArray] = useState([]);
  const [measureArray, setMeasureArray] = useState([]);
  const [addFavMeals, setAddFavMeals] = useState({});
  const [mealAlreadyAdded, setMealAlreadyAdded] = useState(false);
  const [loginMessage, setLoginMessage] = useState("");
  const { id } = useParams();

  const dispatch = useDispatch();
  const [addMeal] = useAddMealMutation();
  const [deleteMeal] = useDeleteMealMutation();
  const userInfo = useSelector((state) => state.auth.userInfo);

  const {
    data: mealDetails,
    loading: mealDetailsLoading,
    error: mealDetailsError,
  } = useSelector((state) => state.mealDetailsById);

  const userMeals = useSelector((state) => state.userProfile.userMeals);

  // Fetch ingredients from API and set them to ingArray
  const getIngredients = async () => {
    const ingredientsArray = [];
    if (mealDetails) {
      for (let i = 1; i <= 20; i++) {
        let ingredientExists = await Object.prototype?.hasOwnProperty.call(
          mealDetails[0],
          `strIngredient${i}`
        );
        const ingredient = mealDetails[0][`strIngredient${i}`];
        if (ingredientExists && ingredient !== "" && ingredient !== null) {
          ingredientsArray.push(ingredient);
        }
      }
    }
    setIngArray(ingredientsArray);
  };

  // Fetch measurements from API and set them to measureArray
  const getMeasurements = async () => {
    const measurementsArray = [];
    if (mealDetails) {
      for (let i = 1; i <= 20; i++) {
        let MeasurementExists = await Object.prototype?.hasOwnProperty.call(
          mealDetails[0],
          `strMeasure${i}`
        );
        const measurement = mealDetails[0][`strMeasure${i}`];
        if (
          MeasurementExists &&
          measurement !== "" &&
          measurement !== null &&
          measurement !== " "
        ) {
          measurementsArray.push(measurement);
        }
      }
    }
    setMeasureArray(measurementsArray);
  };

  useEffect(() => {
    dispatch(fetchMealDetailsById(id));
  }, [dispatch, id]);

  useEffect(() => {
    // After mealDetails data changes, populate ingArray and measureArray
    if (mealDetails && mealDetails.length > 0) {
      getIngredients();
      getMeasurements();

      // This is to add meal details in addFavMeals
      // which later is passed to handleAddMeal to be saved in meal_cart (database)
      let { strMeal, strMealThumb, idMeal } = mealDetails[0];
      setAddFavMeals({ strMeal, strMealThumb, idMeal });
    }
    // Scroll to the top of the page when the component mounts
    window.scrollTo(0, 0);
  }, [mealDetails]);

  useEffect(() => {
    if (userMeals !== null) {
      const favMealChanged = () => {
        const mealAlreadyAdded = Object.values(userMeals.data).some(
          (item) => item.mealName === addFavMeals.strMeal
        );
        setMealAlreadyAdded(mealAlreadyAdded);
      };

      favMealChanged();
    }
  }, [addFavMeals, userMeals]);

  const handleAddMeal = async () => {
    if (userInfo !== null) {
      const userId = userInfo.other.userId;

      try {
        const res = await addMeal({ addFavMeals, userId });
        dispatch(setMeals({ ...res }));
        setMealAlreadyAdded(true);
      } catch (error) {
        console.log(error.data.error);
      }
    } else {
      setLoginMessage("Please login first!");
    }
  };

  const handleDeleteMeal = async () => {
    if (userInfo !== null) {
      const userId = userInfo.other.userId;

      try {
        const res = await deleteMeal({ addFavMeals, userId });
        dispatch(setMeals({ ...res }));
        setMealAlreadyAdded(false);
      } catch (error) {
        console.log(error.data.error);
      }
    } else {
      setLoginMessage("Please login first!");
    }
  };

  return (
    <section>
      <div className="container">
        {mealDetailsLoading === "pending" ? (
          <div>
            <DotLoader
              color="#36d7b7"
              loading={true}
              cssOverride={{
                display: "block",
                margin: "0 auto",
              }}
            />
          </div>
        ) : mealDetailsError ? (
          <div>Error loading meal details: {mealDetailsError}</div>
        ) : (
          <>
            {mealDetails?.map((detail) => (
              <div
                className="flex flex-col justify-center items-center m-3 p-3"
                key={detail.idMeal}
              >
                {/* {====== IMG, NAME, TAGS, ADDTOFAV, SOURCE, VIDEOSRC ======} */}
                <div className="w-full flex flex-col md:flex-row justify-between gap-[50px]">
                  <div className="flex-shrink w-[350px] h-[350px] rounded">
                    <img
                      className="w-full h-full object-fill rounded"
                      src={`${detail?.strMealThumb}/preview`}
                      alt=""
                    />
                  </div>
                  <div className="flex-grow flex flex-col items-start">
                    <div>
                      {loginMessage && (
                        <h3 className="text-red-600/80 mt-2">{loginMessage}</h3>
                      )}
                    </div>
                    <h1 className="text-[36px] font-semibold text-paraColor text-start">
                      {detail?.strMeal ? detail?.strMeal : ""}
                    </h1>
                    <div className="flex flex-col md:flex-row items-center gap-4">
                      <h3 className="text-[24px] text-paraColor text-start mt-[16px]">
                        Category:{" "}
                        <span className="text-slate-500 text-[18px]">
                          {detail?.strCategory ? detail?.strCategory : ""}
                        </span>
                      </h3>
                      <button className="mt-[16px]" type="button">
                        {mealAlreadyAdded ? (
                          <AiOutlineCheck
                            onClick={handleDeleteMeal}
                            size={50}
                            style={{
                              color: "rgb(51 217 178)",
                              borderRadius: "50%",
                              border: "none",
                            }}
                          />
                        ) : (
                          <AiOutlinePlus
                            onClick={handleAddMeal}
                            size={50}
                            style={{
                              color: "rgb(51 217 178)",
                              borderRadius: "50%",
                              border: "none",
                            }}
                          />
                        )}
                      </button>
                    </div>
                    <div className="flex flex-col md:flex-row items-center gap-4">
                      <h3 className="text-[24px] text-paraColor text-start mt-[16px]">
                        Tags:{" "}
                        <span className="text-slate-500 text-[18px]">
                          {detail?.strTags ? detail?.strTags : "None"}
                        </span>
                      </h3>
                    </div>
                    <div>
                      <h3 className="text-[24px] text-paraColor text-start mt-[16px]">
                        More resources:{" "}
                        <Link
                          to={detail?.strSource}
                          className="text-slate-500 text-[18px]"
                        >
                          {detail?.strSource}
                        </Link>
                      </h3>
                    </div>
                    <div>
                      <h3 className="text-[24px] text-paraColor text-start mt-[16px]">
                        Video resources:{" "}
                        <Link
                          to={detail?.strYoutube}
                          className="text-slate-500 text-[18px]"
                        >
                          {detail?.strYoutube}
                        </Link>
                      </h3>
                    </div>
                  </div>
                </div>

                {/* {====== INGREDIENTS AND MEASUREMENTS ======} */}
                <div className="w-full flex flex-col items-start m-[20px]">
                  <div>
                    <h1 className="text-[28px] font-semibold text-paraColor text-start underline">
                      Ingredients and Measurements:
                    </h1>
                  </div>
                  <div className="flex flex-col gap-2 justify-center items-start m-4">
                    <div className="flex flex-row gap-2">
                      <div className="flex flex-col gap-2">
                        {ingArray?.map((ingredient, index) => (
                          <h5
                            key={index}
                            className="text-paraColor text-[20px] text-start"
                          >
                            {ingredient}:{" "}
                          </h5>
                        ))}
                      </div>
                      <div className="flex flex-col gap-2 ml-4">
                        {measureArray?.map((measure, index) => (
                          <div key={index}>
                            {measure ? (
                              <h5 className="text-paraColor text-[20px] text-start">
                                {measure}
                              </h5>
                            ) : (
                              <h5 className="text-paraColor text-[20px] text-start">
                                Use however you like
                              </h5>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* {====== INSTRUCTIONS ======} */}
                <div className="w-full flex flex-col items-start">
                  <h1 className="text-[28px] font-semibold text-paraColor text-start underline">
                    Instructions:
                  </h1>
                  <h4 className="text-[16px] text-[400] text-paraColor text-start mt-3">
                    {detail?.strInstructions}
                  </h4>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </section>
  );
};

export default SingleMealPage;
