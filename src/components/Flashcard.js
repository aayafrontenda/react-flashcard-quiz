import {React, useState, useEffect, useRef } from 'react'

const letters = ['a', 'b', 'c', 'd'];
export default function Flashcard({ flashcard }) {
    function decodeString(str) {
        const textArea = document.createElement('textarea');
        textArea.innerHTML = str;
        return textArea.value;
    }

    const [flip, setFlip] = useState(false);
    const frontEl = useRef();
    const backEl = useRef();
    const [height, setHeight] = useState('100px');

    function setMaxHeight() {
        const frontHeight = frontEl.current.getBoundingClientRect().height;
        const backHeight = backEl.current.getBoundingClientRect().height;
        setHeight(Math.max(frontHeight, backHeight, 100));
    }

    useEffect(setMaxHeight, [frontEl, backEl, flashcard.question, flashcard.correct_answer, flashcard.incorrect_answers]);
    useEffect(() => {
        window.addEventListener('resize', setMaxHeight);
        return () => window.removeEventListener('resize', setMaxHeight);
    });

    return (
    <div
        className={`card ${flip ? 'flip' : ''}`}
        onClick={() => setFlip(!flip)}
        style={{height: height}}
    >
        <div className='front' ref={frontEl}>
            <div className='flex-wrap'>
                {decodeString(flashcard.question)}
            </div>
            <div className='flashcard-options'>
                {[...flashcard['incorrect_answers'], flashcard['correct_answer']].sort(function(){
                    return Math.random() - 0.5;
                }).map((option, id) => {
                    return <div className='flashcard-option' key={id}>{`${letters[id]}) `}{decodeString(option)}</div>
                })}
            </div>
        </div>
        <div className='back' ref={backEl}>
            {decodeString(flashcard.correct_answer)}
        </div> 
    </div>
  )
}
