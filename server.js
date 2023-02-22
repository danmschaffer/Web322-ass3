/*********************************************************************************
*  WEB322 – Assignment 02
*  I declare that this assignment is my own work in accordance with Seneca Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
* 
*  Name: Daniel Moura Schaffer Student ID: 130742216 Date: 02/22/23
*
*  Cyclic Web App URL:  
*
*  GitHub Repository URL: 
*
********************************************************************************/ 

const express = require("express");
const app = express();
const path = require("path");
const exphbs = require("express-handlebars");
const blogService = require("./blog-service.js");
const HTTP_PORT = process.env.PORT || 8080;
const multer = require("multer");
const cloudinary = require('cloudinary').v2
const streamifier = require('streamifier')
const upload = multer(); 


app.set("view engine", ".hbs");  

app.engine(".hbs", exphbs.engine({

    extname: ".hbs",

    defaultLayout: false

}));
cloudinary.config({
    cloud_name: 'dslwyfak3',
    api_key: '971243423761884',
    api_secret: 'ojpLl65IZzxjE6CQVSKiytlYDik',
    secure: true
});
app.use(express.static('public'));

app.get("/", (req, res) => {

    res.redirect("/about");

});


app.get("/about", (req, res) => {
    res.sendFile(path.join(__dirname, "/views/about.html"));

});

app.get("/posts/add", (req, res) => {
    res.sendFile(path.join(__dirname, "/views/addPost.html"));

});

app.post("/posts/add", (req, res) => {
    if(req.file){
        let streamUpload = (req) => {
            return new Promise((resolve, reject) => {
                let stream = cloudinary.uploader.upload_stream(
                    (error, result) => {
                        if (result) {
                            resolve(result);
                        } else {
                            reject(error);
                        }
                    }
                );
    
                streamifier.createReadStream(req.file.buffer).pipe(stream);
            });
        };
    
        async function upload(req) {
            let result = await streamUpload(req);
            console.log(result);
            return result;
        }
    
        upload(req).then((uploaded)=>{
            processPost(uploaded.url);
        });
    }else{
        processPost("");
    }
     
    function processPost(imageUrl){
        req.body.featureImage = imageUrl;
    
        // TODO: Process the req.body and add it as a new Blog Post before redirecting to /posts
    } 

    blogService.addPost(postData)
    
});

app.get("/blog", (req, res) => {
    blogService.getPublishedPosts()

        .then((data) => {
            res.json(data);

        }).catch((err) => {

            res.render("blog", {

                layout: false,

                errorMessage: err

            });

        });

});

 

app.get("/posts", (req, res) => {
  const category = parseInt(req.query.category);
  const minDate = req.query.minDate;

  if (category && (isNaN(category) || category < 1 || category > 5)) {
    return res.status(400).send("Invalid category");
  }

  if (!category && !minDate) {
    blogService.getAllPosts()
      .then((data) => {
        console.log('Retrieved all posts:', data);
        res.json(data);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error retrieving posts");
      });
    return;
  }

  if (category) {
    blogService.getPostsByCategory(category)
      .then((posts) => {
        console.log(`Retrieved posts for category ${category}:`, posts);
        res.json(posts);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error retrieving posts by category");
      });
  }

  if (minDate && /^\d{4}-\d{2}-\d{2}$/.test(minDate)) {
    blogService.getPostsByMinDate(minDate)
      .then((posts) => {
        console.log(`Retrieved posts after ${minDate}:`, posts);
        res.json(posts);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error retrieving posts by minDate");
      });
  } else if (minDate) {
    res.status(400).send("Invalid minDate");
  }
});

app.get("/post/:id", (req, res) => {
  const postId = parseInt(req.params.id, 10);
  blogService.getPostsById(postId)
    .then((post) => {
      if (!post) {
        return res.status(404).send("Post not found");
      } 
      res.json(post);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error retrieving this post");
    });
});

app.get("/categories", (req, res) => {
    blogService.getCategories()

        .then((data) => {
            res.json(data);

        }).catch((err) => {

            res.render("categories", {

                layout: false,

                errorMessage: err

            });

        });

});

blogService.initialize()
    .then((res) => {

    app.listen(HTTP_PORT, () => {
        console.log ("Express http server listening on", HTTP_PORT);
     });
    })
    .catch((err) => console.log(err));