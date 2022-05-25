const express = require('express')
const cors = require('cors')
const app = express()
const port = 3000

app.use(express.json())    // <==== parse request body as JSON ( Inbuilt to Express )
app.use(cors());

const MongoClient = require('mongodb').MongoClient;
const uri = "";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// Global for general use
let currCollection;

client.connect(err => {
   currCollection = client.db("webapp_ass2").collection("products");
  // perform actions on the collection object
  console.log ('Database up!')
 
});


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/getData', (req, res) => {

	currCollection.find().toArray( function(err,docs) {
		if(err) {
		  console.log("Some error.. " + err);
		} else {
		   console.log( JSON.stringify(docs) + " have been retrieved.");
		//    res.send("<h1>" + JSON.stringify(docs) + " : " +  err + "</h1>");
		   res.send(docs);
		}

	});

});

app.post('/postData', (req, res) => {
	console.log("Data: " + JSON.stringify(req.body));

	currCollection.insertMany( req.body , function(err, result) {
	   if (err) {
			console.log(err);
		}else {
			console.log({"msg" : result.insertedCount + " Records Inserted Count:"}); 
			res.send({"msg" : result.insertedCount + " Records Inserted:"});
		 }// end
	
});

})

app.post('/postDeleteAll', (req, res) => {

	currCollection.deleteMany( function(err, result) {
	   if (err) {
			console.log(err);
		}else {
			console.log({"msg" : " Records deleted Count"}); 
			res.send({"msg" : "All records deleted"});
		 }// end
	
});

})

app.listen(port, () => {
  console.log(`Example app listening at http://192.168.1.7:${port}`)
})