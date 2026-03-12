import Header from "../components/Header";
import { useState, useEffect } from "react";
import { api } from "../services/api";
import { useNavigate } from "react-router-dom";
import "./Page.css";

function ProfilePage(){ 
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            // const token =localStorage.getItem('token');

            try{
                const data = await api.getProfileStats();
                console.log(data)
                setProfileData(data);
            }
            catch(error){
                console.log(error);
                navigate('/login');
            }
            finally{
                setLoading(false);
            }
        }
        fetchProfile();
    }, [navigate])

    if (loading) {
        return (
            <>
                <Header />
                <p className="loading">Loading profile...</p>
            </>
        );
    }

    return(
        <>
            <Header/>
            <div className="container">
                <div className="profile-container">
                    <h1>My Profile</h1>

                    {/* {User Info Section} */}
                    <div className="profile-section">
                        <h2>User Information</h2>
                        <div className="user-section">
                            <div className="user-card">
                                <h3>Username: {profileData.users.username}</h3>
                                <h3>Email: {profileData.users.email}</h3>
                                <h4>Member Since: {profileData.users.created_at.split("T")[0]}</h4>
                            </div>

                            <div className="stats-grid">
                                <div className="stat-card">
                                    <h3>{profileData.stats.total_anime_saved}</h3>
                                    <p>Total Anime Saved</p>
                                </div>
                                <div className="stat-card">
                                    <h3>{profileData.stats.total_fav}</h3>
                                    <p>Favourites</p>
                                </div>
                                <div className="stat-card">
                                    <h3>{profileData.stats.total_watch}</h3>
                                    <p>Watchlist</p>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* {Recently Added Anime Section} */}
                    <div className="profile-section">
                        <h2>Recently Added</h2>
                        {profileData.recent_anime.length > 0 ? (
                            <div className="recent-anime-list">
                                {profileData.recent_anime.map(anime => (
                                    <div 
                                        key={anime.id}
                                        className="recent-anime-item"
                                        onClick={() => navigate(`/anime/${anime.mal_id}`)}>
                                        <img src={anime.image_url} alt="anime"></img>
                                        <div className="recent-anime-info">
                                            <h4>{anime.title}</h4>
                                            <p>{anime.status} • {new Date(anime.added_at).toLocaleDateString()}</p>
                                            
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ): (
                            <p>No anime added recently</p>
                        )}
                    </div>

                </div>
            </div>   
        </>

    )
}

export default ProfilePage;