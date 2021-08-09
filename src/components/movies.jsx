import React, {Component} from 'react';
import {getMovies} from "../services/fakeMovieService";
import Like from "./common/like";
import Pagination from "./common/pagination";
import {paginate} from "../utils/paginate";
import ListGroup from "./common/listGroup";
import {getGenres} from "../services/fakeGenreService";


class Movies extends Component {
    state = {
        movies: [],
        pageSize: 3,
        currentPage: 1,
        genres: [],
        selectedGenre: null
    };

    componentDidMount() {
        const genres = [{name: 'All Genres', _id: 0}, ...getGenres()];

        this.setState({
            genres,
            movies: getMovies(),
        });
    }

    handleDelete = (movie) => {
        const movies = this.state.movies.filter(m => m._id !== movie._id);
        this.setState({movies});
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
        this.setState({selectedGenre: genre, currentPage: 1});

    };

    render() {

        const {movies: allMovies, currentPage, pageSize, selectedGenre} = this.state;
        const {length: count} = allMovies;

        if (count === 0)
            return <p className='mt-5'>There are no movies on the database</p>


        const filteredMovies = selectedGenre && selectedGenre._id ? allMovies.filter(m => m.genre._id === selectedGenre._id) : allMovies;
        const movies = paginate(filteredMovies, currentPage, pageSize);

        return (
            <div className='container my-5'>
                <div className="row">
                    <div className="col-md-4">
                        <p>Filters</p>
                        <ListGroup
                            items={this.state.genres}
                            // textProperty='name'
                            // valueProperty='_id'
                            selectedItem={this.state.selectedGenre}
                            onItemSelect={this.handleGenreSelected}/>
                    </div>
                    <div className="col">
                        <p>Showing {filteredMovies.length} movies in the database.</p>
                        <div className='card card-body rounded shadow-sm p-0'>
                            <table className="table">
                                <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Genre</th>
                                    <th>Stock</th>
                                    <th>Rate</th>
                                    <th/>
                                    <th/>
                                </tr>
                                </thead>
                                <tbody>

                                {movies.map(movie => (
                                    <tr key={movie._id}>
                                        <td>{movie.title}</td>
                                        <td>{movie.genre.name}</td>
                                        <td>{movie.numberInStock}</td>
                                        <td>{movie.dailyRentalRate}</td>
                                        <td>
                                            <Like liked={movie.liked} onClick={() => this.handleLike(movie)}/>
                                        </td>
                                        <td>
                                            <button onClick={() => this.handleDelete(movie)}
                                                    className='btn btn-danger btn-sm'>
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}

                                </tbody>
                            </table>
                        <div className='px-3'>
                            <Pagination
                                itemsCount={filteredMovies.length}
                                pageSize={pageSize}
                                currentPage={currentPage}
                                onPageChange={this.handlePageChange}/>
                        </div>
                        </div>
                    </div>
                </div>
            </div>
        );

    }
}

export default Movies;