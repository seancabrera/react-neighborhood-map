const CLIENT_ID = 'QW4WDLEUGK3RMYTPWRRP5V00JXXZI0HI1QBKYINHWWGTS3BJ';
const CLIENT_SECRET = 'RVLDYUW3HMSKXSL53LHLYIQNL1Q544ARWNK4B3ZDLAHWFJSF';

export const getRecommendedVenues = () => {
  return fetch(`https://api.foursquare.com/v2/venues/explore?query=bars&near=Waikiki&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&v=20190201`)
    .then(response => {
      if(!response.ok) {
        throw Error('Error fetching recommended venues from FourSquare');
      }

      return response.json()
    })
    .then(data => {
      if(data.meta.code !== 200) {
        throw Error('Error fetching recommended venues from FourSquare');
      }

      const places = data.response.groups[0].items;
      let venues = places.map(place => place.venue);
      venues = venues.sort(sortByVenueName);
      return venues;
    });
}

export const getVenueDetails = (venueId) => {
  return fetch(`https://api.foursquare.com/v2/venues/${venueId}?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&v=20190201`)
    .then(response => {
      if(!response.ok) {
        throw Error('Error fetching venue details from FourSquare');
      }

      return response.json()
    })
    .then(data => {
      if(data.meta.code !== 200) {
        throw Error('Error fetching venue details from FourSquare');
      }

      return data.response.venue;
    });
}

export const getFourSquarePageUrl = (venueId) => {
  return `https://foursquare.com/v/${venueId}?ref=${CLIENT_ID}`;
}

function sortByVenueName(a, b) {
  if(a.name > b.name) return 1;
  if(b.name > a.name) return -1;
  return 0;
}