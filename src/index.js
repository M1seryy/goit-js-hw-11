import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
// Додатковий імпорт стилів
import 'simplelightbox/dist/simple-lightbox.min.css';

const list = document.querySelector('.gallery');
const form = document.querySelector('.search-form');
const btn = document.querySelector('.load-more');
let page = 1;
function formHandler(e) {
  e.preventDefault();
  list.innerHTML = '';
  const value = form.searchQuery.value;
  page = 1;
  serviceImage(value.trim(), page);
}
form.addEventListener('submit', formHandler);
async function serviceImage(name, nextPage) {
  const URL = `https://pixabay.com/api/?key=36745882-9a469cd98fdea02c7a63719ef&q=${name}&image_type=photo&orientation=horizontal&safesearch=true&page=${nextPage}&per_page=40`;
  try {
    const response = await axios.get(URL).then(res => {
      if (res.data.totalHits === 0) {
        Notify.failure(
          "We're sorry, but you've reached the end of search results."
        );
        return;
      } else {
        btn.hidden = false;
        markUp(res.data);
        let lightbox = new SimpleLightbox('.gallery a');
      }
    });
  } catch (err) {
    console.log(err);
  }
}

function markUp(data) {
  data.hits.map(
    ({
      webformatURL,
      largeImageURL,
      tags,
      likes,
      views,
      comments,
      downloads,
    }) => {
      list.insertAdjacentHTML(
        'beforeend',
        `
        <a  href="${largeImageURL}">
        <div class="photo-card">
          <img src="${webformatURL}" alt="" loading="lazy" />
          <div class="info">
            <p class="info-item">
              <b>${likes}</b>
            </p>
            <p class="info-item">
              <b>${views}</b>
            </p>
            <p class="info-item">
            <b>${comments}</b>
            </p>
            <p class="info-item">
            <b>${downloads}</b>
            </p>
            </div>
            </div>
            </a>
            `
      );
    }
  );
}

function nextPegeService() {
  page = page + 1;
  serviceImage(form.searchQuery.value.trim(), page);
}
btn.addEventListener('click', nextPegeService);
