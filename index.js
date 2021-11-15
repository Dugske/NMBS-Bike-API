const express = require('express');
const faunadb = require("faunadb");
const client = new faunadb.Client({
  secret: process.env['clientKey'],
  domain: 'db.eu.fauna.com',
  scheme: 'https',
});
const fetch = require("node-fetch");

const {
    Ref,
    Paginate,
    Get,
    Match,
    Select,
    Index,
    Create,
    Collection,
    Join,
    Call,
    Function: Fn,
} = faunadb.query;

const api = express();
api.listen(3000, () => {
  console.log("running");
});

api.get('/', (req, res) => {
return res.send("https://dugske.github.io/NMBS-Bike-API/")
});

api.get('/getBikeCarriges/:id/:str?', (req, res) => {
  console.log(req.params.id)
   fetch(`https://api.irail.be/composition/?id=BE.NMBS.${req.params.id}&format=json`)
    // Handle success 
    .then(json => json.json())
    .then(promise => {
      if (req.params.str == "size"){
      return res.send(promise.composition.segments.segment[0].composition.units.number)  
      }
      else if (req.params.str == "amount") {
 amountOfBikeCarriges = 0;
        units = (promise.composition.segments.segment[0].composition.units.unit)
        for (i in Object.keys(units)) {
          if (units[i].hasBikeSection == 1) {amountOfBikeCarriges++}
        }
        return res.send(amountOfBikeCarriges.toString())
      }
      else {
        amountOfBikeCarriges = [];
        units = (promise.composition.segments.segment[0].composition.units.unit)
        for (i in Object.keys(units)) {
          if (units[i].hasBikeSection == 1) {amountOfBikeCarriges.push(i)}
        }
        return res.send(amountOfBikeCarriges.toString())
        }
      })
    .catch(err => console.log('Request Failed', err)); 
});

api.get('/addReservation/:train/:wagonId/:ticket', async (req, res) => {

const trainId = req.params.train.split('')
  .map(x=>x.charCodeAt(0))
  .reduce((a,b)=>a+b)
  .toString()

  const ticket = req.params.ticket.split('')
  .map(x=>x.charCodeAt(0))
  .reduce((a,b)=>a+b)
  .toString()



  const docs = await client.query(
    Create(Ref(Collection("Reservations"), trainId),  { data: { ["wagon"+req.params.wagonId]: [ticket ], }})
  ).catch(err => console.log('Request Failed', err))
  
  res.send(docs)



})

api.get('/train/:id/:str?', (req, res) => {
  console.log(req.params)
  return res.send(req.params.id);
});
