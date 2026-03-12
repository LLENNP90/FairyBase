import AnimeCard from "./AnimeCard";
import '../App.css';

function AnimeGrid({animes, title, isLoading}) {
    const skeletons = [...Array(10).keys()];

    return (
        <div>
            {title && <h2>{title}</h2>}
            <div className="anime-grid">
                {isLoading ? (
                    skeletons.map((index) => (
                        <div key={index} className='anime-card'>
                            <div className='skeleton-img'></div>
                            <div className='skeleton-text'></div>
                        </div>
                    ))
                ) : (
                    animes.map(anime => {
                        return <AnimeCard key={anime.mal_id} anime={anime} />;
                    })
                )}


            </div>
        </div>
    );
}

export default AnimeGrid;