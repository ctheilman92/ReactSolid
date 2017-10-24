import React, { Component } from 'react'
import SimpleStorageContract from '../build/contracts/SimpleStorage.json'
import AccountsContract from '../build/contracts/Accounts.json'
import getWeb3 from './utils/getWeb3'

import './css/styles.css'
import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'


//#region inline styles

var btnStyle = {
  margin: '7px',
  borderRadius: '5px',
  height: '2.6em'
}

var navLink = {
  fontSize: '16px',
  float: 'right',
  width: '50px'
}

//#endregion
class FormLogin extends Component {
  render() {
    return (
      <div>

      </div>
    )
  }
}


class TodoList extends Component {
  
  render() {
    return (
      <table className="pure-table pure-table-horizontal">
        <thead>
          <tr>
            <th>#</th>
            <th>Account</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            {this.props.accounts.map((item, i) => {
              return <td key={i}>{item}</td>
            })}
          </tr>
        </tbody>
      </table>
    )
  }
}


class FormStringSave extends Component {
  handleClick = () => {
    this.props.saveStringRef(this.props.pl);
  }

  handleOnChange = (e) => {
    this.props.updatePLRef(e.target.value)
  }


  render() {
    return (
      <div className="pure-form">
        <fieldset>
          <legend>Save a string Input to account</legend>
          <input style={{marginLeft: "10px", marginRight: "5px"}} type="text" placeholder={this.props.pl} 
            onChange={(event) => this.handleOnChange(event)} value={this.props.pl} />
          <button type="submit" style={btnStyle} className="pure-button pure-button-primary" onClick={() => {this.handleClick()}}>Save</button>
        </fieldset>
      </div>
    )
  }
}


class App extends Component {
  state = {
      BlockchainAddresses: [],
      registeredAccounts: [],   //not set
      TaskList: [],             //not set
      placeholder: 'SaveString',
      storageString: 'null',
      web3: null
  }

  componentWillMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.
    getWeb3
    .then(results => {
      this.setState({web3: results.web3})
      this.instantiateContracts()  //instantiate contract
    }).catch(() => {
      console.log('Error finding web3.')
    })

  }

  instantiateContracts() {
    const contract = require('truffle-contract')
    const simpleStorage = contract(SimpleStorageContract)
    const AccountsCtr = contract(AccountsContract)
    simpleStorage.setProvider(this.state.web3.currentProvider)
    AccountsCtr.setProvider(this.setState.web3.currentProvider)
    var contractInstance // Declaring this for later so we can chain functions on SimpleStorage.

    // Get block chain addresses --- only returns the current address selected in metamask (web3 current addr)
    this.state.web3.eth.getAccounts((error, accounts) => {
      this.setState({BlockchainAddresses: accounts})

      //INIT SIMPLE STORAGE CONTRACT
      simpleStorage.deployed().then((instance) => {
        contractInstance = instance

        return contractInstance.getString.call(accounts[0])}).then((result) => {
          //return
          var ret = (result === '') ? 'null' : result;
          this.setState({ storageString: ret })
          this.forceUpdate()
      })

      //INIT ACCOUNTS CONTRACT
      AccountsCtr.deployed().then((instance) => {
        contractInstance = instance

        return 
      })
    })
  }

  registerUser() {


  }

  saveString = (ss) => {
    getWeb3.then(results => {
      var SSInstance

      const contract = require('truffle-contract')
      const simpleStorage = contract(SimpleStorageContract)
      simpleStorage.setProvider(this.state.web3.currentProvider)

      this.state.web3.eth.getAccounts((error, accounts) => {
        simpleStorage.deployed().then((inst) => {
          SSInstance = inst

          return SSInstance.setString(ss, {from: accounts[0]})
        }).then((res) => {
          return SSInstance.getString.call(accounts[0])
        }).then((res) => {
          var ret = (res === '') ? 'null' : res
          this.setState({storageString: ret})
        })
      })
    })
  }

  updatePlaceholder = (pl) => {
    this.setState({ placeholder: pl })
  }

  render() {
    return (
      <div className="App">
        <nav className="navbar pure-menu pure-menu-horizontal">
            <a href="#" className="pure-menu-heading pure-menu-link">Truffle Box</a>
            <a style={navLink} href="#" className="pure-menu-heading pure-menu-link">Login</a>
            <a style={navLink} href="#" className="pure-menu-heading pure-menu-link">Sign Up</a>
        </nav>

        <main className="container">
          <div className="pure-g">
            <div className="pure-u-1-1">
               <h2>Smart Contract Example</h2>
               <TodoList accounts={this.state.BlockchainAddresses} />
               {/* <AccountsList accounts={this.state.BlockchainAddresses}/>   */}
            </div>
          </div>
          <div className="formView">
           <FormStringSave updatePLRef={this.updatePlaceholder} pl={this.state.placeholder} saveStringRef={this.saveString} /> 
          </div>
          <div>
            <h4>Storage String is: {this.state.storageString}</h4>
          </div>
        </main>
        <footer>
          Created by Cameron Heilman - Adrian Rodriguez
          <br/>
          <a href="https://github.com/ctheilman92/ReactSolid/">React Solid Repo</a>
        </footer>
      </div>
    );
  }
}
export default App
