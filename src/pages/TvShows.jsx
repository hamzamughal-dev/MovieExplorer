import MediaExplorerPage from '../components/MediaExplorerPage';

function TvShows() {
    return (
        <MediaExplorerPage
            type="tv"
            title="Trending TV Shows"
            searchPlaceholder="Search for TV shows, series, or actors..."
            discoverText="Discover trending TV series worldwide"
        />
    );
}

export default TvShows;
