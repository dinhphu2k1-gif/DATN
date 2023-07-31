import axios from 'axios'
import { homeTypes, sortTypes } from '../constants/action.types'
import { BACKEND_PORT } from '../config/application.config'
require('dotenv').config();

const BACKEND_HOST = process.env.REACT_APP_BACKEND_HOST || 'localhost'

export const getCategory = () => async (dispatch, getState) => {
    let res
    try {
        res = await axios.get(`http://${BACKEND_HOST}:${BACKEND_PORT}/all/category`)
    }
    catch (err) {
        return
    }
    dispatch(setCategory(res.data.data))
}

export const getPublisher = () => async (dispatch, getState) => {
    let res
    try {
        res = await axios.get(`http://${BACKEND_HOST}:${BACKEND_PORT}/all/publisher`)
    }
    catch (err) {
        return
    }
    dispatch(setPublisher(res.data.data))
}

export const getAuthor = () => async (dispatch, getState) => {
    let res
    try {
        res = await axios.get(`http://${BACKEND_HOST}:${BACKEND_PORT}/all/author`)
    }
    catch (err) {
        return
    }
    dispatch(setAuthor(res.data.data))
}
export const getBook = () => async (dispatch, getState) => {
    let sorttype = 'release_date'
    let sortorder = '-1'
    let sortType = getState().homeReducers.book.sortType
    if (sortType === sortTypes.SORT_DAY_DECREASED) {
        sorttype = 'release_date'
        sortorder = '-1'
    } else if (sortType === sortTypes.SORT_DAY_INCREASED) {
        sorttype = 'release_date'
        sortorder = '1'
    } else if (sortType === sortTypes.SORT_PRICE_DECREASED) {
        sorttype = 'price'
        sortorder = '-1'
    } else if (sortType === sortTypes.SORT_PRICE_INCREASED) {
        sorttype = 'price'
        sortorder = '1'
    } else if (sortType === sortTypes.SORT_SALES_DECREASED) {
        sorttype = 'sales'
        sortorder = '-1'
    } else if (sortType === sortTypes.SORT_SALES_INCREASED) {
        sorttype = 'sales'
        sortorder = '1'
    } else if (sortType === sortTypes.SORT_VIEWS_DECREASED) {
        sorttype = 'view_counts'
        sortorder = '-1'
    } else if (sortType === sortTypes.SORT_VIEWS_INCREASED) {
        sorttype = 'view_counts'
        sortorder = '1'
    }
    let branch = getState().homeReducers.book.branch
    let _link = `http://${BACKEND_HOST}:${BACKEND_PORT}/book/`+ getState().homeReducers.book.page  + "?"
    if (branch === 'category') {
        _link = `http://${BACKEND_HOST}:${BACKEND_PORT}/book/` + getState().homeReducers.book.page + "?categoryId=" +  getState().homeReducers.book.id
    } else if (branch === 'publisher') {
        _link = `http://${BACKEND_HOST}:${BACKEND_PORT}/book`
    } else if (branch === 'author') {
        _link = `http://${BACKEND_HOST}:${BACKEND_PORT}/book`
    }

    if(getState().homeReducers.range !== undefined){
        _link = _link + "&low=" + getState().homeReducers.range.low + "&high=" + getState().homeReducers.range.high
    }
    let res
    try {
        res = await axios.get(_link, {
        })
    }
    catch (err) {
        console.log(err.response)
        return
    }
    dispatch(setBook(res.data.data.books))
    dispatch(setTotalPage(res.data.data.totalPage))
}

export const setBook = (data) => ({
    type: homeTypes.SET_BOOK,
    data
})
export const setPage = (page) => ({
    type: homeTypes.SET_PAGE,
    page
})
export const setTotalPage = (totalpage) => ({
    type: homeTypes.SET_TOTAL_PAGE,
    totalpage
})
export const setCategory = (data) => ({
    type: homeTypes.SET_CATEGORY_BOOK,
    data
})

export const setPublisher = (data) => ({
    type: homeTypes.SET_PUBLISHSER,
    data
})

export const setAuthor = (data) => ({
    type: homeTypes.SET_AUTHOR,
    data
})
export const setIDBranch = (id) => ({
    type: homeTypes.SET_ID_BRANCH,
    id
})
export const backPage = () => (dispatch, getState) => {
    let page = getState().homeReducers.book.page
    if (page > 1) {
        dispatch(setPage(parseInt(page) - 1))
    }
}

export const nextPage = () => (dispatch, getState) => {
    let page = getState().homeReducers.book.page
    let totalpage = getState().homeReducers.book.totalpage
    if (page < totalpage) {
        dispatch(setPage(parseInt(page) + 1))
    }
}
export const setSortType = (sortType) => async (dispatch, getState) => {
    dispatch(setPage(1))
    let sorttype = 'release_date'
    let sortorder = '-1'
    if (sortType === sortTypes.SORT_DAY_DECREASED) {
        sorttype = 'release_date'
        sortorder = '-1'
    } else if (sortType === sortTypes.SORT_DAY_INCREASED) {
        sorttype = 'release_date'
        sortorder = '1'
    } else if (sortType === sortTypes.SORT_PRICE_DECREASED) {
        sorttype = 'price'
        sortorder = '-1'
    } else if (sortType === sortTypes.SORT_PRICE_INCREASED) {
        sorttype = 'price'
        sortorder = '1'
    } else if (sortType === sortTypes.SORT_SALES_DECREASED) {
        sorttype = 'sales'
        sortorder = '-1'
    } else if (sortType === sortTypes.SORT_SALES_INCREASED) {
        sorttype = 'sales'
        sortorder = '1'
    } else if (sortType === sortTypes.SORT_VIEWS_DECREASED) {
        sorttype = 'view_counts'
        sortorder = '-1'
    } else if (sortType === sortTypes.SORT_VIEWS_INCREASED) {
        sorttype = 'view_counts'
        sortorder = '1'
    }
    dispatch(setSort(sortType, sortorder))
    let branch = getState().homeReducers.book.branch
    let _link = `http://${BACKEND_HOST}:${BACKEND_PORT}/book/`+ getState().homeReducers.book.page  + "?"
    if (branch === 'category') {
        _link = `http://${BACKEND_HOST}:${BACKEND_PORT}/book/` + getState().homeReducers.book.page + "?categoryId=" +  getState().homeReducers.book.id
    } else if (branch === 'publisher') {
        _link = `http://${BACKEND_HOST}:${BACKEND_PORT}/book`
    } else if (branch === 'author') {
        _link = `http://${BACKEND_HOST}:${BACKEND_PORT}/book`
    }
    if(getState().homeReducers.range !== undefined){
        _link = _link + "&low=" + getState().homeReducers.range.low + "&high=" + getState().homeReducers.range.high
    }
    let res
    try {
        res = await axios.get(_link, {
        })
    }
    catch (err) {
        console.log(err.response)
        return
    }
    dispatch(setBook(res.data.data.books))
    dispatch(setTotalPage(res.data.data.totalPage))
}
export const setSort = (sortType) => ({
    type: homeTypes.SET_SORT_TYPE,
    sortType
})
export const setRangeType = (range) => async (dispatch, getState) => {
    dispatch(setPage(1))
    let sorttype = 'release_date'
    let sortorder = '-1'
    let sortType = getState().homeReducers.book.sortType
    if (sortType === sortTypes.SORT_DAY_DECREASED) {
        sorttype = 'release_date'
        sortorder = '-1'
    } else if (sortType === sortTypes.SORT_DAY_INCREASED) {
        sorttype = 'release_date'
        sortorder = '1'
    } else if (sortType === sortTypes.SORT_PRICE_DECREASED) {
        sorttype = 'price'
        sortorder = '-1'
    } else if (sortType === sortTypes.SORT_PRICE_INCREASED) {
        sorttype = 'price'
        sortorder = '1'
    } else if (sortType === sortTypes.SORT_SALES_DECREASED) {
        sorttype = 'sales'
        sortorder = '-1'
    } else if (sortType === sortTypes.SORT_SALES_INCREASED) {
        sorttype = 'sales'
        sortorder = '1'
    } else if (sortType === sortTypes.SORT_VIEWS_DECREASED) {
        sorttype = 'view_counts'
        sortorder = '-1'
    } else if (sortType === sortTypes.SORT_VIEWS_INCREASED) {
        sorttype = 'view_counts'
        sortorder = '1'
    }
    let branch = getState().homeReducers.book.branch
    let _link = `http://${BACKEND_HOST}:${BACKEND_PORT}/book/`+ getState().homeReducers.book.page + "?"
    if (branch === 'category') {
        _link = `http://${BACKEND_HOST}:${BACKEND_PORT}/book/` + getState().homeReducers.book.page + "?categoryId=" +  getState().homeReducers.book.id
    } else if (branch === 'publisher') {
        _link = `http://${BACKEND_HOST}:${BACKEND_PORT}/book`
    } else if (branch === 'author') {
        _link = `http://${BACKEND_HOST}:${BACKEND_PORT}/book`
    }

    if(range !== undefined){
        _link = _link + "&low=" + range.low + "&high=" + range.high
    }
    let res
    try {
        res = await axios.get(_link, {
        })
    }
    catch (err) {
        console.log(err.response)
        return
    }
    console.log(JSON.stringify(res))
    dispatch(setRange(range))
    dispatch(setBook(res.data.data.books))
    dispatch(setTotalPage(res.data.data.totalPage))
}

export const setRange = (range) => ({
    type: homeTypes.SET_RANGE,
    range
})
export const setBranch = (branch) => ({
    type: homeTypes.SET_BRANCH_SEARCH_BOOK,
    branch
})
export const setTitle = (title) => ({
    type: homeTypes.SET_NAME_TITLE_ITEM,
    title
})
export const setSearchText = (searchtext) => ({
    type: homeTypes.SET_SEARCH_TEXT,
    searchtext
})

export const branchClick = (branch, id) => async (dispatch, getState) => {
    let _link = `http://${BACKEND_HOST}:${BACKEND_PORT}/book/`+ getState().homeReducers.book.page  + "?"
    if (branch === 'category') {
        _link = `http://${BACKEND_HOST}:${BACKEND_PORT}/book/` + getState().homeReducers.book.page + "?categoryId=" +  getState().homeReducers.book.id
    } else if (branch === 'publisher') {
        _link = `http://${BACKEND_HOST}:${BACKEND_PORT}/book`
    } else if (branch === 'author') {
        _link = `http://${BACKEND_HOST}:${BACKEND_PORT}/book`
    }
    let res

    if(getState().homeReducers.range !== undefined){
        _link = _link + "&low=" + getState().homeReducers.range.low + "&high=" + getState().homeReducers.range.high
    }

    try {
        res = await axios.get(_link, {
        })
    }
    catch (err) {
        return
    }
    dispatch(setSearchText(''))
    dispatch(setBook(res.data.data.books))
    dispatch(setTotalPage(res.data.data.totalPage))
}

export const getSearchText = () => (dispatch, getState) => {
    return getState().homeReducers.book.searchtext;
}

export const searchTextSubmit = () => async (dispatch, getState) => {
    dispatch(setPage(1))
    let sorttype = 'release_date'
    let sortorder = '-1'
    let sortType = getState().homeReducers.book.sortType
    if (sortType === sortTypes.SORT_DAY_DECREASED) {
        sorttype = 'release_date'
        sortorder = '-1'
    } else if (sortType === sortTypes.SORT_DAY_INCREASED) {
        sorttype = 'release_date'
        sortorder = '1'
    } else if (sortType === sortTypes.SORT_PRICE_DECREASED) {
        sorttype = 'price'
        sortorder = '-1'
    } else if (sortType === sortTypes.SORT_PRICE_INCREASED) {
        sorttype = 'price'
        sortorder = '1'
    } else if (sortType === sortTypes.SORT_SALES_DECREASED) {
        sorttype = 'sales'
        sortorder = '-1'
    } else if (sortType === sortTypes.SORT_SALES_INCREASED) {
        sorttype = 'sales'
        sortorder = '1'
    } else if (sortType === sortTypes.SORT_VIEWS_DECREASED) {
        sorttype = 'view_counts'
        sortorder = '-1'
    } else if (sortType === sortTypes.SORT_VIEWS_INCREASED) {
        sorttype = 'view_counts'
        sortorder = '1'
    }
    let branch = getState().homeReducers.book.branch
    let _link = `http://${BACKEND_HOST}:${BACKEND_PORT}/book/`+ getState().homeReducers.book.page  + "?"
    if (branch === 'category') {
        _link = `http://${BACKEND_HOST}:${BACKEND_PORT}/book/` + getState().homeReducers.book.page + "?categoryId=" +  getState().homeReducers.book.id
    } else if (branch === 'publisher') {
        _link = `http://${BACKEND_HOST}:${BACKEND_PORT}/book`
    } else if (branch === 'author') {
        _link = `http://${BACKEND_HOST}:${BACKEND_PORT}/book`
    }

    if(getState().homeReducers.range !== undefined){
        _link = _link + "&low=" + getState().homeReducers.range.low + "&high=" + getState().homeReducers.range.high
    }
    if(getState().homeReducers.book.searchtext !== undefined){
        _link = _link + "&keyword=" + getState().homeReducers.book.searchtext
    }
    let res
    try {
        res = await axios.get(_link, {
        })
    }
    catch (err) {
        console.log(err.response)
        return
    }
    dispatch(setBook(res.data.data.books))
    dispatch(setTotalPage(res.data.data.totalPage))
} 