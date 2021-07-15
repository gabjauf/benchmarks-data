#!/bin/sh
    cd ./benchmarks
    for dir in ./*
    do
      dir=${dir##*/}
      filename="/app/results/$dir-zig-$(date +%Y-%m-%d)"

      touch $filename
      cd $dir
      for file in $(find -type f -name "*.zig");
      do
      
    perf stat -o ./res zig build-exe $file
    cat ./res | /app/run.js >> $filename
    perf stat -o ./res ./$(basename $file .zig)
    cat ./res | /app/run.js >> $filename
  
      done;
      cd ..
    done