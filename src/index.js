import './css/styles.css';
import Notiflix from 'notiflix';

const formSubmit = document.querySelector('.search-form');
const galaryMarkup = document.querySelector('.gallery');
console.log(galaryMarkup);

const MY_KEY = '24465879-ee592e630361e28095acfb740';

formSubmit.addEventListener('submit', handleSubmit);

function handleSubmit(event) {
  event.preventDefault();
  const inputPickSearch = event.target.searchQuery.value;
  console.log(event.target.searchQuery.value);
  fetchPic(inputPickSearch)
    .then(picList => renderPic(picList))
    .catch(error => console.log(error));
}

function fetchPic(currentPick) {
  return fetch(
    `https://pixabay.com/api/?key=${MY_KEY}&q=${currentPick}&image_type=photo&orientation=horizontal&safesearch=true`,
  ).then(res => {
    if (res.status === 404) {
      return Promise.reject(
        new Error('Sorry, there are no images matching your search query. Please try again.'),
      );
    }
    return res.json();
  });
}

function renderPic(picList) {
  console.log(picList);
  const markup = picList.hits
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
