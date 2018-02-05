import React, {Component} from 'react'
import CardAdd from '../components/cardAdd'
import CardClosedTrade from '../components/cardClosedTrade'
import '../styles/cardContainer.css'
import {withRouter} from "react-router-dom";
import {connect} from 'react-redux'

class CardContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            route: false,
            item: null
        }
//        this.cardClicked = this.cardClicked.bind(this)
//        this.generateList = this.generateList.bind(this)
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
        var cards = [1,2,3,4,5]
        return cards.map((card) => {
            <CardAdd></CardAdd>
        })   
    }

    render() {
        return (
            <div>
                <div className="cardGrid">
                    <CardAdd></CardAdd>
                    <CardClosedTrade color="blue"></CardClosedTrade>
                    <CardClosedTrade color="yellow"></CardClosedTrade>
                    <CardClosedTrade color="red"></CardClosedTrade>
                    <CardClosedTrade color="green"></CardClosedTrade>
                    <CardAdd></CardAdd>
                </div>
            </div>
        )
    }
}
function mapStateToProps(state){
    return {
        items: state.products
    }
}
export default connect(mapStateToProps)(withRouter(CardContainer))