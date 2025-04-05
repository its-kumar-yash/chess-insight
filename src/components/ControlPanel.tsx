import React from 'react'
import { Card } from './ui/card'
import InputForm from './InputForm'
import { Separator } from "@/components/ui/separator"
import NavigationPanel from './NavigationPanel'
import MoveAnalysis from './MoveAnalysis'


export default function ControlPanel() {
  return (
    <Card className='w-1/3 px-4 !gap-3'>
        {/* INPUT HEADER */}
        <InputForm />
        <Separator />
        {/* ANALYSIS BODY */}
        <MoveAnalysis />
        <Separator />
        {/* NAVIGATION BUTTON */}
        <NavigationPanel />
    </Card>
  )
}
