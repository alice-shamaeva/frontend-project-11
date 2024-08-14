import onChange from 'on-change';
import i18nInstance from './locales/initInstance.js';

const formContainer = document.querySelector('[data-purpose="container"]');
const inputUrl = document.querySelector('.form_input');
const feedsContainer = document.querySelector('.feeds');
const postsContainer = document.querySelector('.posts');

export const getWatchedState = (state, render) => onChange(state, render);

export const renderRequestState = (path, value) => {
  if (value === 'pending') {
    const pExample = document.querySelector('.div_p-example');
    if (pExample.nextElementSibling) {
      pExample.nextElementSibling.remove();
    }
  }
};

export const renderModalContent = (path, value) => {
  const { modalTitle, modalBody, postLink } = value[value.length - 1];

  const modal = document.querySelector('#modal');
  const modalButtonFullArticle = modal.querySelector('.full-article');

  modalButtonFullArticle.setAttribute('href', `${postLink}`);
  modal.querySelector('.modal-title').textContent = modalTitle;
  modal.querySelector('.modal-body').textContent = modalBody;
};

export const renderReadabilityPosts = (path, value) => {
  const { postId, readability } = value[value.length - 1];
  const a = document.querySelector(`[data-id="${postId}"]`);

  if (readability === 'read') {
    a.classList.remove('fw-bold');
    a.classList.add('fw-normal', 'link-secondary');
  }
};
export const renderPosts = (path, value) => {
  if (postsContainer.children.length === 0) {
    postsContainer.insertAdjacentHTML(
      'afterbegin',
      `<div class="card border-0">
        <div class="card-body">
          <h2 class="card-title h4">Посты</h2>
        </div>
      </div>
      <ul class="list-group border-0 rounded-0"></ul>`,
    );
  }

  const ulPosts = postsContainer.querySelector('.list-group');
  const { postId, title, link } = value[value.length - 1];
  ulPosts.insertAdjacentHTML(
    'beforeend',
    `<li class="list-group-item d-flex justify-content-between align-items-start border-0 border-end-0">
        <a
          href="${link}"
          class="fw-bold"
          data-id="${postId}"
          target="_blank"
          rel="noopener noreferrer"
        >${title}</a>
        <button 
          type="button"
          class="btn btn-outline-primary btn-sm"
          data-id="${postId}"
          data-bs-toggle="modal"
          data-bs-target="#modal"
        >${i18nInstance.t('validate.openPostPreview')}</button>
    </li>`,
  );
};
export const renderFeeds = (path, value) => {
  if (feedsContainer.children.length === 0) {
    feedsContainer.insertAdjacentHTML(
      'afterbegin',
      `<div class="card border-0">
        <div class="card-body">
          <h2 class="card-title h4">Фиды</h2>
        </div>
      </div>
      <ul class="list-group border-0 rounded-0"></ul>`,
    );
  }

  const { title, description } = value[value.length - 1];

  const ulFeeds = feedsContainer.querySelector('.list-group');
  ulFeeds.insertAdjacentHTML(
    'afterbegin',
    `<li class="list-group-item border-0 border-end-0">
      <h3 class="h6 m-0">${title}</h3>
      <p class="m-0 small text-black-50">${description}</p>
    </li>`,
  );
};

export const renderErrors = (path, value) => {
  if (path === 'errors.validateErrors' || path === 'errors.networkErrors') {
    if (value !== '') {
      inputUrl.classList.add('is-invalid');

      const pExample = document.querySelector('.div_p-example');
      if (pExample.nextElementSibling) {
        pExample.nextElementSibling.remove();
      }

      const pInvalid = document.createElement('p');
      pInvalid.classList.add(
        'feedback',
        'm-0',
        'position-absolute',
        'small',
        'text-danger',
        'div_p_invalid',
      );
      pInvalid.textContent = value;
      formContainer.append(pInvalid);
    }
  }

  if (path === 'rssLinks') {
    inputUrl.value = '';
    inputUrl.focus();
    inputUrl.classList.remove('is-invalid');

    const pExample = document.querySelector('.div_p-example');
    if (pExample.nextElementSibling) {
      pExample.nextElementSibling.remove();
    }

    const pValid = document.createElement('p');
    pValid.classList.add(
      'feedback',
      'm-0',
      'position-absolute',
      'small',
      'text-success',
      'div_p_valid',
    );
    pValid.textContent = i18nInstance.t('validate.successURL');
    formContainer.append(pValid);
  }
};
