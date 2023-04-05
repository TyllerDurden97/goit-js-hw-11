import axios from "axios";

export let currentPage = 1;
export let perPage = 40;
// let totalFechedImages = 


export function getFotos (whatToFind) {
   const API_KEY = '29462445-ad519f5c94a1ccd9fe6c99f35';
   const BASE_URL = 'https://pixabay.com/api/';
   const searchParams = new URLSearchParams({
        key: API_KEY,
        q: whatToFind,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: 'true',
        per_page: [perPage],
      page: [currentPage],
        });
   try {
      return axios
         .get(`${BASE_URL}?${searchParams}`);
   } catch (error) {
      throw new Error(error.massege);
   }
};

export function resetPages() {
   currentPage = 1;
}

export function addPages() {
      currentPage += 1;
}



