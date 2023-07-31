import axios from 'axios'
import storeConfig from '../config/storage.config'
import { profileTypes } from '../constants/action.types'
import { BACKEND_PORT } from '../config/application.config'
require('dotenv').config();

const BACKEND_HOST = process.env.REACT_APP_BACKEND_HOST || 'localhost'

export const auth = () => async (dispatch, getState) => {
    if(storeConfig.getUserId() === null){
        dispatch(setAuthFail())
        return false
    }
    try {
        await axios.post(`http://${BACKEND_HOST}:${BACKEND_PORT}/auth`, {
            userId: storeConfig.getUserId(),
            token: storeConfig.getToken(),
        })
    }
    catch (err) {
        dispatch(setAuthFail())
        return false
    }
    dispatch(setAuthSuccess())
    return true
}
export const setAuthSuccess = () => ({
    type: profileTypes.SET_AUTH_LOGIN_SUCCESS
})
export const setAuthFail = () => ({
    type: profileTypes.SET_AUTH_LOGIN_FAIL
})

export const setUpdateInforSuccess = () => ({
    type:  profileTypes.UPDATE_INFOR_USER_SUCCESS
})
export const setUpdateInforFail = () => ({
    type:  profileTypes.UPDATE_INFOR_USER_FAIL
})
export const resetProfile = () => ({
    type:  profileTypes.RESET_PROFILE
})
export const updateInfor = (email, firstName, lastName, address, phone_number ) => async (dispatch, getState) => {
    let res
    try {
            res =  await axios.post(`http://${BACKEND_HOST}:${BACKEND_PORT}/user/updateinfor`, {
            email: email,
            firstName: firstName,
            lastName: lastName,
            address: address,
            phone_number: phone_number
        })
    }
    catch (err) {
        console.log(err)
        dispatch(setUpdateInforFail())  
        return false
    }
    storeConfig.clear()
    storeConfig.setToken(res.data.token)
    storeConfig.setUser(res.data.user)
    dispatch(setUpdateInforSuccess())
    return true
}