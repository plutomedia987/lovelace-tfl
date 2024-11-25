# TFL Tube Status Card
TFL card to display the tube statuses. 
The YAML file in the repo should be added to your config for now until I get an integration running

![image](https://github.com/user-attachments/assets/b1f9ea41-c537-401b-87df-ef96b7611c33)


Clicking on the line will show you any details if available

![image](https://github.com/user-attachments/assets/73f86d3c-fcaa-47be-a8d8-fbe218547397)

# Installation
## HACS (Easiest)
Add this as a custom reposity in to HACS

[Add to HACS](https://my.home-assistant.io/redirect/hacs_repository/?owner=plutomedia987&repository=lovelace-tfl&category=dashboard)

## Manual
1. Copy the lovelace-tfl.js in to the www folder
2. Go to the dashboard settings
3. Click on the 3 dots (top right) -> resources
4. Click "Add resource" bottom right
5. Add the following javascript rosource "/local/lovelace-tfl.js"

## Setup
To set up the card make sure the rest APIs are running. My current rest file is included in this repo and should be included under "rest:"

Add a custom card with the following settings:

```yaml
type: custom:tfl-card
entities:
  - entity: sensor.tfl_bakerloo_status
  - entity: sensor.tfl_central_status
  - entity: sensor.tfl_circle_status
  - entity: sensor.tfl_district_status
  - entity: sensor.tfl_elizabeth_line_status
  - entity: sensor.tfl_hammersmith_city_status
  - entity: sensor.tfl_jubilee_status
  - entity: sensor.tfl_metropolitan_status
  - entity: sensor.tfl_northern_status
  - entity: sensor.tfl_piccadilly_status
  - entity: sensor.tfl_victoria_status
  - entity: sensor.tfl_waterloo_city_status

```
