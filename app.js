var  express        = require("express")
   , app            = express()
   , cors           = require('cors')
   , mongoose       = require("mongoose")
    , axios         = require("axios")
    , Word          = require("./models/words")
   , bodyParser     = require("body-parser");

const fs = require('fs');
const csv = require('fast-csv');




const path = require("path");


mongoose.connect('mongodb+srv://nitinb:Nit@1979@cluster0.4so4u.mongodb.net/flashcard-app?retryWrites=true&w=majority',{ useNewUrlParser: true, useUnifiedTopology: true });



app.use(cors());
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json({limit: "50mb"}));
app.use(express.static(path.join(__dirname, "client", "build")));


const handlePositiveResponse = async(wordObj)=>{
    //take the word object , c++ , ciratio = c/i
    //update this object
    try{
        words = await Word.find({"word" : wordObj.word})
        oldWordObj = words[0]
        newWordObj = {
            word : oldWordObj.word,
            meaning : oldWordObj.meaning,
            correct : oldWordObj.correct +1 ,
            incorrect: oldWordObj.incorrect,
            ciratio: (oldWordObj.correct +1) / oldWordObj.incorrect
        }
        updatedWord = await Word.findByIdAndUpdate(oldWordObj._id,{$set : newWordObj},{useFindAndModify: false})
        console.log("update successful")

    }catch(err){
        console.log(err)
    }
}

const handleNegativeResponse = async(wordObj)=>{
    //take the word object , i++ , ciratio = c/i
    //update this object
    try{
        words = await Word.find({"word" : wordObj.word})
        oldWordObj = words[0]
        newWordObj = {
            word : oldWordObj.word,
            meaning : oldWordObj.meaning,
            correct : oldWordObj.correct  ,
            incorrect: oldWordObj.incorrect + 1,
            ciratio: oldWordObj.correct/ (oldWordObj.incorrect + 1)
        }
        updatedWord = await Word.findByIdAndUpdate(oldWordObj._id,{$set : newWordObj},{useFindAndModify: false})
        console.log("update successful")

    }catch(err){
        console.log(err)
    }
}


app.post("/responseHandler",(req,res)=>{
    console.log(req.body)
    if(req.body.response === 1){
        handlePositiveResponse(req.body.word)
    }
    if(req.body.response === 0){
        handleNegativeResponse(req.body.word)
    }
    res.json({status : "success"})
});


app.post("/getWords" , async (req,res)=>{
   try{
       console.log(req.body)
       words = await Word.find({})
       res.json(words)
   }catch(err){
       console.log(err)
   }
})


const checkWordsInDb = async(wordObj)=>{

    await Word.find({"word" : wordObj.word},(err,res)=>{
      if(err){
          console.log(err)
      }else{
          if(res.length === 0){
              console.log("word not found , adding into the database...")
              let wordObjDb = {
                  word : wordObj.word ,
                  meaning : wordObj.meaning ,
                  correct : 0,
                  incorrect : 1,
                  ciratio : 0
              }
              Word.create(wordObjDb,(err,newWord)=>{
                  if(err){
                      console.log(err)
                  }else{
                      console.log("Created word successfully :- ")
                      console.log(newWord)
                  }
              })
          }else{
              console.log("word already exists")
          }
      }

    })
}

app.post("/sourceDataFromCSV",(req,res)=>{
    fs.createReadStream(path.resolve(__dirname, 'public', 'words.csv'))
        .pipe(csv.parse({ headers: true }))
        .on('error', error => console.error(error))
        .on('data', row =>   checkWordsInDb(row) )
        .on('end', rowCount => console.log(`Parsed ${rowCount} rows`));

    res.json({status : "success"})
})


app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});



app.listen(7000,function(){
     console.log("app server has started on 7000");
});

