const socket = io('https://idiscuss-chat-app.herokuapp.com/')
const form = document.getElementById("send-container")
const messageInput = document.getElementById("messageInput")
const messageContainer = document.querySelector(".container")

const audio = new Audio('./audio/swiftly.mp3');
const append_function = (message,position)=>
{
    const newDiv = document.createElement("div")
    newDiv.innerText = message;
    newDiv.classList.add("message")
    newDiv.classList.add(position)
    messageContainer.append(newDiv)
    // console.log(message)
    if(position == 'left')
    {
        audio.play();
    }
}

form.addEventListener("submit",(e)=>
{
    e.preventDefault();
    const msg = messageInput.value
    append_function(`You : ${msg}`,"right")
    messageInput.value = ""
    socket.emit("send",msg)
})

var temp_name;

do
{
    temp_name = prompt("please enter your name");
}while(!temp_name);

socket.emit('new-user-joined',temp_name)

socket.on("user-joined",temp_name =>
{
    append_function(`${temp_name} joined the chat`,"left")
})

socket.on('receive',data =>
{
    append_function(`${data.name} : ${data.message} `,"left")
})

socket.on('left',name =>
{
    append_function(`${name} left the chat `,"left")
})
