import React, { Component } from 'react'
import { registerUser } from '../../actions'
import Modal from 'react-awesome-modal'

import '../../css/styles.css'
import '../../css/oswald.css'
import '../../css/open-sans.css'
import '../../css/pure-min.css'
import '../../css/App.css'


//#region inline styles
const btnStyle = {
    margin: '7px',
    borderRadius: '5px',
    height: '2.6em',
    width: '7em',
}


const modalFormView = {
    marginLeft: '1em',
    marginRight: '1em',
    marginBottom: '1em'
}
  //#endregion
  

class ModalUserNav extends Component {
  constructor(props) {
    super(props);
    this.store = this.props.store;

    //use local state for UI stuff ONLY
    this.state = {
      unpl: "UserName",
      pwpl: "Password",
      errorCode: 'Registration Failed',
      errorVisible: false
    }
  }
  
  componentWillMount() {
    this.setState({
      errorCode: '',
      errorVisible: false
    })
  }

  togglError = () => {
    this.setState(prevstate => ({
      errorVisible: !prevstate.errorVisible
    }));
  }

  handleOnChangePL = (e) => {
    this.setState({ [e.target.name]: e.target.value})
  }

  handleSubmit = () => {
    if (this.state.unpl !== "") {
      this.props.toggleModal();
      this.store.dispatch(registerUser(this.state.unpl));
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
  
  render() {
    return (
      <section>
          <Modal visible={this.props.visible} effect="fadeInUp">
            <div className="pure-form">
              <fieldset style={modalFormView}>
                <legend style={{fontSize: "18px"}}><b>Register now. All you need is a handle!</b></legend>
                <div className="flexContainer">
                  <input style={{marginTop: "7px", height: "2.6em", marginLeft: "5px", marginRight: "5px"}} type="text" name="unpl" placeholder={this.state.unpl} onChange={(event) => {this.handleOnChangePL(event)}} value={this.state.unpl} />
                  <button style={btnStyle} type="submit" className="pure-button pure-button-primary" onClick={ () => this.handleSubmit() }><b>Register</b></button>
                </div>
              </fieldset>
            </div>
              
            <div className="flexContainer">
              { this.state.errorVisible ? <p style={{fontSize: "10px", color: "red"}}>{this.state.errorCode}</p> : null }
            </div>
            <div className="flexContainer">
              <a href="" onClick={ () => this.props.toggleModal() }>Close</a>
            </div>
          </Modal>
      </section>
    )
  }
}

  export default ModalUserNav