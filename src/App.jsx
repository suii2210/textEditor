import React from 'react'
import Editor from './components/Editor'


const App = () => {
  return (
    <>
        <div  className='flex items-center justify-center h-screen w-full  '>
            <div className='h-full w-full  flex items-center justify-center p-40'>
              <Editor />
           
            </div>
        </div>
    
    </>
  )
}

export default App