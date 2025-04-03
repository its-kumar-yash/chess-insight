"use client"

import React from 'react'
import { Chessboard } from 'react-chessboard'
import PlayerCard from './PlayerCard'

export default function ChessBoard() {
  return (
    <div className='w-[500px]'>
      <PlayerCard playerName={"Yash"} playerRating={0} playerImage={""} cardPosition='top' />
      <Chessboard
        position="start"
        boardWidth={500}
        customDarkSquareStyle={{ backgroundColor: '#769656' }}
        customLightSquareStyle={{ backgroundColor: '#eeeed2' }}
      />
      <PlayerCard playerName={"Yash"} playerRating={0} playerImage={""} cardPosition='bottom' />
    </div>
  )
}
