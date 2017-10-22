#!/bin/bash

jsonnet prod.jsonnet | kubectl apply -f -
