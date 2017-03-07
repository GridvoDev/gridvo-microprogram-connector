FROM node:latest
MAINTAINER linmadan <772181827@qq.com>
COPY ./package.json /home/test-pomelo-app/
WORKDIR /home/test-pomelo-app
RUN ["npm","config","set","registry","http://registry.npm.taobao.org"]
RUN ["npm","install","--save","ws@2.2.0"]
RUN ["npm","install","--save","pomelo@2.2.5"]
RUN ["npm","install","pomelo@2.2.5","-g"]
COPY ./lib lib
COPY ./test test
VOLUME ["/home/test-pomelo-app"]
ENTRYPOINT ["pomelo"]
CMD ["start","-d","./test/mockPomelo"]