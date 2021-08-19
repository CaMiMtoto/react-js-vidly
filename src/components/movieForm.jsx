import React from "react";
import Input from "./common/input";
import Joi from "joi-browser";
import * as PropTypes from "prop-types";
import { getGenres } from "../services/genreService";
import { getMovie, saveMovie } from "../services/movieService";

class MovieForm extends React.Component {
  state = {
    movie: { title: "", genreId: "", numberInStock: "", dailyRentalRate: "" },
    errors: {},
    genres: [],
  };

  async componentDidMount() {
    const { data } = await getGenres();
    this.setState({ genres: data });

    const movieId = this.props.match.params.id;
    if (movieId === "new") return;

    const movie = (await getMovie(movieId)).data;

    if (!movie) return this.props.history.replace("/not-found");

    this.setState({
      movie: {
        _id: movie._id,
        title: movie.title,
        genreId: movie.genre._id,
        numberInStock: movie.numberInStock,
        dailyRentalRate: movie.dailyRentalRate,
      },
    });
  }

  schema = {
    _id: Joi.string(),
    title: Joi.string().required().label("Title"),
    genreId: Joi.string().required().label("Genre"),
    numberInStock: Joi.number()
      .required()
      .label("Number in stock")
      .min(0)
      .max(100),
    dailyRentalRate: Joi.number()
      .required()
      .label("Daily rental rate")
      .min(0)
      .max(10),
  };

  validate() {
    let configuration = { abortEarly: false };
    const { error } = Joi.validate(
      this.state.movie,
      this.schema,
      configuration
    );

    if (!error) return null;

    const errors = {};
    for (let item of error.details) {
      errors[item.path[0]] = item.message;
    }
    return errors;
  }

  handleSubmit = (e) => {
    e.preventDefault();

    const errors = this.validate();
    this.setState({ errors: errors || {} });

    if (errors) return;

    let movie = this.state.movie;
    // console.log(movie);

    saveMovie(movie);

    this.props.history.push("/movies");
    // console.log('Submitted');
  };

  validateProperty = ({ name, value }) => {
    const obj = { [name]: value };
    const schema = { [name]: this.schema[name] };
    const { error } = Joi.validate(obj, schema);
    return error ? error.details[0].message : null;
  };

  handleChange = ({ currentTarget: input }) => {
    const errors = { ...this.state.errors };

    const errorMessage = this.validateProperty(input);
    if (errorMessage) errors[input.name] = errorMessage;
    else delete errors[input.name];

    const movie = { ...this.state.movie };
    movie[input.name] = input.value;

    this.setState({ movie: movie, errors });
  };

  render() {
    const { errors } = this.state;
    const { title, numberInStock, dailyRentalRate, genreId } = this.state.movie;

    /*    let {match, history} = this.props;
            console.log(match.params.id);*/

    return (
      <div className="row">
        <div className="col-md-6">
          <form onSubmit={this.handleSubmit} autoComplete="off">
            <h3>Movie form </h3>

            <Input
              name="title"
              value={title}
              label="Title"
              onChange={this.handleChange}
              error={errors.title}
            />

            <div className="mb-3">
              <label htmlFor="genreId">Genre</label>
              <select
                className="form-select"
                name="genreId"
                value={genreId}
                onChange={this.handleChange}
              >
                <option />
                {this.state.genres.map((genre) => (
                  <option key={genre._id} value={genre._id}>
                    {genre.name}
                  </option>
                ))}
              </select>
              {errors.genreId && (
                <div className="form-text text-danger">{errors.genreId}</div>
              )}
            </div>

            <Input
              name="numberInStock"
              value={numberInStock}
              label="Number in stock"
              type="number"
              onChange={this.handleChange}
              error={errors.numberInStock}
            />

            <Input
              name="dailyRentalRate"
              value={dailyRentalRate}
              label="Rate"
              type="number"
              onChange={this.handleChange}
              error={errors.dailyRentalRate}
            />

            <button className="btn btn-primary" type="submit">
              Save changes
            </button>
          </form>
        </div>
      </div>
    );
  }
}

MovieForm.propTypes = {
  match: PropTypes.any,
  history: PropTypes.any,
};

export default MovieForm;
