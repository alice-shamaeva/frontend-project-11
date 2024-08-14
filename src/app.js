import * as yup from 'yup';
import _ from 'lodash';
import {
  state,
  watchedStateErrors,
  watchedStateDataFeeds,
  watchedStateDataPosts,
  watchedStateReadabilityPosts,
  watchedStateModalContent,
} from './model.js';
import i18nInstance from './locales/initInstance.js';
import validate from './validate.js';
import dataParse from './dataParse.js';
import getRSSFeed from './getRSSFeed.js';
import getNewPosts from './getNewPosts.js';

const app = () => {
  const inputUrl = document.querySelector('.form_input');
  const form = document.querySelector('.rss-form');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log(e.target);
    const url = inputUrl.value.trim();

    watchedStateErrors.errors.validateErrors = '';

    const schema = yup
      .string()
      .url(i18nInstance.t('validate.invalidURL'))
      .notOneOf(state.rssLinks, i18nInstance.t('validate.notUniqueURL'));

    if (url.length === 0) {
      watchedStateErrors.errors.validateErrors = i18nInstance.t('validate.shouldNotBeEmpty');
      return;
    }

    watchedStateErrors.errors.validateErrors = validate(url, schema);
    if (state.errors.validateErrors.length === 0 && !state.rssLinks.includes(url)) {
      getRSSFeed(url)
        .then((response) => {
          const doc = dataParse(response.data.contents);

          if (!doc.querySelector('channel')) {
            watchedStateErrors.errors.validateErrors = i18nInstance.t(
              'validate.urlShouldContainRSS',
            );
            return;
          }

          const titleFeed = doc.querySelector('title').textContent;
          const descriptionFeed = doc.querySelector('description').textContent;
          const feed = {
            id: _.uniqueId(),
            url,
            title: titleFeed,
            description: descriptionFeed,
          };
          watchedStateDataFeeds.data.feeds.push(feed);

          const items = doc.querySelectorAll('item');
          items.forEach((item) => {
            const titlePost = item.querySelector('title').textContent;
            const descriptionPost = item.querySelector('description').textContent;
            const linkPost = item.querySelector('link').textContent;
            const post = {
              feedId: feed.id,
              postId: _.uniqueId(),
              title: titlePost,
              description: descriptionPost,
              link: linkPost,
            };
            watchedStateDataPosts.data.posts.push(post);
          });
        })
        .catch((error) => {
          watchedStateErrors.errors.networkErrors = i18nInstance.t('validate.networkError');
          console.log(`Вывожу ошибку сети: ${error}`);
        });

      watchedStateErrors.rssLinks.push(url);
    }
  });

  const modal = document.querySelector('#modal');

  modal.addEventListener('show.bs.modal', (event) => {
    const button = event.relatedTarget;
    const idButton = button.getAttribute('data-id');

    let postDescription;
    state.data.posts.forEach((post) => {
      if (post.postId === idButton) {
        postDescription = post.description;
      }
    });

    const li = button.parentNode;
    const a = li.querySelector('a');
    const postTitle = a.textContent;
    const postLink = a.getAttribute('href');

    watchedStateReadabilityPosts.uiState.readabilityPosts.push({
      postId: idButton,
      readability: 'read',
    });
    watchedStateModalContent.uiState.modalContent.push({
      postId: idButton,
      modalTitle: postTitle,
      modalBody: postDescription,
      postLink,
    });
  });

  getNewPosts();
};

export default app;
