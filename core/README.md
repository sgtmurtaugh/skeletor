#clickdummy-creator


## Hints
[node-canvas]: https://github.com/Automattic/node-canvas/wiki/_pages (Projekt Homepage)

### Problem Handling
#### Installation of node-canvas fails
[node-canvas]

##### Installing dependencies
`$ su -c 'dnf install gcc gcc-c++ cairo cairo-devel cairomm-devel libjpeg-turbo-devel pango pango-devel pangomm pangomm-devel giflib-devel'`
in centos some font will not be installed by default, so need install it yourself

`yum search arial`
`yum install liberation-sans-fonts.noarch`

##### Installing node-canvas
`$ npm install canvas`
