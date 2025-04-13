import React from "react";
import { Button } from "./ui/button";
import Image from "next/image";
import Link from "next/link";

export default function GithubButton() {
  return (
    <Link href={"https://github.com/its-kumar-yash"}>
      <Button variant="outline" size="icon">
        <Image
          src="/github.svg"
          width={20}
          height={20}
          alt="github-dark"
          className=" rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
        />

        <Image
          src="/white_github.svg"
          width={20}
          height={20}
          alt="github-light"
          className="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
        />
        <span className="sr-only">Github</span>
      </Button>
    </Link>
  );
}
