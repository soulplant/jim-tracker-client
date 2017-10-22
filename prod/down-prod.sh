#!/bin/bash

jsonnet prod.jsonnet | kubectl delte -f -
