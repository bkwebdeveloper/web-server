const path = require('path');
const express = require('express');
const hbs = require('hbs');
const geocode = require('./utils/geocode');
const forecast = require('./utils/forecast');

const app = express();
const port = process.env.PORT || 3000;

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public');
const viewPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials')

// Setup handlebars engine and views location
app.set('view engine', 'hbs');
app.set('views', viewPath);
hbs.registerPartials(partialsPath);

// Setup static directory to server
app.use(express.static(publicDirectoryPath));

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather App',
        name: 'Bablu Kumar'
    });
});

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Page',
        name: 'Bablu Kumar'
    });
});

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help Page',
        message: 'A helpful message',
        name: 'Bablu Kumar'
    });
});

app.get('/weather', (req, res) => {
    if(!req.query.address) {
        return res.send({
            error: 'Address must be provided in a search term.'
        });
    }
    geocode(req.query.address, (error, {longitude, latitude, location} = {}) => {
        if(error){
            return console.log(error);
        }
        forecast(longitude, latitude, (error, {summary, temperature, rain_probability} = {}) => {
            if(error){
                return console.log(error);
            }
            res.send({
                forecast: `${summary} It is currently ${temperature} degrees celsius out. There is a ${rain_probability}% chance of rain.`,
                location,
                address: req.query.address
            })
        });
    });
});

app.get('/help/*', (req, res) => {
    res.render('404', {
        errorMessage: 'Help article not found.'
    });
});

app.get('*', (req, res) => {
    res.render('404', {
        errorMessage: 'Page not found'
    });
});

app.listen(port, () => {
    console.log('Server is up on port ' + port);
});