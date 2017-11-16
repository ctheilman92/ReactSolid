import subprocess

###################
###################
## This script used for:
## running the testrpc blockchain with the same mnemonic
###################
###################

cmd = 'testrpc -m "excuse acoustic category globe step easy diagram ensure total weather lock unaware"'
proc = subprocess.call(cmd, shell=True)