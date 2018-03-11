import React, { Component } from 'react';
import {withRouter} from "react-router-dom";
import {connect} from 'react-redux'
import NavBar from '../components/navbar'
import CardContainer from '../containers/cardContainer'
import '../styles/dashboard.css'
import '../styles/vendors/sweetalert.css'
import {userLogin} from '../actions';

import Loading from '../new_images/loading.gif'
import { ClipLoader } from 'react-spinners';

import Form from '../components/form'
import Modal from 'react-modal';
import TradeDetail from '../components/tradeDetail'
import BookshelfImage from '../img/Bookshelf_Dashboard.svg'
import EditTrade from '../components/editTrade'
import SweetAlert from 'sweetalert-react';

import axios from 'axios'
const ROOT = 'http://localhost:3000'
axios.defaults.withCredentials = true;

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
          editModalIsOpen: false,
          approveAlert: false,
          selectedCard: null,
          approveAlert: false,
          rejectAlert: false,
          filter: "ALL",
          swal: {
              show: false,
              status: null,
              type: null,
              text: null,
              title: null,
              confirmButtonText: null,
              showCancelButton: false,
              cancelButtonText:null,
              onConfirm: null
          }
        };

        this.openFormModal = this.openFormModal.bind(this);
        this.openDetailModal = this.openDetailModal.bind(this);
        this.openEditModal = this.openEditModal.bind(this);
        this.closeFormModal = this.closeFormModal.bind(this);
        this.closeDetailModal = this.closeDetailModal.bind(this);
        this.closeEditModal = this.closeEditModal.bind(this);
        this.setFilter = this.setFilter.bind(this);
        this.selectCard = this.selectCard.bind(this);
        this.dismissReject = this.dismissReject.bind(this);
        this.dismissAccept = this.dismissAccept.bind(this);
        this.openSwal = this.openSwal.bind(this);
        this.handleAlert = this.handleAlert.bind(this);
        this.openApproveAlert = this.openApproveAlert.bind(this);
        this.openRejectAlert = this.openRejectAlert.bind(this);
        this.openWaitAlert = this.openWaitAlert.bind(this);
    }
    
    openSwal(type) {
        if (type === 'A'){
            this.setState({swal : {
                          show: true,
                          status: 'A',
                          type: "success",
                          title: "This trade is complete!",
                          text: "You have been emailed the details of your trade loop",
                          confirmButtonText: "Okay",
                          showCancelButton: false,
                          cancelButtonText: null,
                        }})
        }
        else if (type === 'R'){
            this.setState({swal : {
                          show: true,
                          status: 'R',
                          type: "error",
                          title: "This trade has been rejected by a member of the loop",
                          text: "If you would still like to trade this book, please add it again.",
                          confirmButtonText: "Dismiss Card",
                          showCancelButton: true,
                          cancelButtonText: "Back",
                        }})
        }
        else if (type === 'W'){
            this.setState({swal : {
                          show: true,
                          status: 'W',              
                          type: "info",
                          title: "We're waiting for other members of the loop to confirm the trade",
                          text: "You will be emailed trade details soon",
                          confirmButtonText: "Okay",
                          showCancelButton: false,
                          cancelButtonText: null,
                        }})
        }
    }

    openFormModal() {
        this.setState({formModalIsOpen: true});
    }

    openEditModal() {
        this.setState({editModalIsOpen: true});
    }
    
    openApproveAlert(){
        this.openSwal('A')
    }
    
    openRejectAlert(){
        this.openSwal('R')
    }
    
    openWaitAlert(){
        this.openSwal('W')
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
    
    dismissReject(){
        var ownedBook = this.state.selectedCard.bookHave
        axios.post(ROOT+'/api/found_trades/dismiss_rejected_trade', {
            owned_book: ownedBook.book_id
        })
        .then((res) => {
            if(res.data.status === 0){
                console.log('successfully removed owned book from owned_books');
            }
            else if(res.data.status === 1)
            {
                console.log('db connection error for removing from owned_books');
            }
            else if(res.data.status === 2)
            {
                console.log('db query error for removing from found_trades');
            }
            else if(res.data.status === 3){
                console.log('wanted book already removed from found_trades');
            }
            window.location.reload();
        })
    }
    
    dismissAccept(){
        console.log("Dismiss Accepted Trade from DB...")
    }
    
    handleAlert(){
        var status = this.state.swal.status
        
        if (!status){
            return
        }
        
        if (status === 'A'){
            this.setState({ swal: {show: false}})
        }
        else if (status === 'W'){
            this.setState({ swal: {show: false}})
        }
        else if (status === 'R'){
            this.dismissReject()
        }
    }
    

    render(){
        if (this.props.user == null){
            return (
            <div className="loadingContainer">
                <ClipLoader
                    color={'#52b9d1'}
                    loading={true}
                    size={60}
                />
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
                        onComplete={this.closeFormModal}>
                     </TradeDetail>
                </Modal>

                <Modal
                  isOpen={this.state.editModalIsOpen}
                  onRequestClose={this.closeEditModal}
                  style={customStyles}
                >
                    <EditTrade
                        offer={this.state.selectedCard ? this.state.selectedCard.bookHave : null}
                        want={this.state.selectedCard ? this.state.selectedCard.booksWant : null}
                        onComplete={this.closeEditModal}>
                    </EditTrade>
                </Modal>
                
                <SweetAlert
                    show={this.state.swal.show}
                    type={this.state.swal.type}
                    title={this.state.swal.title}
                    text={this.state.swal.text}
                    confirmButtonText={this.state.swal.confirmButtonText}
                    showCancelButton={this.state.swal.showCancelButton}
                    cancelButtonText={this.state.swal.cancelButtonText}
                    onConfirm={() => this.handleAlert(this.state.swal.status)}
                    onEscapeKey={() => this.setState({ swal: {show: false} })}
                    onOutsideClick={() => this.setState({ swal: {show: false} })}
                />
                {console.log(this.state.swal)}

                <div className="cardContainer">
                     <CardContainer
                         cards={this.props.user.trades}
                         openFormModal={this.openFormModal}
                         openDetailModal={this.openDetailModal}
                         openEditModal={this.openEditModal}
                         filter={this.state.filter}
                         selectCard={this.selectCard}
                         approveAlert={this.openApproveAlert}
                         rejectAlert={this.openRejectAlert}
                         waitAlert={this.openWaitAlert}
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
