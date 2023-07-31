import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as userActions from "../actions/user.action";
import * as purchaseHistoryActions from '../actions/purchase.history.action'
import HistoryPurchase from '../components/purchase.history/purchase.history'
import storeConfig from "../config/storage.config"

// snowplow tracking
import { trackSelfDescribingEvent } from '@snowplow/browser-tracker';
class HistoryPurchaseContainer extends Component {
    constructor(props) {
        super(props)
    }
    componentWillMount() {
        this.props.actions.auth()
        this.props.purchaseHistoryActions.getPurchaseHitory(1)
    }
    async trackingDeleteBill(id) {
        let bill = await this.props.purchaseHistoryActions.deleteBill(id)

        // if (bill != null) {
        //     trackSelfDescribingEvent({
        //         event: {
        //           schema: 'iglu:com.bookshop/delete_purchase/jsonschema/1-0-0',
        //           data: {
        //             order_id: bill._id,
        //             user_id: storeConfig.getUser().id,
        //             products: bill.products,
        //             address: bill.address,
        //             phone: bill.phone,
        //             name: bill.name,
        //             total: bill.total,
        //             date: bill.date
        //           }
        //         }
        //       })

        //       console.log("bill delete", bill)
        // }
        
    }

    render() {
        return (
            <div>
                <HistoryPurchase
                    islogin={this.props.islogin}
                    logout={() => this.props.actions.logout()}
                    history={this.props.history}
                    purchaseHistory={this.props.purchaseHistory}
                    deleteBill={(id) => this.trackingDeleteBill(id)}
                    getPurchaseHitory={(status) => this.props.purchaseHistoryActions.getPurchaseHitory(status)}
                />
            </div>
        )
    }
}
const mapStateToProps = state => ({
    islogin: state.userReducers.login.islogin,
    purchaseHistory: state.purchaseReducers.purchaseHistory.data
});

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(userActions, dispatch),
        purchaseHistoryActions: bindActionCreators(purchaseHistoryActions, dispatch),
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(HistoryPurchaseContainer);