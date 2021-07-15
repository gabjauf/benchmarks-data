#!/bin/sh
    cd ./benchmarks
    for dir in ./*
    do
      dir=${dir##*/}
      filename="/app/results/$dir-go-$(date +%Y-%m-%d)"

      touch $filename
      cd $dir
      for file in $(find -type f -name "*.go");
      do
      
    perf stat -o ./res go build $file
    cat ./res | /app/run.js >> $filename
    perf stat -o ./res ./$(basename $file .go)
    cat ./res | /app/run.js >> $filename
  
      done;
      cd ..
    done