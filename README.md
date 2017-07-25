<p align="center">
  <h1 align="center">HNPWA Firebase</h1>
  <p align="center">A Dynamic, CDN Cached, HNPWA implementation on Firebase Dynamic Hosting.</p>
</p>
<p align="center">
  <a align="center" href="https://hnpwa-firebase.firebaseapp.com"><h3 align="center">Demo</h3></a>
</p>
<p align="center">
<a href="https://hnpwa-firebase.firebaseapp.com">
<img width="284" height="524" src="https://raw.githubusercontent.com/davideast/hnpwa-firebase/master/hnpwa-firebase.png">
</a>
</p>

## Highlights

- **Emerging Markets** - 1.3
- **3G** - 0.7
- **CDN Cached** - Every file on Firebase Hosting is served through a CDN
- **Dynamic** - Cloud Functions + Firebase Hosting = Dynamic CDN population

## Contribute!?

```bash
git clone https://github.com/davideast/hnpwa-firebase.git
npm i
npm run build

# Basic serving
npm run serve

# Firebase Hosting Emulation
node_modules/.bin/firebase login 
# Use your own project
node_modules/.bin/firebase use -add <your-test-proj>
npm run serve:firebase

# Offline serving A.K.A - Deving on an Airplane/bus/elevator
npm run save:offline # save current HNAPI data set offline
# go offline
npm run serve:offline:api
# open new terminal or tmux or something
npm run serve:offline
```
