# Child's Assistant

![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat&logo=postgresql&logoColor=white)
![SQLAlchemy](https://img.shields.io/badge/SQLAlchemy-5E1F6D?style=flat&logo=sqlalchemy&logoColor=white)
![Flask](https://img.shields.io/badge/Flask-000000?style=flat&logo=flask&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white)
![Docker Compose](https://img.shields.io/badge/Docker%20Compose-2496ED?style=flat&logo=docker&logoColor=white)
![Nginx](https://img.shields.io/badge/Nginx-009639?style=flat&logo=nginx&logoColor=white)

**Child's Assistant** is a project aimed at helping parents organize and manage household tasks for their children. This tool streamlines the process of assigning and tracking chores, making it easier for parents to oversee their children's contributions to household responsibilities.

---

### Table of Contents

- [Overview](#overview)
- [Getting Started](#getting-started)
- [Development Roadmap](#development-roadmap)
- [Screenshots](#screenshots)
- [Contact](#contact)

---

### Overview

Child's Assistant is designed to:

- Help parents distribute household chores efficiently among children.
- Provide a structured and interactive platform for managing and tracking task completion.
- Improve family communication around shared responsibilities.

---

### Getting Started

To get started with the project, you'll need to set it up using Docker Compose.

1. Clone this repository:

   ```bash
   git clone https://github.com/vol4k/Child-s-Assistant.git
   cd Child-s-Assistant
   ```

2. Ensure you have Docker and Docker Compose installed.

3. Run the following command to start the application:

   ```bash
   docker-compose up --build
   ```

4. Once Docker Compose has finished, the application should be accessible via `http://localhost`.

#### Running in the Background

To run the application in the background, you can use the `-d` (detached) flag with the `docker-compose up` command:

```bash
docker-compose up --build -d
```

This command will start the application in detached mode, allowing you to continue using your terminal for other commands.

#### Restarting After Code Updates

If you make changes to the code and need to restart the application, you can do so by running the following commands:

1. **Stop the running containers:**

   ```bash
   docker-compose down
   ```

2. **Rebuild and restart the application:**
   ```bash
   docker-compose up --build
   ```

Alternatively, if you are running the application in detached mode and just want to apply the code changes without stopping it entirely, you can use:

```bash
docker-compose up --build -d
```

This will rebuild the containers if there are changes in the codebase while keeping the application running in the background.

---

### Development Roadmap

#### Authentication and User Management

- [x] Develop a login window for parents.
- [x] Add functionality to create a profile if it doesn't exist.
- [x] Add password validation.
- [ ] Add support for more advanced authentication mechanisms.

#### Frontend Design and Interface

- [x] Design the parent control panel interface.
- [x] Design the child control panel interface.
- [ ] Design the interface for the rewards store based on earned resources.
- [ ] Add form validation.
- [ ] Add dark theme support.
- [ ] Unify style sheets.
- [ ] Improve the calendar for easier date selection.
- [ ] Add support for selecting custom task repetition schedules.

#### Backend Development

- [x] Develop an algorithm to handle REST API requests on the backend.
- [x] Develop an algorithm for database interaction.
- [ ] Integrate SQL functions to enhance performance by reducing queries and leveraging database capabilities.
- [ ] Add functionality for a rewards store based on earned resources.
- [ ] Add support for viewing past weeks' statistics.
- [ ] Add subscription for client notifications when data changes on the backend.

#### Infrastructure and Deployment

- [x] Add support for quick deployment using Docker Compose.
- [x] Add support for internal proxying using Nginx.
- [ ] Add support for Jenkins.
- [ ] Optimize Docker Compose configuration for switching between development and production modes.
- [ ] Change React configuration for production mode.

#### Code Quality and Optimization

- [ ] Perform code refactoring.
- [ ] Add support for Redux store to optimize the number of server requests.
- [ ] Add support for multiple languages and regional standards.

---

### Screenshots

![Parent's dashboard screen](assets/Parent's%20dashboard%20screen.png)
_Fig. 1: Example of parent's dashboard screen._

![Parent's settings screen](assets/Parent's%20settings%20screen.png)
_Fig. 2: Example of parent's settings screen._

!["New child profile" modal](assets/New%20child%20screen.png)
_Fig. 3: Example of "New child profile" modal._

![Child choosing screen](assets/Child%20choosing%20screen.png)
_Fig. 4: Example of сhild choosing screen._

![Child's Dayly To-Do screen](assets/Child%20to-do%20screen.png)
_Fig. 5: Example of сhild's Dayly To-Do screen._

![Child's Dayly Money-Maker screen](assets/Child%20money-maker%20screen.png)
_Fig. 5: Example of сhild's Money-Maker screen._

---

### Contact

If you notice any bugs, or have suggestions for improvement or new features, feel free to reach out via any of the available contact methods.

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=flat-square&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/vol4k)
[![Instagram](https://img.shields.io/badge/Instagram-E4405F?style=flat-square&logo=instagram&logoColor=white)](https://www.instagram.com/vol4k_)
[![Facebook](https://img.shields.io/badge/Facebook-3b5998?style=flat-square&logo=facebook&logoColor=white)](https://www.facebook.com/vol4k)
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=flat-square&logo=github&logoColor=white)](https://github.com/vol4k)
