import React, { Component} from 'react'
import axios from 'axios'
import VerifyPayment from '../components/verify.payment/verify.payment'
import NotFound from '../components/404/404'
import { BACKEND_PORT } from '../config/application.config'
require('dotenv').config();

const BACKEND_HOST = process.env.REACT_APP_BACKEND_HOST || 'localhost'

class VerifyPaymentContainer extends Component {
    constructor(props){
        super(props)
        this.state = {
            isconfirm: true
        }
    }
    async componentWillMount() {
        try {
            await axios.get(`http://${BACKEND_HOST}:${BACKEND_PORT}/bill/verify/` + this.props.match.params.token)
        }
        catch(err) {
            console.log(err)
            this.setState({isconfirm: false})
        }
    }
    render() {
        if(this.state.isconfirm) {
            return(
                <VerifyPayment/>
            )
        } else {
            return (
                <NotFound/>
            )
        }
            
    }
}
export default VerifyPaymentContainer