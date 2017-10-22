import React, { Component } from 'react'
import SimpleStorageContract from '../build/contracts/SimpleStorage.json'
import getWeb3 from './utils/getWeb3'

import './css/styles.css'
import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'


//region inline-styles
var btnStyle = {
  margin: '7px',
  borderRadius: '5px'
}

var navLink = {
  float: 'right',
  width: '50px'
}

//endregion
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


class ButtonSave extends Component {
  handleClick = () => {
    this.props.saveStringRef(this.props.pl)
  }

  render() {
    return (
      <button onClick={this.handleClick} type="submit" style={btnStyle} 
      className="pure-button pure-button-primary btnStyle">Save</button>
    )
  }
}

class FormStringSave extends Component {
  handleClick = () => {
    this.props.saveStringRef(this.props.pl)
  }

  render() {
    return (
      <form className="pure-form">
        <fieldset>
          <legend>Save a string Input to account</legend>
          <input type="text" placeholder={this.state.placeholder} 
                onChange={(event) => this.setState({placeholder: event.target.value})} value={this.state.placeholder} />
          <button onClick={this.handleClick} type="submit" style={btnStyle} 
                className="pure-button pure-button-primary btnStyle">Save</button>
        </fieldset>
      </form>
    )
  }
}


class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      accountsList: [],
      placeholder: 'SaveString',
      storageString: 'null',
      storageValue: 0,
      web3: null
    }
  }

  componentWillMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.
    getWeb3
    .then(results => {
      this.setState({web3: results.web3})
      this.instantiateContract()  //instantiate contract
    }).catch(() => {
      console.log('Error finding web3.')
    })

  }

  instantiateContract() {
    const contract = require('truffle-contract')
    const simpleStorage = contract(SimpleStorageContract)
    simpleStorage.setProvider(this.state.web3.currentProvider)
    var simpleStorageInstance // Declaring this for later so we can chain functions on SimpleStorage.

    // Get accounts.
    this.state.web3.eth.getAccounts((error, accounts) => {
      this.setState({accountsList: accounts})

      simpleStorage.deployed().then((instance) => {
        simpleStorageInstance = instance

        return simpleStorageInstance.getString.call(accounts[0])}).then((result) => {
          //return
          this.setState({ storageString: result })
          this.forceUpdate()
      })
    })
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
          this.setState({storageString: res})
          this.forceUpdate();
        })
      })
    })
    this.forceUpdate()
  }


  render() {
    return (
      <div className="App">
        <nav className="navbar pure-menu pure-menu-horizontal">
            <a href="#" className="pure-menu-heading pure-menu-link">Truffle Box</a>
            <a style={navLink} href="#" className="pure-menu-heading pure-menu-link">Login</a>
        </nav>

        <main className="container">
          <div className="pure-g">
            <div className="pure-u-1-1">
               <h2>Smart Contract Example</h2>
               <TodoList accounts={this.state.accountsList} />
               {/* <AccountsList accounts={this.state.accountsList}/>   */}
            </div>
          </div>
          {/* <FormStringSave pl={this.state.placeholder} saveStringRef={this.saveString} /> */}
          <form className="pure-form">
            <fieldset>
              <legend>Save a string Input to account</legend>
              <input type="text" placeholder={this.state.placeholder} 
                    onChange={(event) => this.setState({placeholder: event.target.value})} value={this.state.placeholder} />
              <ButtonSave pl={this.state.placeholder} saveStringRef={this.saveString} />
            </fieldset>
          </form>
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
