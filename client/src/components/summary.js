import React, { Component } from 'react';
import '../styles/summary.css'
import axios from 'axios'

const ROOT = 'https://cors.io/?http://www.loop-trading.com'

class Summary extends Component{
    constructor(props){
        super(props)
        this.generateList = this.generateList.bind(this)
        this.generateList = this.generateList.bind(this)
    }
    
    generateList(){
        return this.props.books.map((book, i)=>{
            return (
            <div className='summaryContainer'>
                <div className='imageContainer'>
                    <img src={book.img_url}
                    className='bookImage'/>
                </div>
                <div className='summaryText'>
                    <p>Title: {book.title}</p>
                    <p>Author: {book.author}</p>
                    <p>ISBN: {book.isbn}</p>
                    <p>Class: {book.details.classes}</p>
                    <p>Prof: {book.details.profs}</p>
                </div>
            </div>
        )
        })
    }
    
    render(){        
        return (
            this.generateList()
        )
    }
}

export default Summary