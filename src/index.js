import './css/styles.css';
import axios from 'axios';
import Notiflix from 'notiflix';

const formSubmit = document.querySelector('.search-form');
const galaryMarkup = document.querySelector('.gallery');
const btnLoadPick = document.querySelector('.load-more');
// console.log(galaryMarkup);

const MY_KEY = '24465879-ee592e630361e28095acfb740';

let pages = 1;
let inputPickSearch = '';

function resetPage() {
  galaryMarkup.innerHTML = '';
  pages = 1;
}

btnLoadPick.addEventListener('click', () => {
  btnLoadPick.setAttribute('disabled', true);
  fetchPic(inputPickSearch)
    .then(res => {
      renderPic(res);
      pages += 1;
      btnLoadPick.removeAttribute('disabled');
    })
    .catch(error => Notiflix.Notify.failure(error));
});

formSubmit.addEventListener('submit', handleSubmit);

async function fetchPic(currentPick) {
  return await axios
    .get(
      `https://pixabay.com/api/?key=${MY_KEY}&q=${currentPick}&image_type=photo&orientation=horizontal&safesearch=true&page=${pages}&per_page=5`,
    )
    .then(res => {
      if (res.data.total === 0) {
        return Promise.reject(
          'Sorry, there are no images matching your search query. Please try again.',
        );
      }
      return res;
    });
}

function handleSubmit(event) {
  event.preventDefault();
  btnLoadPick.classList.remove('visually-hidden');
  btnLoadPick.setAttribute('disabled', true);

  resetPage();

  inputPickSearch = event.target.searchQuery.value;
  console.log(event.target.searchQuery.value);

  fetchPic(inputPickSearch)
    .then(res => {
      renderPic(res);
      pages += 1;
      btnLoadPick.removeAttribute('disabled');
    })
    .catch(error => Notiflix.Notify.failure(error));
}

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

function renderPic(res) {
  console.log(res.data.hits);
  const markup = res.data.hits
    .map(picks => {
      // console.log(picks);

      return `<div class="photo-card">
    <img src="${picks.largeImageURL}" alt="${picks.tags}" loading="lazy" width="100"/>
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
}
