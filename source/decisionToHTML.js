// ===###===###===###===###===###===###===###===### //
// CREATED BY MUHAMMED BAL
// VERSION 1.0.0
// LICENCE: MIT License
// ===###===###===###===###===###===###===###===### //

// ################################################
// ################################################
// ################################################
class DecisionToHTML {
    constructor(data,main=null) {
        this.data = data;
        this.main = main;
        this.id_path = this.allIDpath(this.data);
        // Bütün soru componentlerin eklendiği liste
        this.allQuestionDiv = [];
        // Bütün ID=>Value çiftlerini içeren sözlük
        this.IDvalue = {};
        // Random ID-CLASS-NAME üretenlerin saklanan deposu
        this.allLists = {
            "id": [],
            "name": [],
            "class": [],
        };

    }
    // ################################################
    // Soru değerleri (option-checkbox-input) güncellendiğinde mevcut comp'tan sonraki compları silen fonksiyon
    updateQuestionDiv(elem, is=null){
        this.allQuestionDiv.forEach(e=>{
            if(is){e.remove();}
            if(e==elem){is=true;}
        });
    }
    // ################################################
    // Random ID-CLASS-NAME üreten ayrıca saklayan foksiyon
    createRandomString(type) {
        const length = 6;
        const character = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const len = character.length;
        let string = "dec-"
        do{string += Array.from({ length }, () => character.charAt(Math.floor(Math.random() * len))).join('');}
        while(this.allLists[type].includes(string));
        this.allLists[type].push(string);
        return string;
    }
    // ################################################
    // İki liste elaman olarak eşit mi kontrolü yapan fonksiyon
    equalList(l1,l2){
        var isequal = true;
        l1.forEach(e=>{isequal = l2.includes(e) ? true : false});
        if(isequal){l2.forEach(e=>{isequal = l1.includes(e) ? true : false});}
        return isequal;
    }
    // ################################################
    // ===*****===*****===*****===*****===*****===*****
    // Element create function
    // ***=====***=====***=====***=====***=====***=====
    creatorElement({
        parent=this.main,
        type,
        type_=null,
        id=null,
        name=null,
        classList=null,
        data=null,
        textContent=null,
        for_=null,
        value=null,
        placeholder=null,
        step=null,
        style=null}){
        const elem = document.createElement(`${type}`);
        if(type_){elem.type = type_;}
        if(id){elem.id = id;}
        if(name){elem.name = name;}
        if(data){elem.setAttribute('data',data);}
        if(textContent){elem.textContent = textContent;}
        if(for_){elem.setAttribute('for',for_);}
        if(value){elem.value = value;}
        if(placeholder){elem.setAttribute('placeholder',placeholder);}
        if(step){elem.setAttribute('step',step);}
        if(classList){if(typeof classList == 'string'){elem.classList.add(classList)}else {classList.forEach(e=>{elem.classList.add(e);});}}
        if(style){for(var e in style){elem.style[e] = style[e];}}
        parent.appendChild(elem);
        return elem;
    }
    // ################################################
    // ===*****===*****===*****===*****===*****===*****
    // Dict içindeki id'leri konumları ile listeleyip return lar
    // ***=====***=====***=====***=====***=====***=====
    allIDpath(data, path=null, id_path=null) {
        id_path = id_path || {};
        if (typeof data == 'object') {
            for (var prop in data) {
                var new_path = path ? path + '.' + prop : prop
                var value = data [prop];
                if (typeof value == 'object') {this.allIDpath(value, new_path, id_path);}
                else if (prop == 'id') {id_path[value]=new_path;}
            }
        } return id_path;
    }
    // ################################################
    // ===*****===*****===*****===*****===*****===*****
    // decisonTree to HTML
    // ***=====***=====***=====***=====***=====***=====
    reStart(path,main=this.main){
        path = path.split('id')[0];
        path = path.split('.');
        path.pop();
        var dataNext = this.data;

        path.forEach(p=>{
            dataNext=dataNext[p];
        });
        this.start(dataNext);
    }
    // ################################################
    // ===*****===*****===*****===*****===*****===*****
    // decisonTree to HTML
    // ***=====***=====***=====***=====***=====***=====
    start(data=this.data, main=this.main){
        var type, id, question;    question = data.question;
        type = data.type;
        id = data.id;
        id = "questionMain" + id.toString();
        
        // Gerekli QuestionMain yapısı, soru-text alanı ve soru alanı oluşturulur
        const questionMain = this.creatorElement({parent:main, type:'div',id:id, classList:'QuestionMain'});
        this.allQuestionDiv.push(questionMain);
        this.creatorElement({parent:questionMain, type:'div', classList:'QuestionText', textContent:question});;
        const questionArea = this.creatorElement({parent:questionMain, type:'div', classList:'QuestionArea'});
        const value = data.value;

        // SWITCH-CASE yapısı ile input,option,checkbox yakalama ve gerekli işlemlerin yapılması
        if(type == "option"){
            // Tüm radioların ortak name si üretilir
            const radioName = this.createRandomString('name');
            value.forEach(option=>{
                // Her bir radio ya özel label ile tıklanması için şart olan ID üretilir
                const radioID = this.createRandomString('id');
                // Gerekli elementler üretilir
                const questionDiv = this.creatorElement({
                    parent:questionArea,
                    type:'div'
                });
                this.creatorElement({
                    parent:questionDiv,
                    type:'label',
                    for_:radioID,
                    textContent: option
                });
                const radio = this.creatorElement({
                    parent: questionDiv,
                    type: 'input',
                    id: radioID,
                    type_: "radio",
                    name: radioName
                });
                // ID=>Value eşleştirilmesi yapılır
                this.IDvalue[radioID] = typeof option == "string" ? option.toLowerCase() : option;
            });
            const allRadioButtons = questionArea.querySelectorAll('input[type="radio"]');
            // üretilen radiolar için tıklanma eventi eklenir
            allRadioButtons.forEach(radio=>{
                // Tıklanma olayında mevcut QuestionMain'den sonrakiler silinir
                radio.addEventListener('click', ()=>{
                    this.updateQuestionDiv(questionMain);
                    var sceneNext = data.option;
                    // olasılıklar için işlemler yapılır
                    sceneNext.forEach(scene=>{
                        // seneryo ile radio eşlenir
                        if(scene.ischecked.toLowerCase() === this.IDvalue[radio.id]){
                            var returnID = typeof scene.return === "object" ? (scene.return != null ? (scene.return.hasOwnProperty('id') ? scene.return.id : null) : null) : (typeof scene.return == "number" ? scene.return : null);
                            var path = returnID ? (this.id_path.hasOwnProperty(returnID) ? this.id_path[returnID] : null) : null;
                            if(path){this.reStart(path)}
                        }
                    });
                });
            });

        }
        else if(type == "checkbox"){
            value.forEach(check=>{
                const checkID = this.createRandomString('id');
                const questionDiv = this.creatorElement({
                    parent: questionArea,
                    type: 'div',
                });
                this.creatorElement({
                    parent:questionDiv,
                    type:'label',
                    for_:checkID,
                    textContent:check,
                });
                const checkbox = this.creatorElement({
                    parent:questionDiv,
                    type:'input',
                    type_:"checkbox",
                    id:checkID,
                });
                this.IDvalue[checkID] = typeof check == "string" ? check.toLowerCase() : check;
            });
            const allcheckbox = questionArea.querySelectorAll('input[type=checkbox]');
            var sceneNext = data.checkbox;
            allcheckbox.forEach(check=>{
                check.addEventListener('click', ()=>{
                    this.updateQuestionDiv(questionMain);
                    sceneNext.forEach(scene=>{
                        var ischecked = scene.hasOwnProperty('ischecked') ? scene.ischecked : null;
                        var returnID = null;
                        if(ischecked){
                            const allchecked = questionArea.querySelectorAll('input[type=checkbox]:checked');
                            if(ischecked == "all" && allcheckbox.length == allchecked.length){
                                returnID = scene.hasOwnProperty('return') ? scene.return : null;
                            }
                            if(typeof ischecked == "number"){
                                if(allchecked.length >= ischecked){
                                    returnID = scene.hasOwnProperty('return') ? scene.return : null;
                                }
                            }
                            if(typeof ischecked == "object"){
                                var ischecked = ischecked.map(eleman => typeof eleman == "string" ? eleman.toLowerCase () : eleman);
                                var allcheckedID = Array.from(allchecked);
                                var allcheckedID = allcheckedID.map(e=>this.IDvalue[e.id]);
                                if(this.equalList(allcheckedID, ischecked)){
                                    returnID = scene.hasOwnProperty('return') ? scene.return : null;
                                }
                            }
                        }
                        returnID = returnID ? (typeof returnID === "number" ? returnID : (typeof returnID === "object" ? (returnID.hasOwnProperty(id) ? returnID.id : null) : null) ) : null;
                        var path = returnID ? (this.id_path.hasOwnProperty(returnID) ? this.id_path[returnID] : null) : null;
                        if(path){this.reStart(path)}
                    });
                });
            });
            const defaultCheckID = this.createRandomString('id');
            const defaultChecDiv   = this.creatorElement({
                parent:questionArea,
                type:'div'
            });
            this.creatorElement({
                parent:defaultChecDiv,
                type:'label',
                textContent:'Hiçbiri',
                classList:"defaultCheckBox",
                for_:defaultCheckID
            });
            const defaultCheck = this.creatorElement({
                parent:defaultChecDiv,
                type:'input',
                type_:"checkbox",
                value:"Hiçbiri",
                id:defaultCheckID,
                style: {
                    'display':'none'
                }
            });
            defaultCheck.addEventListener('click',()=>{
                this.updateQuestionDiv(questionMain);
                var allcheckedbox = questionArea.querySelectorAll('div>input[type="checkbox"]:checked');
                allcheckedbox.forEach(e=>{
                    e.checked = false;
                });
            });
        }
        else if(type="input"){
            const inputType = data.inputType;
            const questionDiv = this.creatorElement({
                parent:questionArea,
                type: "div",
            });
            const input = this.creatorElement({
                parent:questionDiv,
                type: 'input',
                type_: inputType == "str" ? "text" : "number",
                step: "any",
                placeholder: value
            });
            var sceneNext = data.input;
            input.addEventListener("input", ()=>{
                this.updateQuestionDiv(questionMain);
                var path = null;

                sceneNext.forEach(scene=>{
                    if(inputType=='str'){
                        var inputValue = input.value.toLowerCase().trim();
                        if(inputValue == scene.value.toLowerCase()){
                            if(scene.return && scene.return != ''){
                                returnID = typeof scene.return === 'object' ? scene.return.id : scene.return;
                                var path = returnID ? (this.id_path.hasOwnProperty(returnID) ? this.id_path[returnID] : null) : null;
                            }
                        }
                    }else if(inputType == 'int'){
                        var returnID = null;
                        var inputValue = parseFloat(input.value);
                        if(!isNaN(inputValue)){
                            var sceneValue = scene.value ? scene.value : null;
                            var sceneCompare = scene.comparison ? scene.comparison : null;

                            if(typeof sceneValue == "object"){
                                if(sceneCompare && sceneCompare != 'normal'){
                                    if(typeof sceneCompare == 'string' && sceneCompare=='equal'){
                                        if(sceneValue[0]<=inputValue && inputValue<=sceneValue[1]){
                                            returnID = scene.return ? scene.return : null;
                                        }
                                    }else if(typeof sceneCompare == 'object'){
                                        if((sceneCompare[0]=="normal" || sceneCompare[0]==null) && (sceneCompare[1]=="equal")){
                                            if(sceneValue[0]<inputValue && inputValue<=sceneValue[1]){
                                                returnID = scene.return ? scene.return : null;
                                            }
                                        }
                                        if((sceneCompare[0]=="normal" || sceneCompare[0]==null) && (sceneCompare[1]=="normal" || sceneCompare[1]==null)){
                                            if(sceneValue[0]<inputValue && inputValue<sceneValue[1]){
                                                returnID = scene.return ? scene.return : null;
                                            }
                                        }
                                        if((sceneCompare[0]=="equal") && (sceneCompare[1]=="equal")){
                                            if(sceneValue[0]<=inputValue && inputValue<=sceneValue[1]){
                                                returnID = scene.return ? scene.return : null;
                                            }
                                        }
                                        if((sceneCompare[0]=="equal") && (sceneCompare[1]=="normal" || sceneCompare[1]==null)){
                                            if(sceneValue[0]<=inputValue && inputValue<sceneValue[1]){
                                                returnID = scene.return ? scene.return : null;
                                            }
                                        }
                                    }
                                }else{
                                    if(sceneValue[0]<inputValue && inputValue<sceneValue[1]){
                                        returnID = scene.return ? scene.return : null;
                                    }
                                }
                            }else{
                                if(sceneCompare && sceneCompare!=null && typeof sceneCompare == "string"){
                                    if(sceneCompare == "equal"){returnID = inputValue == sceneValue ? scene.return : null;}
                                    else if(sceneCompare == "bigger-equal"){returnID = inputValue >= sceneValue ? scene.return : null;}
                                    else if(sceneCompare == "smaller-equal"){returnID = inputValue <= sceneValue ? scene.return : null;}
                                    else if(sceneCompare == "bigger"){returnID = inputValue > sceneValue ? scene.return : null;}
                                    else if(sceneCompare == "smaller"){returnID = inputValue < sceneValue ? scene.return : null;}
                                }
                            }
                            if(returnID && typeof returnID != "string"){
                                if(typeof returnID == "number"){
                                }else if(typeof returnID == "object"){
                                    if(typeof returnID.id == "number"){
                                        returnID = returnID.id || null;
                                    }else{returnID = null;}
                                }
                            }
                            if(returnID!=null){
                                path = this.id_path[returnID] || null;
                            }
                        }
                    }
                    console.log(path);
                    if(path){this.reStart(path);}
                });
            });
        }
    }
}