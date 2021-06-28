#!/usr/bin/env python3

from os import system
from json import load

f = open('./package.json')
p = load(f)
a = ' '.join(p['dependencies'].keys())
system('yarn add ' + a)
f.close()

if __name__ == '__main__':
    print('[INFO] Running as a script')
