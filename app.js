const express = require('express');
const nunjucks = require('nunjucks');
const bodyParser = require('body-parser');
const axios = require('axios');
const path = require('path');

const app = express();
const port = 3000;

app.set('view engine', 'html');
nunjucks.configure(path.join(__dirname, 'templates'), {
  autoescape:true,
  noCache: (process.env.ENV == 'production')?false:true,
  express:app,
})
app.use('/static', express.static(__dirname + '/public'))
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

app.get('/',(req,res)=>{
    axios.get('http://localhost:3004/posts')
        .then((response)=>{
            const data = {
                posts : response.data
            };
            res.render("index.html",data)
        })
})

app.get('/post/:id',(req,res)=>{
    const id = req.params.id;
    axios.get(`http://localhost:3004/posts/${id}`)
        .then((response)=>{
            const data = {
                post : response.data
            };
            res.render("post.html",data)
        })
})

app.get('/createPost',(req,res)=>{
    res.render("postform.html")
})
app.post('/post',(req,res)=>{
    const title = req.body.title;
    const description = req.body.description;
    const data = {
        title: title,
        description: description,
    }
    axios.post('http://localhost:3004/posts',data)
        .then(response=>{
            const data = {
                id : response.data.id,
                title: response.data.title,
                description: response.data.description,
            }
            console.log(data);
            console.log(data.id);
            return res.redirect("/post/" + data.id)
        })
        .catch(error=>{
            console.log("FOUND ERROR",error);
        })
})

app.listen(port , ()=>{
    console.log(`Server running at ${port}`);
})
