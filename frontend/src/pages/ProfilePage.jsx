import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useGetMealsMutation } from "../store/userApiSlice";
import { setMeals } from "../store/userProfileSlice";
import BarLoader from "react-spinners/BarLoader";
import MealCard from "../components/MealCard/MealCard";

const ProfilePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [getMeals, { isLoading }] = useGetMealsMutation();

  const userInfo = useSelector((state) => state.auth.userInfo.other);
  const userMeals = useSelector((state) => state.userProfile.userMeals);

  useEffect(() => {
    const getMealsData = async () => {
      if (userInfo) {
        try {
          const res = await getMeals(userInfo.userId);
          dispatch(setMeals({ ...res }));
          // console.log(res);
        } catch (error) {
          console.log(error);
        }
      }
    };
    getMealsData();
  }, [dispatch]);

  const handleMealInfoNavigation = (id) => {
    navigate(`/meal/${id}`);
    return "";
  };

  return (
    <div className="container">
      <div className="flex flex-col justify-center items-center space-x-3 m-5">
        <h1 className="text-paraColor text-[22px]">My Meals</h1>
        {isLoading ? (
          <div>
            <BarLoader
              height={4}
              width={50}
              color="#36d7b7"
              loading={true}
              cssOverride={{
                display: "block",
                margin: "0 auto",
              }}
            />
          </div>
        ) : userMeals?.data?.length === 0 ? (
          <div>
            <h1 className="text-red-500/90 text-[22px] font-[600] m-5 text-center">
              Add some meals to your cart, please!
            </h1>
          </div>
        ) : (
          <div className="flex flex-row justify-evenly items-center flex-wrap">
            {userMeals?.data?.map((meal) => (
              // console.log("Mapping meal:", meal)
              <div
                key={meal?.mealId}
                onClick={() => handleMealInfoNavigation(meal?.mealFetchId)}
              >
                <MealCard
                  id={meal?.mealFetchId}
                  name={meal?.mealName}
                  img={meal?.mealImg}
                />
              </div>
            ))}

            {/* <MealCard key={1} id={1} name={"meal"} img={"meal"} /> */}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
