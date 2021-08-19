import './App.css';
import React from "react";
import {Redirect, Route, Switch} from "react-router-dom";
import Rentals from "./components/rentals";
import Movies from "./components/movies";
import NotFound from "./components/notFound";
import Customers from "./components/customers";
import NavBar from "./components/navBar";
import MovieForm from "./components/movieForm";
import LoginForm from "./components/loginForm";
import RegisterForm from "./components/registerForm";

import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Logout from "./components/logout";
import authService from "./services/authService";
import ProtectedRoute from "./components/common/protectedRoute";

class App extends React.Component {
    state = {}

    componentDidMount() {
        const user = authService.getCurrentUser();
        this.setState({user});
    }

    render() {
        const {user} = this.state;

        return (
            <React.Fragment>
                <ToastContainer/>

                <NavBar user={user}/>
                <main className='container py-4'>
                    <Switch>
                        <Route path="/login" component={LoginForm}/>
                        <Route path="/register" component={RegisterForm}/>
                        <Route path="/logout" component={Logout}/>
                        <ProtectedRoute path="/movies/:id" component={MovieForm}/>
                        <Route path="/movies" render={props => {
                            return <Movies {...props} user={user}/>;
                        }}/>
                        <Route path="/customers" component={Customers}/>
                        <Route path="/rentals" component={Rentals}/>
                        <Route path="/not-found" component={NotFound}/>
                        <Redirect from='/' exact to='/movies'/>
                        <Redirect to='/not-found'/>
                    </Switch>
                </main>
            </React.Fragment>
        );
    }
}

export default App;
