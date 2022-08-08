# ReadMe
Bedienungsanleitung findest du unter: vokabeldojo.web.app/about

# Tests
## Firestore rule tests
Um die Firestore db security Regeln zu testen, verwende
```
firebase emulators:exec "npm run test-jest"
```
Das Ruleset für die db befindet sich in ./firestore.rules, die tests dazu unter src/spec/*.spec.js


## Angular functional/unit tests
Um die Tests für die Vokabeldojo Components zu testen, verwende
```
npm test -- --no-watch --no-progress --browsers=ChromeHeadlessCI
```
Die Karma configuration ist karma.conf.js, die test dateien befinden sich als *.spec.ts neben den Code Dateien.


# Development
## Run with local emulators
```
# emulators run in foreground
# firebase emulators:start and more in this command
npm run emulators

# start project in second terminal window
Terminal 2: ng s --configuration=development
```

# Troubleshoot
## Port 8080 is not open on localost, could not start Firestore Emulator
```
lsof -i :8080
ps ax | grep [PID]
# find one like /Users/rs/.cache/firebase/emulators/cloud-firestore-emulator-v1.13.1.jar
kill [PID]
```


# CI/CD with Github Actions
Automatisierte Tests via Github Actions für pushes und pull requests sind aktiv.
Du findest die runner im Verzeichnis ```.github/workflows```
Bei erfolgreichem Run, findest du einen 7 Tage lang gültigen Link um die Testversion gegen Prod zu sehen.

Pushes gegen Master werden automatisch ausgerollt.