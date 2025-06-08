const mongoose= require("mongoose");

const Schema=mongoose.Schema;


const listingSchema= new Schema(
    {
        title:{
         type:   String,
         //required:true,
        },
        description: String,
        image:{
            // type: {
            //     filename: { type: String },
            //     url: { type: String },
            //   },
        
            type:String,
         default:  "https://unsplash.com/photos/a-vase-filled-with-pink-flowers-on-top-of-a-table-a0wvviodl-8",

         set:(v)=>v==="" ? "https://unsplash.com/photos/a-vase-filled-with-pink-flowers-on-top-of-a-table-a0wvviodl-8": v,

        } ,
        price:Number,
        location:String,
        country:String,

    }
)
const Listing= mongoose.model("Listing",listingSchema)

module.exports =Listing;