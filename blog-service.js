const fs = require("fs");

let posts = [];
let categories = [];

module.exports = {

    initialize,

    getAllPosts,

    getPublishedPosts,

    getCategories,

    addPost,

    getPostsByCategory,

    getPostsByMinDate,

    getPostsById

}

function initialize() {
    return new Promise((resolve, reject) => {

        fs.readFile('./data/posts.json', 'utf8', (err, data) => {

            if (err) {
                reject("Unable to read the file");

            }
            else {

                posts = JSON.parse(data);
                fs.readFile('./data/categories.json', 'utf8', (err, data) => {
                    if (err) {

                        reject("Unable to read the file");

                    }

                    else {

                        categories = JSON.parse(data);

                        resolve();

                    }

                });

            }

        });

 

    });

}

function getAllPosts() {
    return new Promise((resolve, reject) => {

        if (posts.length == 0) {

            reject("No results returned");

        }

        else {

            resolve(posts);

        }

    });

}
function getPublishedPosts() {
    return new Promise((resolve, reject) => {

        let publishedPosts = posts.filter(post => post.published == true);

        if (publishedPosts.length == 0) {

            reject("No results returned");

        }

        else {

            resolve(publishedPosts);

        }

    });

}

 

function getCategories() {
    return new Promise((resolve, reject) => {

        if (categories.length == 0) {

            reject("no results returned");

        }

        else {

            resolve(categories);

        }

    });

}

function getPostsByMinDate(minDate) {
  return new Promise((resolve, reject) => {
    if (minDate === undefined) {
      resolve(posts);
    } else {
      const matchingPosts = posts.filter(post => new Date(post.postDate) >= new Date(minDate));
      if (matchingPosts.length === 0) {
        reject("No results returned date");
      } else {
        resolve(matchingPosts);
      }
    }
  });
 }
function getPostsById(id) {
    return new Promise((resolve, reject) => {
      const matchingPost = posts.find(posts => posts.id === id);
  
      if (!matchingPost) {
        reject("No result returned id");
      } else {
        resolve(matchingPost);
      }
    });
  }

function addPost(postData) {
    return new Promise((resolve, reject) => {
      if (typeof postData.published === "undefined") {
        postData.published = false;
      } else {
        postData.published = true;
      }
      postData.id = posts.length + 1;
      if (!postData.title || !postData.content || !postData.category) {
        reject(new Error("Title, content, and category are required."));
      } else {
        posts.push(postData);
        resolve(posts);
      }
    });
  }
  function getPostsByCategory(category) {
    return new Promise((resolve, reject) => {
      if (category === undefined) {
        resolve(posts);
      } else {
        const matchingPosts = posts.filter(post => post.category === category);
        if (matchingPosts.length === 0) {
          reject("No results returned category");
        } else {
          resolve(matchingPosts);
        }
      }
    });
   }
