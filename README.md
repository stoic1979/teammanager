# teammanager
Open source team/project management system written in MEAN stack.

## Features

Team manager has the following features:-
 - Token based auth, login/signup
 - REST APIs (with token auth)
 - A team manager registers his/her account, create a team and invites team members.
 - A team manager creates projects, assigns tasks and monitor progress.
 - A team member updates progress on tasks, can comment on tasks, changes status to done when finished etc.
 - User role based UI
 - Unit tests with Mocha/Chai
 - Charts for visualizing project status etc.
 - Admin panel for administration.


# Watch Demo
[Live Demo On Heroku](https://teammanager9.herokuapp.com)

# Dashboard screenshot
![Alt text](screenshots/dashboard.png?raw=true "Dashboard - add project")

# Issues screenshot
![Alt text](screenshots/issues.png?raw=true "Issues for a project")

# Mocha unit test screenshot
![Alt text](screenshots/mocha_tests.png?raw=true "Dashboard - add project")

## Getting started
First of all, you must have **nodejs** and **mongodb** installed on your computer.

Run these commands in your terminal in the directory of the cloned repository.

```
npm install
node test
node start
```

Technical Stack
---------------

 - Back-end: Node, Express, Mongoose/MongoDB
 - Front-End: JQuery, Bootstrap, Angularjs
 - Unit Tests: Mocha, Chai

Motivation to create Team Manager?
-------------------------------
I was using JIRA for task/project management but it is paid and has so many features that I dont need.
I was looking for a compact minimalist team management system, so I created this one for myself and for my small team.
Would anticipate that this open source project would be useful to anyone who has same need !

