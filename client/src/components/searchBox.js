import React, {Component} from 'react';
import Select from 'react-select';
import axios from 'axios';
import fetch from 'isomorphic-fetch';

const ROOT = 'https://cors.io/?http://www.loop-trading.com'

class searchBox extends Component{
    constructor(props){
        super(props)
        this.state = {
            backspaceRemoves: true,
			multi: false
        }
        this.onChange = this.onChange.bind(this)
        this.switchToMulti = this.switchToMulti.bind(this)
        this.switchToSingle = this.switchToSingle.bind(this)
        this.getUsers = this.getUsers.bind(this)
        this.gotoUser = this.gotoUser.bind(this)
        this.toggleBackspaceRemoves = this.toggleBackspaceRemoves.bind(this)
        this.toggleCreatable = this.toggleCreatable.bind(this)
    }
    
    onChange (value) {
		this.setState({
			value: value,
		});
	}
    
    switchToMulti () {
		this.setState({
			multi: false,
			value: [this.state.value],
		});
	}
    
	switchToSingle () {
		this.setState({
			multi: false,
			value: this.state.value ? this.state.value[0] : null
		});
	}
    
    getUsers(input){
        if (!input) {
			return Promise.resolve({ options: [] });
		}

		return fetch(`https://api.github.com/search/users?q=${input}`)
		.then((response) => response.json())
		.then((json) => {
			return { options: json.items };
		});
    }
    
    stuff (e) {
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
                        var ret = [{title:"Book1"}, {title:"Book2"}, {title:"Book3"}]
                        return ({options: ret})
                    }  
                })
                .catch((e)=>console.log(e))
        }
	}
    
    gotoUser (value, event) {
		console.log("User selected")
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
				<AsyncComponent multi={this.state.multi} value={this.state.value} onChange={this.onChange} onValueClick={this.gotoUser} valueKey="title" labelKey="title" loadOptions={this.getUsers} backspaceRemoves={this.state.backspaceRemoves} />
			</div>
		);
	}
    
    
}

/*

const GithubUsers = createClass({
	displayName: 'GithubUsers',
	propTypes: {
		label: PropTypes.string,
	},
	getInitialState () {
		return {
			backspaceRemoves: true,
			multi: true
		};
	},
	onChange (value) {
		this.setState({
			value: value,
		});
	},
	switchToMulti () {
		this.setState({
			multi: true,
			value: [this.state.value],
		});
	},
	switchToSingle () {
		this.setState({
			multi: false,
			value: this.state.value ? this.state.value[0] : null
		});
	},
	getUsers (input) {
		if (!input) {
			return Promise.resolve({ options: [] });
		}

		return fetch(`https://api.github.com/search/users?q=${input}`)
		.then((response) => response.json())
		.then((json) => {
			return { options: json.items };
		});
	},
	gotoUser (value, event) {
		window.open(value.html_url);
	},
	toggleBackspaceRemoves () {
		this.setState({
			backspaceRemoves: !this.state.backspaceRemoves
		});
	},
	toggleCreatable () {
		this.setState({
			creatable: !this.state.creatable
		});
	},
	render () {
		const AsyncComponent = this.state.creatable
			? Select.AsyncCreatable
			: Select.Async;

		return (
			<div className="section">
				<h3 className="section-heading">{this.props.label} <a href="https://github.com/JedWatson/react-select/tree/master/examples/src/components/GithubUsers.js">(Source)</a></h3>
				<AsyncComponent multi={this.state.multi} value={this.state.value} onChange={this.onChange} onValueClick={this.gotoUser} valueKey="id" labelKey="login" loadOptions={this.getUsers} backspaceRemoves={this.state.backspaceRemoves} />
				<div className="checkbox-list">
					<label className="checkbox">
						<input type="radio" className="checkbox-control" checked={this.state.multi} onChange={this.switchToMulti}/>
						<span className="checkbox-label">Multiselect</span>
					</label>
					<label className="checkbox">
						<input type="radio" className="checkbox-control" checked={!this.state.multi} onChange={this.switchToSingle}/>
						<span className="checkbox-label">Single Value</span>
					</label>
				</div>
				<div className="checkbox-list">
					<label className="checkbox">
					   <input type="checkbox" className="checkbox-control" checked={this.state.creatable} onChange={this.toggleCreatable} />
					   <span className="checkbox-label">Creatable?</span>
					</label>
					<label className="checkbox">
					   <input type="checkbox" className="checkbox-control" checked={this.state.backspaceRemoves} onChange={this.toggleBackspaceRemoves} />
					   <span className="checkbox-label">Backspace Removes?</span>
					</label>
				</div>
				<div className="hint">This example uses fetch.js for showing Async options with Promises</div>
			</div>
		);
	}
});

*/

export default searchBox
