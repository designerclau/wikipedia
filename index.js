const Joi = require('joi');
const express = require('express');
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
const films = require('./model/Post');
require('dotenv/config');
sw = require('stopword');


let responseObj = {
    "status": "",
    "msg": "",
    "body": {

    }
}
const app = express();

app.use(express.json());
app.use(bodyparser.json());

//Initial imput before Mongodb
const docs = [
    {id: 1, title: 'I Robot', body:'this is a book that talk about AI', tags:['robots','sci-fi']},
    {id: 2, title: 'The unforgivable', body:'this is a book that talk about Drama', tags:['drama','crime']},
    {id: 3, title: 'West Side Story', body:'this is a book that talk about Crime', tags:['musical','drama','crime']},
]


//show process
app.get('/process', async(req, res) => {

    res.send(process.env);
    
});

//used to list all films from the database
app.get('/', async(req, res) => {

    try
    {
       const film = await films.find();
       res.json(film);
    } catch (err){
        res.status(500).json({ message: error.message});
    }
    
});

//list the title or body from the database * working
app.get('/look/:text', async(req, res) => {
    stopwords = ['i','me','my','myself','we','our','ours','ourselves','you','your','yours','yourself','yourselves','he','him','his','himself','she','her','hers','herself','it','its','itself','they','them','their','theirs','themselves','what','which','who','whom','this','that','these','those','am','is','are','was','were','be','been','being','have','has','had','having','do','does','did','doing','a','an','the','and','but','if','or','because','as','until','while','of','at','by','for','with','about','against','between','into','through','during','before','after','above','below','to','from','up','down','in','out','on','off','over','under','again','further','then','once','here','there','when','where','why','how','all','any','both','each','few','more','most','other','some','such','no','nor','not','only','own','same','so','than','too','very','s','t','can','will','just','don','should','now']

    var query = req.params.text;
    console.log(query);
    try
    {
      // remove stopwords is not working
      // var newString = sw.removeStopwords(query);
       var queryString=JSON.stringify(query);
       const film = await films.find({"$text": { $search: queryString }});
       res.json(film);
    } catch (error){
        res.status(500).json({ message: error.message});
    }
    
});

//trying with function getFilm
app.get('/search/:text', getFilm, async(req, res) => {

  res.send(res.film.title);
  console.log(res.film.title);
    
});

//another try
app.get("/find"), function(req, res) {
    //films.find( { tags: "Train" } )
    let film;
    try{
        if(!req.body){
            responseObj = {
             "status":"error",
             "msg":"Error occured while searching",
             "body":{}
            }
            res.status(500).send(responseObj);
        }else{
            
          film=films.find({"$text": { $search: "Train" }});
          responseObj = {
             "status":"success",
             "msg":"Record Found",
             "body": console.log(film)
            }
            res.status(500).send(responseObj);
        }
    }catch{
        return res.status(500).json({ message: error.message});
    }
    
   
  };

  //another try
app.get('/search', async(req, res) => {
    
 try{
    var query = req.params.tags;
    console.log(query);
    let film;
    film = await films.find({"$text": { $search: "Train" }});

    
    if (film == null){
        return  res.status(404).json({ message: 'Cannot find the film'});

    }  else{
          console.log("Result: ",film);
    }
   } catch (error) {
        return res.status(500).json({ message: error.message});
   }
   res.send(res);
   //console.log(film);
  });

  //function to get film
async function getFilm (req, res, next){
    let film
    try {
      var query = req.params.text;
      console.log(query);
      //{ tags: { $all: ["red", "blank"] } } )
      { results: { $elemMatch: { product: "xyz" } } }
       film = await films.find({name:{$regex: `^&{req.body.query}`, $options:`i`}}, (console.error, film)) 
      // film = await films.find({  tags: { $elemMatch: { tags: query } } })
     //  {tags: {$all: query }}
       if (film == null){
        return  res.status(404).json({ message: 'Cannot find the film'});

       }
        
    } catch (error) {
        return res.status(500).json({ message: error.message});
    }

    res.film = film
    next()
}

//different way to search
app.post('/searchrecord', async(req, res, next) =>{
    let film
    try{
       if(!req.body){
           responseObj = {
            "status":"error",
            "msg":"Error occured while searching",
            "body":{}
           }
           res.status(500).send(responseObj);
       }else{
        film = await films.find({name:{$regex: `^&{req.body.search.text.trim()}`, $options:`i`}}, (console.error, film)) 
         responseObj = {
            "status":"success",
            "msg":"Record Found",
            "body": console.log(film)
           }
           res.status(500).send(responseObj);
       }
    }catch(error) {
        return res.status(500).json({ message: error.message});

    }
});

//list all
app.post('/index', async(req, res) => {

    const film = new films({
        title: req.body.title,
        body: req.body.body,
        tags:[req.body.tags]
    });

      
    try
    {
      const newfilm = await film.save();
      res.status(201).json(newfilm);
    } catch (err){
        res.status(400).json({ message: error.message});
    }
    
});

app.get('/api/docs', (req, res) => {
    res.send(docs);
});

//list by id, initial way to get data
app.get('/api/docs/:id', (req, res) => {
    const doc = docs.find(c => c.id === parseInt(req.params.id));
    if (!doc) res.status(404).send('The course with the given ID was not found');
    res.send(doc);
});

//connect to database
mongoose.connect( process.env.DB_connection, () =>
                console.log('Connected to Db'),
                 findAllFilms()
                .then(arr => updateFilms(arr))
                .catch(err => console.log(err))
 );

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port} `));

//app.listen(3000, () => console.log(`Listening on port 3000`));

stopwords = ['i','me','my','myself','we','our','ours','ourselves','you','your','yours','yourself','yourselves','he','him','his','himself','she','her','hers','herself','it','its','itself','they','them','their','theirs','themselves','what','which','who','whom','this','that','these','those','am','is','are','was','were','be','been','being','have','has','had','having','do','does','did','doing','a','an','the','and','but','if','or','because','as','until','while','of','at','by','for','with','about','against','between','into','through','during','before','after','above','below','to','from','up','down','in','out','on','off','over','under','again','further','then','once','here','there','when','where','why','how','all','any','both','each','few','more','most','other','some','such','no','nor','not','only','own','same','so','than','too','very','s','t','can','will','just','don','should','now']
 
//function to generate tags
function generateTags(films){
    let tags = [];
    const idfilm = films.id;
    var oldString = films.title.split(' ');
    var newString = sw.removeStopwords(oldString);
    tags.push(newString);
    oldString = films.body.split(' ');
    newString = sw.removeStopwords(oldString);
    tags.push(sw.removeStopwords(newString));
    console.log(tags);
    return tags;
    
}
 
//function to update films
function updateFilms(films){
    films.map((film) => {
        console.log(film.title);
        film.tags = generateTags(film);
        film.save();

    })
}
 
//function to find all films
function findAllFilms(){
    let film
    return film = films.find();
}
 
