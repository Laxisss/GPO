import Input, {TextInput, DateInput, SelectInput, TelInput, NameInput, FirstNameInput} from '../modules/input.js'
class InputTests {
  static testTextInput () {
    let expected = document.createElement('input');
    expected.type = 'text';
    expected.name = "myName"
    expected.classList.add('form-input');
    expected.setAttribute('required','required');
    expected.style.border = "1px solid black";

    let created = new TextInput(
      "text",
      {
        "required": "required",
        "name": "myName"
      },
      {},
      {
        "border": "1px solid black"
      }
    )
    InputTests.assertEquals(expected, created.toHtml(), "text");
    expected.setAttribute('data-madeWithModule', 'true');
    InputTests.assertFalse(expected, created.toHtml(), "text");
  }

  static testDateInput () {
    let expected = document.createElement('input');
    expected.type = 'date';
    expected.value = '2000-01-01';
    expected.max = new Date().toISOString().split('T')[0];
    expected.min = '1970-01-01';
    expected.classList.add('form-input');
    expected.setAttribute('name', 'myName');
  
    let created = new DateInput(
      "date",
      {
          "name": "myName",
          "min": '1970-01-01',
          "max": new Date().toISOString().split('T')[0],
          "value": '2000-01-01'
      }
    );
    
    InputTests.assertEquals(expected, created.toHtml(), "date");
    expected.setAttribute('data-madeWithModule', 'true');
    InputTests.assertFalse(expected, created.toHtml(), "date");
  }
  
  static testTelInput () {
    let expected = document.createElement('input');
    expected.type = 'tel';
    expected.minLength = 10;
    expected.maxLength = 10;
    expected.size = 10;
    expected.pattern = '[0-9]{10}';
    expected.classList.add('form-input');
    expected.setAttribute('name','telName');
  
    let created = new TelInput(
      "tel",
      {
          "name": "telName",
          "minLength": 10,
          "maxLength": 10,
          "size": 10,
          "pattern": '[0-9]{10}'
      }
    );

    InputTests.assertEquals(expected, created.toHtml(), "tel");
    expected.setAttribute('data-madeWithModule', 'true');
    InputTests.assertFalse(expected, created.toHtml(), "tel");
  }
  
  static testSelectInput () {
    let expected = document.createElement('select');
    expected.setAttribute('name',"selectName");
    expected.classList.add('form-input');
    let option = document.createElement('option');
    option.setAttribute('value',"-1");
    option.innerHTML = "Sélectionnez une réponse";
    expected.innerHTML = option;
  
    let created = new SelectInput(
      "",
      {
        "name": "selectName"
      },
      {},
      {},
      [option]
    );

    InputTests.assertEquals(expected, created.toHtml(), "select");
    // expected.setAttribute('data-madeWithModule', 'true');
    InputTests.assertFalse(expected, created.toHtml(), "select");
  }

  static assertFalse(elem1, elem2, test) {
    if(!InputTests.compare(elem1,elem2)) {
      let text = document.createElement('h1');
      text.innerHTML = "test Réussi " + test
      document.body.appendChild(text);
    }
    else {
      let text = document.createElement('h1');
      text.innerHTML = "test Echoué " + test
      document.body.appendChild(text);
      console.log("expected: ", elem1)
      console.log("created: ", elem2)
    }
  }

  static assertEquals(elem1, elem2, test) {
    if(InputTests.compare(elem1,elem2)) {
      let text = document.createElement('h1');
      text.innerHTML = "test Réussi " + test
      document.body.appendChild(text);
      console.log("test Réussi " + test)
    }
    else {
      let text = document.createElement('h1');
      text.innerHTML = "test Echoué " + test
      document.body.appendChild(text);
      console.log("expected: ", elem1)
      console.log("created: ", elem2)
    }
  }

  static compare (elem1, elem2) {
    if(elem1 == null || elem2 == null) {
      return false
    }
    let equal = true;
    let attr1 = [];
    Object.keys(elem1.attributes).forEach(attr => {
      attr1[elem1.attributes[attr].nodeName] = elem1.attributes[attr].nodeValue
    })
    let attr2 = [];
    Object.keys(elem2.attributes).forEach(attr => {
      attr2[elem2.attributes[attr].nodeName] = elem2.attributes[attr].nodeValue
    })
    Object.keys(attr1).sort().forEach(attr => {
      if(attr1[attr] != attr2[attr] || attr1[attr] != attr2[attr]) {
        equal = false;
      }
    })
    if(elem1.childNodes.length == elem2.childNodes.length){
      if(elem1.children.length > 0) {
        for(let i in elem1.children.length > 0 ? elem1.children : elem2.children) {
          if(!InputTests.compare(elem1.children[i], elem2.children[i])) {
            equal = false;
          }
        }
      }
    }
    else {
      equal = false;
    }

    return equal
  }
}
InputTests.testTextInput();
InputTests.testDateInput();
InputTests.testTelInput();
InputTests.testSelectInput();