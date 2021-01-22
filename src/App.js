import React from 'react';
import AppTabs from './AppTabs'
import Login from './Login'

import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";

export default function App() {

    return (
        <Router >
            <Switch>
                <Route path="/" exact component={Login} />
                <Route path="/app" component={AppTabs} />
            </Switch>
        </Router>
    )
}