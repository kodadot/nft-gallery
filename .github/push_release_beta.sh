#!/bin/bash
# experimental 
# https://github.com/kodadot/nft-gallery/issues/5770 

gh pr list -s merged --json url -B main --jq ".[] | .url" | sed 's/^/- /' $1 | awk 'BEGIN{print "Beta Update \n"}{ print}' $1 | gh pr create -t "beta update" -d -H main -B beta -l beta --body-file -
