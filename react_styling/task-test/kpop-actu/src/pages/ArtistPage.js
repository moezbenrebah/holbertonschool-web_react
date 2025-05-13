import React from "react";
import { useParams } from "react-router-dom";
import artistData from "../data/artistData"; // Import des données

function ArtistPage() {
  const { id } = useParams();
  const artist = artistData[id];

  if (!artist) {
    return <div className="p-4 text-center text-red-500">Artiste introuvable.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-2 text-center text-pink-600">
        {artist.name}
      </h1>
      <p className="text-center text-gray-600 mb-6 italic">
        Agence : {artist.agency}
      </p>

      <img
        src={artist.image}
        alt={artist.name}
        onError={(e) => {
          e.target.src = "https://via.placeholder.com/400x300?text=Image+indisponible";
        }}
        className="w-full max-h-[400px] object-cover rounded shadow mb-6"
      />

      {/* Membres */}
      <h2 className="text-2xl font-semibold mb-4">👤 Membres</h2>
      <ul className="mb-6 space-y-2">
        {artist.members.map((member, index) => (
          <li key={index} className="border p-2 rounded bg-gray-50 shadow-sm">
            <strong>{member.name}</strong> — {member.role}, {member.age} ans
          </li>
        ))}
      </ul>

      {/* Albums */}
      <h2 className="text-2xl font-semibold mb-2">📀 Albums</h2>
      <ul className="list-disc list-inside mb-6">
        {artist.albums.map((album, index) => (
          <li key={index}>{album}</li>
        ))}
      </ul>

      {/* Statut */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold">📅 Statut</h2>
        <p className="text-gray-700">
          {artist.end
            ? `Actif de ${artist.debut} à ${artist.end}`
            : `En activité depuis ${artist.debut}`}
        </p>
      </div>

      {/* Liens externes */}
      <div className="flex gap-4 mt-6">
        <a
          href={artist.youtube}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          YouTube
        </a>
        <a
          href={artist.spotify}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Spotify
        </a>
      </div>
    </div>
  );
}

export default ArtistPage;
