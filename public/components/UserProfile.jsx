import React from 'react';

const UserProfile = ({UserProfile}) => {


  return (
    <div className="user-profile">
      <img src="https://media.licdn.com/mpr/mpr/shrinknp_400_400/AAEAAQAAAAAAAASfAAAAJGE4OGU2YzYyLTJiOTgtNDAyMi1iMDY0LTcwMzljMTJlNWNkMQ.jpg" width="42"></img>
      <a href="#" className="username dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Andrew Foresi</a>
      <ul className="dropdown-menu">
        <li className="list-option"><a href="/editProfile">Profile</a></li>
        <li className="list-option"><a href="/logout">Log Out</a></li>
      </ul>
    </div>
  )
}

export default UserProfile;
