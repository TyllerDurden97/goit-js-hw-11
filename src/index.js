import { getFotos, resetPages, currentPage, perPage } from "./fetch_pixabay";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import Notiflix from 'notiflix';

const formEl = document.querySelector('.search-form');
const inputEl = document.querySelector('.input');
const buttonLoadMoreEl = document.querySelector('.load-more');
const galeryEl = document.querySelector('.gallery');


inputEl.focus();


formEl.addEventListener('submit', handleSearchForm);
buttonLoadMoreEl.addEventListener('click', handleLoadMoreBtn);

function addLightbox() {
   const lightbox = new SimpleLightbox('.photo-card a', {
   captionsData: 'alt',
   captionDelay: '250',
   animationSpeed: '100',
   fadeSpeed: '150'   
   });
   return lightbox;
}

function handleSearchForm(event) {
   event.preventDefault();
   resetPages();
   
   if (inputEl.value === '') {
      return
   }
   
   async function fetchData() {
      try {
         const searchResult = await getFotos(inputEl.value.trim());

         if (searchResult.data.hits.length !== perPage) {
             Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
            buttonLoadMoreEl.classList.add('is-hidden');
         } else {
            buttonLoadMoreEl.classList.remove('is-hidden');
         }
       
                  console.log(searchResult);
                  console.log(searchResult.data.hits.length);


         if (!searchResult.data.total) {
             Notiflix.Notify.info("Sorry, there are no images matching your search query. Please try again.");
            return;            
         }
         addLightbox();
         galeryEl.innerHTML = makeMarkupGalery(searchResult);
        
      } catch (error) {
         console.log(error.message);
      }
   }
   fetchData()
}

function handleLoadMoreBtn() {
   async function fetchMoreData() {
      try {
         const searchMoreResult = await getFotos(inputEl.value.trim());
         console.log(searchMoreResult);
         
          if (searchMoreResult.data.hits.length !== perPage) {
             Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
            buttonLoadMoreEl.classList.add('is-hidden');
         }
         addLightbox();

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
      <a class="gallery-item" 
  href="${largeImageURL}">
  <img class="gallery-image" src="${ webformatURL }" alt="${ tags }" loading="lazy" width="350px" height="233"/>
  </a>
  
  
</div>`;
      }).join('');
   }


{/* <div class="info">
    <p class="info-item">
      <b>Likes<br> ${ likes }</b>
    </p>
    <p class="info-item">
      <b>Views<br> ${ views }</b>
    </p>
    <p class="info-item">
      <b>Comments<br> ${ comments }</b>
    </p>
    <p class="info-item">
      <b>Downloads<br> ${ downloads }</b>
    </p>
//   </div> */}





   //  (async function fetchData() {
   //    try {
   //       const res = await getFotos(whatToFind);
   //       console.log(res);
   //    } catch (error) {
   //       console.log(error.message);
   //    }
   // }) ()   
