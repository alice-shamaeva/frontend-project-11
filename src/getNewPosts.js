import _ from 'lodash';
import getRSSFeed from './getRSSFeed.js';
import dataParse from './dataParse.js';
import { state, watchedStateDataPosts } from './model.js';

const getNewPosts = () => {
  state.rssLinks.forEach((link) => {
    let postId;
    state.data.feeds.forEach((feed) => {
      if (feed.url === link) {
        postId = feed.id;
      }
    });

    getRSSFeed(link)
      .then((response) => {
        const doc = dataParse(response.data.contents);
        const items = doc.querySelectorAll('item');
        const existedTitlesPosts = [];
        state.data.posts.forEach((post) => {
          existedTitlesPosts.push(post.title);
        });

        Array.from(items)
          .filter((item) => {
            const titlePost = item.querySelector('title').textContent;
            return !existedTitlesPosts.includes(titlePost);
          })
          .forEach((item) => {
            const titlePost = item.querySelector('title').textContent;
            const linkPost = item.querySelector('link').nextSibling;
            const post = {
              id: _.uniqueId(),
              postId,
              title: titlePost,
              link: linkPost,
            };
            watchedStateDataPosts.data.posts.push(post);
          });
      })
      .catch((err) => {
        state.requestState = 'rejected';
        console.log(err);
      });
  });

  setTimeout(getNewPosts, 5000);
};

export default getNewPosts;
