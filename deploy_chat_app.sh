#!/usr/bin/env bash
git subtree push --prefix chat-app heroku-chat-app master
#git push heroku-chat-app `git subtree split --prefix chat-app master`:master --force
