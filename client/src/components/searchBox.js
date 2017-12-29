import React, {Component} from 'react';
import Select from 'react-select';
import axios from 'axios';
import fetch from 'isomorphic-fetch';
import 'react-select/dist/react-select.css';

const ROOT = 'https://cors.io/?http://www.loop-trading.com'

class searchBox extends Component{
    constructor(props){
        super(props)
        this.state = {
            backspaceRemoves: true,
			multi: this.props.multi,
            value: this.props.initState
        }
        this.onChange = this.onChange.bind(this)
        this.gotoUser = this.gotoUser.bind(this)
        this.toggleBackspaceRemoves = this.toggleBackspaceRemoves.bind(this)
        this.toggleCreatable = this.toggleCreatable.bind(this)
        this.getBooks = this.getBooks.bind(this)
    }
    
    // Take this from parent, so that state is saved in the form itself
    onChange (value) {
        this.props.onChange(value)
		this.setState({
			value: value,
		});
	}
    
    getBooks(input){
        if (input.length < 3) {
			return Promise.resolve({ options: [] });
		}
        else {
            return fetch(ROOT+'/api/search/search_textbooks?search_input='+input)
            .then((res) => res.json())
            .then((json) => {
                this.setState({searchResults: json.data})
                return { options: json.data };
            })
        }
    }
    
    stuff(e){
		var input = e
        if (input.length >= 3){
            axios.get(ROOT+'/api/search/search_textbooks?search_input='+input)
                .then((res) => {
                    console.log(searchResults)
                    var ownedBooksSet = new Set()
                    var displayList = []
                    if (res.data.status == 0){
                        var searchResults = res.data.data
                        console.log(searchResults)
                        //TODO: Clear the search result UI state    
                        /*
                        console.log("Making user request")
                        axios.get(ROOT+'/api/owned_books/get_owned_cards?user_id=user')
                            .then((userData) => {
                            
                                var userBooksInfo = userData.data;
							    for (var j = 0; j < userBooksInfo.length; j++) {
								    ownedBooksSet.add(userBooksInfo[j]["book_id"]);
								    console.log(userBooksInfo[j]["book_id"]);
							     }
                            
                                for (var i = 0; i < searchResults.length; i++){
                                    var book_id = searchResults[i]["book_id"];
								    if (!ownedBooksSet.has(book_id)) {
                                        var title = searchResults[i]["title"];
									    var author = searchResults[i]["author"];
									    var isbn = searchResults[i]["isbn"];
									    var img_url = searchResults[i]["img_url"];
                                        displayList.push({title, author, isbn, img_url})
                                    }
                                }
                                this.setState({search: displayList})
                            })
                            .catch((e)=>console.log(e)) 
                        */  
                        this.setState({search: searchResults})
                        return (searchResults)
                    }  
                })
                .catch((e)=>console.log(e))
        }
	}
    
    gotoUser (value, event) {
		console.log("Selected", value)
	}
    
	toggleBackspaceRemoves () {
		this.setState({
			backspaceRemoves: !this.state.backspaceRemoves
		})
	}
    
	toggleCreatable () {
		this.setState({
			creatable: !this.state.creatable
		})
	}
    
    render () {
		const AsyncComponent = this.state.creatable
			? Select.AsyncCreatable
			: Select.Async;

		return (
			<div className="section">
				<AsyncComponent multi={this.state.multi} value={this.state.value} onChange={this.onChange} onValueClick={this.gotoUser} valueKey="book_id" labelKey="title" loadOptions={this.getBooks} backspaceRemoves={this.state.backspaceRemoves} />
			</div>
		);
	}
    
    
}

export default searchBox
