import React, {Component} from 'react'
import CardAdd from '../components/cardAdd'
import CardClosedTrade from '../components/cardClosedTrade'
import CardPendingTrade from '../components/cardPendingTrade'
import '../styles/cardContainer.css'
import {withRouter} from "react-router-dom";
import {connect} from 'react-redux'

class CardContainer extends Component {
    constructor(props) {
        super(props);
//        this.cardClicked = this.cardClicked.bind(this)
        this.generateList = this.generateList.bind(this)
        this.mapStatusToColor = this.mapStatusToColor.bind(this)
        this.mapFilterToColorToColor = this.mapFilterToColor.bind(this)
    }
    
    generateList(){
        var cards = this.props.cards
        var filter = this.props.filter
        if (!cards){
            return (<div></div>)
        }
        
        console.log("Cards", cards)
        
        if (filter != "ALL"){
                cards = cards.filter(card => this.mapStatusToColor(card.status) === this.mapFilterToColor(filter))
                console.log("After filter", filter, cards)
        }
        
        return cards.map((card, key) => {
            if (card.status === 'N'){
                return (
                    <CardPendingTrade
                        color="yellow"
                        bookHave={card.book_have}
                        booksWant={card.book_want}
                        onClick={this.props.openEditModal}
                        selectCard={this.props.selectCard}
                    ></CardPendingTrade>
                )
            }
            
            if (card.status === 'A'){
                return (
                    <CardClosedTrade 
                    color={this.mapStatusToColor(card.status)}
                    bookHave={card.book_have}
                    bookWant={card.book_want[0]}
                    onClick={this.props.approveAlert}
                    selectCard={this.props.selectCard}
                    >
                </CardClosedTrade>
                )
            }
            
            if (card.status === 'R'){
                return (
                    <CardClosedTrade 
                    color={this.mapStatusToColor(card.status)}
                    bookHave={card.book_have}
                    bookWant={card.book_want[0]}
                    onClick={this.props.rejectAlert}
                    selectCard={this.props.selectCard}
                    >
                </CardClosedTrade>
                )
            }
            
            
            return (
                <CardClosedTrade 
                    color={this.mapStatusToColor(card.status)}
                    bookHave={card.book_have}
                    bookWant={card.book_want[0]}
                    onClick={this.props.openDetailModal}
                    selectCard={this.props.selectCard}
                    >
                </CardClosedTrade>
            )
        })
    }
    // TODO: Separate W and P
    
    mapStatusToColor(status){
        if (status === 'A')
            return "green"
        if (status === 'R')
            return "red"
        if (status === 'W' || status === 'P')
            return "blue"
        if (status == 'N')
            return "yellow"
    }
    
    mapFilterToColor(status){
        if (status === 'REQUESTED')
            return "yellow"
        if (status === 'REJECTED')
            return "red"
        if (status === 'MATCHED')
            return "blue"
    }

    render() {
        return (
            <div>
                <div className="cardGrid">
                    <CardAdd onClick={this.props.openFormModal}></CardAdd>
                    {this.generateList()}
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
export default connect(mapStateToProps)(withRouter(CardContainer))