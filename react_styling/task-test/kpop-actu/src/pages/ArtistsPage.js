import React, { useState } from "react";
import artistData from "../data/artistData";
import ArtistCard from "../components/ArtistCard";

function ArtistsPage() {
  const [search, setSearch] = useState("");

  const allArtists = Object.values(artistData);
  const hotArtistIds = ["blackpink", "bts", "newjeans", "straykids", "twice", "ateez"];

  const filteredResults = allArtists.filter((artist) =>
    artist.name.toLowerCase().includes(search.toLowerCase())
  );

  const showFiltered = search.trim().length > 0;

  const displayedArtists = showFiltered
    ? filteredResults
    : hotArtistIds.map((id) => artistData[id]);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-4 text-center text-pink-500">KPOP's Artist</h1>

      {/* Recherche */}
      <div className="mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher un artiste..."
          className="w-full px-4 py-2 border border-gray-300 rounded shadow"
        />
      </div>

      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        {showFiltered ? "Résultats de recherche" : "Hot artists right now"}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {displayedArtists.length > 0 ? (
          displayedArtists.map((artist) => (
            <ArtistCard key={artist.id} id={artist.id} />
          ))
        ) : (
          <p className="text-center col-span-full text-gray-500">Aucun artiste trouvé.</p>
        )}
      </div>
    </div>
  );
}

export default ArtistsPage;
