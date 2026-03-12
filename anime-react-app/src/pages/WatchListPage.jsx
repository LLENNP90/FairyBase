import Header from "../components/Header";
import { useState, useEffect } from "react";
import { api } from "../services/api";
import AnimeGrid from "../components/AnimeGrid";

function WatchlistPage() {
    const [watchlist, setWatchlist] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWatchlist = async () => {
            const data = await api.getWatchlist();
            setWatchlist(data);
            console.log(data);
            setLoading(false);
        };
        fetchWatchlist();
    }, []); 
    
    return (
        <>
        <Header />
        <div className="container">
            {loading ? (
                <p>Loading...</p>
            ) : watchlist.length > 0 ?(
                <AnimeGrid animes={watchlist} title="My Watchlist"/>
            ) : (
                <div>
                    <h2>No watchlist items yet!</h2>
                    <p>Browse anime and click the heart icon to add them to your watchlist.</p>
                </div>
            )}
        </div>
        </>
    )
}

export default WatchlistPage;