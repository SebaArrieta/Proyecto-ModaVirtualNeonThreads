FROM jenkins/jenkins:lts

USER root

# Install make and other build tools
RUN apt-get update && apt-get install -y build-essential

RUN apt-get update && apt-get install -y docker.io
RUN usermod -aG docker jenkins

USER jenkins