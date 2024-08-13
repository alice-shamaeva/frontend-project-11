import {
  getWatchedState,
  renderErrors,
  renderFeeds,
  renderPosts,
  renderReadabilityPosts,
  renderModalContent,
  renderRequestState,
} from './view.js';

export const state = {
  requestState: 'fulfilled',
  rssLinks: [],
  data: {
    feeds: [
    ],
    posts: [
    ],
  },
  uiState: {
    readabilityPosts: [
    ],
    modalContent: [
    ],
  },
  errors: { validateErrors: '', networkErrors: '' },
};

export const watchedStateErrors = getWatchedState(state, renderErrors);
export const watchedStateDataFeeds = getWatchedState(state, renderFeeds);
export const watchedStateDataPosts = getWatchedState(state, renderPosts);
export const watchedStateReadabilityPosts = getWatchedState(state, renderReadabilityPosts);
export const watchedStateModalContent = getWatchedState(state, renderModalContent);
export const watchedStateRequest = getWatchedState(state, renderRequestState);
