const express = require('express');
const scrapeCalendar = require('./tanggalan');

const app = express();
const port = process.env.port || 4000;

app.get('/api/calendar', async (req, res) => {
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

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
