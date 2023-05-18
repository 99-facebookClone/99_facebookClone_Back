const express = require('express');
const app = express();
const port = 3000;
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const cors = require('cors');
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const mongoDB = require('./schemas/index');
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
    // cors options
  })
);

// swagger
app.use('/api/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

let rooms = [];
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  console.log('connect on');
  socket.on('request_message', (msg) => {
    // response_message로 접속중인 모든 사용자에게 msg 를 담은 정보를 방출한다.
    io.emit('response_message', msg);
  });

  // 방참여 요청
  socket.on('req_join_room', async (msg) => {
    let roomName = 'Room_' + msg;
    if (!rooms.includes(roomName)) {
      rooms.push(roomName);
    }
    socket.join(roomName);
    io.to(roomName).emit('noti_join_room', '방에 입장하였습니다.');
  });

  // 채팅방에 채팅 요청
  socket.on('req_room_message', async (msg) => {
    let userCurrentRoom = getUserCurrentRoom(socket);
    io.to(userCurrentRoom).emit('noti_room_message', msg);
  });

  socket.on('disconnect', async () => {
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
