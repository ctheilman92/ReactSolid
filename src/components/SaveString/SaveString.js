import React, { Component } from 'react'
import SimpleStorageContract from '../build/contracts/SimpleStorage.json'
import getWeb3 from './utils/getWeb3'

import './css/styles.css'
import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

const contract = require('truffle-contract');


const btnStyle = {
  margin: '7px',
  borderRadius: '5px',
  height: '2.6em',
  width: '9em',
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
                <button type="submit" style={btnStyle} className="pure-button pure-button-primary" 
                        onClick={() => {this.handleClick()}}>Save</button>
            </fieldset>
        </div>
        )
        }
  }
  
  

class App extends Component {
    state = {
        SenderAddress: null,
        PlaceHolder: 'SaveString',
        StorageString: 'null',
        SimpleStorageCtrct: null,
        web3: null
    }

    //#region APP METHODS
    componentWillMount() {
        // Get network provider and web3 instance. -- See utils/getWeb3 for more info.
        getWeb3
        .then(results => {
            this.setState({web3: results.web3})
            this.instantiateContract()  //instantiate contract
        }).catch(() => {
            console.log('Error finding web3.')
        })
    }

    instantiateContracts() {
        this.setState({ SimpleStorageCtrct: contract(SimpleStorageContract) })
        this.state.SimpleStorageCtrct.setProvider(this.state.web3.currentProvider)
    
        //Get block chain addresses --- only returns the current address selected in metamask (web3 current addr)
        this.state.web3.eth.getAccounts((error, accounts) => {
          this.setState({ SenderAddress: accounts[0] })
          var ssDeployed = this.state.SimpleStorageCtrct.deployed()

          //INIT SIMPLE STORAGE CONTRACT
          ssDeployed.then((instance) => {
            return instance.getString(); }).then((res) => {
                var ret = (res === '') ? 'null' : res;
                this.setState({ StorageString: ret })
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

                return SSInstance.setString(ss, {from: accounts[0]})}).then((res) => {
                    SSInstance.getString()}).then((res) => {
                        var ret = (res === '') ? 'null' : res
                        this.setState({StorageString: ret}, () => { this.forceUpdate(); })
                    })
            })
        })
    }
    
    updatePlaceholder = (pl) => {
    this.setState({ PlaceHolder: pl })
    }
    //#endregion

    render() {
        return (
            <div className="App">
                <nav className="navbar pure-menu pure-menu-horizontal">
                    <a href="#" className="pure-menu-heading pure-menu-link">Truffle Box</a>
                </nav>
                <main className="container">
                    <div className="formView">
                        <FormStringSave updatePLRef={this.updatePlaceholder} pl={this.state.PlaceHolder} saveStringRef={this.saveString} /> 
                    </div>
                    <div>
                        <h4>Storage String is: {this.state.StorageString}</h4>
                    </div>
                </main>
            </div>
        )
    }
}

export default App;