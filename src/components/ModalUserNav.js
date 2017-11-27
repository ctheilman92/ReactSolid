import React, { Component } from 'react'
import { RadioGroup, Radio } from 'react-radio-group'
import * as accountActions from '../actions' // eslint-disable-line
import { connect } from 'react-redux'
import Modal from 'react-awesome-modal'

import '../css/styles.css'
import '../css/oswald.css'
import '../css/open-sans.css'
import '../css/App.css'

const util = require('util')  // eslint-disable-line


const FormFrame = (props) => {
  if (!props.didRegister) {
    return (
      <form className="form">
        <div className="flexContainer">
          <label style={{ 'fontSize': '20px', 'paddingTop': '.2em', 'marginRight': '.3em' }} htmlFor="unpl">UserName</label>
          <input size="20" className="form-control mr-sm-2" type="text" id="unpl" name="unpl" placeholder=""
                  onChange={(event) => {props.handleOnChangePL(event); }} value={props.unpl} />
        </div>
        <div className="flushContainer">
          <label style={{ 'fontSize': '20px' }} htmlFor="radioGroup">What kind of account is this</label>
          <br />
          <RadioGroup style={{ 'paddingLeft': '1em' }} name="AccountType" selectedValue={props.selectedRadio}>
            <Radio onChange={event => { props.handleOnChangeRadioSelect(event); }} value="personal" /><i> Personal</i>
            <Radio onChange={event => { props.handleOnChangeRadioSelect(event); }} style={{ 'marginLeft': '2em' }} value="commercial" /><i> Commercial</i>
          </RadioGroup>
        </div>
      </form>
    );
  }
  else {
    return (
      <div className="flexContainer">
        <h4>YOU'RE REGISTERED LETS GET STARTED</h4>
      </div>
    );
  }
}
  

class ModalUserNav extends Component {
  constructor(props) {
    super(props);

    //use local state for UI stuff ONLY
    this.state = {
      unpl: 'UserName',
      isVendor: false,
      selectedRadio: null,
      errorCode: 'ERROR: there was an issue with the input',
      errorVisible: false
    }
  }

  //#region events
  togglError = () => {
    this.setState(prevstate => ({
      errorVisible: !prevstate.errorVisible
    }));
  }

  handleOnChangePL = (e) => {
    this.setState({ [e.target.name]: e.target.value })
  }

  handleOnChangeRadioSelect = (e) => {
    let selectedVendor = (e.target.value === "personal") ? false : true;
    this.setState(
      { selectedRadio: e.target.value,
        isVendor: selectedVendor
      }
    )

  }

  handleSubmit = () => {
    if (this.state.unpl !== "" && this.state.isVendor != null) {
      if (this.props.accounts.web3.isConnected()) {
        this.props.registerUser(this.state.unpl, this.state.isVendor);
      }
    }
    else {
      //if the input is empty update the error code and show
      console.log('registration failed!')
      this.setState({
        errorCode: 'REGISTRATION ERR: empty handles are not allowed!',
        errorVisible: true
      })
    }
  }
  //#endregion

  render() {
    const {
      unpl,
      selectedRadio,
      errorCode,
      errorVisible
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
                  <FormFrame handleOnChangePL={this.handleOnChangePL} handleSubmit={this.handleSubmit} handleOnChangeRadioSelect={this.handleOnChangeRadioSelect}
                    unpl={unpl} didRegister={this.props.accounts.isRegisteredUser} selectedRadio={selectedRadio} />
                  <div style={{margin: '1em'}}>
                  {
                    this.state.errorVisible
                      ? <p style={{color: 'red'}}><b>{this.state.errorCode}</b></p>
                      : null
                  }
                  </div>
                </div>
                <div className="modal-footer">
                  { !this.props.accounts.isRegisteredUser
                    ? <button type="button" className="btn btn-primary" onClick={ () => { this.handleSubmit() }}>Register</button> 
                    : null
                  }
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
    registerUser: (handle, isVendor) => { dispatch(accountActions.registerNewUser(handle, isVendor)); }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ModalUserNav)