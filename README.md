![Rundeck](https://www.rundeck.com/hubfs/Images/logos/rundeck-logotype-512.png)

# Welcome to the Rundeck Community Welcome Project

This repo has a complete Docker environment with a project that includes sample jobs showing how Rundeck can integrate to turn alerts into action using our Community software edition.


## Setup / Starting the environment
Running this requires [Docker](https://www.docker.com/) installed on your machine.  We recommend the latest version.

**Build and Up**  
> **NOTE:** Building is not necessary the first time. Use 'build' to update the images used to the latest version.
```
docker-compose build
docker-compose up -d
```
The initial build can take a few minutes to run and get everything started.  After the containers are built and started use the command below to watch Rundeck logs for `Grails application running at http://0.0.0.0:4440/ in environment: production`

```
docker logs -f rundeck
```

**Accessing Rundeck**

To access Rundeck, head to http://localhost:4440 and login using the following credentials:

username: `admin`<br>
password: `admin`


**Stop**
Use the following command to stop the system, but keep the work you've done so far:

```
docker-compose stop
```

To remove the containers that were built and free up space on your machine:

```
docker-compose down
```

**Full Clean**
This command will remove all associated volumes and images as well.
```
docker-compose down --volume --rmi all
```


## Assistance
For help or questions with this image please join [discussions here](https://docs.rundeck.com/docs/manual/02-getting-help.html) and we will do our best to help.
