const grpc = require('grpc')
const protoLoader = require('@grpc/proto-loader')

const packageDef = protoLoader.loadSync('todo.proto', {})
const grpcObject = grpc.loadPackageDefinition(packageDef)
const todoPackage = grpcObject.todoPackage

const text = process.argv[2]
const client = new todoPackage.Todo(
  'localhost:40000',
  grpc.credentials.createInsecure(),
)

client.createTodo(
  {
    id: -1,
    text: text,
  },
  (err, resp) => {
    console.log('Recieved from server ' + JSON.stringify(resp))
  },
)

client.readTodos({}, (err, resp) => {
  console.log('Recieved from server ' + JSON.stringify(resp))
})

const call = client.readTodosStream()
call.on('data', (item) => {
  console.log('Recieved item from server ' + JSON.stringify(item))
})

call.on('end', (e) => console.log('server done!'))
