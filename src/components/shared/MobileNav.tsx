"use client";
import React from "react";
navLinks;
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Link from "next/link";
import Image from "next/image";
import {  SignedIn, UserButton ,SignedOut} from "@clerk/nextjs";
import { navLinks } from "@/constants";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";

export default function MobileNav() {
  const pathname = usePathname();
  return (
    <header className="header">
      <Link href={"/"} className="flex items-center gap-2 md:py-2">
        <Image
          src="/assets/images/logo-text.svg"
          alt="icon"
          width={180}
          height={28}
        ></Image>
      </Link>
      <nav className="flex gap-4">
        <SignedIn>
          <UserButton afterSignOutUrl="/" />
          <Sheet>
            <SheetTrigger>
              <Image
                src={"/assets/icons/menu.svg"}
                alt="menuicon"
                width={32}
                height={32}
              />
            </SheetTrigger>
            <SheetContent className="sheet-content sm:w-64">
              <>
                <Image
                  src={"/assets/images/logo-text.svg"}
                  alt="logo"
                  width={152}
                  height={23}
                />
                <br />
                <ul className="header-nav_elements">
                  {navLinks.map((link) => {
                    const isactive = link.route === pathname;
                    return (
                      <li
                        key={link.route}
                        className={`sidebar-nav_element group ${
                          isactive
                            ? " bg-purple-gradient text-white"
                            : "text-gray-700"
                        }`}
                      >
                        <Link className="sidebar-link " href={link.route}>
                          <Image
                            src={link.icon}
                            alt="logo"
                            width={24}
                            height={24}
                            className={`${isactive && "brightness-200"}`}
                          />

                          {link.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </>
            </SheetContent>
          </Sheet>
        </SignedIn>
        <SignedOut>
            <Button asChild className="button bg-purple-gradient">
                <Link href="/sign-in">Login</Link>
  
            </Button>
          </SignedOut>
      </nav>
    </header>
  );
}
