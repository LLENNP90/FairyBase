import { useState, useEffect } from "react";
import {useNavigate, NavLink} from "react-router-dom";
import './Header.css';
import '../App.css';
import logo from '../assets/fairyTail.png';
import user from '../assets/profile.png';
import {api} from '../services/api';

function Header() {
    const [search, setSearch] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [showProfileDropdown, setProfileDropdown] = useState(false);
    const navigate = useNavigate();
    const [isMobileMenu, setIsMobileMenu] = useState(false);
    const [showSearch, setShowSearch] = useState(false);

    const token = localStorage.getItem('token');
    useEffect(() => {
        const fetchSuggestions = async () => {
            if (search.trim().length > 1) {
                const results = await api.searchAnime(search);
                setSuggestions(results.slice(0, 5));
                setShowDropdown(true);
            }   
            else{
                setSuggestions([]);
                setShowDropdown(false); 
            }
        }
        const timeouutId = setTimeout(() => {
            fetchSuggestions();
        }, 300);

        return () => clearTimeout(timeouutId);
    }, [search]);

    const toggleProfileDropdown = () => {
        // change from true to false and vice verca
        setProfileDropdown((prev) => !prev);
    }

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setProfileDropdown(false);
        navigate('/');
    } 

    const handleSearch = (e) => {
        e.preventDefault();
        if (search.trim()){
            navigate(`/search?q=${search}`);
            setShowDropdown(false);
        }
    };

    const handleSuggestionClick = (mal_id) => {
        navigate(`/anime/${mal_id}`);
        setShowDropdown(false);
    }

    return (
        <header className="header">
            {token && (
                <div className="hamburger" onClick={() => setIsMobileMenu(prev => !prev)}>
                    {isMobileMenu ? '✖' : '☰'}
                </div>
            )}

            <div className="logo-container">
                <a href ="/" className="logo-link">
                    <img src={logo} alt="logo" className="logo"/>
                    <span className="web-name">FairyBase</span>
                </a>
            </div> 

            {token && (
                <div className={`links`}>
                    <NavLink
                        to='/favourites'
                        className={({isActive}) => isActive ? "nav-button active": "nav-button"}
                        onClick={() => setIsMobileMenu(false)}
                    >
                        Favourites 💗
                    </NavLink>
                    <NavLink
                        to='/watchlist'
                        className={({isActive}) => isActive ? "nav-button active": "nav-button"}
                        onClick={() => setIsMobileMenu(false)}
                    >
                        Watchlist 📺
                    </NavLink>
                    {/* <button onClick={() => {
                        navigate('/favourites');
                        
                    }} className="nav-button">
                        Favourites 💗
                    </button>
                    <button onClick = {() => navigate('/watchlist')} className="nav-button">
                        Watchlist 📺
                    </button> */}
                </div>
            )}


            <div className='search-container'>
                <form onSubmit={handleSearch} className="search">
                    <input
                        type="text"
                        placeholder="🔍 Search Anime "
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="search-input"
                    />
                    {/* <button type="submit">🔍</button> */}
                </form>

                {showDropdown && suggestions.length > 0 && (
                    <div className='search-dropdown'>
                        {suggestions.map((anime) => (
                            <div key={anime.mal_id} className='suggestion' onClick={() => handleSuggestionClick(anime.mal_id)}>
                                <img src={anime.images.jpg.image_url} alt={anime.title} className='suggestion-image'/>
                                <div className="suggestion-info">
                                    <p className="suggestion-title">{anime.title}</p>
                                    <p className="suggestion-meta">
                                        {anime.type} • {anime.episodes || '?'} episodes
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

            </div>

            {/* mobile version */}
            <div className="search-mbl">
                <button className="search-toggle-btn" onClick={() => setShowSearch(prev => !prev)}>
                    {showSearch ? '✖️' : '🔍'}
                </button>

                <div className={`search-container ${showSearch ? 'search-visible' : ''}`}>
                    <form onSubmit={handleSearch} className="search">
                        <input
                            type="text"
                            placeholder="🔍 Search Anime "
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="search-input"
                        />
                        {/* <button type="submit">🔍</button> */}
                    </form>
                    {showDropdown && suggestions.length > 0 && (
                        <div className='search-dropdown'>
                            {suggestions.map((anime) => (
                                <div key={anime.mal_id} className='suggestion' onClick={() => handleSuggestionClick(anime.mal_id)}>
                                    <img src={anime.images.jpg.image_url} alt={anime.title} className='suggestion-image'/>
                                    <div className="suggestion-info">
                                        <p className="suggestion-title">{anime.title}</p>
                                        <p className="suggestion-meta">
                                            {anime.type} • {anime.episodes || '?'} episodes
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>



            <div className='profile-container'>

                {/* <button onClick = {() => navigate('/login')} className="nav-button">
                    Logout 
                </button> */}
                {token ? (
                    <>
                        <div onClick={toggleProfileDropdown}>
                            <img className="profile-pic" src={user} alt='profile-pic'></img>
                        </div>
                        {showProfileDropdown && (
                            <div className="profile-dropdown">
                                <div 
                                    className="dropdown-item" 
                                    onClick={() => {
                                        navigate("/profile");
                                        setProfileDropdown(false);
                                    }}>Profile</div>
                                <div 
                                    className="dropdown-item"
                                    onClick={handleLogout}>Logout</div>
                            </div>
                        )}
                           
                    </>
                ) : (
                    <button 
                        onClick={() => navigate('/login')} 
                        className="login-btn"
                    >
                        Login
                    </button>
                )} 
            </div>

            {token && isMobileMenu && (
                <div className="mobile-menu">
                    <NavLink
                        to='/favourites'
                        className={({ isActive }) => isActive ? "mobile-menu-item active" : "mobile-menu-item"}
                        onClick={() => setIsMobileMenu(false)}
                    >
                        Favourites 💗
                    </NavLink>
                    <NavLink
                        to='/watchlist'
                        className={({ isActive }) => isActive ? "mobile-menu-item active" : "mobile-menu-item"}
                        onClick={() => setIsMobileMenu(false)}
                    >
                        Watchlist 📺
                    </NavLink>
                    <div className="mobile-menu-divider" />
                    <div className="mobile-menu-item" onClick={() => { navigate("/profile"); setIsMobileMenu(false); }}>
                        Profile 👤
                    </div>
                    <div className="mobile-menu-item" onClick={handleLogout}>
                        Logout 
                    </div>
                </div>
            )}
                
        </header>
    );
}

export default Header;