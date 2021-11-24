import './css/styles.css';
import axios from 'axios';
import Notiflix from 'notiflix';
// Описан в документации
import SimpleLightbox from 'simplelightbox';
// Дополнительный импорт стилей
import 'simplelightbox/dist/simple-lightbox.min.css';

const formSubmit = document.querySelector('.search-form');
const galaryMarkup = document.querySelector('.gallery');
const btnLoadPick = document.querySelector('.load-more');

const MY_KEY = '24465879-ee592e630361e28095acfb740';

let perpage = 0;

let pages = 1;
let inputPickSearch = '';

btnLoadPick.addEventListener('click', loadMoreBtn);
formSubmit.addEventListener('submit', handleSubmit);

function resetPage() {
  galaryMarkup.innerHTML = '';
  pages = 1;
}

function handleSubmit(event) {
  event.preventDefault();
  btnLoadPick.classList.remove('visually-hidden');
  btnLoadPick.setAttribute('disabled', true);

  resetPage();

  inputPickSearch = event.target.searchQuery.value;
  // console.log(event.target.searchQuery.value);

  fetchPic(inputPickSearch)
    .then(res => {
      perpage = 40;
      Notiflix.Notify.success(`Hooray! We found ${res.data.totalHits} images.`);
      renderPic(res);
      pages += 1;
      btnLoadPick.removeAttribute('disabled');
    })
    .catch(error => Notiflix.Notify.failure(error.message));
}

function loadMoreBtn() {
  btnLoadPick.setAttribute('disabled', true);

  fetchPic(inputPickSearch)
    .then(res => {
      perpage += 40;

      if (perpage >= Number(res.data.totalHits)) {
        btnLoadPick.classList.add('visually-hidden');
        return Notiflix.Notify.info(`We're sorry, but you've reached the end of search results.`);
      } else {
        // console.dir(res.data.totalHits); // Консоль
        renderPic(res);
        pages += 1;
        btnLoadPick.removeAttribute('disabled');
      }
    })
    .catch(error => Notiflix.Notify.failure(error.message));
}

async function fetchPic(currentPick) {
  const response = await axios.get(
    `https://pixabay.com/api/?key=${MY_KEY}&q=${currentPick}&image_type=photo&orientation=horizontal&safesearch=true&page=${pages}&per_page=40`,
  );

  if (response.data.total === 0) {
    return Promise.reject(
      new Error('Sorry, there are no images matching your search query. Please try again.'),
    );
  }
  return response;
}

function renderPic(res) {
  // console.log(res.data.hits);

  const markup = res.data.hits
    .map(picks => {
      return `<div class="photo-card">
  <a href="${picks.webformatURL}"><img src="${picks.largeImageURL}" alt="${picks.tags}" loading="lazy" width="200"/></a>
  <div class="info">
    <p class="info-item">
      <b>Likes:${picks.likes}</b>
    </p>
    <p class="info-item">
      <b>Views:${picks.views}</b>
    </p>
    <p class="info-item">
      <b>Comments:${picks.comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads:${picks.downloads}</b>
    </p>
  </div>
</div>`;
    })
    .join('');
  galaryMarkup.insertAdjacentHTML('afterbegin', markup);
  var lightbox = new SimpleLightbox('.gallery a', {
    /* options */
    captionsData: 'alt',
    captionDelay: 250,
  });
  lightbox.refresh();
}

// function renderPic(res) {
//   // console.log(res.data.hits);

//   const markup = res.data.hits
//     .map(picks => {
//       return `<div class="photo-card">
//     <img src="${picks.largeImageURL}" alt="${picks.tags}" loading="lazy" width="200"/>
//     <div class="info">
//       <p class="info-item">
//         <b>Likes:${picks.likes}</b>
//       </p>
//       <p class="info-item">
//         <b>Views:${picks.views}</b>
//       </p>
//       <p class="info-item">
//         <b>Comments:${picks.comments}</b>
//       </p>
//       <p class="info-item">
//         <b>Downloads:${picks.downloads}</b>
//       </p>
//     </div>
//   </div>`;
//     })
//     .join('');
//   galaryMarkup.insertAdjacentHTML('afterbegin', markup);
// }

// async function fetchPic(currentPick) {
//   return await axios
//     .get(
//       `https://pixabay.com/api/?key=${MY_KEY}&q=${currentPick}&image_type=photo&orientation=horizontal&safesearch=true&page=${pages}&per_page=100`,
//     )
//     .then(res => {
//       if (res.data.total === 0) {
//         return Promise.reject(
//           new Error('Sorry, there are no images matching your search query. Please try again.'),
//         );
//       }
//       return res;
//     });
// }
// function fetchPic(currentPick) {
//   return fetch(
//     `https://pixabay.com/api/?key=${MY_KEY}&q=${currentPick}&image_type=photo&orientation=horizontal&safesearch=true`,
//   ).then(res => {
//     if (res.status === 404) {
//       return Promise.reject(
//         new Error('Sorry, there are no images matching your search query. Please try again.'),
//       );
//     }
//     return res.json();
//   });
// }
