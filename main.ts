import devRant = require('ts-devrant');
import arg = require('arg');
import fetch from 'node-fetch';
import fs = require('fs');


import relativeTime = require('dayjs/plugin/relativeTime');
import updateLocale = require('dayjs/plugin/updateLocale');

import dayjs = require('dayjs');
import { PostType, RantType } from 'ts-devrant';

dayjs.extend(updateLocale);
dayjs.extend(relativeTime);

let token;
let nextShittyPost = Date.now();
const oneHour = 1e3 * 60 * 60
const twoHours = oneHour * 2.5;

const args = arg({
    '--username': String,
    '--password': String,
});

const shittyCodingInstaProfiles = [
    "https://www.instagram.com/meme_coding/?hl=de",
    "https://www.instagram.com/_codehub_/?hl=de",
    "https://www.instagram.com/programmermemes__/",
    "https://www.instagram.com/coderhumor/",
    "https://www.instagram.com/programmer.me/",
    "https://www.instagram.com/pycoders/",
    "https://www.instagram.com/programer.life/"
]

function randomOfList<T>(list: T[]): T {
    return list[
        Math.floor(
            Math.random() * list.length
        )
    ];
}

async function getRandomPostFromInsta(instaUrl) {
    const instaProfileResponse = await fetch(instaUrl);
    const instaDocumentText = await instaProfileResponse.text() as unknown as typeof String & { matchAll: Function };

    const shittyMemes: string[] = Array.from(
        instaDocumentText.matchAll(/"display_url":"([^"]*)/gm)
    ).map(match => match[1])

    return randomOfList(shittyMemes);
}

async function getRandomMemeToPost() {
    const candidate = randomOfList(shittyCodingInstaProfiles);
    const randomImageMeme = await getRandomPostFromInsta(candidate);

    const srcURL = randomImageMeme.replace(/\\u0026/gi, '&');
    console.log(srcURL);

    const image = await fetch(srcURL)
    return image.buffer();
}

function createRandomMemeReaction() {
    const reactionLength = 1 + Math.round(Math.random() * (Math.random() * 15))
    const reactions = [];

    for (let i = 0; i < reactionLength; i++) {
        reactions.push(randomOfList([..."😅😂🤣😄🙃😍🤪🤷‍♂️🤓🥺🤭🤔😲😮😹"]))
    }

    return reactions.map(reaction => {
        const quirks = new Array(
            Math.round(Math.random())
        )
            .fill(null)
            .map(() => randomOfList([..."   , .. \"'     !!!     ▒"]))

        return reaction + quirks.join('')
    })
        .join('')
        .replace(/^[\s.',]*/, '')
}

async function postShittyMeme() {
    const memeImageStream = await getRandomMemeToPost();
    const memeReaction = createRandomMemeReaction();

    // const response = await devRant.postRant(memeReaction, [], RantType.JokeMeme, memeImageStream, token)
    // console.log('Posted shitty meme!', response)
}

async function setupPostingShittyMemesTimer() {
    setInterval(() => {
        const now = Date.now();
        if (now > nextShittyPost) {
            postShittyMeme()
            nextShittyPost = Date.now() + twoHours
        } else {
            console.log(
                `Posting the next shitty theme ${dayjs(nextShittyPost).fromNow()}`
            )
        }
    }, 1e3)
}

async function main({
    "--username": username,
    "--password": password
}: { [key: string]: any }) {
    // const session = await devRant.login(username, password);
    // token = session.auth_token

    // if (session.success) {
    //     console.log('Logged in! Posting shitty memes now...')
    // }

    setupPostingShittyMemesTimer()
}

main(args);