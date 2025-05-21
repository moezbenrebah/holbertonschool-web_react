'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import News from './News';
export default function RightSidebar() {
  const [input, setInput] = useState('');
  const router = useRouter();
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    router.push(`/search/${input}`);
    setTimeout(() => {
      router.refresh();
    }, 100);
  };
  return (
    <>
      <div className='sticky top-0 bg-white py-2'>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
  <input
    type='text'
    placeholder='Search'
    value={input}
    onChange={(e) => setInput(e.target.value)}
    className='bg-gray-100 border border-gray-200 rounded-3xl text-lg w-full px-5 py-3'
  />
  <button
    type='submit'
    className='bg-blue-500 text-white font-bold px-4 py-2 rounded-lg hover:bg-blue-600 transition'
  >
    Rechercher
  </button>
</form>
      </div>
      <News />
    </>
  );
}