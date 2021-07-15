#!/bin/sh
filename="./results/$BENCHMARKED_LANG-$(date +%Y-%m-%d)"

touch $filename
echo $filename

perf stat -o $filename $BENCHMARKED_LANG $1
