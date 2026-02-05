#!/bin/bash
# Bypass Keychain for ONE push so you can paste the token when prompted.
# Run: ./push-with-token.sh
# When it asks for "Password", paste your GitHub Personal Access Token.
cd "$(dirname "$0")"
git -c credential.helper= push -u origin main
