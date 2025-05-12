//--- Page non trouvée ---//

import Link from 'next/link';
import Image from 'next/image';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-5 text-center">
      <h1 className="text-6xl font-bold text-red-500 mb-8">404</h1>
      <h2 className="text-2xl font-semibold mb-4">Page non trouvée</h2>
      <Image
        src="/404.webp"
        alt="404"
        width={500}
        height={400}
        priority={true}
        className="w-1/3 h-auto rounded-xl mb-8"
      />
      <p className="text-gray-600 mb-6">La page que vous recherchez n'existe pas ou a été déplacée.</p>
      <Link href="/" className="btn btn-primary">
        Retour à l'accueil
      </Link>
    </div>
  );
}
