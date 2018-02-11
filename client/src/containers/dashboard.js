import React, { Component } from 'react';
import {withRouter} from "react-router-dom";
import {connect} from 'react-redux'
import NavBar from '../components/navbar'
import CardContainer from '../containers/cardContainer'
import '../styles/dashboard.css'
import {userLogin} from '../actions';

import Form from '../components/form'
import Modal from 'react-modal';

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
          formModalIsOpen: false
        };

        this.openFormModal = this.openFormModal.bind(this);
        this.afterOpenFormModal = this.afterOpenFormModal.bind(this);
        this.closeFormModal = this.closeFormModal.bind(this);
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
                    <button>ALL</button>
                    <button>REQUESTED</button>
                    <button>MATCHED</button>
                    <button>REJECTED</button>
                    <button onClick={this.openFormModal}>Open Modal</button>
                </div>
                <Modal
                  isOpen={this.state.formModalIsOpen}
                  onAfterOpen={this.afterOpenFormModal}
                  onRequestClose={this.closeFormModal}
                  style={customStyles}
                >
                    <Form onComplete={this.closeFormModal}></Form>
                </Modal>

                <div className="cardContainer">
                     <CardContainer openFormModal={this.openFormModal}/>
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
