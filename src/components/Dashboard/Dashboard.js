import React, { Component } from 'react'


class Dashboard extends Component {
    render() {
      return (
        <table className="pure-table pure-table-horizontal">
          <thead>
            <tr>
              <th>Tasks</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>womp womp</td>
              <td>Done</td>
            </tr>
          </tbody>
        </table>
      )
    }
  }