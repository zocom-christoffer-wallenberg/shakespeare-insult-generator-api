const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const webpush = require('web-push');
const app = express();
const port = process.env.PORT || 3000;
let insults = [];

app.use(cors());
app.use(bodyParser.json());

const vapidKeys = {
    publicKey: 'BOZGoy3XBimNMwTFc08sctwfCsKAkZYb3LDUCx39ecNv4KeBkIDBIfvi0IniaCLG2KTWpxxBYdV8H_tUFbj_RSs',
    privateKey: 'FqhiGP8Ul_CqCFS0h_msNIdJL18KOi3zUBpmKzbPta4',
}

webpush.setVapidDetails(
    'mailto:myuserid@email.com',
    vapidKeys.publicKey,
    vapidKeys.privateKey
)

const dummyDb = { subscription: null }

const saveToDatabase = async (subscription) => {
  dummyDb.subscription = subscription;
  console.log(dummyDb)
}

const sendNotification = (subscription, dataToSend) => {
    webpush.sendNotification(subscription, dataToSend)
}

const createInsult = (shakespeareInsult, shakespearePlay) => {
    let obj = {
        insult: shakespeareInsult,
        play: shakespearePlay
    }

    return obj;
}

const reset = () => {
    insults = [
        createInsult('Were such things here as we do speak about? Or have we eaten on the insane root That takes the reason prisoner?', 'Macbeth'),
        createInsult('Never hung poison on a fouler toad', 'Rickard III'),
        createInsult('He thinks too much: such men are dangerous.', 'Julius Ceasar'),
        createInsult('Thou calledst me a dog before thou hadst a cause. But since I am a dog, beware my fangs.', 'The Merchant of Venice'),
        createInsult('Give me your hand...I can tell your fortune. You are a fool.', 'The Two Noble Kinsmen'),
        createInsult('He smells like a fish, a very ancient and fish-like smell, a kind of not-of-the-newest poor-John. A strange fish!', 'The Tempest'),
        createInsult('It is a tale Told by an idiot, full of sound and fury, Signifying nothing.', 'Macbeth'),
        createInsult('Alas, poor heart, that kiss is comfortless As frozen water to a starved snake', 'Titus Andronicus'),
        createInsult('He hath eaten me out of house and home; he hath put all substance into that fat belly of his.', 'Henry IV, Part 2'),
        createInsult('Out, you green-sickness carrion! Out, you baggage! You tallow-face!', 'Romeo and Juliet')
    ]
}

const removeInsult = (index) => {
    insults.splice(index, 1);
}

const randomize = () => {
    return new Promise((resolve, reject) => {
        if (insults.length === 0) {
            reset();
        }

        const index = Math.floor(Math.random() * insults.length);
        resolve(index);
    })
}

app.get('/getInsult', async (req, res) => {
    const index = await randomize();
    res.send(insults[index]);
    removeInsult(index);
});

app.get('/getAll', (req, res) => {
    res.send(insults);
});

app.post('/notifications/save', (req, res) => {
    const body = req.body;

    saveToDatabase(body);

    res.send(JSON.stringify({ success: true }));
});

app.get('/notifications/send', (req, res) => {
    const message = 'Up for a insult?';
    const subscription = dummyDb.subscription;

    sendNotification(subscription, message);

    res.send(JSON.stringify({ success: true }));
});

reset();

app.listen(port);

console.log('todo API server started on: ' + port);