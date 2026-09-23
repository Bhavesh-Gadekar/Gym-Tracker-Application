import mongoose from "mongoose";

const workoutSchema=new mongoose.Schema(
    {
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required: true
        },
        date:{
            type:Date,
            required: true
        },
        exercises:[
            {
                exercise:{
                    type:mongoose.Schema.Types.ObjectId,
                    ref:"Exercise",
                    required: true
                },
                sets:[
                    {
                        weight:{
                            type:Number,
                            required:true,
                            min:0
                        },
                        reps:{
                            type:Number,
                            required: true,
                            min:1
                        }
                    }
                ]
            }
        ],
        notes:{
            type:String,
            trim: true
        }
    },
    {
        timestamps: true
    }
);
const Workout=mongoose.model("Workout", workoutSchema);

export default Workout;