import React from 'react';
import ReactDOM from 'react-dom';
import { Modal } from 'react-bootstrap';

function User(id, name, gender, age) {
  this.id = id;
  this.name = name;
  this.gender = gender;
  this.age = age;
  this.isInEdit = false;
}
const Genders = [
  "Male",
  "Female"
];
function makeName() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for( var i=0; i < 5; i++ ) {
  	text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}
function makeGender() {
	const index = Math.round(Math.random(), 0);
	return Genders[index];
}
function makeAge() {
	return Math.floor(Math.random() * 100);
}
function initUsersData() {
	var tempUsers = [];
	for(var i = 0; i < 100; i++) {
		tempUsers.push(new User(i.toString(), makeName(), makeGender(), makeAge()));
	}
	return tempUsers;
}

var usersArray = initUsersData();

var nextUserId = usersArray.length + 1;

var pageNumber = 1;
const nbPerPage = 20;
var totalPagesHolder = [];

function totalPages() {
  var div = Math.floor(usersArray.length / nbPerPage);
  div += usersArray.length % nbPerPage > 0 ? 1 : 0;

  totalPagesHolder = [];
  for (var i = 0; i < div; i++) {
    totalPagesHolder.push(i + 1);
  }
  return;
}

function getPaginatedUsers() {
    totalPages();
    if(pageNumber > totalPagesHolder.length) {
    	pageNumber--;
    }
    const first = (pageNumber - 1) * nbPerPage;
    return usersArray.slice(first, first + nbPerPage);

 };


var UserForm = React.createClass({
	propTypes: {
    onUser: React.PropTypes.func.isRequired
  },
	getInitialState: function() {
    return {
      name: '',
      gender: '',
      age: ''
    };
  },
  changeName: function(ev) {
    this.setState({
      name: ev.target.value
    });
  },
  changeGender: function(ev) {
    this.setState({
      gender: ev.target.value
    });
  },
  changeAge: function(ev) {
    this.setState({
      age: ev.target.value
    });
  },
  addUser: function(ev) {
    ev.preventDefault();
    if(!this.state.name || !this.state.gender || !this.state.age) {
    	return;
    } 
    this.props.onUser({
    	id: nextUserId.toString(),
      name: this.state.name,
      gender: this.state.gender,
      age: parseInt(this.state.age),
    });

    this.setState({
      name: '',
      gender: '',
      age: ''
    });
    nextUserId++;
  },
	render: function() {
    return (
    	<div className="row">
      	<div className="col-md-12">
		      <form onSubmit={this.addUser} className="form-inline form-user-add">
		        <div className="form-group">
            	<input type="text" id="name" value={this.state.name} onChange={this.changeName} className="form-control name-field" placeholder="Name" />
          	</div>
          	<div className="form-group">
            	<select value={this.state.gender} onChange={this.changeGender} className="form-control gender-field">
            		<option value="">Gender</option>
            		<option value="Female">Female</option>
            		<option value="Male">Male</option>
          		</select>
	          </div>
	          <div className="form-group">
	            <input type="number" min="0" id="age" value={this.state.age} onChange={this.changeAge} className="form-control age-field" placeholder="Age" />
	          </div>
	          <button className="btn btn-default btn-add" disabled={!this.state.name || !this.state.gender || !this.state.age} type="submit"><span className="fa fa-plus"></span></button>
		      </form>
		    </div>
		  </div>
    );
  }
});
var isSortAsc = false;
var sortColumn = ("");

var Users = React.createClass({
  propTypes: {
    users: React.PropTypes.array
  },
  getInitialState: function() {
    return {
      users: getPaginatedUsers(usersArray)
    };
  },
  sortTableByName: function () {
		this.setSortOrder("name");
		this.sortTable("name");	
  },
  sortTableByGender: function () {
  	this.setSortOrder("gender");
  	this.sortTable("gender");
  },
  sortTableByAge: function () {
  	this.setSortOrder("age");
  	this.sortTable("age");
  },
  setSortOrder: function(column) {
  	if (sortColumn === column) {
    	isSortAsc = !isSortAsc;
		} else {
    	isSortAsc = true ;
  	}
  },
  sortTable: function(column) {
    sortColumn = column;
  	
  	usersArray.sort(function(a, b) {
	    if (a[sortColumn] < b[sortColumn]) {
	    	return isSortAsc ? -1 : 0;
		  } else {
		    return isSortAsc ? 0 : -1;
		  }
	  });
	  this.setState({
      users: getPaginatedUsers(usersArray)
    });
  },
  onUser: function(user) {
    usersArray.push(user);   
    if(sortColumn)	{
    	this.sortTable(sortColumn);	
    } else {
    	this.setState({
      	users: getPaginatedUsers(usersArray)
    	});	
    }
  },
  deleteUserFromList: function(user) {
  	var index = usersArray.indexOf(user);
  	if (index > -1) {
    	usersArray.splice(index, 1);
		}
		if(sortColumn)	{
    	this.sortTable(sortColumn);	
    } else {
    	this.setState({
      	users: getPaginatedUsers(usersArray)
    	});	
    }
  },
  editUserFromList: function() {
		if(sortColumn)	{
    	this.sortTable(sortColumn);	
    } else {
    	this.setState({
      	users: getPaginatedUsers(usersArray)
    	});	
    }
  },
  setSelectedPage: function(index) {
  	pageNumber = index;
  	if(sortColumn)	{
    	this.sortTable(sortColumn);	
    } else {
    	this.setState({
      	users: getPaginatedUsers(usersArray)
    	});	
    }

  },
  render: function() {  
    return (
      <div>
        <UserForm onUser={this.onUser}></UserForm>
        <table className="table table-striped table-users table-fixed">
        	<colgroup>
          	<col className="col-md-6" />
          	<col className="col-md-4" />
          	<col className="col-md-4" />
          	<col className="col-md-2" />
          </colgroup>
          <thead>
            <tr>
              <th onClick={this.sortTableByName}>
              	<span className="text-capitalize">Name</span>
	              {sortColumn !==  'name' &&
									<span className="table-sort-icon fa fa-sort"></span>
								}
								{sortColumn ===  'name' && isSortAsc &&
									<span className="table-sort-icon fa fa-sort-up"></span>
								}
								{sortColumn ===  'name' && !isSortAsc &&
									<span className="table-sort-icon fa fa-sort-down"></span>
								}
              </th>
              <th onClick={this.sortTableByGender}>
              	<span className="text-capitalize">Gender</span>
	              {sortColumn !==  'gender' &&
									<span className="table-sort-icon fa fa-sort"></span>
								}
								{sortColumn ===  'gender' && isSortAsc &&
									<span className="table-sort-icon fa fa-sort-up"></span>
								}
								{sortColumn ===  'gender' && !isSortAsc &&
									<span className="table-sort-icon fa fa-sort-down"></span>
								}
							</th>
              <th onClick={this.sortTableByAge}>
              	<span className="text-capitalize">Age</span>
	              {sortColumn !==  'age' &&
									<span className="table-sort-icon fa fa-sort"></span>
								}
								{sortColumn ===  'age' && isSortAsc &&
									<span className="table-sort-icon fa fa-sort-up"></span>
								}
								{sortColumn ===  'age' && !isSortAsc &&
									<span className="table-sort-icon fa fa-sort-down"></span>
								}
							</th>
							<th></th>
            </tr>
          </thead>
          <tbody>
          	{this.state.users.map(user => <UserRow user={user} deleteUserFromList={this.deleteUserFromList} editUserFromList={this.editUserFromList} />)}
          </tbody>
        </table>
        <div className="row">
	      	<div className="col-md-12">
		        <div className="text-center">
		          <ul className="pagination">
		          	{totalPagesHolder.map(page =>
		          			<li className={pageNumber === page ? "active" : ""}><a onClick={this.setSelectedPage.bind(this, page)}><span>{page}</span></a></li>
		          	)}    
		          </ul>
		        </div>
		      </div>
		    </div>
      </div>
    );
  }
});

const DeteleUserButton = React.createClass({
	handleRemoveUser: function() {
    this.props.onUserDelete( this.props.user );
    this.setState({show: false});
    return false;
  },
  getInitialState() {
    return {show: false};
  },

  showModal() {
    this.setState({show: true});
  },

  hideModal() {
    this.setState({show: false});
  },

  render() {
    return (
      <div className="display-inline">
        <button className="btn btn-link" onClick={this.showModal}>
          <span className="fa fa-close"></span>
        </button>
        <Modal
          {...this.props}
          show={this.state.show}
          onHide={this.hideModal}
          dialogClassName="custom-modal"
        >
          <Modal.Header closeButton>
            <h1 className="modal-title text-center">Remove person</h1>
          </Modal.Header>
          <Modal.Body>
		        <div className="row">
		          <div className="col-md-12">
		            <div className="text-center">
		              <p>Are you sure you want to remove this entry?</p>
		            </div>
		          </div>
		        </div>
		        <div className="modal-button-container">
		          <div className="row">
		            <div className="col-md-8 col-md-offset-2">
		              <div className="col-xs-6">
		                <button className="btn btn-lg btn-block btn-cancel" onClick={this.hideModal}>Cancel</button>
		              </div>
		              <div className="col-xs-6">
		                <button className="btn btn-lg btn-block btn-primary" onClick={this.handleRemoveUser}>Yes</button>
		              </div>
		            </div>
		          </div>
		        </div>	
          </Modal.Body>
        </Modal>
      </div>
    );
  }
});

var UserRow = React.createClass({
  getInitialState: function() {
    return {
    	isInEdit: false,
    	nameInEdit: "",
    	genderInEdit: "",
    	ageInEdit: "",
    	user: this.props.user,
    };
  },
  toEditMode: function() {
  	this.setState({
  		isInEdit: true,
  		nameInEdit: this.props.user.name,
  		genderInEdit: this.props.user.gender,
  		ageInEdit: this.props.user.age,
  	});
  },
  changeEditName: function(ev) {
    this.setState({
      nameInEdit: ev.target.value
    });
  },
  changeEditGender: function(ev) {
    this.setState({
      genderInEdit: ev.target.value
    });
  },
  changeEditAge: function(ev) {
    this.setState({
      ageInEdit: ev.target.value
    });
  },
  saveChanges: function() {
  	this.props.user.name = this.state.nameInEdit;
  	this.props.user.gender = this.state.genderInEdit;
  	this.props.user.age = parseInt(this.state.ageInEdit);
  	this.setState({
  		isInEdit: false,
  	});
  	this.props.editUserFromList();
  },
  handleUserDelete: function() {
  	this.setState({
  		isInEdit: false,
  	});
		this.props.deleteUserFromList(this.props.user);
  },

  render: function() {
    return (
      <tr>
        <td className="vertical-middle">
        	{ !this.state.isInEdit  &&
        		<span>{this.props.user.name}</span>
        	}
        	{ this.state.isInEdit  &&
        		<input type="text" value={this.state.nameInEdit} onChange={this.changeEditName} className="form-control" placeholder="Name" />
        	}
       	</td>
        <td className="vertical-middle">
        	{ !this.state.isInEdit  &&
        		<span>{this.props.user.gender}</span>
        	}
        	{ this.state.isInEdit  &&
        		<select value={this.state.genderInEdit} onChange={this.changeEditGender} className="form-control gender-field">
            		<option value="">Gender</option>
            		<option value="Female">Female</option>
            		<option value="Male">Male</option>
          		</select>
        	}
       	</td>
        <td className="vertical-middle">
        	{ !this.state.isInEdit  &&
        		<span>{this.props.user.age}</span>
        	}
        	{ this.state.isInEdit  &&
        		<input type="number" min="0" value={this.state.ageInEdit} onChange={this.changeEditAge}  className="form-control age-field" placeholder="Age" />
        	}
        </td>
        <td className="text-center vertical-middle">
        	{ !this.state.isInEdit  &&
        		<button className="btn btn-link" onClick={this.toEditMode}>
          		<span className="fa fa-edit"></span>
        		</button>
        	}
        	{ this.state.isInEdit  &&
        		<button className="btn btn-link active" onClick={this.saveChanges} disabled={!this.state.nameInEdit || !this.state.genderInEdit || !this.state.ageInEdit}>
          		<span className="fa fa-edit"></span>
        		</button>
        	}
        	<span className="button-separator"></span>
        	<DeteleUserButton onUserDelete={this.handleUserDelete} />
        </td>
      </tr>
    );
  }
});

class Header extends React.Component {
	render() {
		return (
			<nav className="navbar navbar-default">
	    	<div className="container-fluid">
	      	<div className="navbar-header"> 
	      		<a href="#" className="logo"></a> 
	      	</div>
	    	</div>
	  	</nav>
		)
	}
}

class MainContent extends React.Component {
	render() {
		return (
			<div className="container">
				<div className="row">
      		<div className="col-md-12">
        		<h1>Add a person</h1>
      		</div>
    		</div>
				<Users />
			</div>
		)
	}
}

class App extends React.Component {
  render() {
  	return (
  		<div>
    		<Header />
    		<MainContent />
    	</div>
  	);
  }
}
ReactDOM.render(<App />, document.getElementById('root')); 
