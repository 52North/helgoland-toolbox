#!/bin/bash
ng build @helgoland/core --prod
ng build @helgoland/caching --prod
ng build @helgoland/control --prod
ng build @helgoland/depiction --prod
ng build @helgoland/favorite --prod
ng build @helgoland/map --prod
ng build @helgoland/modification --prod
ng build @helgoland/permalink --prod
ng build @helgoland/selector --prod
ng build @helgoland/time --prod
ng build @helgoland/time-range-slider --prod
ng build @helgoland/d3 --prod
ng build @helgoland/plotly --prod
ng build @helgoland/flot --prod
cp projects/helgoland/flot/src/lib/*.js dist/helgoland/flot/