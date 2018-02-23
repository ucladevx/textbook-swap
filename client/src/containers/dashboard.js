import React, { Component } from 'react';
import {withRouter} from "react-router-dom";
import {connect} from 'react-redux'
import NavBar from '../components/navbar'
import CardContainer from '../containers/cardContainer'
import '../styles/dashboard.css'
import {userLogin} from '../actions';

import Form from '../components/form'
import Modal from 'react-modal';
import TradeDetail from '../components/tradeDetail'
import EditTrade from '../components/editTrade'

const customStyles = {
  overlay: {
      backgroundColor: 'rgba(114, 114, 114, 0.75)'
  },
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)',
    padding               : '0px'
  }
};

class Dashboard extends Component{
    componentDidMount(){
        console.log("Component Did Mount");
        this.props.userLogin
    }
    
    constructor(props){
        super(props)
        
        this.state = {
          formModalIsOpen: false,
          detailModalIsOpen: false,
          editModalIsOpen: false,
          selectedCard: null,
          filter: "ALL"
        };

        this.openFormModal = this.openFormModal.bind(this);
        this.openDetailModal = this.openDetailModal.bind(this);
        this.openEditModal = this.openEditModal.bind(this);
        this.closeFormModal = this.closeFormModal.bind(this);
        this.closeDetailModal = this.closeDetailModal.bind(this);
        this.closeEditModal = this.closeEditModal.bind(this);
        this.setFilter = this.setFilter.bind(this);
        this.selectCard = this.selectCard.bind(this);
    }
    
    openFormModal() {
        this.setState({formModalIsOpen: true});
    }
    
     openEditModal() {
        this.setState({editModalIsOpen: true});
    }
    
    closeFormModal() {
        this.setState({formModalIsOpen: false});
    }
    
    closeEditModal() {
        this.setState({editModalIsOpen: false});
    }
    
    openDetailModal() {
        this.setState({detailModalIsOpen: true});
    }
    
    closeDetailModal() {
        this.setState({detailModalIsOpen: false});
    }
    
    setFilter(type) {
        this.setState({filter: type});
    }
    
    selectCard(card){
        this.setState({
            selectedCard: card
        })
    }

    render(){
        if (this.props.user == null){
            return (
            <div className="dashboardContainer">
                Loading...
            </div>
            )
        } 
        return (
            <div className="dashboardContainer">
                <div className="topBar">
                    <p>Hi {this.props.user.name}, this is your dashboard</p>
                    <button onClick={()=>this.setFilter("ALL")}>ALL</button>
                    <button onClick={()=>this.setFilter("REQUESTED")}>REQUESTED</button>
                    <button onClick={()=>this.setFilter("MATCHED")}>MATCHED</button>
                    <button onClick={()=>this.setFilter("REJECTED")}>REJECTED</button>
                </div>
                <Modal
                  isOpen={this.state.formModalIsOpen}
                  onRequestClose={this.closeFormModal}
                  style={customStyles}
                >
                    <Form onComplete={this.closeFormModal}></Form>
                </Modal>
                
                <Modal
                  isOpen={this.state.detailModalIsOpen}
                  onRequestClose={this.closeDetailModal}
                  style={customStyles}
                >
                    <TradeDetail 
                        bookHave={this.state.selectedCard ? this.state.selectedCard.bookHave : null}
                        bookWant={this.state.selectedCard ? this.state.selectedCard.bookWant : null}
                        onComplete={this.closeFormModal}></TradeDetail>
                </Modal>
                
                <Modal
                  isOpen={this.state.editModalIsOpen}
                  onRequestClose={this.closeEditModal}
                  style={customStyles}
                >
                    <EditTrade 
                        offer={this.state.selectedCard ? this.state.selectedCard.bookHave : null}
                        want={this.state.selectedCard ? this.state.selectedCard.booksWant : null}
                        onComplete={this.closeEditModal}></EditTrade>
                </Modal>

                <div className="cardContainer">
                     <CardContainer 
                         cards={this.props.user.trades} 
                         openFormModal={this.openFormModal}
                         openDetailModal={this.openDetailModal}
                         openEditModal={this.openEditModal}
                         filter={this.state.filter}
                         selectCard={this.selectCard}
                    />
                </div>
            </div>
        )
    }
}

function mapStateToProps(state){
    return {
        user: state.user
    }
}

export default connect(mapStateToProps, userLogin)(withRouter(Dashboard))
