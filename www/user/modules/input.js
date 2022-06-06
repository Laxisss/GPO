export default class Input {
  type;
  attributes;
  style;
  eventListener;
  inputName;
  primeQuestionId;
  children;

  constructor(type, attributes, eventListener = {}, style = {}, children = []) {
    this.type = type;
    this.attributes = attributes;
    this.eventListener = eventListener;
    this.style = style;
    this.children = children;
  }
  toHtml (elem) {
    let element = document.createElement(elem);
    if(this.type) {
      element.setAttribute('type',this.type);
    }
    element.classList.add('form-input');
    this.children.forEach(child => {
      element.appendChild(child)
    })
    Object.keys(this.attributes).forEach(attribute => {
      element.setAttribute(attribute, this.attributes[attribute])
    })
    Object.keys(this.style).forEach(styleAttr => {
      element.style[styleAttr] = this.style[styleAttr]
    })
    // Object.keys(this.eventListener).forEach(eve => {
    //   console.log(this.eventListener[eve])
    //   element.addEventListener(eve, e => {
    //     e.preventDefault();
    //     console.log(eval(this.eventListener[eve].params[0]))
    //     this.eventListener[eve].func(eval(this.eventListener[eve].params[0]))
    //   });
    // })
    // element.setAttribute("data-madeWithModule", "true");
    // if(this.mandatory) {
    //   element.setAttribute('required','required');
    // }
    return element;
  }
}

export class TextInput extends Input{
  element = 'input';
  constructor(type = "text", attributes = {}, eventListener = {}, style = {}) {
    super(type, attributes, eventListener, style);
  }
  toHtml() {
    return super.toHtml(this.element);
  }
}
export class DateInput extends Input{
  element = 'input';
  constructor(type = "date", attributes = {}, eventListener = {}, style = {}) {
    super(type, attributes, eventListener, style);
  }
  toHtml() {
    return super.toHtml(this.element);
  }
}
export class SelectInput extends Input{
  element = 'select';
  constructor(type = "", attributes = {}, eventListener = {}, style = {}, children = []) {
    super(type, attributes, eventListener, style, children);
  }
  toHtml () {
    return super.toHtml(this.element);
  }
}
export class TelInput extends Input{
  element = 'input';
  constructor(type = "tel", attributes = {}, eventListener = {}, style = {}) {
    super(type, attributes, eventListener, style);
  }
  toHtml () {
    let element = super.toHtml(this.element);
    element.pattern = "^(0[0-9] ([0-9]{2} ){3}[0-9]{2})|(\+[0-9]{1,3} [0-9] ([0-9]{2} ){3}[0-9]{2})$";
    return element;
  }
}
export class NameInput extends Input{
  element = 'input';
  constructor(type = "text", attributes = {}, eventListener = {}, style = {}, children = []) {
    super(type, attributes, eventListener, style, children);
  }
  toHtml () {
    return super.toHtml(this.element);
  }
  normalize (value) {
    return value.toUpperCase();
  }
}
export class FirstNameInput extends Input{
  element = 'input';
  constructor(type = "text", attributes = {}, eventListener = {}, style = {}, children = []) {
    super(type, attributes, eventListener, style, children);
  }
  toHtml () {
    return super.toHtml(this.element);
  }
  normalize (value) {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }
}