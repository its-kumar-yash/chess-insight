import React from 'react'
import ChessBoard from './ChessBoard'
import ControlPanel from './ControlPanel'
import MovesPanel from './MovesPanel'

export default function ChessAnalysisReport() {
  return (
    <div className='flex gap-8'>
      <ChessBoard/>
      <ControlPanel/>
      <MovesPanel />
    </div>
  )
}
