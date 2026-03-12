import { useState, useEffect } from "react";

function Search(){
  const [search, setSearch] = useState("");
  const [animes, setAnimes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This runs when component mounts (loads)
    fetch('https://api.jikan.moe/v4/top/anime')
      .then(response => response.json())
      .then(data => {
        setAnimes(data.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error:', error);
        setLoading(false);
      });
  }, []); // Empty array = run once on mount
  
  if (loading) {
    return <p>Loading...</p>;
  }

  // const items = [
  //   'Naruto', 'One Piece', 'Bleach', 
  //   'Dragon Ball', 'Attack on Titan', 'Death Note',
  //   'Lycoris Recoil', 'Spy x Family', 'Chainsaw Man',
  //   'My Hero Academia', 'Demon Slayer', 'Jujutsu Kaisen'
  // ];

  const filteredAnime = animes.filter(anime => {
    return anime.title.toLowerCase().includes(search.toLowerCase());
  });
  
  return (
    <div>
      <input
        type="text"
        placeholder="Search Anime"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <h1>Top Anime</h1>
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(6, minmax(200px, 1fr))', gap: '10px', textAlign: 'center'}}>
      {filteredAnime.map((anime, index) => (
        <div key={index}>
          <h2>{anime.title}</h2>
          <img src={anime.images.jpg.image_url} alt={anime.title} width="150" />
        </div>
      ))}
      </div>
    </div>
  )

}

export default Search;
