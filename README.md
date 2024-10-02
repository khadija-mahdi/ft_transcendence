
# Transcendent

Welcome to **Transcendent**, a dynamic and competitive web-based gaming platform. Play thrilling matches against random opponents, challenge AI players, or participate in exciting tournaments. Our platform tracks users' achievements and ranks, allowing players to showcase their progress and compare standings with friends. Enjoy seamless communication through messaging and live chat features, and create groups to stay connected with your gaming community. Join us and immerse yourself in a competitive environment where every match brings new opportunities for victory and camaraderie.

This repository contains the code and resources necessary to understand, install, and contribute to the project.

## Table of Contents

- [Introduction](#introduction)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Introduction

**Transcendent** is designed for players who want to engage in competitive gameplay. Whether you're playing against real opponents, challenging AI, or competing in tournaments, your progress and achievements will be tracked and ranked. Stay in touch with the gaming community through our integrated messaging and group chat features, ensuring a connected and social experience.

## Technologies Used

- **Frontend:**
  - ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
  - ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
  - ![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)

- **Backend:**
  - ![Django](https://img.shields.io/badge/Django-092E20?style=for-the-badge&logo=django&logoColor=white)
  - ![Django REST Framework](https://img.shields.io/badge/Django_REST_Framework-092E20?style=for-the-badge&logo=django&logoColor=white)
  - ![Django Channels](https://img.shields.io/badge/Django_Channels-092E20?style=for-the-badge&logo=django&logoColor=white)

- **Database:**
  - ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white)
  - ![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)


## Project Structure

The project structure is as follows:

```
├── docker-compose.yml
├── makefile
├── backend
│   ├── api
│   │   ├── migrations
│   │   └── tests
│   ├── authentication
│   │   ├── migrations
│   │   └── tests
│   ├── build-tools
│   ├── chat
│   │   ├── consumers
│   │   └── migrations
│   ├── game
│   │   ├── consumers
│   │   ├── managers
│   │   ├── migrations
│   │   ├── seed
│   │   ├── tests
│   │   └── utils
│   ├── public
│   │   ├── badges
│   │   ├── default
│   │   └── ranks
│   ├── transcendent
│   │   └── tests
│   └── user
│       ├── migrations
│       ├── seed
│       └── tests
├── frontend
│   ├── build-tools
│   ├── public
│   │   ├── assets
│   │   │   ├── badges
│   │   │   ├── icons
│   │   │   └── images
│   │   └── game
│   └── src
│       ├── _api
│       ├── components
│       │   ├── all_Online
│       │   │   ├── assets
│       │   │   ├── Controller
│       │   │   └── View
│       │   ├── all_Players
│       │   │   ├── assets
│       │   │   ├── Controller
│       │   │   └── View
│       │   ├── auth
│       │   │   ├── assets
│       │   │   ├── Controller
│       │   │   └── View
│       │   ├── block_list
│       │   │   ├── assets
│       │   │   ├── Controller
│       │   │   └── View
│       │   ├── chat
│       │   │   ├── assets
│       │   │   ├── Controller
│       │   │   └── View
│       │   ├── create_tournament
│       │   │   ├── assets
│       │   │   ├── Controller
│       │   │   └── View
│       │   ├── friends
│       │   │   ├── assets
│       │   │   ├── Controller
│       │   │   └── View
│       │   ├── game
│       │   │   ├── choice_game
│       │   │   │   ├── assets
│       │   │   │   ├── Controller
│       │   │   │   └── View
│       │   │   ├── in_game
│       │   │   │   ├── assets
│       │   │   │   │   └── table_textures
│       │   │   │   ├── Controller
│       │   │   │   └── View
│       │   │   └── match_making
│       │   │       ├── assets
│       │   │       ├── Controller
│       │   │       └── View
│       │   ├── home
│       │   │   ├── assets
│       │   │   ├── components
│       │   │   │   ├── assets
│       │   │   │   ├── Controller
│       │   │   │   └── View
│       │   │   ├── Controller
│       │   │   └── View
│       │   ├── navBar
│       │   │   ├── assets
│       │   │   ├── Controller
│       │   │   └── View
│       │   ├── notification
│       │   │   ├── assets
│       │   │   ├── Controller
│       │   │   └── View
│       │   ├── profile
│       │   │   ├── assets
│       │   │   ├── controller
│       │   │   └── view
│       │   ├── Ranking
│       │   │   ├── assets
│       │   │   ├── Controller
│       │   │   └── View
│       │   ├── settings
│       │   │   ├── assets
│       │   │   ├── Controller
│       │   │   └── View
│       │   ├── tournament
│       │   │   ├── assets
│       │   │   ├── Controller
│       │   │   └── View
│       │   └── tournaments
│       │       ├── assets
│       │       ├── Controller
│       │       └── View
│       └── lib
│           └── NotFound
├── nginx
│   └── conf
└── redis

```

## Installation

To run this project locally, follow these steps:

1. **Clone the repository:**

   ```sh
   git clone https://github.com/khadija-mahdi/ft_transcendence.git
   cd ft_transcendence
   ```

2. **Install Required Tools:**

   ```sh
   sudo apt-get install -y docker docker-compose make
   ```

3. **Run the development server:**

   ```sh
   make
   ```

4. **Set up the database:** Run this command in a separate terminal window

   ```sh
   make db
   ```

5. **Open your browser and navigate to:**

   ```
   https://localhost
   ```

6. **To stop the server:**

   ```sh
   make down
   ```

## Usage

Once the project is up and running, you can start exploring the features:

- **Play Matches:** Challenge random opponents or AI.
- **Tournaments:** Participate in community tournaments to rank higher.
- **Messaging & Chat:** Use live chat to communicate with friends or create group chats.

## Contributing

We welcome contributions! To contribute:

1. Fork the repository.
2. Create a new branch: `git checkout -b feature-branch`.
3. Make your changes and commit them: `git commit -m 'Add new feature'`.
4. Push to the branch: `git push origin feature-branch`.
5. Submit a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

## Contributors

This project was brought to life by a team of dedicated developers:

<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="33.33%">
        <a href="https://github.com/khadija-mahdi">
          <img src="https://avatars.githubusercontent.com/u/116581015?v=4?s=100" width="100px;" alt="Khadija Mahdi"/><br />
          <sub><b>Khadija Mahdi</b></sub>
        </a><br />
        Lead Developer
      </td>
      <td align="center" valign="top" width="33.33%">
        <a href="https://github.com/ayoub-aitouna">
          <img src="https://avatars.githubusercontent.com/u/29020220?v=4?s=100" width="100px;" alt="Ayoub Aitouna"/><br />
          <sub><b>Ayoub Aitouna</b></sub>
        </a><br />
        Lead Developer
      </td>
      <td align="center" valign="top" width="33.33%">
        <a href="https://github.com/OussamaDX">
          <img src="https://avatars.githubusercontent.com/u/98095867?v=4?s=100" width="100px;" alt="Oussama"/><br />
          <sub><b>Oussama SDx</b></sub>
        </a><br />
        Game Developer
      </td>
    </tr>
  </tbody>
</table>

## Contact

Feel free to reach out with any questions:

- **LinkedIn:** [Khadija Mahdi](https://www.linkedin.com/in/khadija-mahdi/)
- **LinkedIn:** [Ayoub Aitouna](https://www.linkedin.com/in/ayoub-aitouna/)
- **LinkedIn:** [Oussama SDx](https://www.linkedin.com/in/oussama-oussaada-031444207/)
---

Thank you for checking out **FT_Transcendent**!