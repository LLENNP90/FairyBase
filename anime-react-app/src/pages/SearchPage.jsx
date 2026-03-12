import {useState, useEffect} from "react";
import { useSearchParams } from "react-router-dom";
import Header from "../components/Header";
import AnimeGrid from "../components/AnimeGrid";
import { api } from "../services/api";

function SearchPage() {
    const [searchParams] = useSearchParams();
    const query = searchParams.get("q") || "";
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSearchResults = async () => {
            if (query){
                setLoading(true);
                const data = await api.searchAnime(query);
                setSearchResults(data);
                setLoading(false);
            }
        }
        fetchSearchResults();
    }, [query]); // refetch when query changes

    return (
        <>
            <Header />
            <div className="container">
                {loading ? (
                    <p>Loading...</p>
                ) : searchResults.length > 0 ? (
                    <AnimeGrid animes={searchResults} title={`Search results for "${query}"`} />
                ) : (
                    <p>No results found for "{query}". Try a different search term.</p>
                )}

            </div>
        </>
    )
}

export default SearchPage;