import React, { Component } from 'react'
import * as accountActions from '../actions' // eslint-disable-line
import { connect } from 'react-redux'
import { Col, Form, FormGroup, FormControl, ControlLabel } from 'react-bootstrap'
import Modal from 'react-awesome-modal'

import '../css/styles.css'
import '../css/oswald.css'
import '../css/open-sans.css'
import '../css/App.css'

const util = require('util')  // eslint-disable-line

const FormPayment = (props) => {
    let sendReceive = (props.senderType === 'VENDOR') ? 'Bill To' : 'Pay To';

    return (
        <Form>
            <FormGroup controlId="formBasicText">
                <Col sm={12}><ControlLabel>Register a payment amount - {sendReceive} address - and a quick description of your payment!</ControlLabel></Col>
                <Col sm={8}><FormControl type="text" value={props.otherAddress} name="otherAddress" onChange={ event=> { props.handleInputChange(event); }} /></Col>
            </FormGroup>
            <FormGroup>
                <Col sm={3}><FormControl type="number" name="amount" value={props.amount} onChange={ event => { props.handleInputChange(event); }} /></Col>
            </FormGroup>
            <FormGroup>
                <Col sm={8}><FormControl type="textarea" name="memo" value={props.memo} onChange={ event => { props.handleInputChange(event); }} /></Col>
            </FormGroup>
        </Form>
    );
}

class ModalPayment extends Component {
  constructor(props) {
    super(props);

    //use local state for UI stuff ONLY
    this.state = {
      otherAddress: '0xFFFFF',
      amount: 0.00,
      memo: 'Payment Description'
    }
  }

  //#region events
  handleSubmit = () => {
      if (this.state.otherAddress !== '' && this.state.amount !== 0.0 && this.state.memo !== '') {
          if (this.props.accounts.web3.isConnected()) {
              this.props.addPayment(this.state.otherAddress, this.state.amount, this.state.memo);
          }
      }
  }

  handleInputChange = (e) => {
    this.setState({ [e.target.name]: e.target.value })
  }
  //#endregion

  render() {
    const {
        otherAddress,
        amount,
        memo
    } = this.state;

    return (
      <section>
        <Modal aria={{labelledby: "heading", describedby: "full_description"}} visible={this.props.visible} effect="fadeInUp">
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title">Register Now!</h5>
                    <a href="#" onClick={ () => { this.props.toggleModal() }}>&times;</a>
                </div>
                <div className="modal-body">
                    <FormPayment senderType={this.props.accounts.SenderType} handleInputChange={this.handleInputChange}
                        otherAddress={otherAddress} amount={amount} memo={memo} />
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-primary" onClick={ () => { this.handleSubmit() }}>Add Payment</button>
                    <button type="button" className="btn btn-secondary" onClick={ () => { this.props.toggleModal() }}>Close</button>
                </div>
            </div>
        </Modal>
      </section>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return { 
    accounts: state.accounts
  }
}

//needs more work done.
function mapDispatchToProps(dispatch) {
  return {
    addPayment: (inputAddress, amount, memo) => { dispatch(accountActions.addPaymentToUser(inputAddress, amount, memo)); }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ModalPayment)