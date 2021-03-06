

let socket     = null;
let  usuario     = null;
const title      = document.querySelector("title");
const txtUid     = document.querySelector("#txtUid");
const txtMensaje = document.querySelector("#txtMensaje");
const ulUsuarios = document.querySelector("#ulUsuarios");
const ulMensaje  = document.querySelector("#ulMensaje");
const btnSalir   = document.querySelector("button");

const url = (window.location.hostname.includes('localhost'))
                  ?'http://localhost:3000/api/auth/'
                  :'http://localhost:3000/api/auth/'

//validar token del localstorage
const validarJWT = async ()=>{
    const token  = localStorage.getItem('token') || '';
    if(token.length<=10){
        window.location = 'index.html';
        throw new Error("No hay token en la aplicación");
    }

    const respuesta  = await fetch(url,{
        headers : {'x-token':token}
    });
    const {usuario:userDB, token:tokenDB} = await respuesta.json();
    localStorage.setItem('token',tokenDB);
    usuario =  userDB;
    title.innerHTML = usuario.name;
    await conectarSocket();
}

const conectarSocket = async () =>{
    socket = io({
        'extraHeaders':{
            'x-token': localStorage.getItem('token')
        }
    });

    socket.on('connect', ()=>{
        console.log("socket online");
    });
    
    socket.on('disconnect',()=>{
        console.log("socket offline");
    });

    socket.on('recibir-mensajes',renderChat);

    socket.on('usuarios-activos', renderUsers);
    socket.on('mensaje-privado', (payload)=>{
        
    });
}

const renderChat = (mensajes = []) =>{
    let mensajeHTML = '';
    mensajes.forEach(({name, message}) =>{
        mensajeHTML+=`
            <li style="list-style:none;">
                <p>
                    <h6 class="text-primary">${name} :</h6>
                    <span class="fs-6 text-muted">${message}</span>
                </p>
            </li>
            <hr>
        `;
    });
    ulMensaje.innerHTML = mensajeHTML;
}

const renderUsers = (users = []) =>{
    let usersHTML = '';
    users.forEach(({name, uid}) =>{
        usersHTML+=`
            <li style="list-style:none;">
                <p>
                    <h6 class="text-info"><i class="bi bi-person-fill"></i> ${name}</h6>
                    <span class="fs-6 text-muted">${uid}</span>
                </p>
            </li>
            <hr>
        `;
    });
    ulUsuarios.innerHTML = usersHTML;
 }

txtMensaje.addEventListener('keyup', ({keyCode}) =>{
    const mensaje = txtMensaje.value;
    const uid     = txtUid.value
    
    if(keyCode !== 13){return; }
    if(mensaje.length===0){return;}
    if(mensaje.replace(/ /g, "").length===0){return;}
    socket.emit("enviar-mensaje",{mensaje, uid});  
    txtMensaje.value="";
});

btnSalir.addEventListener('click', ()=>{  
    localStorage.removeItem('token')
    window.location = "index.html";
});

 

const main = async ()=>{
    //validar JWT
    await validarJWT();
}

main();