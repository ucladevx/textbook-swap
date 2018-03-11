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
                <NavBar></NavBar>
                <Route exact path="/" component={() => (
                        <Home/>
                    )}>
                </Route>
                <Route exact path="/bookshelf" component={() => (
                        <div>
                            <Dashboard></Dashboard>
                        </div>
                )}>
                </Route>
                <Route exact path="/new" component={() => (
                        <div>
                            <Form></Form>
                        </div>
                )}>
                </Route>
                <Route exact path="/detail" component={() => (
                        <div>
                            <TradeDetail></TradeDetail>
                        </div>
                )}>
                </Route>
                <Route exact path="/guide" component={() => (
                        <div>
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
