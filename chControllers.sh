#!/bin/bash

for file in ~/putni-nalozi/IzvorniKod/src/main/java/com/progi/AlfaBeta/putninalozi/rest/*
do
sed -i "s/http:\/\/localhost:3000/https:\/\/$1/g" $file
done
