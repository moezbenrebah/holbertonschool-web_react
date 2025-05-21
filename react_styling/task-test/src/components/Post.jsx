import Link from 'next/link';
import { HiDotsHorizontal, HiOutlineDocumentText } from 'react-icons/hi';
import moment from 'moment';
import Icons from './Icons';

export default function Post({ post }) {
  // Fonction pour détecter si l'URL correspond à un PDF
  const isPdf = post?.image && post.image.toLowerCase().includes('.pdf');

  return (
    <div className='flex p-3 w-full hover:bg-gray-50'>
      <Link href={`/users/${post?.username}`}>
        <img
          src={post?.profileImg || '/default-avatar.png'}
          alt='user-img'
          className='h-11 w-11 rounded-full mr-4'
        />
      </Link>
      <div className='flex-1'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-1 whitespace-nowrap'>
            <h4 className='font-bold text-xs truncate max-w-32'>
              {post?.name || 'Anonymous'}
            </h4>
            <span className='text-xs truncate max-w-32'>
              @{post?.username || 'unknown'}
            </span>
            <span className='text-xl text-gray-500'>·</span>
            <span className='text-xs text-gray-500 flex-1 truncate max-w-32'>
              {post?.createdAt ? moment(post.createdAt).fromNow() : 'N/A'}
            </span>
          </div>
          <HiDotsHorizontal className='text-sm' />
        </div>
        <Link href={`/posts/${post?._id}`}>
          <p className='text-gray-800 text-sm my-3 w-full'>{post?.text || ''}</p>
        </Link>
        {post?.image && (
          <>
            {isPdf ? (
              // Si c'est un PDF, afficher un lien avec une icône et le nom du fichier
              <a
                href={post.image}
                target="_blank"
                rel="noopener noreferrer"
                className='flex items-center text-blue-500 underline mb-2'
              >
                <HiOutlineDocumentText style={{ fontSize: '98px' }} className='mr-1' />

                {post.image.split('/').pop()}
              </a>
            ) : (
              // Sinon, afficher l'image dans un lien vers le post
              <Link href={`/posts/${post?._id}`}>
                <img
                  src={post.image}
                  alt="post-image"
                  className='rounded-2xl mr-2'
                />
              </Link>
            )}
          </>
        )}
        <Icons post={post} id={post._id} />
      </div>
    </div>
  );
}
