import React, {Component} from 'react';
import Like from "./common/like";
import Table from "./table";
import {Link} from "react-router-dom";
import authService from "../services/authService";

class MoviesTable extends Component {


    columns = [
        {
            path: 'title',
            label: "Title",
            content: movie => <Link to={`/movies/${movie._id}`}>{movie.title}</Link>,
            sortable: true
        },
        {path: 'genre.name', label: "Genre", sortable: true},
        {path: 'numberInStock', label: "Stock", sortable: true},
        {path: 'dailyRentalRate', label: "Rate", sortable: true},
        {
            key: 'like',
            content: movie => (<Like liked={movie.liked} onClick={() => this.props.onLike(movie)}/>),
            sortable: false
        }
    ];

    constructor(props) {
        super(props);
        const user = authService.getCurrentUser();
        if (user && user.isAdmin) {
            this.columns.push(this.deleteColumn);
        }
    }

    deleteColumn = {
        key: 'delete',
        content: movie => (<button onClick={() => this.props.onDelete(movie)}
                                   className='btn btn-danger btn-sm'>Delete</button>),
        sortable: false
    };

    render() {
        const {movies, onSort, sortColumn} = this.props;

        return (
            <Table columns={this.columns} sortColumn={sortColumn} onSort={onSort} data={movies}/>
        );
    }
}

export default MoviesTable;