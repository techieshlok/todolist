const express =require("express");
const  bodyParser =require("body-parser");
const mongoose =require("mongoose");
const _=require("lodash");
const { type } = require("express/lib/response");
const app=express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set("view engine","ejs");

mongoose.connect("mongodb+srv://techieking:Shlok9768@cluster0.slng1.mongodb.net/todolistdb",{useNewUrlParser:true});

const itemsSchema ={
    name:String
};

const Item =mongoose.model("Item",itemsSchema);

 const Items1=new Item({
     name:"To  do a weeding"
 });

 const Items2=new Item({
    name:"To  do a bathroom"
});

const Items3=new Item({
    name:"To  do a bathing"
});

const defaultItems =[Items1,Items2,Items3];

const listSchema={
    name:String,
    items:[itemsSchema]
};
const list=mongoose.model("list",listSchema);

app.get("/",function(req,res){
    Item.find({},function(err,result){
        if(result.length===0){
            Item.insertMany(defaultItems,function(err){
                if(err){
                    console.log(err);
                }else{
                    console.log("succesfull done");
                }
            });
            res.redirect("/");
        }else{
            res.render("list",{day1:"Today",newWork:result});
        }
        
    });
  
});
//routing parameters
app.get("/:user_ID",function(req,res){
    const routing =_.capitalize(req.params.user_ID);
    list.findOne({name:routing},function(err,foundlist){
        if(!err){
            if(!foundlist){
                const list1=new list({
                    name:routing,
                    items:defaultItems
                });
                list1.save();
                res.redirect("/"+routing);
            }else{
               res.render("list",{day1:foundlist.name,newWork:foundlist.items})
            }
        }
    })
   
});


app.post("/",function(req,res){
     var itemdef=req.body.worklist;
     const listName=req.body.button;
     const item =new Item({
         name:itemdef
     });
     if(listName==="Today"){
        item.save();
        res.redirect("/");
     }
     else{
         list.findOne({name:listName},function(err,foundlist1){
             foundlist1.items.push(item);
             foundlist1.save();
             res.redirect("/"+listName);
         })
     }
     
});

app.post("/delete",function(req,res){
    const it =req.body.checkbox;
    const newlist=req.body.shlok1;
    if(newlist==="Today"){
        Item.findByIdAndRemove(it,function(err){
            if(err){
                console.log(err);
            }else{
                console.log("success");
                res.redirect("/");
            }
        });
    }else{
        list.findOneAndUpdate({name:newlist},{$pull:{items:{_id:it}}},function(err,foundlist){
            if(!err){
                res.redirect("/"+newlist);
            }
        });
    }
    
});

let port =process.env.PORT;
if(port== null || port == ""){
    port=3000;
}
app.listen(port,function(){
    console.log("i am listening server started");
});
