import axios from 'axios'
import { bookTypes } from '../constants/action.types'
import { BACKEND_PORT } from '../config/application.config'
require('dotenv').config();

const BACKEND_HOST = process.env.REACT_APP_BACKEND_HOST || 'localhost'

export const getBook = () => async (dispatch, getState) => {
    let res
    try {
        res = await axios.get(`http://${BACKEND_HOST}:${BACKEND_PORT}/book/` + getState().bookReducers.book.page)
    }
    catch (err) {
        console.log(err)
        return
    }
    dispatch(setBook(res.data.data.books))
    dispatch(setTotalPage(res.data.data.totalPage))
}
export const setBook = (data) => ({
    type: bookTypes.SET_BOOK,
    data
})
export const setPage = (page) => ({
    type: bookTypes.SET_PAGE,
    page
})
export const setTotalPage = (totalpage) => ({
    type: bookTypes.SET_TOTAL_PAGE,
    totalpage
})
export const authorSetPage = (page) => ({
    type: bookTypes.AUTHOR_SET_PAGE,
    page
})
export const authorSetTotalPage = (totalpage) => ({
    type: bookTypes.AUTHOR_SET_TOTAL_PAGE,
    totalpage
})
export const categorySetPage = (page) => ({
    type: bookTypes.CATEGORY_SET_PAGE,
    page
})
export const categorySetTotalPage = (totalpage) => ({
    type: bookTypes.CATEGORY_SET_TOTAL_PAGE,
    totalpage
})
export const publisherSetPage = (page) => ({
    type: bookTypes.PUBLISHER_SET_PAGE,
    page
})
export const publisherSetTotalPage = (totalpage) => ({
    type: bookTypes.PUBLISHER_SET_TOTAL_PAGE,
    totalpage
})
export const deleteBook = (id) => async(dispatch, getState) => {
    let res
    try {
        res = await axios.get(`http://${BACKEND_HOST}:${BACKEND_PORT}/admin/deletebook/` +id)
    }
    catch (err) {
        console.log(err)
        return
    }
    console.log(res)
    dispatch(getBook())
}

export const getCategory = () => async (dispatch, getState) =>  {
    let res
    try {
        res = await axios.get(`http://${BACKEND_HOST}:${BACKEND_PORT}/category/` + getState().bookReducers.category.page)
    }
    catch (err) {
        return
    }
    dispatch(setCategory(res.data.data.categories))
    dispatch(categorySetTotalPage(res.data.data.totalPage))
}
export const getAllCategory = () => async (dispatch, getState) =>  {
    let res
    try {
        res = await axios.get(`http://${BACKEND_HOST}:${BACKEND_PORT}/all/category/`)
    }
    catch (err) {
        return
    }
    dispatch(setCategory(res.data.data))
}

export const getPublisher = () => async (dispatch, getState) => {
    let res
    try {
        res = await axios.get(`http://${BACKEND_HOST}:${BACKEND_PORT}/publisher/` + getState().bookReducers.publisher.page)
    }
    catch (err) {
        return
    }
    dispatch(setPublisher(res.data.data.publishers))
    dispatch(publisherSetTotalPage(res.data.data.totalPage))
}

export const getAllPublisher = () => async (dispatch, getState) => {
    let res
    try {
        res = await axios.get(`http://${BACKEND_HOST}:${BACKEND_PORT}/all/publisher/`)
    }
    catch (err) {
        return
    }
    dispatch(setPublisher(res.data.data))
}

export const getAuthor = () => async (dispatch, getState) => {
    let res
    try {
        res = await axios.get(`http://${BACKEND_HOST}:${BACKEND_PORT}/author/` + getState().bookReducers.author.page)
    }
    catch(err) {
        return
    }
    dispatch(setAuthor(res.data.data.authors))
    dispatch(authorSetTotalPage(res.data.data.totalPage))
}

export const getAllAuthor = () => async (dispatch, getState) => {
    let res
    try {
        res = await axios.get(`http://${BACKEND_HOST}:${BACKEND_PORT}/all/author/`)
    }
    catch(err) {
        return
    }
    dispatch(setAuthor(res.data.data))
}

export const setCategory = (data) => ({
    type: bookTypes.SET_CATEGORY_BOOK,
    data
})

export const setPublisher = (data) => ({
    type: bookTypes.SET_PUBLISHSER,
    data
})

export const setAuthor = (data) => ({
    type: bookTypes.SET_AUTHOR,
    data
})
export const addCategorySuccess = () =>({
    type: bookTypes.ADD_CATEGORY_SUCCESS
})
export const addCategotyFail = () => ({
    type: bookTypes.ADD_CATEGORY_FAIL
})
export const updateCategorySuccess = () => ({
    type: bookTypes.UPDATE_CATEGORY_SUCCESS
})
export const updateCategoryFail = () => ({
    type: bookTypes.UPDATE_CATEGORY_FAIL
})
export const resetCategory = () => ({
    type: bookTypes.RESET_CATEGORY
})
export const addCategory =  (name) => async (dispatch, getState) => {
    dispatch(resetCategory())
    let res
    try {
        res = await axios.post(`http://${BACKEND_HOST}:${BACKEND_PORT}/category`, {
            name: name
        })
    }
    catch(err) {
        dispatch(addCategotyFail())
        return
    } 
    dispatch(addCategorySuccess())
    dispatch(getCategory())
}

export const updateCategory =  (id, name) => async (dispatch, getState) => {
    let res
    try {
        res = await axios.post(`http://${BACKEND_HOST}:${BACKEND_PORT}/category`, {
            id: id,
            name: name
        })
    }
    catch(err) {
        dispatch(updateCategoryFail())
        return
    } 
    dispatch(updateCategorySuccess())
    dispatch(getCategory())
}
export const addAuthorSuccess = () =>({
    type: bookTypes.ADD_AUTHOR_SUCCESS
})
export const addAuthorFail = () => ({
    type: bookTypes.ADD_AUTHOR_FAIL
})
export const updateAuthorSuccess = () => ({
    type: bookTypes.UPDATE_AUTHOR_SUCCESS
})
export const updateAuthorFail = () => ({
    type: bookTypes.UPDATE_AUTHOR_FAIL
})
export const resetAuthor = () => ({
    type: bookTypes.RESET_AUTHOR
})
export const addAuthor =  (name) => async (dispatch, getState) => {
    dispatch(resetAuthor())
    let res
    try {
        res = await axios.post(`http://${BACKEND_HOST}:${BACKEND_PORT}/author`, {
            name: name
        })
    }
    catch(err) {
        dispatch(addAuthorFail())
        return
    } 
    dispatch(addAuthorSuccess())
    dispatch(getAuthor())
}

export const updateAuthor =  (id, name) => async (dispatch, getState) => {
    let res
    try {
        res = await axios.post(`http://${BACKEND_HOST}:${BACKEND_PORT}/author/` + id, {
            name: name
        })
    }
    catch(err) {
        dispatch(updateAuthorFail())
        return
    } 
    dispatch(updateAuthorSuccess())
    dispatch(getAuthor())
}
export const addPublisherSuccess = () =>({
    type: bookTypes.ADD_PUBLISHER_SUCCESS
})
export const addPublisherFail = () => ({
    type: bookTypes.ADD_PUBLISHER_FAIL
})
export const updatePublisherSuccess = () => ({
    type: bookTypes.UPDATE_PUBLISHER_SUCCESS
})
export const updatePublisherFail = () => ({
    type: bookTypes.UPDATE_PUBLISHER_FAIL
})
export const resetPublisher = () => ({
    type: bookTypes.RESET_PUBLISHER
})
export const addPublisher =  (name) => async (dispatch, getState) => {
    dispatch(resetPublisher())
    let res
    try {
        res = await axios.post(`http://${BACKEND_HOST}:${BACKEND_PORT}/publisher`, {
            name: name
        })
    }
    catch(err) {
        dispatch(addPublisherFail())
        return
    } 
    dispatch(addPublisherSuccess())
    dispatch(getPublisher())
}

export const updatePublisher =  (id, name) => async (dispatch, getState) => {
    let res
    try {
        res = await axios.post(`http://${BACKEND_HOST}:${BACKEND_PORT}/publisher/` + id, {
            id: id,
            name: name
        })
    }
    catch(err) {
        dispatch(updatePublisherFail())
        return
    } 
    dispatch(updatePublisherSuccess())
    dispatch(getPublisher())
}
export const backPage = () => (dispatch, getState) => {
    let page = getState().bookReducers.book.page
    if(page > 1) {
        dispatch(setPage(parseInt(page) - 1))
    }
}

export const nextPage = () => (dispatch, getState) => {
    let page = getState().bookReducers.author.page
    let totalpage = getState().bookReducers.author.totalpage
    if(page < totalpage) {
        dispatch(setPage(parseInt(page) + 1))
    }
}
export const authorBackPage = () => (dispatch, getState) => {
    let page = getState().bookReducers.book.page
    if(page > 1) {
        dispatch(authorSetPage(parseInt(page) - 1))
    }
}

export const authorNextPage = () => (dispatch, getState) => {
    let page = getState().bookReducers.author.page
    let totalpage = getState().bookReducers.author.totalpage
    if(page < totalpage) {
        dispatch(authorSetPage(parseInt(page) + 1))
    }
}
export const categoryBackPage = () => (dispatch, getState) => {
    let page = getState().bookReducers.category.page
    if(page > 1) {
        dispatch(categorySetPage(parseInt(page) - 1))
    }
}

export const categoryNextPage = () => (dispatch, getState) => {
    let page = getState().bookReducers.category.page
    let totalpage = getState().bookReducers.category.totalpage
    if(page < totalpage) {
        dispatch(categorySetPage(parseInt(page) + 1))
    }
}
export const publisherBackPage = () => (dispatch, getState) => {
    let page = getState().bookReducers.publisher.page
    if(page > 1) {
        dispatch(publisherSetPage(parseInt(page) - 1))
    }
}

export const publisherNextPage = () => (dispatch, getState) => {
    let page = getState().bookReducers.publisher.page
    let totalpage = getState().bookReducers.publisher.totalpage
    if(page < totalpage) {
        dispatch(publisherSetPage(parseInt(page) + 1))
    }
}
export const billBackPage = () => (dispatch, getState) => {
    let page = getState().bookReducers.bill.page
    if(page > 1) {
        dispatch(billSetPage(parseInt(page) - 1))
    }
}

export const billNextPage = () => (dispatch, getState) => {
    let page = getState().bookReducers.bill.page
    let totalpage = getState().bookReducers.bill.totalpage
    if(page < totalpage) {
        dispatch(billSetPage(parseInt(page) + 1))
    }
}
export const addBookSuccess = () => ({
    type: bookTypes.ADD_BOOK_SUCCESS
})
export const addBookFail = () => ({
    type: bookTypes.ADD_BOOK_FAIL
})
export const updateBookSuccess = () => ({
    type: bookTypes.UPDATE_BOOK_SUCCESS
})
export const updateBookFail = () => ({
    type: bookTypes.UPDATE_BOOK_FAIL
})
export const addBook = (id_category, name, price, release_date, describe, id_nsx, id_author, file) =>
 async (dispatch, getState) => {
    const dateStr = release_date.toString().replaceAll("-", "/")
    console.log(dateStr)
    fetch(`http://${BACKEND_HOST}:${BACKEND_PORT}/book`, {
        method: 'POST',
        headers: {
            'accept': '*/*',
            'Content-Type': 'application/json',
            "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
            authorIds: id_author,
            categoryIds: id_category,
            description: describe,
            name: name,
            price: price,
            publisherId: parseInt(id_nsx),
            releaseDate: dateStr,
            urlImage: file
        }),
        credentials: "same-origin",
    })
        .then(response => {
            return response.json()
        })
        .then(data => {
            console.log("hello")
        })
        .catch((error) => {
            dispatch(addBookFail())
        })
    dispatch(addBookSuccess())
    dispatch(getBook())
}
export const updateBook = (id, name, id_category, price, release_date, describe, id_nsx, id_author, file) => async (dispatch, getState) => {
    let data = new FormData()
    data.append('file', file)
    data.append('id', id)
    data.append('id_category', id_category) 
    data.append('name', name) 
    data.append('price', price)  
    data.append('release_date', release_date)
    data.append('describe', describe)
    data.append('id_nsx', id_nsx)
    data.append('id_author', id_author)
    let res
    try {
        res = await axios.post(`http://${BACKEND_HOST}:${BACKEND_PORT}/admin/updatebook`, data)
    }
    catch(err) {
        dispatch(updateBookFail())
        return
    } 
    dispatch(updateBookSuccess())
    dispatch(getBook())
}
export const setBill = (data) => ({
    type: bookTypes.BILL_SET_DATA,
    data
})
export const billSetPage = (page) => ({
    type: bookTypes.BILL_SET_PAGE,
    page
})
export const billSetTotalPage = (totalpage) => ({
    type: bookTypes.BILL_SET_TOTAL_PAGE,
    totalpage
})
export const getBill = (status) => async(dispatch, getState) => {
    let link = `http://${BACKEND_HOST}:${BACKEND_PORT}/bill/status/99`
    if(status === "0") {
        link = `http://${BACKEND_HOST}:${BACKEND_PORT}/bill/status/0`
    }
    if(status === "1") {
        link = `http://${BACKEND_HOST}:${BACKEND_PORT}/bill/status/1`
    }
    let res = null
    try {
       res =  await axios.get(link)
    }
    catch(err) {
        return
    }
    dispatch(setBill(res.data.data))
    dispatch(billSetTotalPage(res.data.totalPage))

}
export const updateIssendSuccess = () => ({
    type: bookTypes.UPDATE_ISSEND_SUCCESS
})
export const updateIssendFail = () => ({
    type: bookTypes.UPDATE_ISSEND_FAIL
})

export const updateIssend = (name,id) => async (dispatch, getState) => {
    let res
    try {
        console.log(typeof name);
        res = await axios.post(`http://${BACKEND_HOST}:${BACKEND_PORT}/bill/updateissend`, {
        name: name,
        id:id
        })
    }
    catch(err) {
        
        dispatch(updateIssendFail())
        return
    } 
    dispatch(updateIssendSuccess())
}