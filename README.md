# Child's Assistant

## Overview

This project uses Docker and Docker Compose to simplify the development and deployment of a multi-container application. It includes all necessary services, configurations, and dependencies encapsulated in Docker containers for ease of use and portability.

Prerequisites

Before starting, make sure you have the following software installed:

```
Docker
```
```
Docker Compose
```

To verify installation:

```
docker --version
```
```
docker-compose --version
```

# Project Setup

## Step 1: Build and Start Containers

To build and start the containers, run the following command:

```
docker-compose up --build
```

This will:

1. Pull necessary Docker images (if they don’t already exist).
2. Build any custom images defined in the docker-compose.yml.
3. Start all the services defined in the docker-compose.yml.



You can also run it in detached mode:

```
docker-compose up -d --build
```

## Step 2: Verify Running Containers

After the containers are up, verify they are running:

```
docker ps
```

# Step 3: Access the Application

It will be available at http://localhost.