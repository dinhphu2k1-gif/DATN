import React, { Component } from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import LoginRegister from '../components/login.register/login.register'
import * as userActions from '../actions/user.action'
import * as homeActions from '../actions/home.action'
import { BACKEND_PORT } from '../config/application.config'
import jwt_decode from 'jwt-decode'
require('dotenv').config();

const BACKEND_HOST = process.env.REACT_APP_BACKEND_HOST || 'localhost'

class LoginRegisterContainer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            emailLogin: '',
            passwordLogin: '',
            email: '',
            username: '',
            address: '',
            phone: '',
            password: '',
            confirm: '',
            notificationRegister: '',
            notificationLogin: '',

        }
    }
    componentWillMount() {
        this.props.actions.auth()
    }
    isvalidName = (username) => {
        if(username === '')
            return false
        return true
    }
    isvalidPassword = (password) => {
        if (password.length < 6)
            return false
        return true
    }
    isvalidConfirm = (password, confirm) => {
        if (confirm != password)
            return false
        return true
    }
    isvalidEmail = (email) => {
        if (email === '' || email.indexOf('@') === -1 || email.indexOf('.') === -1)
            return false
        return true
    }
    registerSubmit = async () => {
        if (!this.isvalidEmail(this.state.email)) {
            this.setState({ notificationRegister: "Email invalid" })
            return
        } else {
            this.setState({ notificationRegister: '' })
        }
        if (!this.isvalidPassword(this.state.password)) {
            this.setState({ notificationRegister: 'Password invalid' })
            return
        } else {
            this.setState({ notificationRegister: '' })
        }
        if (!this.isvalidConfirm(this.state.password, this.state.confirm)) {
            this.setState({ notificationRegister: 'Confirm invalid' })
            return
        } else {
            this.setState({ notificationRegister: '' })
        }
        if (!this.isvalidName(this.state.username)) {
            this.setState({ notificationRegister: 'Name invalid' })
            return
        } else {
            this.setState({ notificationRegister: '' })
        }
        fetch(`http://${BACKEND_HOST}:${BACKEND_PORT}/user`, {
            method: 'POST',
            headers: {
                'accept': '*/*',
                'Content-Type': 'application/json',
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify({
                email: this.state.email,
                password: this.state.password,
                name: this.state.username,
                address: this.state.address,
                phoneNumber: this.state.phone }),
            credentials: "same-origin",
        })
            .then(response => {
                return response.json()
            })
            .then(data => {
                if (data.code === 200) {
                    this.setState({ notificationRegister: 'Đăng Ký Thành Công' })
                } else  {
                    this.setState({notificationRegister: data.message})
                }
            })
            .catch(error => {
                console.error('Error:', error);
            })
    }

    loginSubmit = async () => {
        if (!this.isvalidEmail(this.state.emailLogin)) {
            this.setState({ notificationLogin: "Email invalid" })
            return
        } else {
            this.setState({ notificationLogin: '' })
        }
        let res
        try {
            res = await axios.post(`http://${BACKEND_HOST}:${BACKEND_PORT}/login`, {
                email: this.state.emailLogin,
                password: this.state.passwordLogin,
            })
        }
        catch (err) {
            if (err.response !== undefined) {
                if (err.response.data.msg === "no_registration_confirmation")
                    this.setState({ notificationLogin: 'Tài Khoản Chưa Được Kích Hoạt, Vui Lòng Vào mail Để Kích Hoạt' })
                else {
                    this.setState({ notificationLogin: 'Email or password invalid' })
                }
            }
            else {
                this.setState({ notificationLogin: 'Some thing went wrong' })
            }
            return
        }
        var decodedToken = jwt_decode(res.data.data.token);
        this.props.actions.loginSuccess(res.data.data.token, decodedToken.user_id)
        this.props.history.push('/')
        if(localStorage.getItem("location") !== null){
            const path = localStorage.getItem("location")
            localStorage.setItem("location", null)
            window.location.href = path
        }
    }
    render() {
        return (
            <div>
                <LoginRegister
                    setEmailogin={(value) => this.setState({ emailLogin: value })}
                    setPasswordlogin={(value) => this.setState({ passwordLogin: value })}
                    setEmail={(value) => this.setState({ email: value })}
                    setUsername={(value) => this.setState({ username: value })}
                    setAddress={(value) => this.setState({ address: value })}
                    setPhone={(value) => this.setState({ phone: value })}
                    notificationRegister={this.state.notificationRegister}
                    notificationLogin={this.state.notificationLogin}
                    setPassword={(value) => this.setState({ password: value })}
                    setConfirm={(value) => this.setState({ confirm: value })}
                    registerSubmit={() => this.registerSubmit()}
                    loginSubmit={() => this.loginSubmit()}
                    islogin={this.props.islogin}
                    logout={() => this.props.actions.logout()}
                    sortType={this.props.sortType}
                    setSortType={(value) => this.props.homeActions.setSortType(value)}
                    setRangeType={(range) => this.props.homeActions.setRangeType(range)}
                    setSearchText={(value) => this.props.homeActions.setSearchText(value)}
                    searchTextSubmit={() => this.props.homeActions.searchTextSubmit()}
                    history={this.props.history}
                />
            </div>
        )

    }
}

const mapStateToProps = state => ({
    islogin: state.userReducers.login.islogin
})

const mapDispatchToProps = dispatch => {
    return ({
        actions: bindActionCreators(userActions, dispatch),
        homeActions: bindActionCreators(homeActions, dispatch)
    })
}
export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(LoginRegisterContainer)