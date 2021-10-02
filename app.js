const express = require("express");
const bodyPARSER= require("body-parser");
const mongoose= require("mongoose");
const _= require("lodash");
const app= express();
mongoose.connect("mongodb+srv://shriyansh:7753988419@cluster0.0qjc1.mongodb.net/todolist")//to connect to mongoDB
app.use(bodyPARSER.urlencoded({extended: true}));
app.use(express.static("public") );
// we  need a views named folder in which that file will e present  in  whih we have to insert
// the below line activated EJS obvioysly  download ejs by npm install ejs

// THESE ANCHOR <%=  %> IS used to put in something in our template
app.set('view engine', 'ejs');
var day;
// THESE ANCHOR <% %> IS used to put in CONTROL STRUCTURES OF java scrpit in our template

// how to make and put data in templates


//declare global variables here to get them in scope always

// now we use mongoDB instead.of var add= ["Buy food", "cook food", "eat food" ];  //arrar of items

 const itemsSchema= {

 name: String

 };

const Item= mongoose.model("Item", itemsSchema);

const first= new Item({
  name:" Welcome to YOUR todoList"
});


const second= new Item({
  name:"Hit  (+) to ADD new ITEM "
});

const third= new Item({
  name:" <-- hit this to DELETE an Item"
});

// make array having default vales and addthem using insertMnay
const defaultItem= [first,second ,third ];

//add values
// ADD VALUES ONLY ONCE !!!

const listSchema= {

 name:String,
 more: [itemsSchema]

};

const List= mongoose.model("list", listSchema);

var today= new Date();


  var options= {

   weekday: 'long',
   month: 'long',
   day: 'numeric'

  };

day= today.toLocaleDateString("en-US",options);

//the above line is from stackOVERFLOW which gives us dates.

app.get("/", function(req , res){
// same as db.items.find()
  Item.find({}, function(err, founditems){
//console.log(founditems);
//check if db is empty then add defaultItem
if(founditems.length==0)
{
//adds default items only when initially empty
  Item.insertMany(defaultItem, function(err){
  if(err){
    console.log(err);
  }
  else{
    console.log("Sucess!!!!");
  }

  });

 res.redirect("/");// goes back calls this get again but now we are in else block

}
else{

  res.render("list", {listHEAD: day,Add: founditems });
//this add data on our website

}

  });


// we use a render function of EJS lib ("filename in which we want to insert", { variavleINTHATFILE : THISfileVariable})

});

DATEHEAD= day;
app.post("/", function(req,res){


// to add into our array
// simply add the bodyPARSER to get the value and insert it into our items collection as a new Item

// get list. from button
//const listName = .slice(0,-1);

//for removing an extra space
const kitem= new Item({
  name: req.body.Newitem

});
//~~~~~~~ERROR PRONE CODE~~~~~~~~~~

if ( DATEHEAD=== req.body.list)
{     //.  saves our item
 kitem.save();
  //to redirect to home route where1 get() is called and the thing addded in our FOUNDitems hence gets displayed
  res.redirect("/");
//home page
}

else{
List.findOne({name:req.body.list}, function(err,foundlist){

foundlist.more.push(kitem);
  foundlist.save();
  res.redirect("/" +  req.body.list);
});


}








//```````````~~~~~~~~till here ~~~~~~~``



//  add.push(kitem);
//  res.render("list",{Add:add});  will generate.error thats
//we.. need  to pass all the vales in 1 single render codeLine and later rediect to home route..
});


app.post("/delete",function(req,res){


const checkedItemId= (req.body.checked).trim();//.trim( ) give us objectid and solves our error -- stackOVERFLOW
// DELETE CHECKED items by ID ,which we got from INPUT value="" mehtod


if(DATEHEAD=== req.body.deleteList)
{



Item.findByIdAndRemove(checkedItemId, function(err){
  if(err){
    console.log(err);
  }
  else{
    console.log(checkedItemId);
  }

    res.redirect("/" );


});

}

else{
// this line is used to get an item from array using its id as paramaeter
List.findOneAndUpdate( {name: req.body.deleteList}, {$pull: {more: {_id:checkedItemId }} } , function(err, foundlist){

if(!err)
{
  res.redirect("/"+ req.body.deleteList );
}


}   );



}






});

app.get("/:postName", function(req,res) {

 var postName= _.capitalize(req.params.postName);


List.findOne({name:postName},function(err,foundlist){

  if(!err){
    if(!foundlist)
    {
    //ceate a new list
    const list= new List({

    name:postName,
    more:defaultItem

    });

list.save();

res.redirect("/" + postName );
    }
    else{
/////show a exisisting list if already exists

res.render("list", {listHEAD: foundlist.name ,Add: foundlist.more });

    }

  }
});
//this add data on our website

});








app.get("/about",function(req,res){

  res.render("about.ejs")
});

//mongoose.connection.close();












////////////////////...////////////////////
let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}



app.listen(port,  function(){  console.log("sever started")});
