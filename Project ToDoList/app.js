//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
mongoose.connect("mongodb+srv://RyuZaki10:ayush123@cluster0.qquya.mongodb.net/todolistDB",{useNewUrlParser:true, useUnifiedTopology:true});

const itemSchema = {
  item: {
    type: String,
    
  }
};

const Item = mongoose.model("Item",itemSchema);

const item1 = new Item({item:"Welcome to our todo list"});
const item2 = new Item({item:"Hit the + to enter a item"});
const item3 = new Item({item:"Hello"});

const defaultItems = [item1,item2,item3];


app.get("/", function(req, res) {
  Item.find({},function(err,item){
    if(item.length===0)
    {
      Item.insertMany(defaultItems,function(err){
        if(err) console.log(err);
      else console.log("Updated successfully");
     });     
     res.render("list",{listTitle:"Today",newListItems: defaultItems});
    }
    else res.render("list", {listTitle: "Today", newListItems: item});
    if(err) console.log(err);
    else
    console.log(item);
    
  });
});

const listSchema = {
  name: String,
  items: [itemSchema]
};
const List = mongoose.model("List",listSchema);

app.get("/:customList",function(req,res){
  const customlistName = req.params.customList;
  List.findOne({name:customlistName},function(err,results){
    if(results.length>0) console.log("found");
    else console.log("not found")
  });
  const list = new List({
    name: customlistName,
    items: defaultItems
  });
  list.save();
});

app.post("/", function(req, res){

  const item = req.body.newItem;
  const newitem = new Item({item:item});
  newitem.save();
  res.redirect("/");
});

app.post("/delete",function(req,res){
  const id = req.body.checkbox;
  
  Item.findByIdAndRemove(id,function(err){
    if(!err) console.log("Successfully deleted.");
  });
  res.redirect("/");
});

app.get("/work", function(req,res){
  res.render("list", {listTitle: "Work List", newListItems: workItems});
});

app.get("/about", function(req, res){
  res.render("about");
});

let port = process.env.port;
if(port== "NULL" || port==""){
  port = 3000;
}

app.listen(port, function() {
  console.log("Server started successfully");
});
