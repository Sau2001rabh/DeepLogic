const express = require('express');
const dotenv = require('dotenv');
const errorHandler = require("./errorHandler");
const extractStories = require('./extractLatestStories');
const fetchDataByHTMLProcessing = require('./fetchData');

dotenv.config();
const app = express();
app.use(express.json())

const url = 'https://time.com/';
fetchDataByHTMLProcessing(url)
    .then(html => {
        const latestStories = extractStories(html);

        app.get('/getTimeStories', (req, res) => {
            if (latestStories.statusCode === 200)
                console.log(latestStories.data);
            res.status(latestStories.statusCode).json({ message: latestStories.message, data: latestStories?.data });
        });

    })
    .catch(error => {
        console.error('Error fetching HTML:', error);
        process.exit(1);
    });

app.use(errorHandler);


//Listening to port
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
