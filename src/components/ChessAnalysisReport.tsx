import React from 'react'
import ChessBoard from './ChessBoard'
import ControlPanel from './ControlPanel'

export default function ChessAnalysisReport() {
  return (
    <div className='flex gap-8'>
      <ChessBoard/>
      <ControlPanel/>
    </div>
  )
}
