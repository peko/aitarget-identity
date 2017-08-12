express = require "express"
iced_middleware = require './libs/iced-coffee-script-middleware'
stylus = require 'stylus'

app = express()

app.set 'view engine', 'jade'
app.set 'views', __dirname + '/views'

app.use iced_middleware 
  src: __dirname + '/public'

app.use stylus.middleware 
  src: __dirname + '/public'
  dest: __dirname + '/public'

app.use express.static 'public'

# переходим на россию
app.get '/', (req, res)->
  res.render "index"

app.listen 4321, ->
  console.log "PORT 8000"
