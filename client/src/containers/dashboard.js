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
import BookshelfImage from '../img/Bookshelf_Dashboard.svg'

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
        super(props);

        this.state = {
          formModalIsOpen: false,
          detailModalIsOpen: false,
          selectedCard: null,
          filter: "ALL"
        };

        this.openFormModal = this.openFormModal.bind(this);
        this.openDetailModal = this.openDetailModal.bind(this);
        this.afterOpenFormModal = this.afterOpenFormModal.bind(this);
        this.afterOpenDetailModal = this.afterOpenDetailModal.bind(this);
        this.closeFormModal = this.closeFormModal.bind(this);
        this.closeDetailModal = this.closeDetailModal.bind(this);
        this.setFilter = this.setFilter.bind(this);
        this.selectCard = this.selectCard.bind(this);
    }

    openFormModal() {
        this.setState({formModalIsOpen: true});
    }

    afterOpenFormModal() {
    // references are now sync'd and can be accessed.
    }

    closeFormModal() {
        this.setState({formModalIsOpen: false});
    }

    openDetailModal() {
        this.setState({detailModalIsOpen: true});
    }

    afterOpenDetailModal() {
    // references are now sync'd and can be accessed.
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
                    <div className="col-md-3">
                        <h4 className="welcome_text">Hi {this.props.user.name}, welcome to your bookshelf!</h4>
                    </div>
                    <div className="col-md-6 filter_button_container">
                        <button className={"filter_button all_filter " + (this.state.filter === "ALL" ? "active_filter" : "")} onClick={()=>this.setFilter("ALL")}>ALL</button>
                        <button className={"filter_button requested_filter " + (this.state.filter === "REQUESTED" ? "active_filter" : "")} onClick={()=>this.setFilter("REQUESTED")}>REQUESTED</button>
                        <button className={"filter_button matched_filter " + (this.state.filter === "MATCHED" ? "active_filter" : "")} onClick={()=>this.setFilter("MATCHED")}>MATCHED</button>
                        <button className={"filter_button rejected_filter " + (this.state.filter === "REJECTED" ? "active_filter" : "")} onClick={()=>this.setFilter("REJECTED")}>REJECTED</button>
                        <button className={"filter_button completed_filter " + (this.state.filter === "COMPLETED" ? "active_filter" : "")} onClick={()=>this.setFilter("COMPLETED")}>COMPLETED</button>
                    </div>
                    <div className="col-md-3">
                        <img alt="LOOP" className="bookshelf_image" src={BookshelfImage}/>
                    </div>
                </div>
                <Modal
                  isOpen={this.state.formModalIsOpen}
                  onAfterOpen={this.afterOpenFormModal}
                  onRequestClose={this.closeFormModal}
                  style={customStyles}
                >
                    <Form onComplete={this.closeFormModal}></Form>
                </Modal>

                <Modal
                  isOpen={this.state.detailModalIsOpen}
                  onAfterOpen={this.afterOpenDetailModal}
                  onRequestClose={this.closeDetailModal}
                  style={customStyles}
                >
                    <TradeDetail
                        bookHave={this.state.selectedCard ? this.state.selectedCard.bookHave : null}
                        bookWant={this.state.selectedCard ? this.state.selectedCard.bookWant : null}
                        onComplete={this.closeFormModal}></TradeDetail>
                </Modal>

                <div className="cardContainer">
                     <CardContainer
                         cards={this.props.user.trades}
                         openFormModal={this.openFormModal}
                         openDetailModal={this.openDetailModal}
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
