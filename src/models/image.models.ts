import { Schema, model, models} from "mongoose";
import { string } from "zod";
export interface IImage extends Document {
     _id: any
    title: string;
    transformationType: string;
    publicId: string;
    secureURL: string;
    width: number;
    height: number;
    config?: object;
    transformationURL: string;
    aspectRatio?: string;
    color?: string;
    prompt?: string;
    author:{
        _id: string;
        firstName: string;
        lastName: string;
    };
    createdAt?: Date;
}

const Imageschema = new Schema({
    title:{type: String, required: true},
    transformationType:{type: String, required: true},
    publicId:{type: String, required: true},
    secureURL:{type: String, required: true},
    width:{type: Number, required: true},
    height:{type: Number, required: true},
    config:{type: Object},
    transformationURL:{type: String, required: true},
    aspectRatio:{type:String},
    color:{type:String},
    prompt:{type:String},
    author:{type:Schema.Types.ObjectId,ref:'User'},
    createdAt:{type: Date, default: Date.now}

})


const Image = models?.Image || model('Image',Imageschema)


export default Image