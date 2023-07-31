import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import ProductDetail from '../components/product.detail/product.detail'
import * as productActions from '../actions/product.action'
import * as homeActions from '../actions/home.action'
import * as userActions from '../actions/user.action'
import Loading from '../components/loading/loading'
import storeConfig from "../config/storage.config"
import { getUserId } from '../config/storage.config'

// snowplow tracking
import { trackSelfDescribingEvent } from '@snowplow/browser-tracker';
import { setUserId } from '@snowplow/browser-tracker'

class ProductDetailContainer extends Component {
    constructor(props) {
        super(props)

    }
    componentWillMount() {
        this.props.actions.auth()
        this.props.homeActions.getCategory()
        this.props.homeActions.getPublisher()
        this.props.productActions.getBookDetail(this.props.match.params.id)
        this.props.productActions.getBookRelated(this.props.match.params.id)
        this.props.productActions.getCommentByIDBook(this.props.match.params.id)

    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.mproductDetail !== null) {
            this.props.productActions.getNameCategoryByID(nextProps.mproductDetail.categories[0].id)
            this.props.productActions.getNamePubliserByID(nextProps.mproductDetail.publisher.id)
            this.props.productActions.getNameAuthorByID(nextProps.mproductDetail.authors[0].id)
        }
        if (nextProps.page !== this.props.page) {
            this.props.productActions.getCommentByIDBook(this.props.match.params.id)
        }
    }

    trackingAddProductToCart(product) {
        let book = this.props.bookrelated
        var category = book.categories[0]
        var publisher = book.publisher
        var author = book.authors[0]

        var product_context = {
            schema: "iglu:com.bookshop/product_context/jsonschema/1-0-0",
            data: {
                product_id: book.id, // comment cho m sua id
                product_name: book.name,
                quantity: parseInt(product.count),
                price: book.price,
                category_id: category.id,
                publisher_id: publisher.id,
                author_id: author.id
            }
        }

        setUserId(getUserId());
        trackSelfDescribingEvent({
            event: {
                schema: 'iglu:com.bookshop/product_action/jsonschema/1-0-0',
                data: {
                    action: "add"
                }
            },
            context: [product_context]
        })

        // add product to cart
        this.props.productActions.addToCart(product)
    }

    trackingCommentProduct(user_id, comment, id) {
        let book = this.props.bookrelated
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

        setUserId(getUserId());
        trackSelfDescribingEvent({
            event: {
                schema: 'iglu:com.bookshop/product_action/jsonschema/1-0-0',
                data: {
                    action: "comment",
                    extra: comment
                }
            },
            context: [product_context]
        })

        this.props.productActions.submitComment(user_id, comment, id)
    }

    render() {
        if (this.props.mproductDetail && this.props.nameCategory && this.props.namePublicsher && this.props.nameAuthor) {
            return (
                <div>
                    <ProductDetail
                        category={this.props.category}
                        publisher={this.props.publisher}
                        mproductDetail={this.props.mproductDetail}
                        nameCategory={this.props.nameCategory}
                        namePublicsher={this.props.namePublicsher}
                        islogin={this.props.islogin}
                        setSearchText={(value) => this.props.homeActions.setSearchText(value)}
                        sortType={this.props.sortType}
                        setSortType={(value) => this.props.homeActions.setSortType(value)}
                        searchTextSubmit={() => this.props.homeActions.searchTextSubmit()}
                        bookrelated={this.props.bookrelated}
                        logout={() => this.props.actions.logout()}
                        id_book={this.props.match.params.id}
                        submitComment={(user_id, comment, id) => this.trackingCommentProduct(user_id, comment, id)}
                        comment={this.props.comment}
                        nameAuthor={this.props.nameAuthor}
                        addToCart={(product) => this.trackingAddProductToCart(product)}
                        totalpage={this.props.totalpage}
                        page={this.props.page}
                        backPage={() => this.props.productActions.backPage()}
                        nextPage={() => this.props.productActions.nextPage()}
                        setPage={(page) => this.props.productActions.setPage(page)}
                        history={this.props.history}
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
    category: state.homeReducers.category.data,
    publisher: state.homeReducers.publisher.data,
    mproductDetail: state.productReducers.product.productDetail,
    nameCategory: state.productReducers.product.nameCategory,
    namePublicsher: state.productReducers.product.namePublicsher,
    nameAuthor: state.productReducers.product.nameAuthor,
    islogin: state.userReducers.login.islogin,
    bookrelated: state.productReducers.product.bookrelated,
    comment: state.productReducers.product.comment,
    totalpage: state.productReducers.product.totalpage,
    page: state.productReducers.product.page,
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
    mapDispatchToProps,
)(ProductDetailContainer)