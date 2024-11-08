const ws = require('ws')
const server = new ws.Server({ port: 3400 });

let rooms = {}
// console.log('the rooms are ${rooms}');


const broadcast = (roomno,message) =>{
    const room = rooms[roomno]
    console.log(message.message);
    
    // console.log(room);
    // console.log(rooms);
    // console.log(message.message);
    for(let users in room){
        const socket = room[users].socket
        socket.send(JSON.stringify(message))
        console.log(socket);
    }
}

server.on('connection', (socket) => {
    console.log('a user connected');


    let username;
    let roomno;

    socket.on('message', (message) => {
        console.log(JSON.parse(message));

        // server.clients.forEach((client)=>{
        //     if(client.readyState==ws.OPEN){
        //         client.send(message)
        //     }
        // })

        const data = JSON.parse(message);
        switch (data.type) {
            case 'join':
                username = data.name
                roomno = data.room;
                rooms[roomno] = [...rooms[roomno]||[],{username,socket}]
                // console.log(rooms);
                broadcast(roomno,{type:'notify',message:`${username} has joined the room ${roomno}`})
                break;

            case 'message':
               console.log(data);
               broadcast(roomno,{type:'message',username,message:data.message})
               break;

            case 'leave':
                broadcast(roomno,{type:'notify',message:`${username} left the chat room ${roomno}`})   
        }
    })

    socket.on('close', () => {
        console.log('disconnected');

    })

})
console.log('server is running at http://localhost:3400');
