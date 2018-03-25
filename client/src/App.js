import React, { Component } from 'react';
import {BrowserRouter, Route} from 'react-router-dom'
import {connect} from 'react-redux';

import NavBar from './components/navbar'
import Footer from './components/footer'
import Home from './containers/home'
import Dashboard from './containers/dashboard'
import Form from './components/form'
import TradeDetail from './components/tradeDetail'
import TradingGuide from './components/tradingGuide'

class App extends Component {
    componentDidMount(){
        console.log("Load initial app state")
    }

    render() {
    return (
        <BrowserRouter>
            <div className="App">
                <Route exact path="/" component={() => (
                        <div>
                            <NavBar></NavBar>
                            <Home/>
                        </div>
                    )}>
                </Route>
                <Route exact path="/bookshelf" component={() => (
                        <div>
                            <NavBar></NavBar>
                            <Dashboard new={false}></Dashboard>
                        </div>
                )}>
                </Route>
                <Route exact path="/bookshelf_new" component={() => (
                        <div>
                            <NavBar></NavBar>
                            <Dashboard new={true}></Dashboard>
                        </div>
                )}>
                </Route>
                <Route exact path="/guide" component={() => (
                        <div>
                            <NavBar></NavBar>
                            <TradingGuide></TradingGuide>
                        </div>
                )}>
                </Route>
                <Footer></Footer>
            </div>
        </BrowserRouter>
    );
  }
}

export default connect(null)(App);
