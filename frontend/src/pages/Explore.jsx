import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchRecipeCategories } from "../store/recipeCategoriesSlice";
import { fetchMealsByCategory } from "../store/mealsByCategorySlice";
import MealCard from "../components/MealCard/MealCard";
import HashLoader from "react-spinners/HashLoader";
import BarLoader from "react-spinners/BarLoader";

const Explore = () => {
  const [cat, setCat] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    data: categories,
    loading: categoriesLoading,
    error: categoriesError,
  } = useSelector((state) => state.recipeCategories);
  const {
    data: mealData,
    loading: mealsLoading,
    error: mealsError,
  } = useSelector((state) => state.mealsByCategory);

  useEffect(() => {
    dispatch(fetchRecipeCategories("/list.php?c=list"));
  }, [dispatch]);

  const handleCategoryChange = (category) => {
    if (category) {
      dispatch(fetchMealsByCategory(category));
    }
  };

  useEffect(() => {
    setCat(mealData.category);
  }, [mealData.category]);

  const handleMealInfoNavigation = (id) => {
    navigate(`/meal/${id}`);
    return "";
  };

  return (
    <div className="container">
      <div className="flex justify-center items-center space-x-3 m-5">
        <h1 className="text-paraColor text-[22px]">Recipe Categories</h1>
        {categoriesLoading === "pending" ? (
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
        ) : categoriesError ? (
          <div className="text-red-400">
            Error loading categories: {categoriesError}
          </div>
        ) : (
          <div className="meal-categories">
            <select
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="w-[300px] bg-slate-500 overflow-y-scroll p-3 rounded border-none"
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option
                  key={category.strCategory}
                  value={category.strCategory}
                  className="text-hoverColor border-none"
                >
                  {category.strCategory}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div>
        <h2 className="text-paraColor text-center text-[32px] font-semibold">
          {cat ? `Meals in ${cat}` : `Please choose a meal category.`}
        </h2>
        {mealsLoading === "pending" ? (
          <div className="text-paraColor">
            <HashLoader
              color="#36d7b7"
              loading={true}
              cssOverride={{
                display: "block",
                margin: "0 auto",
              }}
              size={150}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
          </div>
        ) : mealsError ? (
          <div className="text-red-400">Error loading meals: {mealsError}</div>
        ) : (
          <div className="flex flex-row justify-evenly items-center flex-wrap">
            {mealData.response?.map((meal) => (
              // console.log("Mapping meal:", meal)
              <div
                key={meal.idMeal}
                onClick={() => handleMealInfoNavigation(meal.idMeal)}
              >
                <MealCard
                  id={meal.idMeal}
                  name={meal.strMeal}
                  img={meal.strMealThumb}
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

export default Explore;
