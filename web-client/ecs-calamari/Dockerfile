FROM mono:latest

RUN curl -sL https://deb.nodesource.com/setup_9.x | bash -
RUN apt-get update
RUN apt-get install -y openssh-server python nodejs python-pip
RUN pip install awscli
RUN npm install -g typeorm
RUN npm install -g mysql
RUN mkdir -p /var/run/sshd
RUN echo V3ych3IBTK54DDBWr3xk > test
RUN echo V3ych3IBTK54DDBWr3xk >> test
RUN passwd root < test
RUN rm test

COPY sshd_config /etc/ssh/sshd_config

EXPOSE 22

CMD /usr/sbin/sshd -D
