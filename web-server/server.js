const express = require('express');
const hbs = require('hbs');

const path = require('path');
const fs = require('fs');

const port = process.env.PORT || 3000;
const app = express();

hbs.registerPartials(path.join(__dirname, 'views', 'partials'));

app.set('view engine', 'hbs');
app.use((req, res, next) => {
    const now = new Date().toString();
    const log = `${now} ${req.method} ${req.url}`;

    console.log(log);

    fs.appendFile('server.log', `${log} \n`, err => {
        if (err) {
            console.log(`Error been happen o`)
        }
    });
    next();
});

// app.use((req, res, next) => {
//    res.render('maintenance.hbs', {
//        pageTitle: 'Working hard to please you!'
//    })
// });

app.use(express.static(path.join(__dirname, 'public')));

hbs.registerHelper('currentYear', () => {
    return new Date().getFullYear();
});

hbs.registerHelper('toUpperCase', (text) => {
    return text.toUpperCase();
});

app.get('/', (req, res) => {
    res.render('home.hbs', {
        pageTitle: `You're most welcome!`,
        welcomeMessage: `I welcome you in the name of the God and Father of our Lord Jesus Christ, who has blessed us with all spiritual blessing in Heavenly places`,
    })
});

app.get('/about', (req, res) => {
    res.render('about.hbs', {
        pageTitle: 'About Me',
    })
});

app.get('/projects', (req, res) => {
    res.render('projects.hbs', {
        pageTitle: 'Projects'
    })

});

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
});