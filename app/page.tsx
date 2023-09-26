'use client'

import { useState } from 'react'
import Image from 'next/image'

export default function Home () {
  const [promt, setPromt] = useState(
    'Task chair+ in a well-lit home office-, surrounded by shelves of books and a large window with a scenic view+;ergonomic, adjustable, comfortable, professional'
  )

  const [photo, setPhoto] = useState('/400.svg')
  const [loading, setLoading] = useState(false)
  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPromt(event.target.value)
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    generatePhoto(promt)
  }

  async function generatePhoto (fileUrl: string) {
    await new Promise(resolve => setTimeout(resolve, 200))
    setLoading(true)
    const res = await fetch('/api/replicate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ promt })
    })

    let newPhoto = await res.json()
    setLoading(false)
    setPhoto(newPhoto)
  }

  return (
    <main className='flex min-h-screen flex-col items-center justify-between p-24'>
      <span>Demo replicate</span>
      {/* div promt */}
      <div>
        <form onSubmit={handleSubmit} className='flex flex-col mb-10'>
          <textarea
            className='p-5 text-slate-800'
            cols={40}
            rows={5}
            placeholder='Add Promt'
            onChange={handleChange}
            value={promt}
          ></textarea>
          <button
            className='bg-blue-600 rounded-md text-white font-medium px-4 py-3 sm:mt-10 mt-8 hover:bg-blue-500 transition disabled:bg-blue-300'
            type='submit'
            disabled={loading}
          >
            Generate Backgound
          </button>
        </form>
      </div>
      <div className='flex flex-col gap-5 md:flex-row'>
        <div className='flex flex-col '>
          <span>Original Img</span>
          <Image
            src={
              'https://eugaming.hermanmiller.com/cdn/shop/products/Embody_Cyan_02_dc8c17b4-3a11-46e1-a643-31c21a6278a4_1000x1000_crop_center.png?v=1628693749'
            }
            width={768}
            height={768}
            alt='original img'
          />
        </div>
        <div className='flex flex-col relative'>
          {loading && (
            <div className='absolute top-0 left-0 w-full h-full flex items-center justify-center bg-white bg-opacity-50'>
              <span>Generating...</span>
            </div>
          )}
          <span>Generated Img</span>
          <Image src={photo} width={768} height={768} alt='generated img' />
        </div>
      </div>
    </main>
  )
}
