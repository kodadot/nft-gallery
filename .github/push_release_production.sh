#!/bin/bash
# experimental 
# https://github.com/kodadot/nft-gallery/issues/5770 

gh pr list -s merged --json url -B main --jq ".[] | .url" | sed 's/^/- /' $1 | awk 'BEGIN{print "copilot:summary \n"}{ print}' $1 | gh pr create -t "release update" -d -H beta -B production-cf -l release --body-file -
