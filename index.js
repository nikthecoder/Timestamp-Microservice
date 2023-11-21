// index.js
// where your node app starts

const express = require('express');
const app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC
const cors = require('cors');
app.use(cors({ optionsSuccessStatus: 200 })); // Added a closing parenthesis here

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function(req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

// Timestamp microservice API endpoint
app.get("/api/:date", function(req, res) {
  const inputDate = req.params.date;
  let result = {};

  function formatUTC(date) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const year = date.getUTCFullYear();
    const month = months[date.getUTCMonth()];
    const day = date.getUTCDate();
    const time = date.toUTCString().split(' ')[4];

    return `${days[date.getUTCDay()]}, ${day} ${month} ${year} ${time} GMT`;
  }

  if (!inputDate) {
    // If no date is provided, return the current time
    const now = new Date();
    result = { unix: now.getTime() * 1000, utc: formatUTC(now) };
  } else if (!isNaN(inputDate)) {
    // If the input is a Unix timestamp, convert it to a date and return the Unix timestamp in milliseconds and UTC time
    const timestamp = new Date(parseInt(inputDate, 10));
    result = { unix: timestamp.getTime(), utc: formatUTC(timestamp) };
  } else {
    // Try parsing the input date string as "YYYY-MM-DD"
    const dateParts = inputDate.split('-');
    if (dateParts.length === 3) {
      const year = parseInt(dateParts[0], 10);
      const month = parseInt(dateParts[1], 10) - 1;
      const day = parseInt(dateParts[2], 10);
      const date = new Date(Date.UTC(year, month, day));
      if (!isNaN(date)) {
        result = { unix: date.getTime(), utc: formatUTC(date) };
      } else {
        result = { error: "Invalid Date" };
      }
    } else {
      result = { error: "Invalid Date" };
    }
  }

  res.json(result);
});




// listen for requests
const listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});
