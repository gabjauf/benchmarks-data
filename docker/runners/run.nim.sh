#!/bin/sh
    cd ./benchmarks
    for dir in ./*
    do
      dir=${dir##*/}
      filename="/app/results/$dir-nim-$(date +%Y-%m-%d)"

      touch $filename
      cd $dir
      for file in $(find -type f -name "*.nim");
      do
      
    perf stat -o ./res nim c $file
    cat ./res | /app/run.js >> $filename
    perf stat -o ./res ./$(basename $file .nim)
    cat ./res | /app/run.js >> $filename
  
      done;
      cd ..
    done