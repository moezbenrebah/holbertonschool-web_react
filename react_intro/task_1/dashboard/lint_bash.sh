#!/bin/bash

npm run lint

if [ $? -eq 0 ]; then
  echo "OK"
else
  echo "NOK"
fi