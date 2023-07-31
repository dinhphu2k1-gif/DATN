import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import axios from 'axios'
import Home from '../components/home/home'
import * as userActions from '../actions/user.action'
import * as homeActions from '../actions/home.action'
import * as productActions from '../actions/product.action'
import Loading from '../components/loading/loading'
import { sortTypes } from '../constants/action.types'
import localStore from '../config/storage.config'
import storeConfig from "../config/storage.config"
import homeReducer from '../reducers/home.reducer'
import { getUserId } from '../config/storage.config'

// snowplow tracking
import { trackSelfDescribingEvent } from '@snowplow/browser-tracker';
import { setUserId } from '@snowplow/browser-tracker'

const { createStore } = require('redux');
const store = createStore(homeReducer);

class HomeContainer extends React.Component {
    constructor(props) {
        super(props)

    }
    componentWillMount() {
        this.props.actions.auth()
        this.props.homeActions.getCategory()
        this.props.homeActions.getPublisher()
        this.props.homeActions.getBook()
        this.props.homeActions.getAuthor()
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.page !== this.props.page) {
            this.props.homeActions.getBook()
        }
    }

    trackingSearchText() {
        this.props.homeActions.searchTextSubmit()

        let searchText = this.props.homeActions.getSearchText();
        if (searchText.length != 0) {
            setUserId(getUserId());
            trackSelfDescribingEvent({
                event: {
                    schema: 'iglu:com.bookshop/search_action/jsonschema/1-0-0',
                    data: {
                        action: "search_text",
                        search_value: searchText
                    }
                }
            })
        }
    }

    trackingSearchValue(range) {
        this.props.homeActions.setRangeType(range)

        setUserId(getUserId());
        trackSelfDescribingEvent({
            event: {
                schema: 'iglu:com.bookshop/search_action/jsonschema/1-0-0',
                data: {
                    action: "search_price",
                    search_value: JSON.stringify(range)
                }
            }
        })
    }

    render() {
        const { category, publisher, book, totalpage } = this.props
        if (category !== null && publisher !== null && book !== null && totalpage !== null) {
            return (
                <div>
                    <Home
                        islogin={this.props.islogin}
                        logout={() => this.props.actions.logout()}
                        category={this.props.category}
                        publisher={this.props.publisher}
                        book={this.props.book}
                        totalpage={this.props.totalpage}
                        backPage={() => this.props.homeActions.backPage()}
                        nextPage={() => this.props.homeActions.nextPage()}
                        setPage={(page) => this.props.homeActions.setPage(page)}
                        page={this.props.page}
                        sortType={this.props.sortType}
                        setSortType={(value) => this.props.homeActions.setSortType(value)}
                        setRangeType={(range) => this.trackingSearchValue(range)}
                        title={this.props.title}
                        setTitle={(title) => this.props.homeActions.setTitle(title)}
                        setBranch={(branch) => this.props.homeActions.setBranch(branch)}
                        branch={this.props.branch}
                        setSearchText={(value) => this.props.homeActions.setSearchText(value)}
                        author={this.props.author}
                        setIDBranch={(id) => this.props.homeActions.setIDBranch(id)}
                        branchClick={(branch, id) => this.props.homeActions.branchClick(branch, id)}
                        history={this.props.history}
                        searchTextSubmit={() => this.trackingSearchText()}
                        addToCart={(product) => this.props.productActions.addToCart(product)}
                    />
                </div>
            )
        }
        else {
            return (
                <Loading />
            )
        }
    }
}
const mapStateToProps = state => ({
    islogin: state.userReducers.login.islogin,
    category: state.homeReducers.category.data,
    publisher: state.homeReducers.publisher.data,
    author: state.homeReducers.author.data,
    book: state.homeReducers.book.data,
    totalpage: state.homeReducers.book.totalpage,
    page: state.homeReducers.book.page,
    sortType: state.homeReducers.book.sortType,
    title: state.homeReducers.book.title,
    branch: state.homeReducers.book.branch
})

const mapDispatchToProps = dispatch => {
    return ({
        actions: bindActionCreators(userActions, dispatch),
        homeActions: bindActionCreators(homeActions, dispatch),
        productActions: bindActionCreators(productActions, dispatch)
    })
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(HomeContainer)