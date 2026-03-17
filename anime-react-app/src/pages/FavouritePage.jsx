import Header from "../components/Header";
import { useState, useEffect } from "react";
import { api } from "../services/api";
import AnimeGrid from "../components/AnimeGrid";

function FavouritePage() {
    const [favourites, setFavourites] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFavourites = async () => {
            const data = await api.getMyList("favourite");
            setFavourites(data);
            console.log(data);
            console.log(favourites)
            setLoading(false);
        };
        fetchFavourites();
    }, []); 
    
    return (
        <>
        <Header />
        <div className="container">
            {favourites.length > 0 ?(
                <AnimeGrid animes={favourites} title="My Favourites"/>
            ) : (
                <div>
                    <h2>No favourites yet!</h2>
                    <p>Browse anime and click the heart icon to add them to your favourites.</p>
                </div>
            )}
        </div>
        </>
    )
}

export default FavouritePage;