# 基于 centos8 + nginx
FROM ykenan/nginx:1.0.0
# 作者
MAINTAINER ykenan
# 定义变量
ENV DIR_WEBAPP ${project_path}/data/code/web
# 切换工作路径
WORKDIR $DIR_WEBAPP
# 覆盖远程容器中的 nginx.conf
COPY nginx.conf /home/nginx/nginx/conf/nginx.conf
