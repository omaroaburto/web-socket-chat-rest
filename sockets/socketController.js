const { checkToken } = require("../helpers/create-jwt");
const {ChatMessage} = require("../models");
const chatMessage = new ChatMessage();
const socketController = async (socket, io) =>{
    const user  = await checkToken(socket.handshake.headers['x-token']);
    console.log(user)
    if(!user){
        return socket.disconnect();
    } 
    //agregar al usuario conectado
    chatMessage.addUser(user);
    
    io.emit('usuarios-activos', chatMessage.usersArr);
    socket.emit('recibir-mensajes', chatMessage.lastMessagesSent);
    socket.join(user.id);

    socket.on('disconnect',()=>{
        chatMessage.desconnectUser(user.id);
        io.emit('usuarios-activos', chatMessage.usersArr);
    });
    socket.on('enviar-mensaje',({uid, mensaje})=>{
        if(uid){
            socket.to(uid).emit('mensaje-privado',{userName:user.name, mensaje})
        }else{
            chatMessage.sendMessages(user.id , user.name, mensaje);  
            io.emit('recibir-mensajes', chatMessage.lastMessagesSent);
        }  
    });
    
}

module.exports = {
    socketController
}