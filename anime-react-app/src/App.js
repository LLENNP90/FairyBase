import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import DetailsPage from './pages/DetailsPage';
// import FavouritesPage from './pages/FavouritePage';
// import WatchlistPage from './pages/WatchListPage';
import AnimeListPage from './pages/AnimeListPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import ProfilePage from './pages/ProfilePage';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/anime/:id" element={<DetailsPage />} />
        <Route path="/favourites" element={<AnimeListPage listType="favourite" />} />
        <Route path="/watchlist" element={<AnimeListPage listType="watchlist" />} />
        <Route path="/login" element={<LoginPage />}/>
        <Route path="/register" element={<SignUpPage />} /> 
        <Route path="/profile" element={<ProfilePage/>}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
