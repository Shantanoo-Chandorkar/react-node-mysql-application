import axios from "axios";

export const BASE_URL = "https://www.themealdb.com/api/json/v1/1";

export const fetchDataFromApi = async (url) => {
  try {
    const { data } = await axios.get(BASE_URL + url);
    return data;
  } catch (err) {
    console.log(err);
    return err;
  }
};
