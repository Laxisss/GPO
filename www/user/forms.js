import Input, {TextInput, DateInput, SelectInput, TelInput, NameInput, FirstNameInput} from './modules/input.js'

const form = document.getElementById('login-form');
form?.addEventListener('submit', (e) => {
    e.preventDefault();
    login();
});
const bodyMenu = document.getElementById('menu-body');
if(bodyMenu != null) {
    menuLoad();
}
const buttonNewForm = document.getElementsByClassName('new-form')[0];
buttonNewForm?.addEventListener('click', (e) => {
    e.preventDefault();
    setForms();
});
const buttonOldForm = document.getElementsByClassName('exist-form')[0];
buttonOldForm?.addEventListener('click', (e) => {
    e.preventDefault();
    displayOldForms();
});
const noResponseBTN = document.getElementById('no-response');
noResponseBTN?.addEventListener('click', (e) => {
    e.preventDefault();
    noResponse(noResponseBTN);
})
const prevBtn = document.getElementsByClassName('retour')[0];
prevBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    prevPageNum();
})
const nextBtn = document.getElementsByClassName('suivant')[0];
nextBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    nextPageNum();
})
const homeBtn = document.getElementsByClassName('homeB')[0];
homeBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    hideStats();
})
const statsBtn = document.getElementsByClassName('statsB')[0];
statsBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    displayStats();
})
const navBtn = document.getElementsByClassName('nav')[0];
navBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    disconnect();
})
var dataArray = [];
var unsentForm = 0;
var unsentFormsArray = [];
var sentFormArray = [];
var pageMax = 0;
var pageNum = 0;
var leftBox = document.getElementsByClassName('left-box')[0];
var rightBox = document.getElementsByClassName('right-box')[0];
function setDataArr(array){
    dataArray = array;
}
function setPageMax(value){
    pageMax = value;
    setProgressBarMax(pageMax);
    UpdateProgressBar();
    if(pageNum+1 == pageMax){
        let button = document.getElementsByClassName('suivant')[0];
        button.innerHTML = '<h3>Envoyer</h3>';
        button.addEventListener('click',e => {
            e.preventDefault
            submitForm(button.parentNode.parentNode);
        });
    }
}
function createPage(){
    var traffic = document.createElement('div');
    traffic.setAttribute('data-number',document.getElementsByClassName('elem')[0].childNodes.length);
    traffic.style.display = 'none';
    document.getElementsByClassName('elem')[0].appendChild(traffic);
    setPageMax(pageMax + 1);
    return traffic;
}
function moveFirstQuestionToPrevPage(originPage){
    let originPageElem = document.querySelector('[data-number="'+originPage+'"]');
    let destination = document.querySelector('[data-number="'+(Number(originPage-1))+'"]');
    destination.appendChild(originPageElem.firstChild);
    destination.appendChild(br());
    originPageElem.firstChild.remove();
    if(destination.childNodes.length <= 8 || destination.previousSibling?.childNodes.length <= 8){
        moveFirstQuestionToPrevPage(Number(originPage)-1);
    }
}
function moveLastQuestionToNextPage(originPage){
    let originPageElem = document.querySelector('[data-number="'+originPage+'"]');
    let destination = document.querySelector('[data-number="'+(Number(originPage)+1)+'"]');
    originPageElem.lastChild.remove();
    let lastQuestion = originPageElem.lastChild;
    if(isEmpty(destination)){
        destination = createPage();
    }
    destination.prepend(br());
    destination.prepend(lastQuestion);
    if(destination.childNodes.length >8){
        moveLastQuestionToNextPage(Number(originPage)+1);
    }
}

function clearErrors() {
    const currPage = document.querySelector('[data-number="'+pageNum+'"]');
    const requiredFields = currPage.querySelectorAll('[required]');
    if(currPage.querySelector('.invalidFields'))
        currPage.querySelector('.invalidFields').remove();
    requiredFields.forEach(item => {
        item.classList.remove('invalid');
    });
}

function checkFieldsValidity () {
    const currPage = document.querySelector('[data-number="'+pageNum+'"]');
    const requiredFields = currPage.querySelectorAll('[required]');
    for (let field in requiredFields) {
        if(requiredFields[field].value == '' || Number(requiredFields[field].value) == -1) {
            clearErrors();
            let template = document.querySelector("#fieldValidity");
            let clone = template.content.children[0].cloneNode(true);
            currPage.appendChild(clone);
            requiredFields[field].classList.add('invalid');
            requiredFields[field].focus();
            return false;
        }
    };
    return true;
}

function nextPageNum(){
    if(!checkFieldsValidity()) return;
    else clearErrors();
    document.querySelector('[data-number="'+pageNum+'"]').style.display = 'none';
    if(pageNum+1<pageMax){
        if(document.querySelector('[data-number="'+(pageNum+1)+'"]')){
            document.querySelector('[data-number="'+(pageNum+1)+'"]').style.display = 'block';
        }
        pageNum++;
        UpdateProgressBar();
    }
    if(pageNum+1 == pageMax){
        let button = document.getElementsByClassName('suivant')[0];
        if(document.getElementsByClassName('elem')[0].classList.contains('new-forms')){
            button.innerHTML = '<h3>Envoyer</h3>';
        }
        else if(document.getElementsByClassName('elem')[0].classList.contains('old-forms')){
            button.innerHTML = '<h3>Modifier</h3>';
        }
        button.addEventListener('click',e => {
            e.preventDefault
            submitForm(button.parentNode.parentNode);
        });
    }
}
function prevPageNum(){
    if(pageNum == 0){
        unsetForms();
    }
    if(pageNum>0){
        if(document.querySelector('[data-number="'+pageNum+'"]')){
            document.querySelector('[data-number="'+pageNum+'"]').style.display = 'none';
        }
        document.querySelector('[data-number="'+(pageNum-1)+'"]').style.display = 'block';
        pageNum--;
        UpdateProgressBar();
    }
    var buttonCheck = document.getElementsByClassName('suivant')[0].innerHTML == '<h3>Envoyer</h3>' || document.getElementsByClassName('suivant')[0].innerHTML == '<h3>Modifier</h3>';
    var divCheck = typeof document.getElementsByClassName('recap')[0] != 'undefined';
    if(buttonCheck ^ divCheck){
        let button = document.getElementsByClassName('suivant')[0];
        button.innerHTML = '<h3>Suivant</h3>';
        button.addEventListener('click',e => {
            e.preventDefault();
            nextPageNum();
        });
    }
    if(document.getElementsByClassName('recap')[0]){
        document.getElementsByClassName('recap')[0].remove();
        let button = document.getElementsByClassName('suivant')[0];
        button.addEventListener('click',e => {
            e.preventDefault
            submitForm(button.parentNode.parentNode);
        });
    }
}
async function getFormStructure(tableau,i,traffic){
    var node = document.createElement('div');
    var capsule = document.createElement('span');
    capsule.innerHTML = tableau[i].Question;
    node.setAttribute('data-questionId',tableau[i].ID_Question);
    node.setAttribute('data-primeQuestionId',tableau[i].ID_Question);
    var action;
    if(tableau[i].id_Choix != null){

        action = new SelectInput(
            "",
            {
                "data-primeQuestionId": tableau[i].ID_Question,
                "name": tableau[i].Question.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ /g,"_")
            },
            {
                "change": {
                    func: getCorrespondingQuestion,
                    params: ["this.toHtml()"]
                }
            }
        );

        // action = document.createElement('select');
        // action.setAttribute('onchange','getCorrespondingQuestion(this)');
        // action.setAttribute('name',tableau[i].Question.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ /g,"_"));
        // action.setAttribute('data-primeQuestionId',tableau[i].ID_Question);
        const rep = await fetch("http://jpo-charlespeguy.alwaysdata.net/user/phpscripts/queryChoices.php?id_ques="+tableau[i].ID_Question);
        const choiceArray = await rep.json();
        let option = document.createElement('option');
        option.setAttribute('value',"-1");
        option.innerHTML = "Sélectionnez une réponse";
        // action.appendChild(option);
        action.children.push(option);
        for(let item in choiceArray){
            let option = document.createElement('option');
            option.setAttribute('value',choiceArray[item].ID_Choix);
            option.innerHTML = choiceArray[item].NomChoix;
            // action.appendChild(option);
            action.children.push(option);
        }
        // $.ajax({
        //     url: "http://jpo-charlespeguy.alwaysdata.net/user/phpscripts/queryChoices.php",
        //     type: "GET",
        //     data: "id_ques="+tableau[i].ID_Question,
        //     success: function(code_html, status){
        //         let choiceArray = JSON.parse(code_html);
        //         let option = document.createElement('option');
        //         option.setAttribute('value',"-1");
        //         option.innerHTML = "Sélectionnez une réponse";
        //         // action.appendChild(option);
        //         action.children.push(option);
        //         for(let item in choiceArray){
        //             let option = document.createElement('option');
        //             option.setAttribute('value',choiceArray[item].ID_Choix);
        //             option.innerHTML = choiceArray[item].NomChoix;
        //             // action.appendChild(option);
        //             action.children.push(option);
        //         }
        //         console.log(action)
        //     },
        //     error: function(error, status){
        //         console.error(error);
        //     }
        // });
    }
    else{
        if(tableau[i].Libelle == 'Texte'){
            action = new TextInput(
                "",
                {
                    "name": tableau[i].Question.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ /g,"_")
                }
            );


            // action = document.createElement('input');
            // action.type = 'text';
            // action.classList.add('form-input');
            // action.setAttribute('name',tableau[i].Question.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ /g,"_"));
        }
        else if(tableau[i].Libelle == 'Date'){

            action = new DateInput(
                "date",
                {
                    "name": tableau[i].Question.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ /g,"_"),
                    "min": '1970-01-01',
                    "max": new Date().toISOString().split('T')[0],
                    "value": '2000-01-01'
                }
            );

            // action = document.createElement('input');
            // action.type = 'date';
            // action.value = '2000-01-01';
            // let yourDate = new Date()
            // yourDate.toISOString().split('T')[0]
            // action.max = yourDate;
            // action.min = '1970-01-01';
            // action.classList.add('form-input');
            // action.setAttribute('name',tableau[i].Question.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ /g,"_"));
        }
        if(tableau[i].Libelle == 'Telephone'){

            action = new TelInput(
                "tel",
                {
                    "name": tableau[i].Question.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ /g,"_"),
                    "minLength": 10,
                    "maxLength": 10,
                    "size": 10,
                    "pattern": '[0-9]{10}'
                }
            );


            // action = document.createElement('input');
            // action.type = 'tel';
            // action.minLength = 10;
            // action.maxLength = 10;
            // action.size = 10;
            // action.pattern = '[0-9]{10}';
            // action.classList.add('form-input');
            // action.setAttribute('name',tableau[i].Question.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ /g,"_"));
        }
    }
    // if(Number(tableau[i].Obligatoire) === 1) {
    //     action.setAttribute('required','required');
    // }
    node.appendChild(capsule);
    node.appendChild(br());
    node.appendChild(action.toHtml());
    traffic.appendChild(node);
    traffic.appendChild(br())
}
function loadForms(){
    pageNum = 0;
    let button = document.getElementsByClassName('suivant')[0];
    button.innerHTML = '<h3>Suivant</h3>';
    button.addEventListener('click', e => {
        e.preventDefault();
        nextPageNum();
    });
    $.ajax({
        url: "http://jpo-charlespeguy.alwaysdata.net/user/phpscripts/queryQuestion.php",
        type: "GET",
        data: "",
        success: async function(code_html, status){
            var container = document.getElementsByClassName('table')[0];
            container.innerHTML = "";
            var elemDiv = document.createElement('div');
            elemDiv.classList.add('elem','new-forms');
            document.getElementById('no-response').style.display = 'block';
            var tableau = JSON.parse(code_html);
            container.setAttribute('data-formId',tableau.at(-1));
            tableau.pop();
            let rest = tableau.length%5;
            let tranches = (tableau.length-rest)/5;
            for(let j=0; j<tranches; j++){
                var traffic = document.createElement('div');
                traffic.setAttribute('data-number',j);
                if(j>0){
                    traffic.style.display = 'none';
                }
                for(let i=j*5; i<(j*5)+5; i++){
                    getFormStructure(tableau,i,traffic);   
                }
                elemDiv.appendChild(traffic);
            }
            if(rest>0){
                var traffic = document.createElement('div');
                traffic.setAttribute('data-number',tranches);
                traffic.style.display = 'none';
                for(let i=tableau.length-rest; i<tableau.length; i++){
                    getFormStructure(tableau,i,traffic);
                }
                elemDiv.appendChild(traffic);
                setPageMax(tranches+1);
            }
            else{
                setPageMax(tranches);
            }
            container.appendChild(elemDiv);
        },
        error: function(error, status){
            console.error(error+' '+status);
        }
    });
}
async function getChoices(idQues, idPrimeQues, nomQuestion = '', typeChoix = 'Texte', reponse = '', row = null){
    await $.ajax({
        url: "http://jpo-charlespeguy.alwaysdata.net/user/phpscripts/queryChoices.php",
        type: "GET",
        data: "id_ques="+idQues,
        success: function(code_html, status){
            let node;
            if(row == null){
                row = document.querySelector('[data-primequestionid="'+idPrimeQues+'"]');
                node = document.createElement('div');
                node.setAttribute('data-questionid',idQues);
                node.setAttribute('data-primequestionid',idPrimeQues);
            }
            else{
                node = row;
            }
            var tableau = JSON.parse(code_html);
            let flag = document.createElement('span');
            flag.innerHTML = nomQuestion;
            var action;
            if(typeChoix == 'Choix multiples'){
                action = document.createElement('select');
                action.setAttribute('name',nomQuestion.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ /g,"_"));
                action.setAttribute('data-primeQuestionid',idPrimeQues);
                action.setAttribute('data-questionid',idQues);
                action.addEventListener('change',e => {
                    e.preventDefault();
                    getCorrespondingQuestion(action);
                });
                let option = document.createElement('option');
                option.setAttribute('value',"-1");
                option.innerHTML = "Sélectionnez une réponse";
                action.appendChild(option);
                let longueur = tableau.length;
                for(let i=0; i<longueur; i++){
                    let option = document.createElement('option');
                    option.setAttribute('value',tableau[i].ID_Choix);
                    option.setAttribute('name','Choix'+idPrimeQues);
                    option.innerHTML = tableau[i].NomChoix;
                    action.appendChild(option);
                }
                if(reponse != ''){
                    let optionList = action.querySelectorAll('option[name="Choix'+idPrimeQues+'"]');
                    for(item in optionList){
                        if(optionList[item].innerText == reponse.replace(/&#39;/g, "'")){
                            action.value = optionList[item].value;
                        }
                    }
                }
            }
            else{
                action = document.createElement('input');
                action.classList.add('form-input');
                action.setAttribute('type','text');
                action.setAttribute('name',nomQuestion.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ /g,"_"));
                if(reponse != ''){
                    action.value = reponse;
                }
            }
            node.appendChild(flag);
            node.appendChild(br());
            node.appendChild(action);
            if(row.parentNode.childNodes.length <= 8){
                row.parentNode.insertBefore(node, row.nextSibling);
                row.parentNode.insertBefore(br(), row.nextSibling);
            }
            else {
                if(row.parentNode.lastChild.previousSibling == row){
                    if(isEmpty(row.parentNode.nextSibling)){
                        var traffic = document.createElement('div');
                        traffic.setAttribute('data-number',row.parentNode.parentNode.childNodes.length);
                        traffic.style.display = 'none';
                        traffic.appendChild(node);
                        traffic.appendChild(br());
                        row.parentNode.parentNode.appendChild(traffic);
                        setPageMax(pageMax+1);
                        nextPageNum();
                    }
                    else{
                        row.parentNode.nextSibling.prepend(br());
                        row.parentNode.nextSibling.prepend(node);
                        moveLastQuestionToNextPage(row.parentNode.nextSibling.getAttribute('data-number'));
                        nextPageNum();
                    }
                }
                else{
                    row.parentNode.insertBefore(node, row.nextSibling);
                    row.parentNode.insertBefore(br(),row.nextSibling);
                    moveLastQuestionToNextPage(row.parentNode.getAttribute('data-number'));
                }
            }
        },
        error: function(error, status){
            console.error(error+' '+status);
        }
    });
}
function var_dump(obj) {
    var out = '';
    for (var i in obj) {
        out += i + ": " + obj[i] + "\n";
    }
    var pre = document.createElement('pre');
    pre.innerHTML = out;
    document.body.appendChild(pre)
}
function submitForm(elem){
    if(!checkFieldsValidity()) return;
    else clearErrors();
    var dataParent = [];
    for(let item in elem){
        if(elem[item]!= null){
            if(elem[item].tagName == 'INPUT'){
                var datas = [];
                if(elem[item].type=='text' || elem[item].type=='date'){
                    datas = [elem[item].name,elem[item].value,elem[item].parentNode.getAttribute('data-questionid')];
                    if(elem[item].parentNode.getAttribute('data-reponseid') != null){
                        datas.push(elem[item].parentNode.getAttribute('data-reponseid'));
                    }
                }
                dataParent.push(datas);
            }
            else if(elem[item].tagName == 'SELECT'){
                console.log(elem)
                console.log(elem[item].value)
                console.log(elem[item])
                console.log(elem[item]+"querySelector('[value=\"'"+elem[item].value+"'\"')")
                console.log(elem[item].querySelector('[value="'+elem[item].value+'"'))
                console.log(elem[item].querySelector('[value="'+elem[item].value+'"').innerHTML)
                let value = elem[item].querySelector('[value="'+elem[item].value+'"').innerHTML;
                datas = [elem[item].name,value,elem[item].parentNode.getAttribute('data-questionid')];
                if(elem[item].parentNode.getAttribute('data-reponseid') != null){
                    datas.push(elem[item].parentNode.getAttribute('data-reponseid'));
                }
                dataParent.push(datas);
            }
        }
    }
    var formId = document.getElementsByClassName('table')[0].getAttribute('data-formid');
    dataParent.push(formId);
    document.querySelector('[data-number="'+pageNum+'"]').style.display = 'none';
    pageNum++;
    let button = document.getElementsByClassName('suivant')[0];
    let elemDiv = button.parentNode.previousElementSibling.firstElementChild;
    setDataArr(dataParent);
    if(elemDiv.classList.contains('new-forms')){
        confirmSendForm();
        //button.setAttribute('onclick','confirmSendForm(); return false');
    }
    else if(elemDiv.classList.contains('old-forms')){
        confirmUpdateForm();
        // button.setAttribute('onclick','confirmUpdateForm(); return false');
    }
    else{
        console.error("Cannot determine whether you're updating or sending a new form");
    }
    /*
    var recap = document.createElement('div');
    recap.classList.add('recap');
    for(let item in dataParent){
        if(dataParent[item] !== dataParent.at(-1)){
            var node = document.createElement('div');
            node.classList.add('confirm-data');
            var capsule = document.createElement('span');
            capsule.innerHTML = dataParent[item][0];
            node.appendChild(capsule);
            node.appendChild(br());
            var capsule = document.createElement('span');
            capsule.innerHTML = dataParent[item][1];
            node.appendChild(capsule);
            recap.appendChild(node);
        }
    }
    document.getElementsByClassName('elem')[0].appendChild(recap);
    */
}
function confirmSendForm(){
    $.ajax({
        url: "http://jpo-charlespeguy.alwaysdata.net/user/phpscripts/insertFormAnswers.php",
        type: "POST",
        data: {dataArray},
        success: function(code_html, status){
            if(code_html=="true"){
                console.log('Formulaire envoyé');
                unsetForms(true);
            }
            else{
                console.log(code_html);
                unsetForms(false);
                cannotSend(dataArray);
            }
        },
        error: function(error, status){
            console.log('Formulaire non-envoyé');
            unsetForms(false);
            cannotSend(dataArray);
            console.error(error+' '+status);
        }
    });
}
function confirmUpdateForm(){
    $.ajax({
        url: "http://jpo-charlespeguy.alwaysdata.net/user/phpscripts/updateForm.php",
        type: "POST",
        data: {dataArray},
        success: function(code_html, status){
            tableau = JSON.parse(code_html);
            if(code_html=="true"){
                console.log('Formulaire Modifié');
                unsetForms(true);
            }
            else{
                console.log(code_html);
                unsetForms(false);
                cannotSend(dataArray);
            }
        },
        error: function(error, status){
            console.log('Formulaire non-envoyé');
            unsetForms(false);
            cannotSend(dataArray);
            console.error(error+' '+status);
        }
    });
}

function noResponse(butt) {
    let elem = butt.nextSibling;
    var dataParent = [];
    for(let item in elem){
        if(elem[item]!= null){
            if(elem[item].tagName == 'INPUT'){
                var datas = [];
                if(elem[item].type=='text' || elem[item].type=='date'){
                    datas = [elem[item].name,'vide',elem[item].parentNode.getAttribute('data-questionid')];
                    if(elem[item].parentNode.getAttribute('data-reponseid') != null){
                        datas.push(elem[item].parentNode.getAttribute('data-reponseid'));
                    }
                }
                dataParent.push(datas);
            }
            else if(elem[item].tagName == 'SELECT'){
                let value = elem[item].querySelector('[value="'+elem[item].value+'"').innerHTML;
                datas = [elem[item].name,value,elem[item].parentNode.getAttribute('data-questionid')];
                if(elem[item].parentNode.getAttribute('data-reponseid') != null){
                    datas.push(elem[item].parentNode.getAttribute('data-reponseid'));
                }
                dataParent.push(datas);
            }
        }
    }
    var formId = document.getElementsByClassName('table')[0].getAttribute('data-formid');
    dataParent.push(formId);
    document.querySelector('[data-number="'+pageNum+'"]').style.display = 'none';
    pageNum++;
    let button = document.getElementsByClassName('suivant')[0];
    let elemDiv = button.parentNode.previousElementSibling.firstElementChild;
    if(elemDiv.classList.contains('new-forms')){
        button.addEventListener('click',e => {
            e.preventDefault();
            confirmSendForm();
        })
    }
    else if(elemDiv.classList.contains('old-forms')){
        button.addEventListener('click',e => {
            e.preventDefault();
            confirmUpdateForm();
        });
    }
    else{
        console.error("Cannot determine whether you're updating or sending a new form");
    }
    var recap = document.createElement('div');
    recap.classList.add('recap');
    for(let item in dataParent){
        if(dataParent[item] !== dataParent.at(-1)){
            var node = document.createElement('div');
            node.classList.add('confirm-data');
            var capsule = document.createElement('span');
            capsule.innerHTML = dataParent[item][0];
            node.appendChild(capsule);
            node.appendChild(br());
            var capsule = document.createElement('span');
            capsule.innerHTML = dataParent[item][1];
            node.appendChild(capsule);
            recap.appendChild(node);
        }
    }
    document.getElementsByClassName('elem')[0].appendChild(recap);
    setDataArr(dataParent);
    confirmSendForm();
}

function login(){
    console.log('logging');
    var email = document.querySelector('[type="text"]').value, pswd = document.querySelector('[type="password"]').value;
    $.ajax({
        url: "http://jpo-charlespeguy.alwaysdata.net/user/phpscripts/logging.php",
        type: "POST",
        data: "email="+email+"&pswd="+pswd,
        success: function(code_html, status){
            if(code_html=='true'){
                window.location.replace('./user/menu.html');
            }
            else {
                document.getElementById('failure').classList.remove('animate-error');
                document.getElementById('failure').style.display = "block";
                document.getElementById('failure').classList.add('animate-error');
                setTimeout(function() {
                    document.getElementById('failure').classList.remove('animate-error');
                }, 1000);
            }
        },
        error: function(error, status){
            console.error(error+' '+status);
            console.log(error);
        }
    });
}
function menuLoad(){
    $.ajax({
        url: "http://jpo-charlespeguy.alwaysdata.net/user/phpscripts/getSessData.php",
        type: "GET",
        data: "",
        success: function(code_html, status){
            let tableau = JSON.parse(code_html);
            document.querySelector('h5.nom').innerHTML = "Bonjour "+tableau[2]+" !"
        },
        error: function(error, status){
            console.error(error+' '+status);
        }
    });
}
function disconnect(){
    $.ajax({
        url: "http://jpo-charlespeguy.alwaysdata.net/user/phpscripts/disconnect.php",
        type: "GET",
        data: "",
        success: function(code_html, status){
            window.location.replace('../index.html');
        },
        error: function(error, status){
            console.error(error+' '+status);
        }
    });
}
function setForms(){
    leftBox.style.display = 'none';
    rightBox.style.display = 'none';
    document.getElementsByClassName('form-display')[0].style.display = 'block';
    document.getElementsByClassName('suivant')[0].style.display = 'block';
    loadForms();
}
function unsetForms(success){
    leftBox.style.display = 'block';
    rightBox.style.display = 'block';
    document.getElementById('no-response').style.display = 'none';
    document.getElementsByClassName('elem')[0].remove();
    document.getElementsByClassName('form-display')[0].style.display = 'none';
    if(success){
        document.getElementsByClassName('success-alert')[0].style.display = 'block';
    }
    else if(success === false){
        document.getElementsByClassName('danger-alert')[0].style.display = 'block';
    }
    setTimeout(() => {
        if(typeof document.getElementsByClassName('alert')[0] != 'undefined' || typeof document.getElementsByClassName('alert')[1] != 'undefined'){
            document.getElementsByClassName('alert')[0].style.display = 'none';
            document.getElementsByClassName('alert')[1].style.display = 'none';
        }
    }, 3000);
}
$(".close").click(function() {
    $(this).parent(".alert").fadeOut();
    setTimeout(() => {
        if(typeof document.getElementsByClassName('alert')[0] != 'undefined'){
            document.getElementsByClassName('alert')[0].style.display = 'none';
            document.getElementsByClassName('alert')[1].style.display = 'none';
        }
    }, 3000);
});

function hideStats() {
    document.getElementsByClassName('stats')[0].style.display = 'none';
    document.getElementsByClassName('right-box-button')[0].style.display = 'block';
}

function displayStats(){
    document.getElementsByClassName('stats')[0].style.display = 'flex';
    document.getElementsByClassName('right-box-button')[0].style.display = 'none';
    $.ajax({
        url: "http://jpo-charlespeguy.alwaysdata.net/user/phpscripts/queryStats.php",
        type: "GET",
        data: "",
        success: function(code_html, status){
            document.getElementById('sentFormsNumber').innerText = code_html;
            document.getElementById('unsentFormsNumber').innerText = unsentForm;
            console.log('sent forms : '+code_html);
            console.log('unsent forms : '+unsentForm);
        },
        error: function(error, status){
            console.log('not synced');
            console.log('sent forms : '+sentFormArray.length);
            console.log('unsent forms : '+unsentForm);
            console.error(error+' '+status);
        }
    });
}
function cannotSend(data){
    unsentForm++;
    unsentFormsArray.push(data);
}
function displayOldForms(){
    $.ajax({
        url: "http://jpo-charlespeguy.alwaysdata.net/user/phpscripts/queryOldForms.php",
        type: "GET",
        data: "",
        success: function(code_html, status){
            let tableau = JSON.parse(code_html);
            let forms = [];
            const nbForms = tableau.at(-1);
            tableau.pop();
            let idsTable = [];
            for (let item in tableau) {
                let isPresent = false;
                for (let id in idsTable) {
                    if (tableau[item].ID_Formulaire == idsTable[id]) {
                        isPresent = true;
                        break;
                    }
                }
                if (!isPresent) {
                    idsTable.push(tableau[item].ID_Formulaire);
                }
            }
            idsTable.sort();
            for (let formId in idsTable) {
                let currentForm = [];
                for (let response in tableau) {
                    if (tableau[response].ID_Formulaire == idsTable[formId]) {
                        currentForm.push(tableau[response]);
                    }
                }
                forms.push(currentForm);
            }
            console.log(forms);
            sentFormArray = forms;
            leftBox.style.display = 'none';
            rightBox.style.display = 'none';
            document.getElementsByClassName('suivant')[0].style.display = 'none';
            document.getElementsByClassName('form-display')[0].style.display = 'block';
            let elem = document.createElement('div');
            elem.classList.add('elem','old-forms');
            document.getElementsByClassName('table')[0].appendChild(elem);
            for(let i=0; i<forms.length;i++){
                let button = document.createElement('button');
                button.classList.add('form-list');
                button.innerHTML = "Id: "+forms[i][0].ID_Formulaire+" Date: "+forms[i][0].Date_Envoi+" "+forms[i][0].Heure_Envoi+":"+forms[i][0].Minute_Envoi;
                button.addEventListener('click',e => {
                    e.preventDefault();
                    displayRecap(forms[i][0].ID_Formulaire, i);
                });
                elem.appendChild(button);
            }
        },
        error: function(error, status){
            console.error(error+' '+status);
        }
    });
}

function displayRecap(id, index){
    document.getElementsByClassName('table')[0].setAttribute('data-formid',id);
    let elem = document.getElementsByClassName('elem')[0];
    document.getElementsByClassName('elem')[0].innerHTML = '';
    let button = document.getElementsByClassName('suivant')[0];
    button.style.display = 'block';
    button.innerHTML = '<h3>Suivant</h3>';
    button.addEventListener('click',e => {
        e.preventDefault();
        nextPageNum();
    });
    pageNum = 0;
    let questionArray = sentFormArray[index];
    let rest = questionArray.length%5;
    let tranches = (questionArray.length-rest)/5;
    for(let j=0; j<tranches; j++){
        var traffic = document.createElement('div');
        traffic.setAttribute('data-number',j);
        if(j>0){
            traffic.style.display = 'none';
        }
        for(let i=j*5; i<(j*5)+5; i++){
            setChoiceInput(traffic,i,questionArray);
        }
        elem.appendChild(traffic);
    }
    if(rest>0){
        var traffic = document.createElement('div');
        traffic.setAttribute('data-number',tranches);
        traffic.style.display = 'none';
        for(let i=questionArray.length-rest; i<questionArray.length; i++){
            setChoiceInput(traffic,i,questionArray);
        }
        elem.appendChild(traffic);
        setPageMax(tranches+1);
    }
    else{
        setPageMax(tranches);
    }
}

async function verifyPrimeQues(idQues) {
    const response = await fetch("http://jpo-charlespeguy.alwaysdata.net/user/phpscripts/getPrimeQues.php");
    const primeIds = await response.json();
    console.log(primeIds.includes(idQues));
    while(!primeIds.includes(idQues)){
        let reponse = await fetch("http://jpo-charlespeguy.alwaysdata.net/user/phpscripts/getThePrimeOfQuestion.php?idQues=" + idQues);
        idQues = await reponse.json();
    }
    return idQues;
}

function setChoiceInput(traffic,i,questionArray){
    let node = document.createElement('div');
    node.setAttribute('data-questionid',questionArray[i].ID_Question);
    const primeQues = verifyPrimeQues(questionArray[i].primeQues);
    if(primeQues instanceof Number) {
        node.setAttribute('data-primeQuestionid',primeQues);
    }
    else {
        node.setAttribute('data-primeQuestionid',questionArray[i].primeQues);
    }
    node.setAttribute('data-reponseid',questionArray[i].ID_Reponses);
    let capsule = document.createElement('span');
    capsule.innerHTML = questionArray[i].Question;
    let champ;
    if(questionArray[i].Libelle == 'Texte'){
        champ = document.createElement('input');
        champ.name = questionArray[i].Question.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ /g,"_");
        champ.type = 'text';
        champ.value = questionArray[i].Reponse;
        champ.classList.add('form-input');
        node.appendChild(capsule);
        node.appendChild(br());
        node.appendChild(champ);
        traffic.appendChild(node);
        traffic.appendChild(br());
    }
    else if(questionArray[i].Libelle == 'Date'){
        champ = document.createElement('input');
        champ.name = questionArray[i].Question.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ /g,"_");
        champ.type = 'date';
        champ.value = questionArray[i].Reponse;
        champ.classList.add('form-input');
        node.appendChild(capsule);
        node.appendChild(br());
        node.appendChild(champ);
        traffic.appendChild(node);
        traffic.appendChild(br());
    }
    else if(questionArray[i].Libelle == 'Choix multiples'){
        let idPrimeQues = questionArray[i].primeQues;
        if(isEmpty(idPrimeQues)){
            idPrimeQues = questionArray[i].ID_Question;
        }
        node.setAttribute('data-primequestionid',idPrimeQues);
        traffic.appendChild(node);
        getChoices(questionArray[i].ID_Question, idPrimeQues, questionArray[i].Question, questionArray[i].Libelle, questionArray[i].Reponse, node);
    }
}

function br(){
    return document.createElement('br');
}
let getCorrespondingQuestion = (elem) => {
    let idChoix = elem.value;
    let idPrimeQues = elem.getAttribute('data-primequestionid');
    let row = elem.parentNode;
    let page = row.parentNode;
    $.ajax({
        url: 'http://jpo-charlespeguy.alwaysdata.net/user/phpscripts/getIdQuestion.php',
        type: 'POST',
        data: 'idChoix='+idChoix,
        success: function(code_html){
            let tableau = JSON.parse(code_html);
            let immuneElem = null;
            if(tableau[0] == null){
                immuneElem = elem.parentNode;
            }
            let allSameIdPrimeQues = page.parentNode.querySelectorAll('[data-primequestionid="'+idPrimeQues+'"]');
            for(item in allSameIdPrimeQues){
                if(!isNaN(item)){
                    if(allSameIdPrimeQues[item].getAttribute('data-questionid') != idPrimeQues && allSameIdPrimeQues[item].tagName != 'SELECT' && allSameIdPrimeQues[item] != immuneElem){
                        allSameIdPrimeQues[item].nextSibling.remove()
                        allSameIdPrimeQues[item].remove();
                    }
                }
            }
            if(!isEmpty(page.nextSibling)){
                if(page.childNodes.length <= 8 || page.nextSibling.childNodes.length <= 8){
                    moveFirstQuestionToPrevPage(pageMax - 1);
                }
                if(page.parentNode.childNodes[pageMax - 1].childNodes.length == 0){
                    page.parentNode.childNodes[pageMax - 1].remove();
                    setPageMax(pageMax - 1);
                }
            }
            if(tableau[0] != null && tableau[0].ID_Question != null){
                getChoices(tableau[0].ID_Question,idPrimeQues,tableau[0].Question,tableau[0].Libelle);
            }
        },
        error: function(error,status){
            console.error(error+' '+status);
        }
    });
}
function UpdateProgressBar() {
    document.getElementById("p1").value = ((pageNum+1)*10);
}
function setProgressBarMax(value){
    document.getElementsByClassName('progress-bar')[0].setAttribute('max',value*10);
}
function isEmpty(value) {
    return value == null;
}

$(function() {
    App.init();
});
var App = {
    init: function() {
        this.datetime(), this.side.nav(), this.search.bar(), this.navigation(), this.hyperlinks(), setInterval(this.datetime, 1e3)
    },
    datetime: function() {
        var e = new Array("Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"),
            t = new Array("Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Decembre"),
            a = new Date,
            i = a.getYear();
        1e3 > i && (i += 1900);
        var s = a.getDay(),
            n = a.getMonth(),
            r = a.getDate();
        10 > r && (r = "0" + r);
        var l = a.getHours(),
            c = a.getMinutes(),
            h = a.getSeconds(),
            o = "AM";
        l >= 12 && (o = "PM"), l > 12 && (l -= 12), 0 == l && (l = 12), 9 >= c && (c = "0" + c), 9 >= h && (h = "0" + h), $(".welcome .datetime .day").text(e[s]), $(".welcome .datetime .date").text(t[n] + " " + r + ", " + i), $(".welcome .datetime .time").text(l + ":" + c + ":" + h + " " + o)
    },
    title: function(e) {
        return $(".header>.title").text(e)
    },
    side: {
        nav: function() {
            this.toggle(), this.navigation()
        },
        toggle: function() {
            $(".ion-ios-navicon").on("touchstart click", function(e) {
                e.preventDefault(), $(".sidebar").toggleClass("active"), $(".nav").removeClass("active"), $(".sidebar .sidebar-overlay").removeClass("fadeOut animated").addClass("fadeIn animated")
            }), $(".sidebar .sidebar-overlay").on("touchstart click", function(e) {
                e.preventDefault(), $(".ion-ios-navicon").click(), $(this).removeClass("fadeIn").addClass("fadeOut")
            })
        },
        navigation: function() {
            $(".nav-left a").on("touchstart click", function(e) {
                e.preventDefault();
                var t = $(this).attr("href").replace("#", "");
                $(".sidebar").toggleClass("active"), $(".html").removeClass("visible"), "home" == t || "" == t || null == t ? $(".html.welcome").addClass("visible") : $(".html." + t).addClass("visible"), App.title($(this).text())
            })
        }
    },
    search: {
        bar: function() {
            $(".header .ion-ios-search").on("touchstart click", function() {
                var e = ($(".header .search input").hasClass("search-visible"), $(".header .search input").val());
                return "" != e && null != e ? (App.search.html($(".header .search input").val()), !1) : ($(".nav").removeClass("active"), $(".header .search input").focus(), void $(".header .search input").toggleClass("search-visible"))
            }), $(".search form").on("submit", function(e) {
                e.preventDefault(), App.search.html($(".header .search input").val())
            })
        },
        html: function(e) {
            $(".search input").removeClass("search-visible"), $(".html").removeClass("visible"), $(".html.search").addClass("visible"), App.title("Result"), $(".html.search").html($(".html.search").html()), $(".html.search .key").html(e), $(".header .search input").val("")
        }
    },
    navigation: function() {
        $(".nav .mask").on("touchstart click", function(e) {
            e.preventDefault(), $(this).parent().toggleClass("active")
        })
    },
    hyperlinks: function() {
        $(".nav .nav-item").on("click", function(e) {
            e.preventDefault();
            var t = $(this).attr("href").replace("#", "");
            $(".html").removeClass("visible"), $(".html." + t).addClass("visible"), $(".nav").toggleClass("active"), App.title($(this).text())
        })
    }
};