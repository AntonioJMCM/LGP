# Quaerere
Quaerere Software Application consists of a learning management system for educational purposes used both by teachers and students from the 1st until 12th grade. Teachers can create quizzes according to the variety of templates available in the system, taking into account the school year and subject. After creating the quizzes, a unique code is generated and provided to the target students so that they can have access and be able to answer.

The software is compatible with Windows 10 and login must be done with an Office 365 account.

Developed for **Escola Global** by Feeka LGP-2A.

## Get Started
Make sure you have [yarn](https://yarnpkg.com/en/) installed. Yarn is strongly recommended instead of npm. 
```bash
cd quaerere
yarn install
```

### Docker
To turn on the server use the following commands. If you are on windows use Docker Toolbox to run the docker containers and note down the IP address given to you by the docker termianl.
```bash
cd server
docker-compose up
```

### Rebuild Docker Containers
If you need to rebuild the docker containers for the server before running, use the following command
```bash
cd server
docker-compose up --build
```

### Run
Runs the app in development mode. Open http://localhost:3000 to view it in the browser. The page will automatically reload if you make changes to the code. You will see the build errors and lint warnings in the console.
```bash
cd quaerere
yarn start
```
Both React and Electron will run concurrently. It can take a while for the app to launch.

### Build
By default build for current platform and current arch. Use CLI flags ```--mac```, ```--win```, ```--linux``` to specify platforms.
```bash
cd quaerere
yarn build
```
