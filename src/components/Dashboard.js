import { connect } from 'react-redux' 
import React, { Component } from 'react'
import * as accountActions from '../actions' // eslint-disable-line
import getEtherValue from '../utils/unitConverter';
import ModalPayment from './ModalPayment'
import { Table } from 'react-bootstrap'
import Modal from 'react-awesome-modal'

import '../css/pure-min.css'
import '../css/Dashboard.css'


const ModalConfirmPayment = (props) => {
  return (
    <section>
      <Modal aria={{labelledby: "heading", describedby: "full_description"}} visible={props.visible} effect="fadeInUp">
          <div className="modal-content">
              <div className="modal-body">
                <div className="flexContainer">
                  <h4>Are you sure you want to pay this?</h4>
                </div>
                <div className="flexContainer">
                  <button style={{ 'marginRight': '16px' }} type="button" className="btn btn-lg btn-primary" onClick={ () => { props.handleProcessPayout(); props.toggleModal(); }}>yeah let's go!</button>
                  <button type="button" className="btn btn-lg btn-secondary" onClick={ () => { props.toggleModal(); }}>Wait I'm broke!</button>
                </div>
              </div>
          </div>
      </Modal>
    </section>
  );
}


class Dashboard extends Component {
    constructor(props) {
      super(props);

      this.state = {
        addPaymentModalOpen: false,
        confirmPayoutModalOpen: false,
        selectedPayment: null
      };
    }
   
   //for shorthand use
   payments = (this.props.accounts.SenderPayments).sort((a, b) => { return a.isPaid - b.isPaid });

   //#region RENDER methods
   renderPaymentsTable = () => {
     return (
      <div>
        <h4>Your Payments</h4>
        <div className="flexContainer">
        {
          (this.payments.length > 0) 
          ? <Table bordered responsive>
            <thead>
              <th style={{ 'width': '7px' }}>Status</th>
              <th style={{ 'width': '10px' }}>{this.setUserHeaderType()}</th>
              <th>Memo</th>
              <th style={{ 'width': '12px' }}>Amount</th>
              { 
                (this.props.accounts.SenderType !== 'VENDOR') 
                ? <th style={{ 'width': '8px' }}>PAY</th> 
                : null 
              }
            </thead>
            <tbody>

              {this.payments.map((pmnt,key) => {
                return (
                  <tr> 
                    <td><li className="list-unstyled"><span className={this.setStatusClass(pmnt.isPaid)}>{this.setStatusLabel(pmnt.isPaid)}</span></li></td>
                    <td>{pmnt.partyAddress}</td>
                    <td>{pmnt.memo}</td>
                    <td>{getEtherValue(pmnt.amount)}</td>
                    { 
                      (this.props.accounts.SenderType !== 'VENDOR') 
                      ? <td><i style={{ 'padding': '4px' }} className={this.setPayableClass(pmnt.isPaid)} aria-hidden="true" onClick={ () => { if (!pmnt.isPaid) { this.selectStatePayment(pmnt); this.toggleConfirmPayoutModal(); }}}></i></td>
                      : null 
                    }
                  </tr>
                );
              })}

            </tbody>
          </Table>
          : <h4>Well this is awkward...you don't have any bills to pay!?</h4>
        }
        </div>
        <div className="flexContainer">
          <button type="button" className="btn btn-lg btn-primary" onClick={ () => { this.toggleAddPaymentModal(); }}>Add a New Payment</button>
        </div>
      </div>
     );
   }

   //#region UI methods
   setUserHeaderType = () => {
     if (this.props.accounts.SenderType === 'VENDOR') {
        return 'Bill to';
     }
     else {
       return 'Pay to';
     }
   }

   setPayableClass = (status) => {
    switch (status) {
      case true:
        return "fa fa-lg fa-times-rectangle"
      case false:
        return "fa fa-lg fa-btc"
      default:
        return "fa fa-lg fa-times-rectangle"
    }
   }

   setStatusClass = (status) => {
      switch (status) {
        case true:
          return "status green"
        case false:
          return "status red"
        default:
          return "status yellow"
      }
    }

    setStatusLabel = (status) => {
      switch (status) {
        case true:
          return "COMPLETED"
        case false:
          return "INCOMPLETE"
        default:
          return "PENDING"
      }
    }

    toggleAddPaymentModal = () => {
      this.setState(prevState => ({
        addPaymentModalOpen: !prevState.addPaymentModalOpen
      }));
    }

    toggleConfirmPayoutModal = () => {
      if (this.state.selectedPayment !== null) {
        this.setState({ selectedPayment: null });
      }
      this.setState(prevState => ({
        confirmPayoutModalOpen: !prevState.confirmPayoutModalOpen
      }));
    }

    selectStatePayment = (pmnt) => {
      this.setState({ selectedPayment: pmnt });
    }

    handleProcessPayout = () => {
      if (this.state.selectedPayment !== null) {
        this.props.processPayout(this.state.selectedPayment);
      }
    }
    //#endregion

    render() {
      if (this.props.accounts.isRegisteredUser) {
        return (
          <div>
            <h3>Welcome {this.props.accounts.SenderHandle}!</h3>
            <div className="flexContainer">
              { 
                (this.props.accounts.SenderType !== 'VENDOR') 
                  ? <ModalConfirmPayment visible={this.state.confirmPayoutModalOpen} pmnt={this.state.selectedPayment}
                      toggleModal={this.toggleConfirmPayoutModal} handleProcessPayout={this.handleProcessPayout} /> 
                  : null 
              }
              <ModalPayment visible={this.state.addPaymentModalOpen} toggleModal={this.toggleAddPaymentModal} />
            </div>
            <this.renderPaymentsTable />
          </div>
        )
      }
      else {
        return (
          <div>
            <div className="flexContainer">
              <h3>There's nothing to report yet.</h3>
            </div>
            <div className="flexContainer">
              <h4>Register now to get started</h4>
            </div>
          </div>
        )
      }
    }
  }

  const mapStateToProps = (state, ownProps) => {
    return { 
      accounts: state.accounts
    }
  }
  
  //needs more work done.
  function mapDispatchToProps (dispatch) {
    return {
      processPayout: (pmnt) => { dispatch(accountActions.processPayout(pmnt)); }
    }
  }
  
  export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)
  
