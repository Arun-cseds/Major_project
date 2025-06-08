const express=require("express");
const app=express();
let port=8080;
const mongoose=require("mongoose");
const path=require("path");
const Listing=require("./models/listing.js");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));


async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}
main()
.then(()=>{
    console.log("connected to db");
})
.catch(err => console.log(err));



//home route

app.get("/",(req,res)=>{
    res.send("hi i am root");

})


// app.get("/testListing",async(req,res)=>{
//     let sampleListing = new Listing({
//      title: "My New Villa",
//      description:"By the beach" , 
//      pricr:1200,
//      location:"Calangute ,Goa",
//      country:"India",
//     })
//   await sampleListing.save(); 
//   console.log("sample was saved");
//   res.send("successful testing");
// });


// index route
app.get("/listing",wrapAsync(async(req,res)=>{
   const AllListings= await Listing.find({});
   //console.log(AllListings);
  res.render("listings/index.ejs",{AllListings});

  })
);

    //new route to add data

    app.get("/listing/new",(req,res)=>{
      
      res.render("listings/new.ejs");
  
    })

  
  
    // show route  it is used for read the data  based on their id

  app.get("/listing/:id",wrapAsync(async(req,res)=>{
    let{id}=req.params;
  //  console.log(id);
    let listing=await Listing.findById(id);
   
    res.render("listings/show.ejs",{listing});

    
  })
);

  //create route

  app.post("/listing",wrapAsync(async(req,res,next)=>{
    if(!req.body.listing){
      throw new ExpressError(400,"send valid data for listing")
    }
    
  //  let {title,description,image, price, country, location}= req.body;
  //  let listing=req.body.listing;
  //  console.log(listing);
  //  console.log(listing.image);

  const newListing=  new Listing(req.body.listing);
 await newListing.save();
  res.redirect("/listing");


  


  })
);

  // edit listing

  app.get("/listing/:id/edit",wrapAsync(async(req,res)=>{
    let{id}=req.params;
    const listing=await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
  })
);

  //update route 

  app.put("/listing/:id",wrapAsync(async(req,res)=>{
    if(!req.body.listing){
      throw new ExpressError(400,"send valid data for listing")
    }
    let{id}=req.params;
    const newListing=req.body.listing;
       await Listing.findByIdAndUpdate(id,{...newListing});
    res.redirect(`/listing/${id}`);
  })
);

  //DELETE ROUTE

  app.delete("/listing/:id",wrapAsync(async(req,res)=>{
    let{id}=req.params;
 let deletedListing =await Listing.findByIdAndDelete(id);
 console.log(deletedListing);
 res.redirect("/listing");

  })
);

  app.all("*",(req,res,next)=>{
  next(new ExpressError(404,"page not found"))
  })

  
app.use((err, req, res, next)=>{
  let{statusCode=500, message="something went wrong"}=err;
  res.status(statusCode).render("error.ejs",{message});
 // res.status(statusCode).send(message)
});




app.listen(port,(req,res)=>{
    console.log(`app is listenig at port ${port}`);
})