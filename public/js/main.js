const chatForm = document.getElementById('chat-form')

const socket = io();

socket.on("message",(message)=>{
    console.log(message);
    outPutMessage(message)
});

chatForm.addEventListener('submit', (event)=>{
    event.preventDefault();

    const msg = event.target.elements.msg.value;
    socket.emit('chatMessage',msg)

});

const outPutMessage = (message)=>{
    const div = document.createElement('div');

    div.classList.add('message');
    div.innerHTML= `	<p class="meta">Brad <span>9:15pm</span></p>
    <p class="text">
       ${message}
    </p>`

    document.querySelector('.chat-messages').appendChild(div)
}