import React from 'react';
import FourSquareLogoImage from './powered-by-foursquare-grey.svg';

function FourSquareLogo(props) {
  return (
    <div className="foursquare-logo">
      <img src={FourSquareLogoImage} alt="FourSquare logo"/>
    </div>
  );
}

export default FourSquareLogo;