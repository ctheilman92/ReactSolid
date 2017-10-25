import subprocess

###################
###################
## This script used for:
## running the testrpc blockchain with the same mnemonic
###################
###################

cmd = 'testrpc -m "Elegant Acrobatic Damsels Greeted Big Elvis Slouchingly For Zonked Fishmongers Choked Greasily"'
proc = subprocess.call(cmd,shell=True)