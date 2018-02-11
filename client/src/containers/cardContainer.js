import React, {Component} from 'react'
import CardAdd from '../components/cardAdd'
import CardClosedTrade from '../components/cardClosedTrade'
import '../styles/cardContainer.css'
import {withRouter} from "react-router-dom";
import {connect} from 'react-redux'

class CardContainer extends Component {
    constructor(props) {
        super(props);
//        this.cardClicked = this.cardClicked.bind(this)
        this.generateList = this.generateList.bind(this)
        this.mapStatusToColor = this.mapStatusToColor.bind(this)
//        window.scrollTo(0, 0)
    }
   
/*
    generateListOld(){ 
        if (!this.props.items){
            return <div></div>    
        }
        return this.props.items.Products.map((item) => (
                <Card
                    handleClick={this.cardClicked}
                    item={item}
                ></Card>
        ))     
    }
    
    cardClicked(item){
        console.log("User Clicked", item._id)
        this.props.history.push(`/product/${item._id}`)        
    }
*/
    
    generateList(){
        var cards = this.props.user.trades
        if (!cards){
            return (<div></div>)
        }
        
        console.log("Cards", cards)
        
        return cards.map((card, key) => {
            return (
                <CardClosedTrade 
                    color={this.mapStatusToColor(card.status)}
                    bookHave={card.book_have}
                    bookWant={card.book_want[0]}
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
        if (status === 'N')
            return "yellow"
        if (status === 'W' || status === 'P')
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