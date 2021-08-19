import React, {Component} from "react";
import Input from "./common/input";
import Joi from "joi-browser";

import * as userService from "../services/userService";
import authService from "../services/authService";

class RegisterForm extends Component {
    state = {
        account: {username: "", password: "", name: ""},
        errors: {},
    };

    schema = {
        username: Joi.string().required().label("Username"),
        password: Joi.string().required().label("Password"),
        name: Joi.string().required().label("Name"),
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
            const response = await userService.register(this.state.account);
            authService.loginWithJwt(response.headers['x-auth-token']);
            window.location = '/';
        } catch (ex) {
            if (ex.response && ex.response.status === 400) {
                const errors = {...this.state.errors};
                errors.username = ex.response.data;
                this.setState({errors});
            }
        }

        console.log("Submitted");
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
        const {account, errors} = this.state;
        const {password, username, name} = account;

        return (
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-5 col-sm-8">
                    <form onSubmit={this.handleSubmit} autoComplete="off">
                        <div className="card rounded-3 shadow-sm">
                            <div className="card-header px-4 py-3 bg-transparent border-bottom-0">
                                <h4>Register</h4>
                                <p className="small">Enter your details to create account</p>
                            </div>
                            <div className="card-body px-4">
                                <Input
                                    name="name"
                                    value={name}
                                    label="Name"
                                    onChange={this.handleChange}
                                    error={errors.name}
                                />

                                <Input
                                    name="username" type="email"
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

                                <button
                                    type="submit"
                                    className="btn btn-secondary rounded-3 px-3"
                                    disabled={this.validate()}
                                >
                                    Register
                                </button>
                            </div>
                            <div className="card-footer bg-transparent border-top-0"/>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

export default RegisterForm;
