# SCVdb

## Project setup

```
npm install
```

### Compiles and hot-reloads for development

```
npm run serve
```

### Compiles and minifies for production

```
npm run build
```

### Run your unit tests

```
npm run test:unit
```

### Run your end-to-end tests

```
npm run test:e2e
```

### Lints and fixes files

```
npm run lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).

## 2. The deployment process

* Install Docker in advance

### 2.1 Transfer files to the server

> **Need to execute `upload.bat` in the `deploy` folder**
>
> Modify the server path passed to, double-click and enter the server password to complete

### 2.2 The content added to the host `nginx.conf`

```shell
location /scvdb {
    proxy_pass http://localhost:${web_port}/scvdb;
    index  index.html index.htm index.jsp;
    proxy_set_header X-Real-IP $remote_addr;    # 获取客户端真实IP
    proxy_set_header REMOTE-HOST $remote_addr;  # 获取客户端浏览器的主机名
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for; # 获取代理者的真实ip
    proxy_set_header Host $host:$server_port;
}

location /scvdb_static {
    proxy_pass http://localhost:${web_port}/static;
    proxy_set_header X-Real-IP $remote_addr;    # 获取客户端真实IP
    proxy_set_header REMOTE-HOST $remote_addr;  # 获取客户端浏览器的主机名
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for; # 获取代理者的真实ip
    proxy_set_header Host $host:$server_port;
}

location /scvdb_service/ {
    proxy_pass http://localhost:${service_port}/scvdb_service/;
    index  index.html index.htm index.jsp;
    proxy_set_header X-Real-IP $remote_addr;    # 获取客户端真实IP
    proxy_set_header REMOTE-HOST $remote_addr;  # 获取客户端浏览器的主机名
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for; # 获取代理者的真实ip
    proxy_set_header Host $host:$server_port;
}

location /scvdb_api {
    alias ${project_path}/data/API/V1.0.0;
    autoindex on;
}
```

> If there are no other projects, you can overwrite `deploy/nginx.conf` to the remote server `Nginx` configuration.

### 2.3 Deploy with Dockerfile

> Just simple and fast

### 2.4 Execute

```bash
docker build -t scvdb_web .
```

```bash
docker run -d -it -p ${web_port}:80 \
       -v ${project_path}/data/code/web:${project_path}/data/code/web \
       -v ${project_path}/data/data:${project_path}/data/data \
       --privileged --name=scvdb_web scvdb_web
```

The above operation is recommended to be completed using the Docker plugin that comes with WebStorm.
