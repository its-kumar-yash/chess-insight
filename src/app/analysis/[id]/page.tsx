import AnalysisReportView from '@/components/AnalysisReportView'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

export default function AnalysisResultPage() {
  return (
    <main className='flex-1 container py-6 sm:px-6 lg:px-8'>
      <div className="flex items-center mb-3">
        <Link
          href="/analyze"
          className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back to Input
        </Link>
      </div>
      <AnalysisReportView />
    </main>
  )
}
