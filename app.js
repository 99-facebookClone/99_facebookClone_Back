const express = require('express');
const app = express();
const port = 3000;
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const cors = require('cors');
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const mongoDB = require('./schemas/index');
const Message = require('./schemas/message')
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger-output');
require('dotenv').config();

mongoDB();
// 왜안돼..ㅠㅠ
// parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

// logger
app.use(morgan('dev'));

// cors
app.use(
  cors({
    origin: '*',
    credentials: 'true',
  })
);

// swagger
app.use('/api/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

let roomList = [];

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  console.log('a user connected');

  io.emit('room_list', roomList);

  socket.on('request_message', (msg) => {
    io.emit('response_message', msg);
  });

  socket.on('req_join_room', (roomName) => {
    roomName = 'Room_' + roomName;
    if (!roomList.includes(roomName)) {
      roomList.push(roomName);
    }
    socket.join(roomName);
    io.to(roomName).emit('noti_join_room', '방에 입장하였습니다.');
  });

  socket.on('req_room_message', async (msg) => {
    let userCurrentRoom = getUserCurrentRoom(socket);
    io.to(userCurrentRoom).emit('noti_room_message', msg);

    // mongoDB에 저장
    const message = new Message({
      room_id: userCurrentRoom,
      from: msg.name,
      to: '상대name',
      content: msg.message,
    });

    try {
      await message.save();
      console.log('메시지 저장 성공');
    } catch (err) {
      console.error('메시지 저장 실패: ', err);
    }
  });

  socket.on('req_create_room', (roomName) => {
    roomName = 'Room_' + roomName;
    if (!roomList.includes(roomName)) {
      roomList.push(roomName);
    }
    io.emit('room_list', roomList);
    io.emit('noti_join_my_room', roomName);
  });

  socket.on("room_list", (roomList) => {
    $("#select-room").empty(); // 기존의 옵션을 모두 제거
    $("#select-room").append('<option value="none" selected="selected">방을 선택해주세요</option>'); // 기본 옵션 추가
  
    roomList.forEach((room) => {
      $("#select-room").append(`<option value="${room}">${room}</option>`); // 방 목록 옵션 추가
    });
  });
  

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

// TEST CODE GOES HERE
(async function () {})();

function getUserCurrentRoom(socket) {
  let currentRoom = '';

  let socketRooms = [...socket.rooms];
  console.log(socketRooms);

  for (let i = 0; i < socketRooms.length; i++) {
    if (socketRooms[i].indexOf('Room_') !== -1) {
      currentRoom = socketRooms[i];
      break;
    }
  }
  return currentRoom;
}

const apiMainRouter = require('./routes/index');
app.use('/api', [apiMainRouter]);

http.listen(port, () => {
  console.log(`Example app listening on http://localhost:${port}`);
});