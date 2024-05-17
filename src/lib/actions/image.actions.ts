"use server";

import { revalidatePath } from "next/cache";
import dbConnect from "../dbconnect";
import { handleError } from "../utils";
import User from "@/models/user.models";
import Image from "@/models/image.models";
import { redirect } from "next/navigation";

const populateUser = (query:any)=>query.populate({
path:'author',
model:User,
select:'_id firstName lastName'
})

//ADD IMAGE

export async function addImage({ image, userId, path }: AddImageParams) {
  try {
    await dbConnect();
    const author = await User.findById(userId);
    if (!author) {
      throw new Error("User not found");
    }

    const newImage = await Image.create({ ...image, author: author._id });
    revalidatePath(path);
    return JSON.parse(JSON.stringify(newImage));
  } catch (error) {
    handleError(error);
  }
}
//UPDATE IMAGE
export async function UpdateImage({ image, userId, path }: UpdateImageParams) {
  try {
    await dbConnect();
    const imagetoUpdate = await Image.findById(image._id);
    if (!imagetoUpdate || imagetoUpdate.author.toHexString() !== userId) {
      throw new Error("Image not Found");
    }

    const updatedimage = await Image.findByIdAndUpdate(
      imagetoUpdate._id,
      image,
      {
        new: true,
      }
    );

    revalidatePath(path);
    return JSON.parse(JSON.stringify(updatedimage));
  } catch (error) {
    handleError(error);
  }
}

//DELETE
export async function DeleteImage(imageId: string) {
  try {
    await dbConnect();
    await Image.findByIdAndDelete(imageId);
    // revalidatePath(path)
    // return JSON.parse(JSON.stringify(image));
  } catch (error) {
    handleError(error);
  } finally {
    redirect("/");
  }
}

//GETIMAGEBYID
export async function Getbyid(imageId: string) {
  try {
    await dbConnect();
    const image = await populateUser (Image.findById(imageId))
    if(!image) throw new Error("image not found")
         
    // revalidatePath(path)
    return JSON.parse(JSON.stringify(image));

  } catch (error) {
    handleError(error);
  }
}
