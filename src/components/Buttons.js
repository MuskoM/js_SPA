import React from 'react';
import { styled } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

export const PrimaryButton = styled(Button)({
  background: 'linear-gradient(30deg, #00c49a 30%, #47FFD7 90%)',
  border: 0,
  borderRadius: 3,
  boxShadow: '0 3px 5px 2px rgba(71, 255, 215, .4)',
  color: 'white',
  height: 48,
  padding: '0 30px',
});


export const SecondaryButton = styled(Button)({
  background: 'linear-gradient(45deg, #AB4E68 30%, #fa824c 90%)',
  border: 0,
  borderRadius: 3,
  boxShadow: '0 3px 5px 2px rgba(250, 130, 76, .4)',
  color: 'white',
  height: 48,
  padding: '0 30px',
  });

  export default PrimaryButton;