import React, { Component } from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom'
import {connect} from 'react-redux';

import Home from './containers/home'
import Bookshelf from './containers/bookshelf'
import Form from './components/form'

class App extends Component {
    componentDidMount(){
        console.log("Load initial app state")
    }

  render() {
    return (
        <BrowserRouter>
            <div className="App">
                <Route exact path="/" component={() => (
                        <Home/>
                    )}>
                </Route>
                <Route exact path="/bookshelf" component={() => (
                        <Form/>
                    )}>
                </Route>
            </div>
        </BrowserRouter>
    );
  }
}

export default  connect(null)(App);
