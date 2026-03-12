import { useNavigate } from "react-router-dom"; 
import '../App.css';
import './AnimeCard.css';

function AnimeCard({anime}) {
    const navigate = useNavigate();

    const imageUrl = anime.image_url || anime.images?.jpg?.image_url

    return (
        <div className='anime-card' onClick={() => navigate(`/anime/${anime.mal_id}`)}>
            <img src={imageUrl} alt={anime.title} className='anime-img'/>
            <h3>{anime.title}</h3>
        </div>
    );
}

export default AnimeCard;