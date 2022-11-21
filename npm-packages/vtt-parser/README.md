# VTT Parser

## Install

Install the package with the following command : 
```
npm i @polyflix/vtt-parser
```

## How to use

This module allows you to parse a VTT file from a raw file, or from an URL. Once the file is parsed, you'll have access to some methods like `getBlocks` to get an array of the subtitles present in the file.

Below an example for parse a VTT file from an URL :

```ts
import { VttFile } from '@polyflix/vtt-parser';

const url = "https://www.iandevlin.com/html5test/webvtt/upc-video-subtitles-en.vtt"

const file = await VttFile.fromUrl(url);

// To get the parsed subtitles :
file.getBlocks()
```

In this example, `JSON.stringify(file.getBlocks())` returns to you the following JSON string : 

```json
 [
  {
    "sequence": 0,
    "startTime": 3500,
    "endTime": 5000,
    "text": "Everyone wants the most from life"
  },
  {
    "sequence": 1,
    "startTime": 6000,
    "endTime": 9000,
    "text": "Like internet experiences that are rich <b>and</b> entertaining"
  },
  {
    "sequence": 2,
    "startTime": 11000,
    "endTime": 14000,
    "text": "Phone conversations where people truly <c.highlight>connect</c>"
  },
  {
    "sequence": 3,
    "startTime": 14500,
    "endTime": 18000,
    "text": "Your favourite TV programmes ready to watch at the touch of a button"
  },
  {
    "sequence": 4,
    "startTime": 19000,
    "endTime": 24000,
    "text": "Which is why we are bringing TV, internet and phone together in <c.highlight>one</c> super package"
  },
  {
    "sequence": 5,
    "startTime": 24500,
    "endTime": 26000,
    "text": "<c.highlight>One</c> simple way to get everything"
  },
  { 
    "sequence": 6, 
    "startTime": 26500, 
    "endTime": 27500, 
    "text": "UPC"
  },
  {
    "sequence": 7,
    "startTime": 28000,
    "endTime": 30000,
    "text": "Simply for <u>everyone</u>"
  }
```

