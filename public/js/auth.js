const formulario =  document.querySelector('form');
const url = (window.location.hostname.includes('localhost'))
                  ?'http://localhost:3000/api/auth/'
                  :'http://localhost:3000/api/auth/'

formulario.addEventListener('submit', ev =>{
    ev.preventDefault();
    const formData = {};
    for(let element of formulario.elements){
        if(element.name.length > 0){
          formData[element.name] = element.value;
        } 
    }
    fetch(url+'login',{
          method: 'POST',
          headers: { 'Content-Type':'application/json'},
          body: JSON.stringify(formData)
    }).then(resp => resp.json())
      .then(({msg, token}) =>{ 
          if(token){ 
              console.log(token)
              localStorage.setItem('token', token); 
              window.location = 'chat.html';
          }else{
              if(msg){
                return console.error(msg);
              }
              return console.error('ingrese email');
          } 
          
      })
      .catch(err =>{
          console.log(err);
      });
});

function onSignIn(googleUser) { 
    //var profile = googleUser.getBasicProfile();
    //console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    //console.log('Name: ' + profile.getName());
    //console.log('Image URL: ' + profile.getImageUrl());
    //console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
    var id_token = googleUser.getAuthResponse().id_token;     
    var data = { id_token }
    
    fetch(`${url}google`, {
      method: 'POST',
      headers: { 'Content-Type':'application/json'},
      body: JSON.stringify(data)
    })
      .then( resp => resp.json())
      .then( ({token}) =>{
          localStorage.setItem('token', token);
          window.location = 'chat.html';
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