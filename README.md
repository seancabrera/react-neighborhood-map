# Neightborhood Map Project
---

## Project Overview

The goal of this project was to build a neighborhood map using React, Google Maps and a 3rd party data API. I chose to use FourSquare as the 3rd party API.

The app shows bars in Waikiki recommended from FourSquare. Selecting a bar either in the list view or on the map will show additional details of the bar

## Instructions

The following instructions can be used to run a production build of the app locally.

First clone or download the project:

`git clone https://github.com/seancabrera/react-neighborhood-map`

NOTE:
In index.html, "GOOGLE_MAPS_KEY" must be replaced with a valid Google Maps API key.
In FourSquareAPI.js, "CLIENT_ID" and "CLIENT_SECRET" must be replaced with valid keys from FourSquare.

Then, in a terminal, navigate to the downloaded repository and run the following npm commands:

`npm install`

`npm run build`

`npm install -g serve`

`serve -s build`

Then open the following url in your browser
`http://localhost:5000/`
