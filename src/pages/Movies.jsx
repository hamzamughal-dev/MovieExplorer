import MediaExplorerPage from '../components/MediaExplorerPage';

function Movies() {
    return (
        <MediaExplorerPage
            type="movie"
            title="Trending Movies"
            searchPlaceholder="Search for movies, actors, or genres..."
            discoverText="Discover trending movies worldwide"
        />
    );
}

export default Movies;
