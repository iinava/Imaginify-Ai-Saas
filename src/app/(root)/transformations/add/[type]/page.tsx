import Header from "@/components/shared/Header";
import React from "react";
import { transformationTypes } from "@/constants";
import TransformationForm from "@/components/shared/TransformationForm";
import { auth } from "@clerk/nextjs/server";
import { getUserById } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
export default async function AddTransformationTypepage({
  params: { type },
}: SearchParamProps) {
  const { userId } = auth(); //clerk id
  if (!userId) {
    redirect('/sign-in')
    
  }
  const user = await getUserById(userId);
  const transformation = transformationTypes[type];

  return (
    <>
      <Header title={transformation.title} subtitle={transformation.subTitle} />
      <TransformationForm action="Add" userId={user._id} type={transformation.type as TransformationTypeKey}  creditBalance={user.creditBalance}/>
    </>
  );
}
