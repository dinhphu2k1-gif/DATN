import axios from 'axios'
import { productTypes } from '../constants/action.types'
import storeConfig from '../config/storage.config'
import { BACKEND_PORT } from '../config/application.config'
require('dotenv').config();

const BACKEND_HOST = process.env.REACT_APP_BACKEND_HOST || 'localhost'


export const getBookDetail = (id) => async (dispatch, getState) => {
    let res
    try {
        res = await axios.get(`http://${BACKEND_HOST}:${BACKEND_PORT}/detail/book/` + id)
    }
    catch (err) {
        return
    }
    dispatch(setProductDetail(res.data.data))
}

export const getBookRelated = (id) => async (dispatch, getState) => {
    let res
    try {
        res = await axios.get(`http://${BACKEND_HOST}:${BACKEND_PORT}/detail/book/` + id)
    }
    catch (err) {
        return
    }
    dispatch(setBookRelated(res.data.data))
}
export const getNameCategoryByID = (id) => async (dispatch) => {
    let res
    try {
        res = await axios.get(`http://${BACKEND_HOST}:${BACKEND_PORT}/detail/category/` + id)
    }
    catch (err) {
        return
    }
    dispatch(setNameCategory(res.data.data.name))
    return res
}
export const getNamePubliserByID = (id) => async (dispatch) => {
    let res
    try {
        res = await axios.get(`http://${BACKEND_HOST}:${BACKEND_PORT}/detail/publisher/` + id)
    }
    catch (err) {
        return
    }

    dispatch(setNamePubliser(res.data.data.name))
    return res
}
export const getNameAuthorByID = (id) => async (dispatch) => {
    let res
    try {
        res = await axios.get(`http://${BACKEND_HOST}:${BACKEND_PORT}/detail/author/` + id)
    }
    catch (err) {
        return
    }

    dispatch(setNameAuthor(res.data.data.name))
    return res
}
export const setProductDetail = (productDetail) => ({
    type: productTypes.SET_PRODUCT_DETAIL,
    productDetail
})
export const setNameCategory = (name) => ({
    type: productTypes.SET_NAME_CATEGORY,
    name
})
export const setNamePubliser = (name) => ({
    type: productTypes.SET_NAME_PUBLICSHER,
    name
})

export const setBookRelated = (bookrelated) => ({
    type: productTypes.SET_BOOK_RELATED,
    bookrelated
})
export const setNameAuthor = (name) => ({
    type: productTypes.SET_NAME_AUTHOR,
    name
})

export const submitComment = (user_id, comment, id_book) => async (dispatch, getState) => {
    let res
    try {
        res = await axios.post(`http://${BACKEND_HOST}:${BACKEND_PORT}/comment`, {
            book_id: id_book,
            content: comment,
            user_id: user_id
        })
    }
    catch (err) {
        console.log(JSON.stringify(err.response))
        return
    }
    dispatch(getCommentByIDBook(id_book))
}
export const setTotalPage = (totalpage) => ({
    type: productTypes.SET_TOTAL_PAGE,
    totalpage
})
export const setPage = (page) => ({
    type: productTypes.SET_PAGE,
    page
})
export const backPage = () => (dispatch, getState) => {
    let page = getState().productReducers.product.page
    if(page > 1) {
        dispatch(setPage(parseInt(page) - 1))
    }
}

export const nextPage = () => (dispatch, getState) => {
    let page = getState().productReducers.product.page
    let totalpage = getState().productReducers.product.totalpage
    if(page < totalpage) {
        dispatch(setPage(parseInt(page) + 1))
    }
}
export const getCommentByIDBook = (id) => async (dispatch, getState) => {
    let res
    try {
        res = await axios.get(`http://${BACKEND_HOST}:${BACKEND_PORT}/comment?bookId=` + id + "&page=" + getState().productReducers.product.page, {
            })
    }
    catch (err) {
        console.log(JSON.stringify(err.response))
        return
    }
    dispatch(setTotalPage(res.data.data.totalPage))
    dispatch(setComment(res.data.data.comments))
}
export const setComment = (data) => ({
    type: productTypes.SET_COMMENT,
    data
})

export const addToCart = (product) => async (dispatch, getState) => {
    if (getState().userReducers.login.islogin) {
        let res
        try {
            const link = `http://${BACKEND_HOST}:${BACKEND_PORT}/cart/add?userId=` + storeConfig.getUserId() + "&quantity=" + product.count + "&bookId=" + product.id
            res = await axios.get(link, {
            })
        }
        catch (err) {
            console.log(JSON.stringify(err.response))
            return
        }
    } else {
        alert("Bạn cần phải đăng nhập");
        localStorage.setItem("location", window.location.href)
        return (
            window.location.href = "/login_register"
        )
    }
}
