const axios = require('axios');
const cheerio = require('cheerio');

const url = 'https://www.tanggalan.com';

async function scrapeTanggalan() {
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        const year = $('#now').text().trim().match(/\d{4}/)[0];

        const result = {
            code: 200,
            tahun: year,
            data: [],
            message: "Berhasil menampilkan kalender tahun "+year
        };

        $('article ul').each((index, ul) => {
            const $ul = $(ul);
            const monthNameWithYear = $ul.find('li').first().text().trim().toLowerCase();
            const monthName = monthNameWithYear.replace(/[0-9]/g, '').trim();

            let kerja = 0;
            let libur = 0;
            let tanggal_merah = [];

            $ul.find('li').not(':first-child').each((liIndex, li) => {
                const $li = $(li);
                let dayCounter = 0;

                $li.children().each((i, elem) => {
                    if (elem.tagName === 's') {
                        dayCounter++;
                    } else if (elem.tagName === 'a') {
                        dayCounter++;
                        const isHoliday = $(elem).attr('style') === 'color: #f00;';

                        if (dayCounter % 7 === 0) {
                            libur++;
                        } else if (isHoliday) {
                            libur++;
                        } else {
                            kerja++;
                        }
                    }

                    if (dayCounter % 7 === 0 && elem.tagName === 'a') {
                        kerja--;
                        libur++;
                    }
                });
            });

            const lastLi = $ul.find('li').last();
            lastLi.find('tr').each((trIndex, tr) => {
                const $tr = $(tr);
                const tanggal = $tr.find('td').first().text().trim();
                const memperingati = $tr.find('td').last().text().trim();
                tanggal_merah.push({ tanggal, memperingati });
            });

            result.data.push({
                bulan: monthName,
                kerja,
                libur,
                tanggal_merah
            });
        });

        return result;
    } catch (error) {
        return {
            code: 500,
            data: [],
            message: `Failed to get calendar: ${error.message}`
        };
    }
}


module.exports = scrapeTanggalan;
