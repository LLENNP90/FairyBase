import { useState, useEffect } from "react";
import Header from "../components/Header";
import AnimeGrid from "../components/AnimeGrid";
import {api} from "../services/api";
import './Page.css';

function HomePage() {
    const [topAnime, setTopAnime] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect (() => {
        const fetchTopAnime = async () => {
            try {
                const data = await api.getTopAnime();
                setTopAnime(data);
            }   
            catch (error) {
                console.error('Error fetching top anime:', error);
            }
            finally {
                setLoading(false);  
            }
        };

        fetchTopAnime();

    }, []); // Empty array = run once on mount

    return(
        <>
        <Header />
        <div className="container">
            <AnimeGrid animes={topAnime} title="Top Anime" isLoading={loading} />
        </div>
        </>
    );
}

export default HomePage;
