import React from 'react';
import './App.css';
const axios = require('axios');
require('dotenv').config();

class App extends React.Component{

  _api;
  constructor() {
    super();
    this._api  = process.env.REACT_APP_API ||'http://ec2-3-16-28-33.us-east-2.compute.amazonaws.com:3000';
    this.state = {
      loading:false,
      quotation_info:'',
      quotations: []
    };
  }

  componentWillMount(){
    // Make a request for a user with a given ID
   this._loadQuotations();
  }

  _handleChange=(e)=>{
    this.setState({[e.target.name]:e.target.value });
  }
  _loadQuotations=() =>{
    const _this = this;

    axios.get(`${this._api}`)
    .then(function (response) {
      // handle success
      _this.setState({quotations:response.data, quotation_info:''});
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
    .finally(function () {
      // always executed
    });
  }
  _submit= (e)=>{
    e.preventDefault();
    const _this = this;
    this.setState({loading: true});
    axios.post(`${this._api}`,{quotation_info:this.state.quotation_info})
    .then(function (response) {
      // handle success
      _this._loadQuotations();
    })
    .catch(function (error) {
      console.log(error);
    })
    .finally(function () {
      _this.setState({loading: false});
    });
  }

  render() {
  return (
    <div className="App container-fluid">
      <div className='row d-flex flex-column align-items-center'>
      <form className="quotation-form" onSubmit={this._submit}>
        <div className="form-group">
          <label htmlFor="info">Quotation Info</label>
          <textarea type="text" minLength="3" required={true} name="quotation_info" value={this.state.quotation_info} onChange={this._handleChange} className="form-control" id="info"  aria-describedby="quotationHelp" rows="3"></textarea>
          <small id="quotationHelp" className="form-text text-muted">Quotation Info is required*.</small>
        </div>
        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
      {
        this.state.quotations && 
        <table className="table">
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Info</th>
            <th scope="col">Valid?</th>
          </tr>
        </thead>
        <tbody>
          {this.state.quotations.map((el,index)=>
            <tr key={index}>
              <td >{el.Q_ID}</td>
              <td>{el.Quotation_Info || 'N/A'}</td>
              <td>{el.Quotation_Valid?'Active':' Inactive' }</td>
          </tr>
          )}
        </tbody>
      </table>
      }
      </div>
      {this.state.loading && <img src="https://www.foundationiq.com/images/loading.gif" className="loader"/> }
    </div>
  );
}
}
export default App;
