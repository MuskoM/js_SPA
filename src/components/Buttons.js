// import React from 'react';
import { styled } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

export const PrimaryButton = styled(Button)({
  background: 'linear-gradient(30deg, #ffd400 30%, #ffeb85 90%)',
  border: 0,
  borderRadius: 3,
  boxShadow: '0 3px 5px 2px rgba(255, 212, 0, .4)',
  color: 'black',
  height: 48,
  padding: '0 30px',
});


export const SecondaryButton = styled(Button)({
  background: 'linear-gradient(45deg, #ac3931 30%, #d26760 90%)',
  border: 0,
  borderRadius: 3,
  boxShadow: '0 3px 5px 2px rgba(210, 103, 96, .4)',
  color: 'white',
  height: 48,
  padding: '0 30px',
  });

  export default PrimaryButton;