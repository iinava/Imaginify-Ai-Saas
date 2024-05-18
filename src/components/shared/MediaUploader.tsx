"use client"
import React from "react";
import { useToast } from "../ui/use-toast";
import { CldImage, CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { dataUrl, getImageSize } from "@/lib/utils";
import { PlaceholderValue } from "next/dist/shared/lib/get-img-props";
type MediaUploadPropsType = {
  onValueChange: (value: string) => void;
  setimage: React.Dispatch<any>;
  publicId: string;
  image: any;
  type: string;
};
export default function MediaUploader({
  onValueChange,
  setimage,
  image,
  publicId,
  type,
}: MediaUploadPropsType) {
  const { toast } = useToast();
  const onuploadSuccessHandler = (result: any) => {
    setimage((prevstate: any) => ({
      ...prevstate,
      publicId: result?.info?.public_id,
      width: result?.info?.width,
      height: result?.info?.height,
      secureURL: result?.info.secure_url,
    }));
    onValueChange(result?.info?.public_id);
    toast({
      title: "Image upload succesful",
      description: "1 credit was deducteted",
      duration: 5000,
      className: "success-toast",
    });
  };
  const onuploadError = () => {
    toast({
      title: "error uploading images",
      description: "Something went wrong",
      duration: 5000,
      className: "error-toast",
    });
  };
  return (
    <CldUploadWidget
      uploadPreset="jsm_imaginify"
      options={{
        multiple: false,
        resourceType: "image",
      }}
      onSuccess={onuploadSuccessHandler}
      onError={onuploadError}
    >
      {({ open }) => (
        <div className="flex flex-col gap-4">
          <h3 className="h3-bold text-dark-600">Original</h3>
          {publicId ? (
            <>
              <div className="cursor-pointer overflow-hidden rounded-[10px]">
                <CldImage
                  width={getImageSize(type, image, "width")}
                  height={getImageSize(type, image, "height")}
                  src={publicId}
                  alt="image"
                  sizes={"(max-width: 767px) 100vw, 50vw"}
                  placeholder={dataUrl as PlaceholderValue}
                  className="media-uploader_cldImage"
                />
              </div>
            </>
          ) : (
            <div className="media-uploader_cta" onClick={() => open()}>
              <div className="media-uploader_cta-image">
                <Image
                  width={24}
                  height={24}
                  alt="Add image"
                  src="/assets/icons/add.svg"
                />
              </div>
              <p className="p-14-medium">Click here to upload the image</p>
            </div>
          )}
        </div>
      )}
    </CldUploadWidget>
  );
}
