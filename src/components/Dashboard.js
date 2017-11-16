import React, { Component } from 'react'
import { connect } from 'react-redux' 
import { bindActionCreators } from 'redux' 
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table'
import { Panel } from 'react-bootstrap'

// import '../css/bootstrap.min.css'
import '../../node_modules/react-bootstrap-table/dist/react-bootstrap-table-all.min.css';

class Dashboard extends Component {

  products = [{
    id: 1,
    name: "Product1",
    price: 120
  }, {
    id: 2,
    name: "Product2",
    price: 80
  }];

    render() {
      return (

        <div>
          <BootstrapTable data={this.products} insertRow={true}>
            <TableHeaderColumn dataField='id' isKey>Product ID</TableHeaderColumn>
            <TableHeaderColumn dataField='name'>Name</TableHeaderColumn>
            <TableHeaderColumn dataField='price'>Price</TableHeaderColumn>
          </BootstrapTable>
        </div>
      )
    }
  }

  const mapStateToProps = (state, ownProps) => {
    return { 
      accounts: state.accounts
    }
  }
  
  //needs more work done.
  const mapDispatchToProps = (dispatch, ownProps) => {
    return bindActionCreators({
        
      });
  }
  
  export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)
  
