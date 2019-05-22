const request = require('request');

const forecast = (longitude, latitude, callback) => {
    const url = `https://api.darksky.net/forecast/5565207ec2497914cebf618e8f96a5b6/${latitude},${longitude}?units=si`;

    request({url, json: true}, (error, { body }) => {
        if(error){
            callback('Unable to connect to weather service!', undefined);
        } else if (body.error){
            callback('Unable to find location', undefined);
        } else {
            callback(undefined, {
                summary: body.daily.data[0].summary,
                temperature: body.currently.temperature,
                rain_probability: body.currently.precipProbability
            });
        }
    });
}

module.exports = forecast;
