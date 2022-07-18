// const socket = io('http://localhost:8000/', { transports : ['websocket'] });
const socket = io()
 
const form = document.getElementById('sendcontainer')
const messageInput = document.getElementById('msginput')
const messageContainer = document.getElementById("chatbox")
var msgAudio = new Audio("juntos-607.mp3")
var joinAudio = new Audio("Nokia Sms.mp3")

const append = (message,position)=>{
    const messageElement = document.createElement("div");
    messageElement.innerText = message;
    messageElement.classList.add('message')
    messageElement.classList.add(position)
    messageContainer.append(messageElement)
    console.log(message)
    if(position == "left")
        msgAudio.play();
    if(position == "joining")
        joinAudio.play();  
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value;
    append(`you: ${message}`,'right')
    socket.emit('send',message);
    messageInput.value = " ";
})

const uname = prompt("Enter your name to join: ")

socket.emit("new-user-joined", uname);
socket.on('user-joined', uname => {
    append(`${uname} joined the chat`,'joining')
})
socket.on('receive', data => {
    append(`${data.name} : ${data.message} `,'left')
})
socket.on('left', uname => {
    append(`${uname} left the chat`, 'joining')
})