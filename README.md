![image](https://user-images.githubusercontent.com/6076073/42849227-4958b40c-8a1a-11e8-9e7a-149775d01dfa.png)
<h1 align=center>@jakewhelan/resolvr</h1>

Run A/B tests using PM2 and nginx

`resolvr` is a HTTP router and PM2/nginx A/B test companion - manage A/B test cookies and automagically configure nginx with proxy settings for PM2 instances in real-time

# What is resolvr?

`resolvr` is made up of three parts:
1. PM2 interface: monitors your running PM2 processes
2. nginx interface: updates nginx config reactively with changes to PM2 processes
3. a/b test cookie management service: the secret sauce! Sets and unsets cookies in your current browser session allowing the nginx interface to map incoming connections to PM2 processes

# Setup
Disclaimer: `resolvr` requires a running instance of PM2 and nginx

1. Create your master and child PM2 processes, set the PORT environmental variable
```bash
$ PORT=5555 pm2 start app.js --name master
$ PORT=6666 pm2 start app.js --name ab-test-example-1
```

2. Create `.resolvrrc`
```yaml
nginx-bin-path: 'C:/nginx' #required - nginx binary path
nginx-config-file: 'C:/nginx/conf/nginx.conf' #required - nginx.conf file
root-app-name: 'master' #required - master PM2 instance
polling-frequency: 5 #optional - polling frequency in seconds
```

3. Start resolvr
```bash
$ cd ~/code/resolvr
$ npm run start
// resolvr now listening on localhost:3000
```

4. Set A/B test routing for browser session
```
http://localhost:3000/resolvr/ab/set/ab-test-example-1
```

5. Establish connection with nginx, and be routed to `ab-test-example-1` PM2 instance
```
http://localhost:80
-> nginx reads cookie
-> nginx proxies incoming connection to localhost:6666 (ab-test-example-1)
```

# Cookie management service
### /resolvr/ab/set/:abTestname
Set a/b test routing cookie
- `:abTestName`: PM2 process name

### /resolvr/ab/unset
Unset a/b test routing

# TODO
- Exempt Resolvr from a/b testing rules (add a fixed route in nginx.conf - /resolvr)
- Add admin bar that shows a/b cookie is active, and which one
- UNIX support (currenly executing Window commands to interface with nginx)
- HTTPS support
- Publish to npm
- Update documentation with library installation instructions
