import {useNavigate, useParams} from 'react-router-dom';
import Header from '../components/Header';
import { useState, useEffect } from 'react';
import { api } from '../services/api';
import '../App.css';
import './Page.css';

function DetailsPage() {
    const [animeDetails, setAnimeDetails] = useState(null);
    const [dbInfo, setDbInfo] = useState({ inDatabase: false, dbId: null, status: null });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const {id} = useParams();


    useEffect(() => {
        const fetchAnimeDetails = async () => {
            try {
                const data = await api.getAnimeDetails(id);
                console.log('Fetched Data: ', data);
                setAnimeDetails(data);
                setDbInfo({
                    inDatabase: data.in_database,
                    dbId: data.db_id,
                    status: data.status
                });
            }
            catch (error){
                console.error('Error fetching anime details:', error);  
            }
            finally{
                setLoading(false);
            }
        }
        fetchAnimeDetails();
    }, [id]); // reruns if id changes
    console.log(animeDetails);

    const handleAdd = async (status) => {
        try {
            await api.addToList({
                mal_id: animeDetails.anime_details.mal_id,
                title: animeDetails.anime_details.title,
                image_url: animeDetails.anime_details.images.jpg.image_url,
                anime_type: animeDetails.anime_details.type,
                episodes: animeDetails.anime_details.episodes,
                status: status,
                added_at: new Date().toISOString()
            });
            console.log(dbInfo)
            const result = await api.getAnimeDetails(id);
            setAnimeDetails(result);
        }
        catch (error) {
            console.error(`Error updating ${status}:`, error);
        }

    }

    const handleRemove = async () => {
        if (!dbInfo.dbId) return; // Safety check
        try {
            await api.removeFromList(dbInfo.dbId);
            // Instantly refresh to show the "Add" buttons again
            const result = await api.getAnimeDetails(id);
            setAnimeDetails(result);
        } catch (error) {
            console.error('Error removing from list:', error);
        }
    };
    
    const moveToFav = async () => {
        try {
            await api.moveToFav(dbInfo.dbId);
            const result = await api.getAnimeDetails(id);
            setAnimeDetails(result);
        }
        catch (error) { 
            console.error('Error moving to favourites:', error);
        }

    }

    if (loading) {
        return (
            <>
                <Header/>
                <p>Loading...</p>;
            </>
            
            
        )
        
    }

    return (
        <>
            <Header />
            <button onClick={() => navigate(-1)} className="back-button">← Back</button>
            <div className="container">
                <div className="details-container">
                    <h1>{animeDetails.anime_details.title}</h1>
                    <div className="details-row">
                        <img src={animeDetails.anime_details.images?.jpg?.image_url} alt={animeDetails.title} className='col-1'/>
                        <div className='synopsis'>
                            <h1>Synopsis</h1>
                            <p className='col-2'> {animeDetails.anime_details.synopsis}</p>
                            <div className='details-mobile'>
                                <div>
                                    <p><strong>Type:</strong> {animeDetails.anime_details.type}</p>
                                    <p><strong>Episodes:</strong> {animeDetails.anime_details.episodes}</p>
                                </div>
                                <div>
                                    <p><strong>Score:</strong> {animeDetails.anime_details.score}</p>
                                    <p><strong>Source:</strong> {animeDetails.anime_details.source}</p>
                                </div>
                            </div>

    
                        </div>
                        
                    </div>
                </div>
                <div className="button-container" style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                    
                    {dbInfo.inDatabase && dbInfo.status === "watchlist" ? (
                        // IF IN THE DB: SHOW REMOVE BUTTON
                        <>
                            <p style={{fontWeight: 'bold', color: '#ff5252'}}>
                                Currently in your {dbInfo.status}!
                            </p>
                            <button onClick={() => { moveToFav(); navigate('/favourites'); }} className="button fav">
                                Move to Favourites 
                            </button>
                            <button onClick={() => { handleRemove(); navigate('/watchlist'); }} className="button remove">
                                Remove from Watchlist
                            </button>
                        </>
                    ) : dbInfo.inDatabase && dbInfo.status === "favourite" ?(
                        <>
                            <p style={{fontWeight: 'bold', color: '#ff5252'}}>
                                Currently in your {dbInfo.status}!
                            </p>
                            <button onClick={() => { handleRemove(); navigate('/favourites'); }} className='button remove'>
                                Remove from Favourites
                            </button>
                        </>
                    ) : (
                        // IF IT IS NOT IN THE DB: SHOW ADD BUTTONS
                        <>
                            <button onClick={() => { handleAdd("favourite"); navigate('/favourites'); }} className="button fav">
                                Add to Favourites 💗
                            </button>
                            <button onClick={() => { handleAdd("watchlist"); navigate('/watchlist'); }} className="button watchlist">
                                Add to Watchlist 📺
                            </button>
                        </>
                    )}
                    
                </div>                
            </div>
        </>
    );

}

export default DetailsPage;
