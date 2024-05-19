"use server";

import { revalidatePath } from "next/cache";
import dbConnect from "../dbconnect";
import { handleError } from "../utils";
import User from "@/models/user.models";
import Image from "@/models/image.models";
import { redirect } from "next/navigation";

import { v2 as cloudinary } from "cloudinary";

const populateUser = (query: any) =>
  query.populate({
    path: "author",
    model: User,
    select: "_id firstName lastName clerkId"
  });

//ADD IMAGE

export async function addImage({ image, userId, path }: AddImageParams) {
  try {
    await dbConnect();
    console.log(image, userId, path);

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
    const image = await populateUser(Image.findById(imageId));
    if (!image) throw new Error("image not found");

    // revalidatePath(path)
    return JSON.parse(JSON.stringify(image));
  } catch (error) {
    handleError(error);
  }
}

// getimages all

export async function GetAllimages({
  limit = 9,
  page = 1,
  searchquery = "",
}: {
  limit?: number;
  page: number;
  searchquery?: string;
}) {
  try {
    await dbConnect();
    cloudinary.config({
      cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true,
    });
    let expression = "folder=imaginify";
    if (searchquery) {
      expression += `AND ${searchquery}`;
    }

    const { resources } = await cloudinary.search
      .expression(expression)
      .execute();
    const resourceIds = resources.map((resource: any) => resource.public_id);

    let query = {};
    if (searchquery) {
      query = {
        publicId: {
          $in: resourceIds,
        },
      };
    }

    const skipAmount = (Number(page) - 1) * limit;

    const images = await populateUser(Image.find(query))
      .sort({
        updatedAt: -1,
      })
      .skip(skipAmount)
      .limit(limit);

    const totalImages = await Image.find(query).countDocuments();
    const savedImages = await Image.find().countDocuments();

    return {
      data: JSON.parse(JSON.stringify(images)),
      totalPage: Math.ceil(totalImages / limit),
      savedImages,
    };
  } catch (error) {
    handleError(error);
  }
}



// GET IMAGES BY USER
export async function getUserImages({
  limit = 9,
  page = 1,
  userId,
}: {
  limit?: number;
  page: number;
  userId: string;
}) {
  try {
    await dbConnect();

    const skipAmount = (Number(page) - 1) * limit;

    const images = await populateUser(Image.find({ author: userId }))
      .sort({ updatedAt: -1 })
      .skip(skipAmount)
      .limit(limit);

    const totalImages = await Image.find({ author: userId }).countDocuments();

    return {
      data: JSON.parse(JSON.stringify(images)),
      totalPages: Math.ceil(totalImages / limit),
    };
  } catch (error) {
    handleError(error);
  }
}
