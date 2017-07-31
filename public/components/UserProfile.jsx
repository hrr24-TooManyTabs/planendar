import React from 'react';

export default class UserProfile extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      toggle: false,
      profileLoaded: false
    };
  }

  componentDidMount() {
    console.log("WHATS UP")
  }


  renderUserProfile() {



    if (!this.props.profileInformation[0]) {
      return (
      <div className="user-profile">
        <img className="img-circle" src="https://thebenclark.files.wordpress.com/2014/03/facebook-default-no-profile-pic.jpg" width="42"></img>
        <a href="#" className="username dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"></a>
        <ul className="dropdown-menu">
          <li className="list-option"><a href="/editProfile">Profile</a></li>
          <li className="list-option"><a href="/logout">Log Out</a></li>

        </ul>
      </div>
    )

    } else {
      return (
      <div className="user-profile">
        <img className="img-circle" src={this.props.profileInformation[0].photo} width="42" ></img>
        <a href="#" className="username dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">{this.props.profileInformation[0].name}</a>
        <ul className="dropdown-menu">
          <li className="list-option"><a href="/editProfile">Profile</a></li>
          <li className="list-option"><a href="/logout">Log Out</a></li>
          <li className="list-option"><a onClick={this.toggle}>Click Me</a></li>

        </ul>
      </div>
      )
    }
  }

  render() {
      return (
        <div>
        {this.renderUserProfile()}
        </div>
      );
  }


}



