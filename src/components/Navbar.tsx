import Link from 'next/link'
import React from 'react'
import ModeToggle from './ModeToggle'

export default function Navbar() {
  return (
    <nav className="sticky top-0 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-primary font-mono tracking-wider">
              ChessInsight
            </Link>
          </div>
          <ModeToggle />
        </div>
      </div>
    </nav>
  )
}
