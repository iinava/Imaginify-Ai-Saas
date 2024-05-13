import { Schema, model, models } from "mongoose";
export interface IImage extends Document {
    title: string;
    transformationType: string;
    publicId: string;
    secureUrl: URL;
    width: number;
    height: number;
    config?: object;
    transformationUrl: URL;
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
    secureUrl:{type: URL, required: true},
    width:{type: Number, required: true},
    height:{type: Number, required: true},
    config:{type: Object},
    transformationUrl:{type: URL, required: true},
    aspectRatio:{type:String},
    color:{type:String},
    prompt:{type:String},
    author:{type:Schema.Types.ObjectId,ref:'User'},
    createdAt:{type: Date, default: Date.now}

})


const Image = models?.Image || model('Image',Imageschema)


export default Image