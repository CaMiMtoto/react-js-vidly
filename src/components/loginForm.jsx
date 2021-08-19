import React, {Component} from "react";
import {LoginIcon} from "@heroicons/react/solid";
import Input from "./common/input";
import Joi from "joi-browser";

import authService from "../services/authService";
import {Redirect} from "react-router-dom";

class LoginForm extends Component {
    state = {
        account: {username: "", password: ""},
        errors: {},
    };

    schema = {
        username: Joi.string().required().label("Username"),
        password: Joi.string().required().label("Password"),
    };

    validate() {
        let configuration = {abortEarly: false};
        const {error} = Joi.validate(
            this.state.account,
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

    handleSubmit = async (e) => {
        e.preventDefault();

        const errors = this.validate();
        this.setState({errors: errors || {}});

        if (errors) return;

        try {
            await authService.login(this.state.account.username, this.state.account.password);
            const {state} = this.props.location;
            window.location = state ? state.intended.pathname : '/';

        } catch (ex) {
            if (ex.response && ex.response.status === 400) {
                const errors = {...this.state.errors};
                errors.username = ex.response.data;
                this.setState({errors});
            }
        }
    };

    validateProperty = ({name, value}) => {
        const obj = {[name]: value};
        const schema = {[name]: this.schema[name]};
        const {error} = Joi.validate(obj, schema);
        return error ? error.details[0].message : null;
    };

    handleChange = ({currentTarget: input}) => {
        const errors = {...this.state.errors};

        const errorMessage = this.validateProperty(input);
        if (errorMessage) errors[input.name] = errorMessage;
        else delete errors[input.name];

        const account = {...this.state.account};
        account[input.name] = input.value;

        this.setState({account, errors});
    };

    render() {


        if (authService.getCurrentUser())
            return <Redirect to='/'/>

        const {account, errors} = this.state;
        const {password, username} = account;

        return (
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-4 col-sm-8">
                    <form onSubmit={this.handleSubmit} autoComplete="off">
                        <div className="card rounded-3 shadow-sm">
                            <div className="card-header px-4 py-3 bg-transparent border-bottom-0">
                                <h4>Login</h4>
                                <p className="small">Enter your email and password to login.</p>
                            </div>
                            <div className="card-body px-4">
                                <Input
                                    name="username"
                                    value={username}
                                    label="Username"
                                    onChange={this.handleChange}
                                    error={errors.username}
                                />
                                <Input
                                    name="password"
                                    value={password}
                                    label="Password"
                                    onChange={this.handleChange}
                                    error={errors.password}
                                    type="password"
                                />

                                <div className="mb-3 form-check">
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        id="remember"
                                    />
                                    <label className="form-check-label" htmlFor="remember">
                                        Remember me!
                                    </label>
                                </div>
                                <button
                                    type="submit"
                                    className="btn btn-secondary rounded-3 px-3"
                                    disabled={this.validate()}
                                >
                                    <LoginIcon className="w-5 h-5 me-2"/>
                                    Login
                                </button>
                            </div>
                            <div className="card-footer bg-transparent border-top-0"></div>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

export default LoginForm;
