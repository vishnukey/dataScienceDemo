customElements.define('info-card',
      class extends HTMLElement {
        constructor() {
          super();
          const template = 
                document
                        .querySelector('#template__info-card')
                        .content
          const shadowRoot = 
                this
                        .attachShadow({mode: 'open'})
                        .appendChild(template.cloneNode(true))
        } 
})