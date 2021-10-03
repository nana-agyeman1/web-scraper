const PORT = 8000
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const fs = require('fs') 
const { response } = require('express')

const app = express()

const url = 'https://www.theguardian.com/uk'
let articles = []
var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();

today = mm + '-' + dd + '-' + yyyy;

axios(url)
    .then(response => {
        const html = response.data
        const $ = cheerio.load(html)
        
        $('.fc-item__title', html).each(function() {
            const title = $(this).text()
            const url = $(this).find('a').attr('href')

            articles.push({
                title,
                url
            })
        })

        
        console.log(articles)

    
        const csvWriter = createCsvWriter({
    
            path: "out " + today + ".csv",
            header: [
                {id: 'title', title: 'Title'},
                {id: 'url', title: 'Url'},
            ]
          });

        csvWriter
          .writeRecords(articles)
          .then(()=> console.log('The CSV file was written successfully'));
    
           
    }).catch(err => console.log(err))


app.listen(PORT, () => console.log('server running on PORT', PORT ))