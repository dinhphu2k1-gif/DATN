import { cartTypes } from '../constants/action.types'
import axios from 'axios'
import storeConfig from '../config/storage.config'
import { BACKEND_PORT } from '../config/application.config'
require('dotenv').config();

const BACKEND_HOST = process.env.REACT_APP_BACKEND_HOST || 'localhost'

export const setCart = (data) => ({
    type: cartTypes.SET_CART,
    data
})
export const getCart = () => async (dispatch, getState) => {
    let id_user = storeConfig.getUserId()
    let res
    try {
        res = await axios.get(`http://${BACKEND_HOST}:${BACKEND_PORT}/cart?userId=` + id_user)
    }
    catch (err) {
        console.log(err)
        return
    }
    if (res.data.data.books !== null) {
        dispatch(setCart(res.data.data.books))
    }

}
export const updateProductInCart = (product, quantity) => async (dispatch, getState) => {
    try {
        let link = `http://${BACKEND_HOST}:${BACKEND_PORT}/cart/add?userId=` + storeConfig.getUserId() + "&bookId=" + product.id + "&quantity=" + quantity
        await axios.get(link, {
        })
    }
    catch (err) {
        console.log(err.response)
    }
    dispatch(getCart())
}
export const deteleProductInCart = (product) => async (dispatch, getState) => {
    try {
        let link = `http://${BACKEND_HOST}:${BACKEND_PORT}/cart/add?userId=` + storeConfig.getUserId() + "&bookId=" + product.id + "&quantity=" + -product.quantity
        await axios.get(link, {
        })
    }
    catch (err) {
        console.log(err.response)
    }
    dispatch(getCart())
}


export const paymentSuccess = () => ({
    type: cartTypes.PAYMENT_SUCCESS
})
export const paymentFail = () => ({
    type: cartTypes.PAYMENT_FAIL
})
export const resetPayment = () => ({
    type: cartTypes.RESET_PAYMENT
})
export const payment = (address, phone, name, total) => async (dispatch, getState) => {
    let res = null
    try {
        res = await axios.post(`http://${BACKEND_HOST}:${BACKEND_PORT}/bill?userId=` + storeConfig.getUserId() , {
            address: address,
            phone: phone,
            name: name
            //email: storeConfig.getUser().email
        })
    }
    catch (err) {
        dispatch(paymentFail())
        console.log(err.response)
        dispatch(resetPayment())
        return
    }
    dispatch(paymentSuccess())
    dispatch(resetPayment())
    dispatch(getCart())

    if (res != null) {
        return res.data.bill
    }
    return null
}