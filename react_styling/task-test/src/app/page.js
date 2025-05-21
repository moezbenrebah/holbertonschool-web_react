import React from 'react'
import Input from '@/components/Input';
import Feed from '@/components/Feed';
import Image from 'next/image';

export default async function Home() {
  let data = null;
  try {
    const result = await fetch(process.env.URL + '/api/post/all', {
      method: 'POST',
      cache: 'no-store',
    });
    data = await result.json();
  } catch (error) {
    console.error('Error fetching posts:', error);
  }
  return (
    <div className='min-h-screen'>
      <div className='py-4 px-6 sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm'>
        <div className='flex items-center space-x-3'>
          
          <div className='relative h-9 w-9 hover:scale-105 transition-transform'>
            
          </div>
          <h2 className='text-2xl font-extrabold bg-gradient-to-r from-red-600 to-red-200 bg-clip-text text-transparent tracking-tight  text-cente'>
          Holberton Social Media
          </h2>
        </div>
      </div>
      <Input />
      <Feed data={data} />
    </div>
  );
}