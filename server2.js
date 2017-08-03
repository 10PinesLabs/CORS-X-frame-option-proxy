/**
 * Created by fede on 31/07/17.
 */
var express = require('express')
var axios=require('axios')
var app = express()
app.set('view engine', 'html')

app.all('/proxy/*', function(req, res) {
  console.log(req.path)
  var url=String(req.path.substring(7,req.path.length))

  req.headers.host=url.split('/')[0]
  //req.headers.Referer=  req.headers.host
  console.log(url)
  axios({ url:'http://'+url, headers: req.headers, body: req.body }).then(function(response){
    var spliteo=response.data.split('head>')
    var punteroDeAgregado=spliteo[0].length+5
    var newBody=response.data.substring(0,punteroDeAgregado)
            +'   <base href='+'https://'+ req.headers.host +' target="_blank">'
            + response.data.substring(punteroDeAgregado,response.data.length)
       // +'<script  language="javascript">window.document.origin="tu vieja ";console.log(window) </script>'
    //console.log(newBody)
    delete response.headers['x-frame-options']
    delete response.headers['content-security-policy']
    response.headers['Access-Control-Allow-Origin']='*'

    res.headers=response.headers
    res.body=newBody
    res.send(newBody)
  })

})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})