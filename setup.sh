echo "Creating Volume Mixer settings from template"
# -n flag prevents it from overwriting existing files
cp -n ./src/renderer/modules/VolumeMixer/settings-template.json ./src/renderer/modules/VolumeMixer/settings.json

echo "Making the ./server/icons folder"
mkdir ./server/icons
