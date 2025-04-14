import Link from "next/link";
import React from "react";
import ModeToggle from "./ModeToggle";
import { Zap } from "lucide-react";
import GithubButton from "./GithubButton";

// export default function Navbar() {
//   return (
//     <nav className="sticky top-0 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
//       <div className="max-w-7xl mx-auto px-4">
//         <div className="flex items-center justify-between h-16">
//           <div className="flex items-center">
//             <Link
//               href="/"
//               className="text-xl font-bold text-primary font-mono tracking-wider"
//             >
//               ChessInsight
//             </Link>
//           </div>
//           <ModeToggle />
//         </div>
//       </div>
//     </nav>
//   );
// }

export default function Navbar() {
  return (
    <header className="border-1 border-b">
      <div className="flex h-16 items-center px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <Zap className="h-6 w-6" />
          <span>ChessInsight</span>
        </Link>
        <div className="ml-auto flex items-center gap-4">
          {/* <nav className="flex gap-4 sm:gap-6">
            <Link href="/" className="text-sm font-medium hover:underline underline-offset-4">Login</Link>
            <Link href="/" className="text-sm font-medium hover:underline underline-offset-4">Sign Up</Link>
          </nav> */}
          <ModeToggle />
          <GithubButton />
        </div>
      </div>
    </header>
  );
}
