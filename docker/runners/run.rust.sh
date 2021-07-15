#!/bin/sh
    cd ./benchmarks
    for dir in ./*
    do
      dir=${dir##*/}
      filename="/app/results/$dir-rust-$(date +%Y-%m-%d)"

      touch $filename
      cd $dir
      for file in $(find -type f -name "*.rs");
      do
      
    perf stat -o ./res rustc $file
    cat ./res | /app/run.js >> $filename
    perf stat -o ./res ./$(basename $file .rs)
    cat ./res | /app/run.js >> $filename
  
      done;
      cd ..
    done