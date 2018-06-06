#!/bin/bash
ng build @helgoland/core
ng build @helgoland/caching
ng build @helgoland/control
ng build @helgoland/depiction
ng build @helgoland/favorite
ng build @helgoland/map
ng build @helgoland/modification
ng build @helgoland/permalink
ng build @helgoland/selector
ng build @helgoland/time
ng build @helgoland/time-range-slider
ng build @helgoland/d3
ng build @helgoland/plotly
ng build @helgoland/flot
cp projects/helgoland/flot/src/lib/*.js dist/helgoland/flot/