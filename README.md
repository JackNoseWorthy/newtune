# newTune

newTune is a web application and email notification system that lets you know when your favourite artists release new music. Using the spotify api, newTune checks for new music weekly and sends you an email with links to new singles, EPs and albums from the artists you love.

## Usage

### Steps to run newTune

In the `newtune/backend` directory:
1. `npm run db`
2. `npm start`
3. `npm run cron-job`

In the `newtune/frontend/newtune` directory:
1. `npm start`

### Website

The newTune website runs on port `localhost:3000`. To create a newTune account, enter [localhost:3000/sign-up](http://localhost:3000/sign-up) in the address bar of your browser and enter your email and a password. Note that you will need a spotify account to use newTune. If you don't have an account, you can sign up for free at [spotify.com/signup].

Once you've created an account, search for the artists you want notifications for, scroll through the results and click add. That's it! You'll get an email from newTune when any of the artists you've added release new music.

### Email Notifications

Email notifications are scheduled to be sent weekly on Sundays at 11:59pm. If you don't see an email from newtune.noreply@gmail.com when you wake up on Monday, it means that newTune didn't find any new music for you that week.