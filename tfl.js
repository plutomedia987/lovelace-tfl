import {
    LitElement,
    html,
    css,
  } from "https://unpkg.com/lit-element@2.0.1/lit-element.js?module";


  const fireEvent = (node, type, detail, options) => {
    options = options || {};
    detail = detail === null || detail === undefined ? {} : detail;
    const event = new Event(type, {
      bubbles: options.bubbles === undefined ? true : options.bubbles,
      cancelable: Boolean(options.cancelable),
      composed: options.composed === undefined ? true : options.composed,
    });
    event.detail = detail;
    node.dispatchEvent(event);
    return event;
  };

  function hasConfigOrEntityChanged(element, changedProps) {
    if (changedProps.has("_config")) {
      return true;
    }

    const oldHass = changedProps.get("hass");
    if (oldHass) {
      return (
        oldHass.states[element._config.entity] !==
        element.hass.states[element._config.entity]
      );
    }

    return true;
  }

class TFLCard extends LitElement {

    static get properties() {
      return {
        hass: { type: Object},
        _config: { type: Object },
      };
    }

    static getStubConfig(hass, entities, entitiesFallback) {

        return {
            entities: entities
        }
    }

    // The user supplied configuration. Throw an exception and Home Assistant
    // will render an error card.
    setConfig(config) {
      if (!config.entities) {
        throw new Error("You need to define an entity");
      }

      this._config = config;
      // console.log(config)
    }

    shouldUpdate(changedProps) {
      return hasConfigOrEntityChanged(this, changedProps);
    }

    // The height of your card. Home Assistant uses this to automatically
    // distribute all cards over the available columns in masonry view
    getCardSize() {
      return 4;
    }

    static get styles() {
      return css`
        .elizabeth{
          background-color: #773DBD;
          color: #FFFFFF;
        }

        .bakerloo{
          background-color: #A65A2A;
          color: #FFFFFF;
        }

        .central{
          background-color: #FF251B;
          color: #FFFFFF;
        }

        .circle{
          background-color: #FFCD00;
          color: #000F9F;
        }

        .district{
          background-color: #007934;
          color: #000F9F;
        }

        .hammersmith-city{
          background-color: #EC9BAD;
          color: #000F9F;
        }

        .jubilee{
          background-color: #7B868C;
          color: #FFFFFF;
        }

        .metropolitan{
          background-color: #870F54;
          color: #FFFFFF;
        }

        .northern{
          background-color: #000000;
          color: #FFFFFF;
        }

        .piccadilly{
          background-color: #000F9F;
          color: #FFFFFF;
        }

        .victoria{
          background-color: #00A0DF;
          color: #FFFFFF;
        }

        .waterloo-city{
          background-color: #6BCDB2;
          color: #000F9F;
        }

        .dlr{
          background-color: #00AFAA;
          color: #FFFFFF;
        }

        .bus{
          background-color: #E1251B;
          color: #FFFFFF;
        }

        .overground{
          background-color: #EE7623;
          color: #FFFFFF;
        }

        .underground{
          background-color: #000F9F;
          color: #FFFFFF;
        }

        .tram{
          background-color: #76BC21;
          color: #FFFFFF;
        }

        .container{
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
        }

        .tfl-line{
          flex: 33%;
          margin: 1px;
          text-align: center;
          border-radius: 8px;
          display: flex;
        }

        .tfl-line-name{
          display: block;
        }

        .tfl-icon{
          display: inline;
          align-self: center;
          width: 24px;
          padding: 3px;
        }

        .tfl-details{
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .tfl-name{
          display: block;
          font-weight: bold;
          white-space: nowrap;
        }

        .tfl-status{
          display: block;
          white-space: nowrap;
        }

        .tfl-full-details-divider{
          width: 100%;
        }

        .tfl-full-details{
          display: block;
        }

        .hide{
          display: none;
        }

        .addPointer{
          cursor: pointer;
        }
      `;
    }

    getIcon(severity) {
      let icon = "";
      let width = 24;

      switch (severity) {
        case 0: // Special Service
          icon = "mdi:star";
          break;
        case 1: // Closed
        case 2: // Suspended
        case 3: // Part Suspended
        case 4: // Planned Closure
        case 5: // Part Closure
        case 11: // Part Closed
        case 16: // Not Runnning
        case 20: // Service Closed
          icon = "mdi:close-circle-outline";
          break;
        case 6: // Severe Delays
        case 7: // Reduced Service
        case 9: // Minor Delays
        case 17: // Issues Reported
          icon = "mdi:alert-circle-outline";
          break;
        case 8: // Bus Service
          icon = "mdi:bus-alert";
          break;
        case 10: // Good Service
        case 18: // No Issues
          width = 0;
          break;
        case 12: // Exit only
          icon = "mdi:exit-run";
          break;
        case 13: // No Step Free Access
          icon = "mdi:stairs";
          break;
        case 14: // Change of Frequency
          icon = "mdi:archive-clock";
          break;
        case 15: // Diverted
          icon = "mdi:swap-horizontal";
          break;
        case 19: // Information
          icon = "mdi:information-outline";
          break;
      }

      return new Object({ "icon": icon, "width": width });
    }

    _handleLineClick(e) {

      e.stopPropagation();

      let components = e.composedPath();
      let targetElement = components[0];
      let lineElement = targetElement.closest(".tfl-line");
      let detailsElement = lineElement.querySelectorAll(".tfl-full-details, .tfl-full-details-divider");

      let addRemove = detailsElement[0].classList.contains("hide");

      if (lineElement.classList.contains("addPointer")) {
        for (let i = 0; i<detailsElement.length; i++){
          if (addRemove) {
            detailsElement[i].classList.remove("hide");
          } else {
            detailsElement[i].classList.add("hide");
          }
        }
      }
    }

    render() {
      if (!this._config || !this.hass) {
          return html``;
      }

      let elements = [];

      for (let x in this._config.entities) {
        let entity = this._config.entities[x].entity;

        if (Object.keys(this.hass.states).includes(entity)) {
          let entityObj = this.hass.states[entity];
          if (Object.keys(entityObj).includes("attributes")) {
            let stateAttr = entityObj["attributes"];

            let severity = stateAttr.lineStatuses[0].statusSeverity;
            let settings = this.getIcon(severity);

            elements.push(
              html`
                <div class="tfl-line ${stateAttr.id} ${((severity != 10)?'addPointer':'')}" @click="${this._handleLineClick}">
                  <ha-icon style="width:${settings.width}px;" class="tfl-icon" icon="${settings.icon}"></ha-icon>
                  <div class="tfl-details">
                    <div class="tfl-name">${stateAttr.name}</div>
                    <div class="tfl-status">${stateAttr.lineStatuses[0].statusSeverityDescription}</div>
                    <hr class="tfl-full-details-divider hide" />
                    <div class="tfl-full-details hide">${stateAttr.lineStatuses[0].reason}</div>
                  </div>
                  <div class="tfl-icon" style="width:${settings.width}px;"></div>
                </div>
              `
            );
          }
        }
      }

      return html`
        <ha-card>
          <h1 class="card-header">
            <ha-icon icon="mdi:subway"></ha-icon>
            <span>TFL Status</span>
          </h1>
          <div class="card-content">
            <div class="container">
              ${elements}
            </div>
          </div>
        </ha-card>
      `;
    }
}


customElements.define("tfl-card", TFLCard);