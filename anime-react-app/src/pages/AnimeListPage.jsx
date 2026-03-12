import { useState, useEffect } from "react";
import Header from "../components/Header";
import AnimeGrid from "../components/AnimeGrid";
import { api } from "../services/api";
import { useNavigate } from "react-router-dom";

function AnimeListPage({listType}) {
    const [animeList, setAnimeList] = useState([]);
    const navigate = useNavigate();
    // const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchList = async () => {
            const token = localStorage.getItem('token');
            // console.log(token);
            if (!token || token === 'null' || token === 'undefined') {
                alert("Please log in to view your lists!");
                navigate('/login');
                return; // Stop the function here
            }
            try {
                const data = await api.getMyList(listType);
                setAnimeList(data);}
            catch (error) {
                console.error('Error fetching anime list:', error); 
            }
            // finally {
            //     setLoading(false);
            // }
        }
        fetchList();
    },[listType, navigate]); // refetch if listType changes


    return (
        <>
            <Header />
            <div className="container">
                <AnimeGrid animes={animeList} title={listType === 'watchlist' ? "My Watchlist" : "My Favourites"} />
            </div>
        </>

    );
}

export default AnimeListPage;