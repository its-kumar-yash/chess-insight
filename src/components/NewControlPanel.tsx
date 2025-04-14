import React from 'react'
import { Card, CardContent } from './ui/card'
import NewNavigationPanel from './NewNavigationPanel'
import { Separator } from "@/components/ui/separator"
import NewMoveAnalysis from './NewMoveAnalysis'

export default function NewControlPanel() {
  return (
    <Card className='max-w-[30%] w-full px-4 !py-3 !gap-3 !bg-card/20'>
        <NewMoveAnalysis />
        <Separator className='!bg-secondary' />
        <NewNavigationPanel />
    </Card>
  )
}
