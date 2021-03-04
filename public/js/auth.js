function onSignIn(googleUser) { 
    //var profile = googleUser.getBasicProfile();
    //console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    //console.log('Name: ' + profile.getName());
    //console.log('Image URL: ' + profile.getImageUrl());
    //console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
    var id_token = googleUser.getAuthResponse().id_token; 

    var url = (window.location.hostname.includes('localhost'))
                  ?'http://localhost:3000/api/auth/google'
                  :'http://localhost:3000/api/auth/google'
    
    var data = { id_token }
    
    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type':'application/json'},
      body: JSON.stringify(data)
    })
      .then( resp => resp.json())
      .then( ({token}) =>{
          localStorage.setItem('token', token);
      })
      .catch( console.log() ) 
}

function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      console.clear();
      console.log('User signed out.');
    });
  }