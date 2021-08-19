import React, {Component} from "react";
import {deleteMovie, getMovies} from "../services/movieService";
import Pagination from "./common/pagination";
import {paginate} from "../utils/paginate";
import ListGroup from "./common/listGroup";
import {getGenres} from "../services/genreService";
import MoviesTable from "./moviesTable";
import _ from "lodash";
import {Link} from "react-router-dom";
import SearchBox from "./common/searchBox";
import {toast} from "react-toastify";

class Movies extends Component {
    state = {
        movies: [],
        pageSize: 10,
        currentPage: 1,
        genres: [],
        selectedGenre: null,
        sortColumn: {path: "title", order: "asc"},
        searchQuery: "",
    };

    async componentDidMount() {
        const {data} = await getGenres();
        const genres = [{name: "All Genres", _id: ""}, ...data];

        const movies = (await getMovies()).data;

        this.setState({
            genres,
            movies: movies,
        });
    }

    handleDelete = async (movie) => {
        const originalMovies = this.state.movies;
        const movies = this.state.movies.filter((m) => m._id !== movie._id);
        this.setState({movies});

        try {
            await deleteMovie(movie._id);
        } catch (ex) {
            if (ex.response) {
                if (ex.response.status === 404) {
                    toast.error("This movie have been deleted.");
                } else if (ex.response.status === 403) {
                    toast.error(ex.response.data);
                    // toast.error(ex);
                }
                this.setState({movies: originalMovies});
            }
        }
    };

    handleSort = (sortColumn) => {
        this.setState({sortColumn});
    };

    handleLike = (movie) => {
        const movies = [...this.state.movies];
        const index = movies.indexOf(movie);
        movies[index] = {...movies[index]};
        movies[index].liked = !movies[index].liked;
        this.setState({movies});
    };

    handlePageChange = (page) => {
        this.setState({currentPage: page});
    };

    handleGenreSelected = (genre) => {
        this.setState({selectedGenre: genre, searchQuery: "", currentPage: 1});
    };

    getPageData = () => {
        const {
            movies: allMovies,
            currentPage,
            pageSize,
            selectedGenre,
            sortColumn,
            searchQuery,
        } = this.state;

        let filteredMovies = allMovies;

        if (searchQuery) {
            filteredMovies = allMovies.filter((m) =>
                m.title.toLowerCase().includes(searchQuery.toLowerCase())
            );
        } else if (selectedGenre && selectedGenre._id) {
            filteredMovies = allMovies.filter(
                (m) => m.genre._id === selectedGenre._id
            );
        }

        let sorted = _.orderBy(
            filteredMovies,
            [sortColumn.path],
            [sortColumn.order]
        );
        const movies = paginate(sorted, currentPage, pageSize);
        return {
            totalCount: filteredMovies.length,
            data: movies,
        };
    };

    handleSearch = (query) => {
        this.setState({searchQuery: query, selectedGenre: null, currentPage: 1});
    };

    render() {
        const {
            movies: allMovies,
            currentPage,
            pageSize,
            sortColumn,
            searchQuery,
        } = this.state;
        const {length: count} = allMovies;
        const {user} = this.props;

        if (count === 0)
            return <p className="mt-5">There are no movies on the database</p>;

        const {totalCount, data} = this.getPageData();

        return (
            <div className="row">
                <div className="col-md-4">
                    <p className="mt-5">Filters</p>
                    <div className="card card-body rounded shadow-sm p-0">
                        <ListGroup
                            items={this.state.genres}
                            // textProperty='name'
                            // valueProperty='_id'
                            selectedItem={this.state.selectedGenre}
                            onItemSelect={this.handleGenreSelected}
                        />
                    </div>
                </div>
                <div className="col">
                    <div className="row mb-3">
                        <div className="col">
                            {
                                user &&
                                <Link
                                    className="btn btn-sm btn-primary rounded-1 my-2 my-md-0 shadow-sm"
                                    to="/movies/new"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    New Movie
                                </Link>
                            }

                        </div>
                        <div className="col-md-6">
                            <SearchBox value={searchQuery} onChange={this.handleSearch}/>
                        </div>
                    </div>

                    <p>Showing {totalCount} movies in the database.</p>
                    <div className="card card-body rounded shadow-sm p-0 table-responsive">
                        <MoviesTable
                            movies={data}
                            sortColumn={sortColumn}
                            onLike={this.handleLike}
                            onDelete={this.handleDelete}
                            onSort={this.handleSort}
                        />

                        <div className="px-3">
                            <Pagination
                                itemsCount={totalCount}
                                pageSize={pageSize}
                                currentPage={currentPage}
                                onPageChange={this.handlePageChange}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Movies;
