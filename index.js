const express = require('express');
const path = require('path');
const scrapeCalendar = require('./tanggalan');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());

app.use(express.static(path.join(__dirname)));

app.get('/favicon.ico', (req, res) => (
       res.status(200).sendFile(path.join(__dirname, 'favicon.ico'))
));

app.get('/api', async (req, res) => {
    try {
        const calendarData = await scrapeCalendar();
        res.json(calendarData);
    } catch (error) {
        res.status(500).json({
            code: 500,
            data: [],
            message: `Failed to get calendar: ${error.message}`
        });
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
    console.log(`Server is running on ${port}`);
});
