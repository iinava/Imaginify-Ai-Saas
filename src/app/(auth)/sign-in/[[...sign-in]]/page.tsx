import { SignIn } from "@clerk/nextjs";

export default function Signinpage() {
  return <SignIn path="/sign-in" />;
}