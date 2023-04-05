import { getFotos, resetPages, addPages, currentPage, perPage } from "./fetch_pixabay";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import Notiflix from 'notiflix';

const formEl = document.querySelector('.search-form');
const inputEl = document.querySelector('.input');
const buttonLoadMoreEl = document.querySelector('.load-more');
const galeryEl = document.querySelector('.gallery');
const btnUp = {
      el: document.querySelector('.btn-up'),
      scrolling: false,
      show() {
        if (this.el.classList.contains('btn-up_hide') && !this.el.classList.contains('btn-up_hiding')) {
          this.el.classList.remove('btn-up_hide');
          this.el.classList.add('btn-up_hiding');
          window.setTimeout(() => {
            this.el.classList.remove('btn-up_hiding');
          }, 300);
        }
      },
      hide() {
        if (!this.el.classList.contains('btn-up_hide') && !this.el.classList.contains('btn-up_hiding')) {
          this.el.classList.add('btn-up_hiding');
          window.setTimeout(() => {
            this.el.classList.add('btn-up_hide');
            this.el.classList.remove('btn-up_hiding');
          }, 300);
        }
      },
      addEventListener() {
        // при прокрутке окна (window)
        window.addEventListener('scroll', () => {
          const scrollY = window.scrollY || document.documentElement.scrollTop;
          if (this.scrolling && scrollY > 0) {
            return;
          }
          this.scrolling = false;
          // если пользователь прокрутил страницу более чем на 200px
          if (scrollY > 400) {
            // сделаем кнопку .btn-up видимой
            this.show();
          } else {
            // иначе скроем кнопку .btn-up
            this.hide();
          }
        });
        // при нажатии на кнопку .btn-up
        document.querySelector('.btn-up').onclick = () => {
          this.scrolling = true;
          this.hide();
          // переместиться в верхнюю часть страницы
          window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth'
          });
        }
      }
}
// ПЛАВНАЯ ПРОКРУТКА РАБОТАЕТ НЕ КОРРЕКТНО. ПОЭТОМУ ФУНКЦИЯ ЗАКОММЕНТИРОВАНА ////////////////////////////////////////////////////
// function smoothScroll() {
// const { height: cardHeight } = galeryEl.firstElementChild.getBoundingClientRect();

// window.scrollBy({
//   top: cardHeight * 2,
//   behavior: "smooth",
// });
// }
//   window.addEventListener('scroll', smoothScroll);

inputEl.focus();

formEl.addEventListener('submit', handleSearchForm);
buttonLoadMoreEl.addEventListener('click', handleLoadMoreBtn);
btnUp.addEventListener();

function addLightbox() {
   const lightbox = new SimpleLightbox('.photo-card a', {
   captionsData: 'alt',
   captionDelay: '250',
   animationSpeed: '100',
   fadeSpeed: '150'   
   }).refresh();
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

         if (searchResult.data.hits.length !== perPage && searchResult.data.hits.length !== 0) {
            Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
            buttonLoadMoreEl.classList.add('is-hidden');
         } else if (searchResult.data.hits.length === 0) {
            buttonLoadMoreEl.classList.add('is-hidden');
         } else {
            buttonLoadMoreEl.classList.remove('is-hidden');
         }    

         if (!searchResult.data.total) {
             Notiflix.Notify.warning("Sorry, there are no images matching your search query. Please try again.");
            return;            
         }              
         galeryEl.innerHTML = makeMarkupGalery(searchResult);
         
         addLightbox();
         addPages();

         Notiflix.Notify.success(`Hooray! We found ${searchResult.data.totalHits} images.`);

         // smoothScroll()
    
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
        
         galeryEl.insertAdjacentHTML('beforeend', makeMarkupGalery(searchMoreResult));

         addLightbox();
         addPages();

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
  <div class="info">
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
 </div> 
  
</div>`;
      }).join('');
   }


 
