# SCURE DIALOGFLOW - Script Creation Utilities for Ric Escape (Conversational adventures) with Dialogflow / Google Assistant.

SCURE DIALOGFLOW is a javascript enginge for creating conversational or adventure games for Google Assistant (through dialogflow) 

SCURE is a javascript engine for creating conversational or adventure games.

## Usage

Check https://github.com/jmarti-theinit/ric-escape to see an example.

- Create a data.js, with the json of the definition of the game.
- Create a walkthrough.js to test the game
- Create an index.js to publish require('scure-dialogflow').app as "app" from dialogflow to cloud functions.
- Publish the game through firebase functions.
- Create an app in Actions On Google, and Dialogflow; and use fullfilment.

## Instalation

npm install --save scure-dialogflow

## Instructions and commands

- require('scure-dialogflow').sdk and .dsl to build the walkthrough commands
- require('scure').dsl : functions to build the data JSON.
