#!/bin/bash
file="./imports"
while IFS=: read -r f1
do
	touch "$f1".vue
	cat script.txt | sed s/Basic/"$f1"/g >> "$f1".vue
	printf 'Name: %s \n' "$f1".vue
done <"$file"
