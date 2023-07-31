import axios from 'axios'
import storeConfig from '../config/storage.config'
import { purchaseHistoryTypes } from '../constants/action.types'
import { BACKEND_PORT } from '../config/application.config'
require('dotenv').config();

const BACKEND_HOST = process.env.REACT_APP_BACKEND_HOST || 'localhost'

export const setPurchaseHistory = (data) => ({
    type: purchaseHistoryTypes.SET_PURCHASED_HISTORY,
    data
})
export const getPurchaseHitory = (status) => async (dispatch, getState) => {
    let res = null
    let userId = storeConfig.getUserId()
    if (!storeConfig.getUserId()) {
        alert("Bạn cần phải đăng nhập");
        localStorage.setItem("location", window.location.href)
        return (
            window.location.href = "/login_register"
        )

    }
    try {
        res = await axios.get(`http://${BACKEND_HOST}:${BACKEND_PORT}/bill?userId=` + userId + "&status=" + status)
    }
    catch (err) {
        console.log(err)
        return
    }
    dispatch(setPurchaseHistory(res.data.data))
}
export const deleteBill = (id) => async (dispatch, getState) => {
    let res = null;
    try {
        res = await axios.delete(`http://${BACKEND_HOST}:${BACKEND_PORT}/bill/` + id)
    }
    catch (err) {
        console.log(err.response)
    }
    dispatch(getPurchaseHitory(1))

    return res.data.bill;
}
