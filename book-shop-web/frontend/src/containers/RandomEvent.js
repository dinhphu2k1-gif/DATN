import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Loading from '../components/loading/loading'
import { addGlobalContexts, removeGlobalContexts, trackSelfDescribingEvent, setUserId } from '@snowplow/browser-tracker';
import { Button } from 'react-bootstrap/lib/InputGroup';
import { BACKEND_PORT } from '../config/application.config';
import { getUser, setUser } from '../config/storage.config';

const BACKEND_HOST = process.env.REACT_APP_BACKEND_HOST || 'localhost'

class RandomEvent extends React.Component {

    state = {
        users: [],
        books: [],
        action: ['view', 'purchase', 'add', 'remove', 'comment']
    }

    setUsers = (evt) => this.setState({ users: evt });

    setBooks = (evt) => this.setState({ books: evt });

    constructor(props) {
        super(props)
        console.log("remove user_context")
        fetch(`http://${BACKEND_HOST}:${BACKEND_PORT}/all/book`, {
            method: 'GET',
            headers: {
                'accept': '*/*',
                'Content-Type': 'application/json',
            },
            credentials: "same-origin"
        })
            .then(response => {
                return response.json()
            })
            .then(data => {
                this.setBooks(data.data)
            })
            .catch((error) => {
                alert("ERROR");
                console.log(error)
            });

        fetch(`http://${BACKEND_HOST}:${BACKEND_PORT}/all/user`, {
            method: 'GET',
            headers: {
                'accept': '*/*',
                'Content-Type': 'application/json',
            },
            credentials: "same-origin"
        })
            .then(response => {
                return response.json()
            })
            .then(data => {
                this.setUsers(data.data)
            })
            .catch((error) => {
                alert("ERROR");
                console.log(error)
            });
    }
    componentWillMount() {
    }
    componentWillReceiveProps(nextProps) {
    }

    genEvent(users, books, action) {
        let i = 0;
        while (i < 100) {
            let index_user = Math.floor(Math.random() * users.length);
            for (let j = 0; j < 3; j++) {
                let index_book = Math.floor(Math.random() * books.length);
                let index_action = Math.floor(Math.random() * action.length);
                trackingActionProduct(index_user, index_book, index_action);
            }
            i++;
        }
        const id = getUser()
        setUserId(id)

        function trackingActionProduct(index_user, index_book, index_action) {
            console.log(1)
            let book = books[index_book]
            //console.log(book)
            var category = book.categories[0]
            var publisher = book.publisher
            var author = book.authors[0]

            var product_context = {
                schema: "iglu:com.bookshop/product_context/jsonschema/1-0-0",
                data: {
                    product_id: book.id, // comment cho m sua id
                    product_name: book.name,
                    quantity: 0,
                    price: book.price,
                    category_id: category.id,
                    publisher_id: publisher.id,
                    author_id: author.id
                }
            }

            let user = users[index_user]

            var user_context = {
                schema: "iglu:com.bookshop/user_context/jsonschema/1-0-0",
                data: {
                    user_id: user.userId,
                    user_name: user.name,
                    phone_number: user.phoneNumber,
                    email: user.email,
                    address: user.address
                }
            }


            setUserId(user_context.data.user_id)
            addGlobalContexts([user_context])
            trackSelfDescribingEvent({
                event: {
                    schema: 'iglu:com.bookshop/product_action/jsonschema/1-0-0',
                    data: {
                        action: action[index_action]
                    }
                },
                context: [product_context]
            })
            removeGlobalContexts([user_context])
        }
    }



    render() {
        const { users, books, action} = this.state;
        const div_style = {
            display: 'flex',
            backgroundColor: "white",
            padding: "10px",
            width: '100%',
            height: '500px',
            fontFamily: "Arial",
            justifyContent: "center"
        };

        const button_style = {
            backgroundColor: "Red",
            width: '200px',
            height: '50px',
            fontSize: '20px',
            padding: "10px",
            fontFamily: "Arial",
            margin: 'auto'
        };
        return (
            <div style={div_style}>
                <Button style={button_style} onClick={() => this.genEvent(users, books, action)}>GenEvent</Button>
            </div>
        )
    }
}
const mapStateToProps = state => ({
})

const mapDispatchToProps = dispatch => {
    return ({
    })
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(RandomEvent)