import React from 'react';
import { styled } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

export const PrimaryButton = styled(Button)({
  background: '#ffd400',
  border: 0,
  borderRadius: 3,
  color: '#35393c',
  height: 48,
  padding: '0 30px',
});


export const DangerButton = styled(Button)({
    background: '#ba1200',
    border: 0,
    borderRadius: 3,
    color: 'white',
    height: 48,
    padding: '0 30px',
    marginTop: '2rem'
  });

  export default PrimaryButton;