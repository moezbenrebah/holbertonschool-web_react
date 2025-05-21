'use client';

import { useUser } from '@clerk/nextjs';
import { HiOutlinePhotograph, HiOutlineDocumentText } from 'react-icons/hi';
import { useRef, useState, useEffect } from 'react';
import { app } from '../firebase';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

export default function Input() {
  const { user, isSignedIn, isLoaded } = useUser();
  const [fileUrl, setFileUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileUploading, setFileUploading] = useState(false);
  const [text, setText] = useState('');
  const [postLoading, setPostLoading] = useState(false);
  const filePickRef = useRef(null);

  if (!isSignedIn || !isLoaded) {
    return null;
  }

  console.log("User metadata:", user.publicMetadata);

  const addFileToPost = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      if (file.type.startsWith('image/')) {
        setFileUrl(URL.createObjectURL(file));
      } else {
        setFileUrl(null);
      }
    }
  };

  useEffect(() => {
    if (selectedFile) {
      uploadFileToStorage();
    }
  }, [selectedFile]);

  const uploadFileToStorage = async () => {
    setFileUploading(true);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + '-' + selectedFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, selectedFile);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
      },
      (error) => {
        console.error('Upload error:', error);
        setFileUploading(false);
        setSelectedFile(null);
        setFileUrl(null);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFileUrl(downloadURL);
          setFileUploading(false);
        });
      }
    );
  };

  const handleSubmit = async () => {
    if (!user.publicMetadata?.userMongoId) {
      console.error("userMongoId is missing from publicMetadata!");
      return;
    }

    setPostLoading(true);
    console.log("Sending post data:", {
      userMongoId: user.publicMetadata.userMongoId,
      name: user.fullName,
      username: user.username,
      text,
      profileImg: user.imageUrl,
      image: fileUrl,
    });

    const response = await fetch('/api/post/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userMongoId: user.publicMetadata.userMongoId,
        name: user.fullName,
        username: user.username,
        text,
        profileImg: user.imageUrl,
        image: fileUrl,
      }),
    });

    setPostLoading(false);
    setText('');
    setSelectedFile(null);
    setFileUrl(null);
    location.reload();
  };

  return (
    <div className='flex border-b border-gray-200 p-3 space-x-3 w-full'>
      <img
        src={user.imageUrl}
        alt='user-img'
        className='h-11 w-11 rounded-full cursor-pointer hover:brightness-95 object-cover'
      />
      <div className='w-full divide-y divide-gray-200'>
        <textarea
          className='w-full border-none outline-none tracking-wide min-h-[50px] text-gray-700'
          placeholder="What's happening?"
          rows='2'
          value={text}
          onChange={(e) => setText(e.target.value)}
        ></textarea>

        {selectedFile && (
          <div className="mt-2">
            {selectedFile.type.startsWith('image/') ? (
              <img
                onClick={() => {
                  setSelectedFile(null);
                  setFileUrl(null);
                }}
                src={fileUrl}
                alt='selected-img'
                className={`w-full max-h-[250px] object-cover cursor-pointer ${
                  fileUploading ? 'animate-pulse' : ''
                }`}
              />
            ) : (
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                {selectedFile.name}
              </a>
            )}
          </div>
        )}

        <div className='flex items-center justify-between pt-2.5'>
          <HiOutlinePhotograph
            className='h-10 w-10 p-2 text-sky-500 hover:bg-sky-100 rounded-full cursor-pointer'
            onClick={() => filePickRef.current.click()}
          />
          <HiOutlineDocumentText
            className='h-10 w-10 p-2 text-red-500 hover:bg-red-100 rounded-full cursor-pointer'
            onClick={() => filePickRef.current.click()}
          />
          <input
            type='file'
            ref={filePickRef}
            accept='image/*,application/pdf'
            hidden
            onChange={addFileToPost}
          />
          <button
            disabled={fileUploading || text.trim() === '' || postLoading}
            className='bg-blue-400 text-white px-4 py-1.5 rounded-full font-bold shadow-md hover:brightness-95 disabled:opacity-50'
            onClick={handleSubmit}
          >
            {fileUploading ? 'Uploading...' : 'Post'}
          </button>
        </div>
      </div>
    </div>
  );
}
