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
          background-color: #FF25AD;
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
          margin: 0.1vw;
          text-align: center;
          border-radius: 0.3vw;
        }

        .tfl-line-name{
          display: block;
        }

        .tfl-icon{
          display: inline;
        }

        .tfl-name{
          display: inline;
          font-weight: bold;
          white-space: nowrap;
        }

        .tfl-status{
          display: block;
          white-space: nowrap;
        }
      `;
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

            let icon = "";
            if (stateAttr.lineStatuses[0].statusSeverity == 10) {
              // icon = "mdi:check";
            } else {
              icon = "mdi:alert-circle-outline";
            }

            elements.push(
              html`
                <div class="tfl-line ${stateAttr.id}">
                  <div class="tfl-line-name">
                    <ha-icon class="tfl-icon" icon="${icon}"></ha-icon>
                    <div class="tfl-name">${stateAttr.name}</div>
                  </div>
                  <div class="tfl-status">${stateAttr.lineStatuses[0].statusSeverityDescription}</div>
                </div>
              `
            );
          }
        }
      }

      return html`
        <ha-card>
          <h1 class="card-header">TFL Status</h1>
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