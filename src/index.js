import { getFotos } from "./fetch_pixabay";

const formEl = document.querySelector('.search-form');
const inputEl = document.querySelector('.input');
const buttonLoadMoreEl = document.querySelector('.load-more');
const galeryEl = document.querySelector('.gallery');

inputEl.focus();
   console.dir(inputEl.value);


formEl.addEventListener('submit', handleSearchForm);
buttonLoadMoreEl.addEventListener('click', handleLoadMoreBtn);


function handleSearchForm(event) {
   event.preventDefault();
   // console.log(whatToFind);
      if (inputEl.value === '') {
      return
   }
   
   async function fetchData() {
      try {
         const searchResult = await getFotos(inputEl.value.trim());
           console.log(searchResult);

         if (!searchResult.data.total) {
            console.log("Sorry, there are no images matching your search query. Please try again.");
            return;            
         }
      //    if (searchResult.data.totalHits >= searchParams.per_page) {
      // buttonLoadMoreEl.classList.remove('is-hidden');
      // }
         galeryEl.innerHTML = makeMarkupGalery(searchResult);
        
      } catch (error) {
         console.log(error.message);
      }
   }
   fetchData()
   // page += 1;

}

function handleLoadMoreBtn() {
   async function fetchMoreData() {
      try {
         const searchMoreResult = await getFotos(inputEl.value.trim());
           console.log(searchMoreResult);

         
      //    if (searchResult.data.totalHits >= searchParams.per_page) {
      // buttonLoadMoreEl.classList.remove('is-hidden');
      // }
         galeryEl.insertAdjacentHTML('beforeend', makeMarkupGalery(searchMoreResult));
        
      } catch (error) {
         console.log(error.message);
      }
   }
   fetchMoreData()
}


   function makeMarkupGalery(searchResult) {
   return searchResult.data.hits.map(({ largeImageURL, views, webformatURL, tags, likes, comments, downloads }) => {
      return `         
      <div class="photo-card">
  <img src="${ webformatURL }" alt="${ tags }" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes ${ likes }</b>
    </p>
    <p class="info-item">
      <b>Views ${ views }</b>
    </p>
    <p class="info-item">
      <b>Comments ${ comments }</b>
    </p>
    <p class="info-item">
      <b>Downloads ${ downloads }</b>
    </p>
  </div>
</div>`;
      }).join('');
   }








   //  (async function fetchData() {
   //    try {
   //       const res = await getFotos(whatToFind);
   //       console.log(res);
   //    } catch (error) {
   //       console.log(error.message);
   //    }
   // }) ()   
