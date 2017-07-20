import React from 'react';

const UserProfile = ({UserProfile, profileInformation}) => {


  if (profileInformation[0]) {
    return (
    <div className="user-profile">
      <img className="img-circle" src="https://thebenclark.files.wordpress.com/2014/03/facebook-default-no-profile-pic.jpg" width="42" ></img>
      <a href="#" className="username dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">{profileInformation[0].name}</a>
      <ul className="dropdown-menu">
        <li className="list-option"><a href="/editProfile">Profile</a></li>
        <li className="list-option"><a href="/logout">Log Out</a></li>

      </ul>
    </div>
  )
  } else {
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
  }



}

export default UserProfile;
