FROM jenkins/jenkins:lts

USER root

# Install make, Netcat, and other build tools
RUN apt-get update && apt-get install -y build-essential netcat-openbsd

# Install Docker CLI
RUN apt-get update && apt-get install -y docker.io

# Install Modern Docker Compose Plugin
RUN mkdir -p /usr/lib/docker/cli-plugins && \
    curl -SL https://github.com/docker/compose/releases/download/v2.24.0/docker-compose-linux-x86_64 -o /usr/lib/docker/cli-plugins/docker-compose && \
    chmod +x /usr/lib/docker/cli-plugins/docker-compose

# Add Jenkins user to the Docker group to allow running Docker commands
RUN usermod -aG docker jenkins

RUN apt-get update && apt-get install -y python3-requests

USER jenkins
