#!/bin/bash

if [ "$DATA_PROBLEM" != "ecg_classification" ]; then
  echo "DATA_PROBLEM must be set to 'ecg_classification' to start the app. Current value: $DATA_PROBLEM"
  exit 1
fi

yarn migrate && yarn dev
