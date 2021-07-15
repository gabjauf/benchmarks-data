#!/bin/sh
    cd ./benchmarks
    for dir in ./*
    do
      dir=${dir##*/}
      filename="/app/results/$dir-elixir-$(date +%Y-%m-%d)"

      touch $filename
      cd $dir
      for file in $(find -type f -name "*.ex");
      do
      
    perf stat -o ./res $BENCHMARKED_LANG 
    cat ./res | /app/run.js >> $filename
  
      done;
      cd ..
    done