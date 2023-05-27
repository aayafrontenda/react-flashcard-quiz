import React from 'react'
import Flashcard from './Flashcard'

export default function FlashcardList({ flashcards }) {
  return (
    <div className='card-grid'>
        {flashcards.map((flashcard, id) => <Flashcard flashcard={flashcard} key={id} />)}
    </div>
  )
}
