/*
 *  Copyright 2009, Firebug Working Group
 *  Released under BSD license.
 *  More information: http://getfirebug.com/lite.html
 */
var FBL={};
(function(){var reSplitFile=/:\/{1,3}(.*?)\/([^\/]*?)\/?($|\?.*)/;
var namespaces=[];
this.ns=function(fn){var ns={};
namespaces.push(fn,ns);
return ns
};
var FBTrace=null;
this.initialize=function(){var isChromeContext=typeof window.FirebugApplication=="object";
if(!isChromeContext){findLocation()
}FBTrace=FBL.FBTrace;
if(FBL.Application.isTraceMode){FBTrace.initialize()
}if(isChromeContext){FBL.Application=window.FirebugApplication;
FBL.Application.isChromeContext=true;
FBL.FirebugChrome=FBL.Application.FirebugChrome
}else{FBL.Application.browser=window;
FBL.Application.destroy=destroyApplication
}if(FBTrace.DBG_INITIALIZE){FBTrace.sysout("FBL.initialize",namespaces.length/2+" namespaces BEGIN")
}for(var i=0;
i<namespaces.length;
i+=2){var fn=namespaces[i];
var ns=namespaces[i+1];
fn.apply(ns)
}if(FBTrace.DBG_INITIALIZE){FBTrace.sysout("FBL.initialize",namespaces.length/2+" namespaces END");
FBTrace.sysout("FBL waitForDocument","waiting document load")
}if(!isChromeContext){FBL.Application.FirebugChrome=FBL.FirebugChrome
}waitForDocument()
};
var waitForDocument=function waitForDocument(){if(document.body){onDocumentLoad()
}else{setTimeout(waitForDocument,50)
}};
var onDocumentLoad=function onDocumentLoad(){if(FBTrace.DBG_INITIALIZE){FBTrace.sysout("FBL onDocumentLoad","create application chrome")
}if(FBL.isIE6){fixIE6BackgroundImageCache()
}if(FBL.Application.isPersistentMode&&FBL.Application.isChromeContext){FBL.Firebug.initialize();
if(!FBL.Application.isDevelopmentMode){window.FirebugApplication.destroy();
if(FBL.isIE){window.FirebugApplication=null
}else{delete window.FirebugApplication
}}}else{FBL.FirebugChrome.create()
}};
this.Application={openAtStartup:false,isBookmarletMode:false,isPersistentMode:false,isTraceMode:false,skin:"xp",isDevelopmentMode:false,isChromeContext:false,browser:null,chrome:null};
var destroyApplication=function destroyApplication(){setTimeout(function(){FBL=null
},100)
};
this.Application.location={sourceDir:null,baseDir:null,skinDir:null,skin:null,app:null};
var findLocation=function findLocation(){var reFirebugFile=/(firebug(?:\.\w+)?\.js(?:\.jgz)?)(#.+)?$/;
var rePath=/^(.*\/)/;
var reProtocol=/^\w+:\/\//;
var path=null;
var doc=document;
var script=doc.getElementById("FirebugLite");
if(script){file=reFirebugFile.exec(script.src)
}else{for(var i=0,s=doc.getElementsByTagName("script"),si;
si=s[i];
i++){var file=null;
if(si.nodeName.toLowerCase()=="script"&&(file=reFirebugFile.exec(si.src))){script=si;
break
}}}if(file){var fileName=file[1];
var fileOptions=file[2];
if(reProtocol.test(script.src)){path=rePath.exec(script.src)[1]
}else{var r=rePath.exec(script.src);
var src=r?r[1]:script.src;
var rel=/^((?:\.\.\/)+)(.*)/.exec(src);
var lastFolder=/^(.*\/)[^\/]+\/$/;
path=rePath.exec(location.href)[1];
if(rel){var j=rel[1].length/3;
var p;
while(j-->0){path=lastFolder.exec(path)[1]
}path+=rel[2]
}}}var m=path&&path.match(/([^\/]+)\/$/)||null;
if(path&&m){var App=FBL.Application;
var loc=App.location;
loc.sourceDir=path;
loc.baseDir=path.substr(0,path.length-m[1].length-1);
loc.skinDir=loc.baseDir+"skin/"+App.skin+"/";
loc.skin=loc.skinDir+"firebug.html";
loc.app=path+fileName;
if(fileName=="firebug.dev.js"){App.isDevelopmentMode=true
}if(fileOptions){if(fileOptions.indexOf("open")!=-1){App.openAtStartup=true
}if(fileOptions.indexOf("remote")!=-1){App.isBookmarletMode=true;
App.openAtStartup=true
}if(fileOptions.indexOf("trace")!=-1){App.isTraceMode=true
}if(fileOptions.indexOf("persist")!=-1){App.isPersistentMode=true
}}var innerOptions=FBL.trim(script.innerHTML);
if(innerOptions){var innerOptionsObject=eval(innerOptions)
}}else{throw new Error("Firebug Error: Library path not found")
}};
this.bind=function(){var args=cloneArray(arguments),fn=args.shift(),object=args.shift();
return function(){return fn.apply(object,arrayInsert(cloneArray(args),0,arguments))
}
};
this.extend=function(l,r){var newOb={};
for(var n in l){newOb[n]=l[n]
}for(var n in r){newOb[n]=r[n]
}return newOb
};
this.append=function(l,r){for(var n in r){l[n]=r[n]
}return l
};
this.keys=function(map){var keys=[];
try{for(var name in map){keys.push(name)
}}catch(exc){}return keys
};
this.values=function(map){var values=[];
try{for(var name in map){try{values.push(map[name])
}catch(exc){if(FBTrace.DBG_ERRORS){FBTrace.dumpPropreties("lib.values FAILED ",exc)
}}}}catch(exc){if(FBTrace.DBG_ERRORS){FBTrace.dumpPropreties("lib.values FAILED ",exc)
}}return values
};
this.remove=function(list,item){for(var i=0;
i<list.length;
++i){if(list[i]==item){list.splice(i,1);
break
}}};
this.sliceArray=function(array,index){var slice=[];
for(var i=index;
i<array.length;
++i){slice.push(array[i])
}return slice
};
function cloneArray(array,fn){var newArray=[];
if(fn){for(var i=0;
i<array.length;
++i){newArray.push(fn(array[i]))
}}else{for(var i=0;
i<array.length;
++i){newArray.push(array[i])
}}return newArray
}function extendArray(array,array2){var newArray=[];
newArray.push.apply(newArray,array);
newArray.push.apply(newArray,array2);
return newArray
}this.extendArray=extendArray;
this.cloneArray=cloneArray;
function arrayInsert(array,index,other){for(var i=0;
i<other.length;
++i){array.splice(i+index,0,other[i])
}return array
}var userAgent=navigator.userAgent;
this.isFirefox=userAgent.indexOf("Firefox")!=-1;
this.isIE=userAgent.indexOf("MSIE")!=-1;
this.isOpera=userAgent.indexOf("Opera")!=-1;
this.isSafari=userAgent.indexOf("AppleWebKit")!=-1;
this.isIE6=/msie 6/i.test(navigator.appVersion);
this.isQuiksMode=document.compatMode=="BackCompat";
this.isIEQuiksMode=this.isIE&&this.isQuiksMode;
this.isIEStantandMode=this.isIE&&!this.isQuiksMode;
this.noFixedPosition=this.isIE6||this.isIEQuiksMode;
this.NS=document.getElementsByTagName("html")[0].getAttribute("xmlns");
var reTrim=/^\s+|\s+$/g;
this.trim=function(s){return s.replace(reTrim,"")
};
this.escapeNewLines=function(value){return value.replace(/\r/g,"\\r").replace(/\n/g,"\\n")
};
this.stripNewLines=function(value){return typeof(value)=="string"?value.replace(/[\r\n]/g," "):value
};
this.escapeJS=function(value){return value.replace(/\r/g,"\\r").replace(/\n/g,"\\n").replace('"','\\"',"g")
};
function escapeHTMLAttribute(value){function replaceChars(ch){switch(ch){case"&":return"&amp;";
case"'":return apos;
case'"':return quot
}return"?"
}var apos="&#39;",quot="&quot;",around='"';
if(value.indexOf('"')==-1){quot='"';
apos="'"
}else{if(value.indexOf("'")==-1){quot='"';
around="'"
}}return around+(String(value).replace(/[&'"]/g,replaceChars))+around
}function escapeHTML(value){function replaceChars(ch){switch(ch){case"<":return"&lt;";
case">":return"&gt;";
case"&":return"&amp;";
case"'":return"&#39;";
case'"':return"&quot;"
}return"?"
}return String(value).replace(/[<>&"']/g,replaceChars)
}this.escapeHTML=escapeHTML;
this.cropString=function(text,limit){text=text+"";
if(!limit){var halfLimit=50
}else{var halfLimit=limit/2
}if(text.length>limit){return this.escapeNewLines(text.substr(0,halfLimit)+"..."+text.substr(text.length-halfLimit))
}else{return this.escapeNewLines(text)
}};
this.safeToString=function(ob){try{if(ob&&"toString" in ob&&typeof ob.toString=="function"){return ob.toString()
}}catch(exc){return"[an object with no toString() function]"
}};
this.emptyFn=function(){};
this.isVisible=function(elt){return elt.offsetWidth>0||elt.offsetHeight>0||elt.tagName in invisibleTags||elt.namespaceURI=="http://www.w3.org/2000/svg"||elt.namespaceURI=="http://www.w3.org/1998/Math/MathML"
};
this.collapse=function(elt,collapsed){elt.setAttribute("collapsed",collapsed?"true":"false")
};
this.obscure=function(elt,obscured){if(obscured){this.setClass(elt,"obscured")
}else{this.removeClass(elt,"obscured")
}};
this.hide=function(elt,hidden){elt.style.visibility=hidden?"hidden":"visible"
};
this.clearNode=function(node){node.innerHTML=""
};
this.eraseNode=function(node){while(node.lastChild){node.removeChild(node.lastChild)
}};
this.iterateWindows=function(win,handler){if(!win||!win.document){return
}handler(win);
if(win==top||!win.frames){return
}for(var i=0;
i<win.frames.length;
++i){var subWin=win.frames[i];
if(subWin!=win){this.iterateWindows(subWin,handler)
}}};
this.getRootWindow=function(win){for(;
win;
win=win.parent){if(!win.parent||win==win.parent||!this.instanceOf(win.parent,"Window")){return win
}}return null
};
this.hasClass=function(node,name){if(!node||node.nodeType!=1){return false
}else{for(var i=1;
i<arguments.length;
++i){var name=arguments[i];
var re=new RegExp("(^|\\s)"+name+"($|\\s)");
if(!re.exec(node.className)){return false
}}return true
}};
this.setClass=function(node,name){if(node&&!this.hasClass(node,name)){node.className+=" "+name
}};
this.getClassValue=function(node,name){var re=new RegExp(name+"-([^ ]+)");
var m=re.exec(node.className);
return m?m[1]:""
};
this.removeClass=function(node,name){if(node&&node.className){var index=node.className.indexOf(name);
if(index>=0){var size=name.length;
node.className=node.className.substr(0,index-1)+node.className.substr(index+size)
}}};
this.toggleClass=function(elt,name){if(this.hasClass(elt,name)){this.removeClass(elt,name)
}else{this.setClass(elt,name)
}};
this.setClassTimed=function(elt,name,context,timeout){if(!timeout){timeout=1300
}if(elt.__setClassTimeout){context.clearTimeout(elt.__setClassTimeout)
}else{this.setClass(elt,name)
}elt.__setClassTimeout=context.setTimeout(function(){delete elt.__setClassTimeout;
FBL.removeClass(elt,name)
},timeout)
};
this.cancelClassTimed=function(elt,name,context){if(elt.__setClassTimeout){FBL.removeClass(elt,name);
context.clearTimeout(elt.__setClassTimeout);
delete elt.__setClassTimeout
}};
this.$=function(id,doc){if(doc){return doc.getElementById(id)
}else{return FBL.Firebug.chrome.document.getElementById(id)
}};
this.$$=function(selector,doc){if(doc||!FBL.Firebug.chrome){return FBL.Firebug.Selector(selector,doc)
}else{return FBL.Firebug.Selector(selector,FBL.Firebug.chrome.document)
}};
this.getChildByClass=function(node){for(var i=1;
i<arguments.length;
++i){var className=arguments[i];
var child=node.firstChild;
node=null;
for(;
child;
child=child.nextSibling){if(this.hasClass(child,className)){node=child;
break
}}}return node
};
this.getAncestorByClass=function(node,className){for(var parent=node;
parent;
parent=parent.parentNode){if(this.hasClass(parent,className)){return parent
}}return null
};
this.createElement=function(tagName,properties){properties=properties||{};
var doc=properties.document||FBL.Firebug.chrome.document;
var element=doc.createElement(tagName);
for(var name in properties){if(name!="document"){element[name]=properties[name]
}}return element
};
this.createGlobalElement=function(tagName,properties){properties=properties||{};
var doc=FBL.Application.browser.document;
var element=FBL.isIE?doc.createElement(tagName):doc.createElementNS(FBL.NS,tagName);
for(var name in properties){var propname=name;
if(FBL.isIE&&name=="class"){propname="className"
}if(FBL.isIE&&name=="style"){propname="cssText"
}if(name!="document"){element.setAttribute[propname]=properties[name]
}}return element
};
this.isLeftClick=function(event){return event.button==0&&this.noKeyModifiers(event)
};
this.isMiddleClick=function(event){return event.button==1&&this.noKeyModifiers(event)
};
this.isRightClick=function(event){return event.button==2&&this.noKeyModifiers(event)
};
this.noKeyModifiers=function(event){return !event.ctrlKey&&!event.shiftKey&&!event.altKey&&!event.metaKey
};
this.isControlClick=function(event){return event.button==0&&this.isControl(event)
};
this.isShiftClick=function(event){return event.button==0&&this.isShift(event)
};
this.isControl=function(event){return(event.metaKey||event.ctrlKey)&&!event.shiftKey&&!event.altKey
};
this.isControlShift=function(event){return(event.metaKey||event.ctrlKey)&&event.shiftKey&&!event.altKey
};
this.isShift=function(event){return event.shiftKey&&!event.metaKey&&!event.ctrlKey&&!event.altKey
};
this.addEvent=function(object,name,handler){if(document.all){object.attachEvent("on"+name,handler)
}else{object.addEventListener(name,handler,false)
}};
this.removeEvent=function(object,name,handler){if(document.all){object.detachEvent("on"+name,handler)
}else{object.removeEventListener(name,handler,false)
}};
this.cancelEvent=function(e,preventDefault){if(!e){return
}if(preventDefault){if(e.preventDefault){e.preventDefault()
}else{e.returnValue=false
}}if(document.all){e.cancelBubble=true
}else{e.stopPropagation()
}};
this.addGlobalEvent=function(name,handler){var doc=FBL.Firebug.browser.document;
var frames=FBL.Firebug.browser.window.frames;
FBL.addEvent(doc,name,handler);
if(FBL.Firebug.chrome.type=="popup"){FBL.addEvent(FBL.Firebug.chrome.document,name,handler)
}for(var i=0,frame;
frame=frames[i];
i++){try{FBL.addEvent(frame.document,name,handler)
}catch(E){}}};
this.removeGlobalEvent=function(name,handler){var doc=FBL.Firebug.browser.document;
var frames=FBL.Firebug.browser.window.frames;
FBL.removeEvent(doc,name,handler);
if(FBL.Firebug.chrome.type=="popup"){FBL.removeEvent(FBL.Firebug.chrome.document,name,handler)
}for(var i=0,frame;
frame=frames[i];
i++){try{FBL.removeEvent(frame.document,name,handler)
}catch(E){}}};
this.dispatch=function(listeners,name,args){try{if(typeof listeners.length!="undefined"){if(FBTrace.DBG_DISPATCH){FBTrace.sysout("FBL.dispatch",name+" to "+listeners.length+" listeners")
}for(var i=0;
i<listeners.length;
++i){var listener=listeners[i];
if(listener.hasOwnProperty(name)){listener[name].apply(listener,args)
}}}else{if(FBTrace.DBG_DISPATCH){FBTrace.sysout("FBL.dispatch",name+" to listeners of an object")
}for(var prop in listeners){var listener=listeners[prop];
if(listeners.hasOwnProperty(prop)&&listener.hasOwnProperty(name)){listener[name].apply(listener,args)
}}}}catch(exc){}};
this.disableTextSelection=function(e){if(typeof e.onselectstart!="undefined"){e.onselectstart=function(){return false
}
}else{e.onmousedown=function(){return false
}
}e.style.cursor="default"
};
this.getFileName=function(url){var split=this.splitURLBase(url);
return split.name
};
this.splitURLBase=function(url){if(this.isDataURL(url)){return this.splitDataURL(url)
}return this.splitURLTrue(url)
};
this.splitDataURL=function(url){var mark=url.indexOf(":",3);
if(mark!=4){return false
}var point=url.indexOf(",",mark+1);
if(point<mark){return false
}var props={encodedContent:url.substr(point+1)};
var metadataBuffer=url.substr(mark+1,point);
var metadata=metadataBuffer.split(";");
for(var i=0;
i<metadata.length;
i++){var nv=metadata[i].split("=");
if(nv.length==2){props[nv[0]]=nv[1]
}}if(props.hasOwnProperty("fileName")){var caller_URL=decodeURIComponent(props.fileName);
var caller_split=this.splitURLTrue(caller_URL);
if(props.hasOwnProperty("baseLineNumber")){props.path=caller_split.path;
props.line=props.baseLineNumber;
var hint=decodeURIComponent(props.encodedContent.substr(0,200)).replace(/\s*$/,"");
props.name="eval->"+hint
}else{props.name=caller_split.name;
props.path=caller_split.path
}}else{if(!props.hasOwnProperty("path")){props.path="data:"
}if(!props.hasOwnProperty("name")){props.name=decodeURIComponent(props.encodedContent.substr(0,200)).replace(/\s*$/,"")
}}return props
};
this.splitURLTrue=function(url){var m=reSplitFile.exec(url);
if(!m){return{name:url,path:url}
}else{if(!m[2]){return{path:m[1],name:m[1]}
}else{return{path:m[1],name:m[2]+m[3]}
}}};
this.getFileExtension=function(url){var lastDot=url.lastIndexOf(".");
return url.substr(lastDot+1)
};
this.isSystemURL=function(url){if(!url){return true
}if(url.length==0){return true
}if(url[0]=="h"){return false
}if(url.substr(0,9)=="resource:"){return true
}else{if(url.substr(0,16)=="chrome://firebug"){return true
}else{if(url=="XPCSafeJSObjectWrapper.cpp"){return true
}else{if(url.substr(0,6)=="about:"){return true
}else{if(url.indexOf("firebug-service.js")!=-1){return true
}else{return false
}}}}}};
this.isSystemPage=function(win){try{var doc=win.document;
if(!doc){return false
}if((doc.styleSheets.length&&doc.styleSheets[0].href=="chrome://global/content/xml/XMLPrettyPrint.css")||(doc.styleSheets.length>1&&doc.styleSheets[1].href=="chrome://browser/skin/feeds/subscribe.css")){return true
}return FBL.isSystemURL(win.location.href)
}catch(exc){ERROR("tabWatcher.isSystemPage document not ready:"+exc);
return false
}};
this.getURIHost=function(uri){try{if(uri){return uri.host
}else{return""
}}catch(exc){return""
}};
this.isLocalURL=function(url){if(url.substr(0,5)=="file:"){return true
}else{if(url.substr(0,8)=="wyciwyg:"){return true
}else{return false
}}};
this.isDataURL=function(url){return(url&&url.substr(0,5)=="data:")
};
this.getLocalPath=function(url){if(this.isLocalURL(url)){var fileHandler=ioService.getProtocolHandler("file").QueryInterface(Ci.nsIFileProtocolHandler);
var file=fileHandler.getFileFromURLSpec(url);
return file.path
}};
this.getURLFromLocalFile=function(file){var fileHandler=ioService.getProtocolHandler("file").QueryInterface(Ci.nsIFileProtocolHandler);
var URL=fileHandler.getURLSpecFromFile(file);
return URL
};
this.getDataURLForContent=function(content,url){var uri="data:text/html;";
uri+="fileName="+encodeURIComponent(url)+",";
uri+=encodeURIComponent(content);
return uri
},this.getDomain=function(url){var m=/[^:]+:\/{1,3}([^\/]+)/.exec(url);
return m?m[1]:""
};
this.getURLPath=function(url){var m=/[^:]+:\/{1,3}[^\/]+(\/.*?)$/.exec(url);
return m?m[1]:""
};
this.getPrettyDomain=function(url){var m=/[^:]+:\/{1,3}(www\.)?([^\/]+)/.exec(url);
return m?m[2]:""
};
this.absoluteURL=function(url,baseURL){return this.absoluteURLWithDots(url,baseURL).replace("/./","/","g")
};
this.absoluteURLWithDots=function(url,baseURL){if(url[0]=="?"){return baseURL+url
}var reURL=/(([^:]+:)\/{1,2}[^\/]*)(.*?)$/;
var m=reURL.exec(url);
if(m){return url
}var m=reURL.exec(baseURL);
if(!m){return""
}var head=m[1];
var tail=m[3];
if(url.substr(0,2)=="//"){return m[2]+url
}else{if(url[0]=="/"){return head+url
}else{if(tail[tail.length-1]=="/"){return baseURL+url
}else{var parts=tail.split("/");
return head+parts.slice(0,parts.length-1).join("/")+"/"+url
}}}};
this.normalizeURL=function(url){if(!url){return""
}if(url.length<255){url=url.replace(/[^/]+\/\.\.\//,"","g");
url=url.replace(/#.*/,"");
url=url.replace(/file:\/([^/])/g,"file:///$1");
if(url.indexOf("chrome:")==0){var m=reChromeCase.exec(url);
if(m){url="chrome://"+m[1].toLowerCase()+"/"+m[2]
}}}return url
};
this.denormalizeURL=function(url){return url.replace(/file:\/\/\//g,"file:/")
};
this.parseURLParams=function(url){var q=url?url.indexOf("?"):-1;
if(q==-1){return[]
}var search=url.substr(q+1);
var h=search.lastIndexOf("#");
if(h!=-1){search=search.substr(0,h)
}if(!search){return[]
}return this.parseURLEncodedText(search)
};
this.parseURLEncodedText=function(text){var maxValueLength=25000;
var params=[];
text=text.replace(/\+/g," ");
var args=text.split("&");
for(var i=0;
i<args.length;
++i){try{var parts=args[i].split("=");
if(parts.length==2){if(parts[1].length>maxValueLength){parts[1]=this.$STR("LargeData")
}params.push({name:decodeURIComponent(parts[0]),value:decodeURIComponent(parts[1])})
}else{params.push({name:decodeURIComponent(parts[0]),value:""})
}}catch(e){if(FBTrace.DBG_ERRORS){FBTrace.sysout("parseURLEncodedText EXCEPTION ",e);
FBTrace.sysout("parseURLEncodedText EXCEPTION URI",args[i])
}}}params.sort(function(a,b){return a.name<=b.name?-1:1
});
return params
};
this.reEncodeURL=function(file,text){var lines=text.split("\n");
var params=this.parseURLEncodedText(lines[lines.length-1]);
var args=[];
for(var i=0;
i<params.length;
++i){args.push(encodeURIComponent(params[i].name)+"="+encodeURIComponent(params[i].value))
}var url=file.href;
url+=(url.indexOf("?")==-1?"?":"&")+args.join("&");
return url
};
this.getResource=function(aURL){try{var channel=ioService.newChannel(aURL,null,null);
var input=channel.open();
return FBL.readFromStream(input)
}catch(e){if(FBTrace.DBG_ERRORS){FBTrace.sysout("lib.getResource FAILS for "+aURL,e)
}}};
this.parseJSONString=function(jsonString,originURL){var regex=new RegExp(/^\/\*-secure-([\s\S]*)\*\/\s*$/);
var matches=regex.exec(jsonString);
if(matches){jsonString=matches[1];
if(jsonString[0]=="\\"&&jsonString[1]=="n"){jsonString=jsonString.substr(2)
}if(jsonString[jsonString.length-2]=="\\"&&jsonString[jsonString.length-1]=="n"){jsonString=jsonString.substr(0,jsonString.length-2)
}}if(jsonString.indexOf("&&&START&&&")){regex=new RegExp(/&&&START&&& (.+) &&&END&&&/);
matches=regex.exec(jsonString);
if(matches){jsonString=matches[1]
}}jsonString="("+jsonString+")";
var s=Components.utils.Sandbox(originURL);
var jsonObject=null;
try{jsonObject=Components.utils.evalInSandbox(jsonString,s)
}catch(e){if(e.message.indexOf("is not defined")){var parts=e.message.split(" ");
s[parts[0]]=function(str){return str
};
try{jsonObject=Components.utils.evalInSandbox(jsonString,s)
}catch(ex){if(FBTrace.DBG_ERRORS||FBTrace.DBG_JSONVIEWER){FBTrace.sysout("jsonviewer.parseJSON EXCEPTION",e)
}return null
}}else{if(FBTrace.DBG_ERRORS||FBTrace.DBG_JSONVIEWER){FBTrace.sysout("jsonviewer.parseJSON EXCEPTION",e)
}return null
}}return jsonObject
};
this.objectToString=function(object){try{return object+""
}catch(exc){return null
}};
function onOperaTabBlur(e){if(this.lastKey==9){this.focus()
}}function onOperaTabKeyDown(e){this.lastKey=e.keyCode
}function onOperaTabFocus(e){this.lastKey=null
}this.fixOperaTabKey=function(el){el.onfocus=onOperaTabFocus;
el.onblur=onOperaTabBlur;
el.onkeydown=onOperaTabKeyDown
};
this.Property=function(object,name){this.object=object;
this.name=name;
this.getObject=function(){return object[name]
}
};
this.ErrorCopy=function(message){this.message=message
};
function EventCopy(event){for(var name in event){try{this[name]=event[name]
}catch(exc){}}}this.EventCopy=EventCopy;
var toString=Object.prototype.toString;
var reFunction=/^\s*function(\s+[\w_$][\w\d_$]*)?\s*\(/;
this.isArray=function(object){return toString.call(object)==="[object Array]"
};
this.isArrayLike=function(object){};
this.isFunction=function(object){return toString.call(object)==="[object Function]"||this.isIE&&typeof object!="string"&&reFunction.test(""+object)
};
this.instanceOf=function(object,className){if(!object||typeof object!="object"){return false
}var cache=instanceCheckMap[className];
if(!cache){return false
}for(var n in cache){var obj=cache[n];
var type=typeof obj;
obj=type=="object"?obj:[obj];
for(var name in obj){var value=obj[name];
if(n=="property"&&!(value in object)||n=="method"&&!this.isFunction(object[value])||n=="value"&&(""+object[name]).toLowerCase()!=""+value){return false
}}}return true
};
var instanceCheckMap={Window:{property:["window","document"],method:"setTimeout"},Document:{property:["body","cookie"],method:"getElementById"},Node:{property:"ownerDocument",method:"appendChild"},Element:{property:"tagName",value:{nodeType:1}},Location:{property:["hostname","protocol"],method:"assign"},HTMLImageElement:{property:"useMap",value:{nodeType:1,tagName:"img"}},HTMLAnchorElement:{property:"hreflang",value:{nodeType:1,tagName:"a"}},HTMLInputElement:{property:"form",value:{nodeType:1,tagName:"input"}},HTMLButtonElement:{},HTMLFormElement:{method:"submit",value:{nodeType:1,tagName:"form"}},HTMLBodyElement:{},HTMLHtmlElement:{}};
this.getDOMMembers=function(object){if(!domMemberCache){domMemberCache={};
for(var name in domMemberMap){var builtins=domMemberMap[name];
var cache=domMemberCache[name]={};
for(var i=0;
i<builtins.length;
++i){cache[builtins[i]]=i
}}}try{if(this.instanceOf(object,"Window")){return domMemberCache.Window
}else{if(object instanceof Document||object instanceof XMLDocument){return domMemberCache.Document
}else{if(object instanceof Location){return domMemberCache.Location
}else{if(object instanceof HTMLImageElement){return domMemberCache.HTMLImageElement
}else{if(object instanceof HTMLAnchorElement){return domMemberCache.HTMLAnchorElement
}else{if(object instanceof HTMLInputElement){return domMemberCache.HTMLInputElement
}else{if(object instanceof HTMLButtonElement){return domMemberCache.HTMLButtonElement
}else{if(object instanceof HTMLFormElement){return domMemberCache.HTMLFormElement
}else{if(object instanceof HTMLBodyElement){return domMemberCache.HTMLBodyElement
}else{if(object instanceof HTMLHtmlElement){return domMemberCache.HTMLHtmlElement
}else{if(object instanceof HTMLScriptElement){return domMemberCache.HTMLScriptElement
}else{if(object instanceof HTMLTableElement){return domMemberCache.HTMLTableElement
}else{if(object instanceof HTMLTableRowElement){return domMemberCache.HTMLTableRowElement
}else{if(object instanceof HTMLTableCellElement){return domMemberCache.HTMLTableCellElement
}else{if(object instanceof HTMLIFrameElement){return domMemberCache.HTMLIFrameElement
}else{if(object instanceof SVGSVGElement){return domMemberCache.SVGSVGElement
}else{if(object instanceof SVGElement){return domMemberCache.SVGElement
}else{if(object instanceof Element){return domMemberCache.Element
}else{if(object instanceof Text||object instanceof CDATASection){return domMemberCache.Text
}else{if(object instanceof Attr){return domMemberCache.Attr
}else{if(object instanceof Node){return domMemberCache.Node
}else{if(object instanceof Event||object instanceof EventCopy){return domMemberCache.Event
}else{return{}
}}}}}}}}}}}}}}}}}}}}}}}catch(E){return{}
}};
this.isDOMMember=function(object,propName){var members=this.getDOMMembers(object);
return members&&propName in members
};
var domMemberCache=null;
var domMemberMap={};
domMemberMap.Window=["document","frameElement","innerWidth","innerHeight","outerWidth","outerHeight","screenX","screenY","pageXOffset","pageYOffset","scrollX","scrollY","scrollMaxX","scrollMaxY","status","defaultStatus","parent","opener","top","window","content","self","location","history","frames","navigator","screen","menubar","toolbar","locationbar","personalbar","statusbar","directories","scrollbars","fullScreen","netscape","java","console","Components","controllers","closed","crypto","pkcs11","name","property","length","sessionStorage","globalStorage","setTimeout","setInterval","clearTimeout","clearInterval","addEventListener","removeEventListener","dispatchEvent","getComputedStyle","captureEvents","releaseEvents","routeEvent","enableExternalCapture","disableExternalCapture","moveTo","moveBy","resizeTo","resizeBy","scroll","scrollTo","scrollBy","scrollByLines","scrollByPages","sizeToContent","setResizable","getSelection","open","openDialog","close","alert","confirm","prompt","dump","focus","blur","find","back","forward","home","stop","print","atob","btoa","updateCommands","XPCNativeWrapper","GeckoActiveXObject","applicationCache"];
domMemberMap.Location=["href","protocol","host","hostname","port","pathname","search","hash","assign","reload","replace"];
domMemberMap.Node=["id","className","nodeType","tagName","nodeName","localName","prefix","namespaceURI","nodeValue","ownerDocument","parentNode","offsetParent","nextSibling","previousSibling","firstChild","lastChild","childNodes","attributes","dir","baseURI","textContent","innerHTML","addEventListener","removeEventListener","dispatchEvent","cloneNode","appendChild","insertBefore","replaceChild","removeChild","compareDocumentPosition","hasAttributes","hasChildNodes","lookupNamespaceURI","lookupPrefix","normalize","isDefaultNamespace","isEqualNode","isSameNode","isSupported","getFeature","getUserData","setUserData"];
domMemberMap.Document=extendArray(domMemberMap.Node,["documentElement","body","title","location","referrer","cookie","contentType","lastModified","characterSet","inputEncoding","xmlEncoding","xmlStandalone","xmlVersion","strictErrorChecking","documentURI","URL","defaultView","doctype","implementation","styleSheets","images","links","forms","anchors","embeds","plugins","applets","width","height","designMode","compatMode","async","preferredStylesheetSet","alinkColor","linkColor","vlinkColor","bgColor","fgColor","domain","addEventListener","removeEventListener","dispatchEvent","captureEvents","releaseEvents","routeEvent","clear","open","close","execCommand","execCommandShowHelp","getElementsByName","getSelection","queryCommandEnabled","queryCommandIndeterm","queryCommandState","queryCommandSupported","queryCommandText","queryCommandValue","write","writeln","adoptNode","appendChild","removeChild","renameNode","cloneNode","compareDocumentPosition","createAttribute","createAttributeNS","createCDATASection","createComment","createDocumentFragment","createElement","createElementNS","createEntityReference","createEvent","createExpression","createNSResolver","createNodeIterator","createProcessingInstruction","createRange","createTextNode","createTreeWalker","domConfig","evaluate","evaluateFIXptr","evaluateXPointer","getAnonymousElementByAttribute","getAnonymousNodes","addBinding","removeBinding","getBindingParent","getBoxObjectFor","setBoxObjectFor","getElementById","getElementsByTagName","getElementsByTagNameNS","hasAttributes","hasChildNodes","importNode","insertBefore","isDefaultNamespace","isEqualNode","isSameNode","isSupported","load","loadBindingDocument","lookupNamespaceURI","lookupPrefix","normalize","normalizeDocument","getFeature","getUserData","setUserData"]);
domMemberMap.Element=extendArray(domMemberMap.Node,["clientWidth","clientHeight","offsetLeft","offsetTop","offsetWidth","offsetHeight","scrollLeft","scrollTop","scrollWidth","scrollHeight","style","tabIndex","title","lang","align","spellcheck","addEventListener","removeEventListener","dispatchEvent","focus","blur","cloneNode","appendChild","insertBefore","replaceChild","removeChild","compareDocumentPosition","getElementsByTagName","getElementsByTagNameNS","getAttribute","getAttributeNS","getAttributeNode","getAttributeNodeNS","setAttribute","setAttributeNS","setAttributeNode","setAttributeNodeNS","removeAttribute","removeAttributeNS","removeAttributeNode","hasAttribute","hasAttributeNS","hasAttributes","hasChildNodes","lookupNamespaceURI","lookupPrefix","normalize","isDefaultNamespace","isEqualNode","isSameNode","isSupported","getFeature","getUserData","setUserData"]);
domMemberMap.SVGElement=extendArray(domMemberMap.Element,["x","y","width","height","rx","ry","transform","href","ownerSVGElement","viewportElement","farthestViewportElement","nearestViewportElement","getBBox","getCTM","getScreenCTM","getTransformToElement","getPresentationAttribute","preserveAspectRatio"]);
domMemberMap.SVGSVGElement=extendArray(domMemberMap.Element,["x","y","width","height","rx","ry","transform","viewBox","viewport","currentView","useCurrentView","pixelUnitToMillimeterX","pixelUnitToMillimeterY","screenPixelToMillimeterX","screenPixelToMillimeterY","currentScale","currentTranslate","zoomAndPan","ownerSVGElement","viewportElement","farthestViewportElement","nearestViewportElement","contentScriptType","contentStyleType","getBBox","getCTM","getScreenCTM","getTransformToElement","getEnclosureList","getIntersectionList","getViewboxToViewportTransform","getPresentationAttribute","getElementById","checkEnclosure","checkIntersection","createSVGAngle","createSVGLength","createSVGMatrix","createSVGNumber","createSVGPoint","createSVGRect","createSVGString","createSVGTransform","createSVGTransformFromMatrix","deSelectAll","preserveAspectRatio","forceRedraw","suspendRedraw","unsuspendRedraw","unsuspendRedrawAll","getCurrentTime","setCurrentTime","animationsPaused","pauseAnimations","unpauseAnimations"]);
domMemberMap.HTMLImageElement=extendArray(domMemberMap.Element,["src","naturalWidth","naturalHeight","width","height","x","y","name","alt","longDesc","lowsrc","border","complete","hspace","vspace","isMap","useMap",]);
domMemberMap.HTMLAnchorElement=extendArray(domMemberMap.Element,["name","target","accessKey","href","protocol","host","hostname","port","pathname","search","hash","hreflang","coords","shape","text","type","rel","rev","charset"]);
domMemberMap.HTMLIFrameElement=extendArray(domMemberMap.Element,["contentDocument","contentWindow","frameBorder","height","longDesc","marginHeight","marginWidth","name","scrolling","src","width"]);
domMemberMap.HTMLTableElement=extendArray(domMemberMap.Element,["bgColor","border","caption","cellPadding","cellSpacing","frame","rows","rules","summary","tBodies","tFoot","tHead","width","createCaption","createTFoot","createTHead","deleteCaption","deleteRow","deleteTFoot","deleteTHead","insertRow"]);
domMemberMap.HTMLTableRowElement=extendArray(domMemberMap.Element,["bgColor","cells","ch","chOff","rowIndex","sectionRowIndex","vAlign","deleteCell","insertCell"]);
domMemberMap.HTMLTableCellElement=extendArray(domMemberMap.Element,["abbr","axis","bgColor","cellIndex","ch","chOff","colSpan","headers","height","noWrap","rowSpan","scope","vAlign","width"]);
domMemberMap.HTMLScriptElement=extendArray(domMemberMap.Element,["src"]);
domMemberMap.HTMLButtonElement=extendArray(domMemberMap.Element,["accessKey","disabled","form","name","type","value","click"]);
domMemberMap.HTMLInputElement=extendArray(domMemberMap.Element,["type","value","checked","accept","accessKey","alt","controllers","defaultChecked","defaultValue","disabled","form","maxLength","name","readOnly","selectionEnd","selectionStart","size","src","textLength","useMap","click","select","setSelectionRange"]);
domMemberMap.HTMLFormElement=extendArray(domMemberMap.Element,["acceptCharset","action","author","elements","encoding","enctype","entry_id","length","method","name","post","target","text","url","reset","submit"]);
domMemberMap.HTMLBodyElement=extendArray(domMemberMap.Element,["aLink","background","bgColor","link","text","vLink"]);
domMemberMap.HTMLHtmlElement=extendArray(domMemberMap.Element,["version"]);
domMemberMap.Text=extendArray(domMemberMap.Node,["data","length","appendData","deleteData","insertData","replaceData","splitText","substringData"]);
domMemberMap.Attr=extendArray(domMemberMap.Node,["name","value","specified","ownerElement"]);
domMemberMap.Event=["type","target","currentTarget","originalTarget","explicitOriginalTarget","relatedTarget","rangeParent","rangeOffset","view","keyCode","charCode","screenX","screenY","clientX","clientY","layerX","layerY","pageX","pageY","detail","button","which","ctrlKey","shiftKey","altKey","metaKey","eventPhase","timeStamp","bubbles","cancelable","cancelBubble","isTrusted","isChar","getPreventDefault","initEvent","initMouseEvent","initKeyEvent","initUIEvent","preventBubble","preventCapture","preventDefault","stopPropagation"];
this.domConstantMap={ELEMENT_NODE:1,ATTRIBUTE_NODE:1,TEXT_NODE:1,CDATA_SECTION_NODE:1,ENTITY_REFERENCE_NODE:1,ENTITY_NODE:1,PROCESSING_INSTRUCTION_NODE:1,COMMENT_NODE:1,DOCUMENT_NODE:1,DOCUMENT_TYPE_NODE:1,DOCUMENT_FRAGMENT_NODE:1,NOTATION_NODE:1,DOCUMENT_POSITION_DISCONNECTED:1,DOCUMENT_POSITION_PRECEDING:1,DOCUMENT_POSITION_FOLLOWING:1,DOCUMENT_POSITION_CONTAINS:1,DOCUMENT_POSITION_CONTAINED_BY:1,DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC:1,UNKNOWN_RULE:1,STYLE_RULE:1,CHARSET_RULE:1,IMPORT_RULE:1,MEDIA_RULE:1,FONT_FACE_RULE:1,PAGE_RULE:1,CAPTURING_PHASE:1,AT_TARGET:1,BUBBLING_PHASE:1,SCROLL_PAGE_UP:1,SCROLL_PAGE_DOWN:1,MOUSEUP:1,MOUSEDOWN:1,MOUSEOVER:1,MOUSEOUT:1,MOUSEMOVE:1,MOUSEDRAG:1,CLICK:1,DBLCLICK:1,KEYDOWN:1,KEYUP:1,KEYPRESS:1,DRAGDROP:1,FOCUS:1,BLUR:1,SELECT:1,CHANGE:1,RESET:1,SUBMIT:1,SCROLL:1,LOAD:1,UNLOAD:1,XFER_DONE:1,ABORT:1,ERROR:1,LOCATE:1,MOVE:1,RESIZE:1,FORWARD:1,HELP:1,BACK:1,TEXT:1,ALT_MASK:1,CONTROL_MASK:1,SHIFT_MASK:1,META_MASK:1,DOM_VK_TAB:1,DOM_VK_PAGE_UP:1,DOM_VK_PAGE_DOWN:1,DOM_VK_UP:1,DOM_VK_DOWN:1,DOM_VK_LEFT:1,DOM_VK_RIGHT:1,DOM_VK_CANCEL:1,DOM_VK_HELP:1,DOM_VK_BACK_SPACE:1,DOM_VK_CLEAR:1,DOM_VK_RETURN:1,DOM_VK_ENTER:1,DOM_VK_SHIFT:1,DOM_VK_CONTROL:1,DOM_VK_ALT:1,DOM_VK_PAUSE:1,DOM_VK_CAPS_LOCK:1,DOM_VK_ESCAPE:1,DOM_VK_SPACE:1,DOM_VK_END:1,DOM_VK_HOME:1,DOM_VK_PRINTSCREEN:1,DOM_VK_INSERT:1,DOM_VK_DELETE:1,DOM_VK_0:1,DOM_VK_1:1,DOM_VK_2:1,DOM_VK_3:1,DOM_VK_4:1,DOM_VK_5:1,DOM_VK_6:1,DOM_VK_7:1,DOM_VK_8:1,DOM_VK_9:1,DOM_VK_SEMICOLON:1,DOM_VK_EQUALS:1,DOM_VK_A:1,DOM_VK_B:1,DOM_VK_C:1,DOM_VK_D:1,DOM_VK_E:1,DOM_VK_F:1,DOM_VK_G:1,DOM_VK_H:1,DOM_VK_I:1,DOM_VK_J:1,DOM_VK_K:1,DOM_VK_L:1,DOM_VK_M:1,DOM_VK_N:1,DOM_VK_O:1,DOM_VK_P:1,DOM_VK_Q:1,DOM_VK_R:1,DOM_VK_S:1,DOM_VK_T:1,DOM_VK_U:1,DOM_VK_V:1,DOM_VK_W:1,DOM_VK_X:1,DOM_VK_Y:1,DOM_VK_Z:1,DOM_VK_CONTEXT_MENU:1,DOM_VK_NUMPAD0:1,DOM_VK_NUMPAD1:1,DOM_VK_NUMPAD2:1,DOM_VK_NUMPAD3:1,DOM_VK_NUMPAD4:1,DOM_VK_NUMPAD5:1,DOM_VK_NUMPAD6:1,DOM_VK_NUMPAD7:1,DOM_VK_NUMPAD8:1,DOM_VK_NUMPAD9:1,DOM_VK_MULTIPLY:1,DOM_VK_ADD:1,DOM_VK_SEPARATOR:1,DOM_VK_SUBTRACT:1,DOM_VK_DECIMAL:1,DOM_VK_DIVIDE:1,DOM_VK_F1:1,DOM_VK_F2:1,DOM_VK_F3:1,DOM_VK_F4:1,DOM_VK_F5:1,DOM_VK_F6:1,DOM_VK_F7:1,DOM_VK_F8:1,DOM_VK_F9:1,DOM_VK_F10:1,DOM_VK_F11:1,DOM_VK_F12:1,DOM_VK_F13:1,DOM_VK_F14:1,DOM_VK_F15:1,DOM_VK_F16:1,DOM_VK_F17:1,DOM_VK_F18:1,DOM_VK_F19:1,DOM_VK_F20:1,DOM_VK_F21:1,DOM_VK_F22:1,DOM_VK_F23:1,DOM_VK_F24:1,DOM_VK_NUM_LOCK:1,DOM_VK_SCROLL_LOCK:1,DOM_VK_COMMA:1,DOM_VK_PERIOD:1,DOM_VK_SLASH:1,DOM_VK_BACK_QUOTE:1,DOM_VK_OPEN_BRACKET:1,DOM_VK_BACK_SLASH:1,DOM_VK_CLOSE_BRACKET:1,DOM_VK_QUOTE:1,DOM_VK_META:1,SVG_ZOOMANDPAN_DISABLE:1,SVG_ZOOMANDPAN_MAGNIFY:1,SVG_ZOOMANDPAN_UNKNOWN:1};
this.cssInfo={background:["bgRepeat","bgAttachment","bgPosition","color","systemColor","none"],"background-attachment":["bgAttachment"],"background-color":["color","systemColor"],"background-image":["none"],"background-position":["bgPosition"],"background-repeat":["bgRepeat"],border:["borderStyle","thickness","color","systemColor","none"],"border-top":["borderStyle","borderCollapse","color","systemColor","none"],"border-right":["borderStyle","borderCollapse","color","systemColor","none"],"border-bottom":["borderStyle","borderCollapse","color","systemColor","none"],"border-left":["borderStyle","borderCollapse","color","systemColor","none"],"border-collapse":["borderCollapse"],"border-color":["color","systemColor"],"border-top-color":["color","systemColor"],"border-right-color":["color","systemColor"],"border-bottom-color":["color","systemColor"],"border-left-color":["color","systemColor"],"border-spacing":[],"border-style":["borderStyle"],"border-top-style":["borderStyle"],"border-right-style":["borderStyle"],"border-bottom-style":["borderStyle"],"border-left-style":["borderStyle"],"border-width":["thickness"],"border-top-width":["thickness"],"border-right-width":["thickness"],"border-bottom-width":["thickness"],"border-left-width":["thickness"],bottom:["auto"],"caption-side":["captionSide"],clear:["clear","none"],clip:["auto"],color:["color","systemColor"],content:["content"],"counter-increment":["none"],"counter-reset":["none"],cursor:["cursor","none"],direction:["direction"],display:["display","none"],"empty-cells":[],"float":["float","none"],font:["fontStyle","fontVariant","fontWeight","fontFamily"],"font-family":["fontFamily"],"font-size":["fontSize"],"font-size-adjust":[],"font-stretch":[],"font-style":["fontStyle"],"font-variant":["fontVariant"],"font-weight":["fontWeight"],height:["auto"],left:["auto"],"letter-spacing":[],"line-height":[],"list-style":["listStyleType","listStylePosition","none"],"list-style-image":["none"],"list-style-position":["listStylePosition"],"list-style-type":["listStyleType","none"],margin:[],"margin-top":[],"margin-right":[],"margin-bottom":[],"margin-left":[],"marker-offset":["auto"],"min-height":["none"],"max-height":["none"],"min-width":["none"],"max-width":["none"],outline:["borderStyle","color","systemColor","none"],"outline-color":["color","systemColor"],"outline-style":["borderStyle"],"outline-width":[],overflow:["overflow","auto"],"overflow-x":["overflow","auto"],"overflow-y":["overflow","auto"],padding:[],"padding-top":[],"padding-right":[],"padding-bottom":[],"padding-left":[],position:["position"],quotes:["none"],right:["auto"],"table-layout":["tableLayout","auto"],"text-align":["textAlign"],"text-decoration":["textDecoration","none"],"text-indent":[],"text-shadow":[],"text-transform":["textTransform","none"],top:["auto"],"unicode-bidi":[],"vertical-align":["verticalAlign"],"white-space":["whiteSpace"],width:["auto"],"word-spacing":[],"z-index":[],"-moz-appearance":["mozAppearance"],"-moz-border-radius":[],"-moz-border-radius-bottomleft":[],"-moz-border-radius-bottomright":[],"-moz-border-radius-topleft":[],"-moz-border-radius-topright":[],"-moz-border-top-colors":["color","systemColor"],"-moz-border-right-colors":["color","systemColor"],"-moz-border-bottom-colors":["color","systemColor"],"-moz-border-left-colors":["color","systemColor"],"-moz-box-align":["mozBoxAlign"],"-moz-box-direction":["mozBoxDirection"],"-moz-box-flex":[],"-moz-box-ordinal-group":[],"-moz-box-orient":["mozBoxOrient"],"-moz-box-pack":["mozBoxPack"],"-moz-box-sizing":["mozBoxSizing"],"-moz-opacity":[],"-moz-user-focus":["userFocus","none"],"-moz-user-input":["userInput"],"-moz-user-modify":[],"-moz-user-select":["userSelect","none"],"-moz-background-clip":[],"-moz-background-inline-policy":[],"-moz-background-origin":[],"-moz-binding":[],"-moz-column-count":[],"-moz-column-gap":[],"-moz-column-width":[],"-moz-image-region":[]};
this.inheritedStyleNames={"border-collapse":1,"border-spacing":1,"border-style":1,"caption-side":1,color:1,cursor:1,direction:1,"empty-cells":1,font:1,"font-family":1,"font-size-adjust":1,"font-size":1,"font-style":1,"font-variant":1,"font-weight":1,"letter-spacing":1,"line-height":1,"list-style":1,"list-style-image":1,"list-style-position":1,"list-style-type":1,quotes:1,"text-align":1,"text-decoration":1,"text-indent":1,"text-shadow":1,"text-transform":1,"white-space":1,"word-spacing":1};
this.cssKeywords={appearance:["button","button-small","checkbox","checkbox-container","checkbox-small","dialog","listbox","menuitem","menulist","menulist-button","menulist-textfield","menupopup","progressbar","radio","radio-container","radio-small","resizer","scrollbar","scrollbarbutton-down","scrollbarbutton-left","scrollbarbutton-right","scrollbarbutton-up","scrollbartrack-horizontal","scrollbartrack-vertical","separator","statusbar","tab","tab-left-edge","tabpanels","textfield","toolbar","toolbarbutton","toolbox","tooltip","treeheadercell","treeheadersortarrow","treeitem","treetwisty","treetwistyopen","treeview","window"],systemColor:["ActiveBorder","ActiveCaption","AppWorkspace","Background","ButtonFace","ButtonHighlight","ButtonShadow","ButtonText","CaptionText","GrayText","Highlight","HighlightText","InactiveBorder","InactiveCaption","InactiveCaptionText","InfoBackground","InfoText","Menu","MenuText","Scrollbar","ThreeDDarkShadow","ThreeDFace","ThreeDHighlight","ThreeDLightShadow","ThreeDShadow","Window","WindowFrame","WindowText","-moz-field","-moz-fieldtext","-moz-workspace","-moz-visitedhyperlinktext","-moz-use-text-color"],color:["AliceBlue","AntiqueWhite","Aqua","Aquamarine","Azure","Beige","Bisque","Black","BlanchedAlmond","Blue","BlueViolet","Brown","BurlyWood","CadetBlue","Chartreuse","Chocolate","Coral","CornflowerBlue","Cornsilk","Crimson","Cyan","DarkBlue","DarkCyan","DarkGoldenRod","DarkGray","DarkGreen","DarkKhaki","DarkMagenta","DarkOliveGreen","DarkOrange","DarkOrchid","DarkRed","DarkSalmon","DarkSeaGreen","DarkSlateBlue","DarkSlateGray","DarkTurquoise","DarkViolet","DeepPink","DarkSkyBlue","DimGray","DodgerBlue","Feldspar","FireBrick","FloralWhite","ForestGreen","Fuchsia","Gainsboro","GhostWhite","Gold","GoldenRod","Gray","Green","GreenYellow","HoneyDew","HotPink","IndianRed","Indigo","Ivory","Khaki","Lavender","LavenderBlush","LawnGreen","LemonChiffon","LightBlue","LightCoral","LightCyan","LightGoldenRodYellow","LightGrey","LightGreen","LightPink","LightSalmon","LightSeaGreen","LightSkyBlue","LightSlateBlue","LightSlateGray","LightSteelBlue","LightYellow","Lime","LimeGreen","Linen","Magenta","Maroon","MediumAquaMarine","MediumBlue","MediumOrchid","MediumPurple","MediumSeaGreen","MediumSlateBlue","MediumSpringGreen","MediumTurquoise","MediumVioletRed","MidnightBlue","MintCream","MistyRose","Moccasin","NavajoWhite","Navy","OldLace","Olive","OliveDrab","Orange","OrangeRed","Orchid","PaleGoldenRod","PaleGreen","PaleTurquoise","PaleVioletRed","PapayaWhip","PeachPuff","Peru","Pink","Plum","PowderBlue","Purple","Red","RosyBrown","RoyalBlue","SaddleBrown","Salmon","SandyBrown","SeaGreen","SeaShell","Sienna","Silver","SkyBlue","SlateBlue","SlateGray","Snow","SpringGreen","SteelBlue","Tan","Teal","Thistle","Tomato","Turquoise","Violet","VioletRed","Wheat","White","WhiteSmoke","Yellow","YellowGreen","transparent","invert"],auto:["auto"],none:["none"],captionSide:["top","bottom","left","right"],clear:["left","right","both"],cursor:["auto","cell","context-menu","crosshair","default","help","pointer","progress","move","e-resize","all-scroll","ne-resize","nw-resize","n-resize","se-resize","sw-resize","s-resize","w-resize","ew-resize","ns-resize","nesw-resize","nwse-resize","col-resize","row-resize","text","vertical-text","wait","alias","copy","move","no-drop","not-allowed","-moz-alias","-moz-cell","-moz-copy","-moz-grab","-moz-grabbing","-moz-contextmenu","-moz-zoom-in","-moz-zoom-out","-moz-spinning"],direction:["ltr","rtl"],bgAttachment:["scroll","fixed"],bgPosition:["top","center","bottom","left","right"],bgRepeat:["repeat","repeat-x","repeat-y","no-repeat"],borderStyle:["hidden","dotted","dashed","solid","double","groove","ridge","inset","outset","-moz-bg-inset","-moz-bg-outset","-moz-bg-solid"],borderCollapse:["collapse","separate"],overflow:["visible","hidden","scroll","-moz-scrollbars-horizontal","-moz-scrollbars-none","-moz-scrollbars-vertical"],listStyleType:["disc","circle","square","decimal","decimal-leading-zero","lower-roman","upper-roman","lower-greek","lower-alpha","lower-latin","upper-alpha","upper-latin","hebrew","armenian","georgian","cjk-ideographic","hiragana","katakana","hiragana-iroha","katakana-iroha","inherit"],listStylePosition:["inside","outside"],content:["open-quote","close-quote","no-open-quote","no-close-quote","inherit"],fontStyle:["normal","italic","oblique","inherit"],fontVariant:["normal","small-caps","inherit"],fontWeight:["normal","bold","bolder","lighter","inherit"],fontSize:["xx-small","x-small","small","medium","large","x-large","xx-large","smaller","larger"],fontFamily:["Arial","Comic Sans MS","Georgia","Tahoma","Verdana","Times New Roman","Trebuchet MS","Lucida Grande","Helvetica","serif","sans-serif","cursive","fantasy","monospace","caption","icon","menu","message-box","small-caption","status-bar","inherit"],display:["block","inline","inline-block","list-item","marker","run-in","compact","table","inline-table","table-row-group","table-column","table-column-group","table-header-group","table-footer-group","table-row","table-cell","table-caption","-moz-box","-moz-compact","-moz-deck","-moz-grid","-moz-grid-group","-moz-grid-line","-moz-groupbox","-moz-inline-block","-moz-inline-box","-moz-inline-grid","-moz-inline-stack","-moz-inline-table","-moz-marker","-moz-popup","-moz-runin","-moz-stack"],position:["static","relative","absolute","fixed","inherit"],"float":["left","right"],textAlign:["left","right","center","justify"],tableLayout:["fixed"],textDecoration:["underline","overline","line-through","blink"],textTransform:["capitalize","lowercase","uppercase","inherit"],unicodeBidi:["normal","embed","bidi-override"],whiteSpace:["normal","pre","nowrap"],verticalAlign:["baseline","sub","super","top","text-top","middle","bottom","text-bottom","inherit"],thickness:["thin","medium","thick"],userFocus:["ignore","normal"],userInput:["disabled","enabled"],userSelect:["normal"],mozBoxSizing:["content-box","padding-box","border-box"],mozBoxAlign:["start","center","end","baseline","stretch"],mozBoxDirection:["normal","reverse"],mozBoxOrient:["horizontal","vertical"],mozBoxPack:["start","center","end"]};
this.nonEditableTags={HTML:1,HEAD:1,html:1,head:1};
this.innerEditableTags={BODY:1,body:1};
var invisibleTags=this.invisibleTags={HTML:1,HEAD:1,TITLE:1,META:1,LINK:1,STYLE:1,SCRIPT:1,NOSCRIPT:1,BR:1,html:1,head:1,title:1,meta:1,link:1,style:1,script:1,noscript:1,br:1};
this.Ajax={requests:[],transport:null,states:["Uninitialized","Loading","Loaded","Interactive","Complete"],initialize:function(){this.transport=this.getXHRObject()
},getXHRObject:function(){var xhrObj=false;
try{xhrObj=new XMLHttpRequest()
}catch(e){var progid=["MSXML2.XMLHTTP.5.0","MSXML2.XMLHTTP.4.0","MSXML2.XMLHTTP.3.0","MSXML2.XMLHTTP","Microsoft.XMLHTTP"];
for(var i=0;
i<progid.length;
++i){try{xhrObj=new ActiveXObject(progid[i])
}catch(e){continue
}break
}}finally{return xhrObj
}},request:function(options){var o=options||{};
o.type=o.type&&o.type.toLowerCase()||"get";
o.async=o.async||true;
o.dataType=o.dataType||"text";
o.contentType=o.contentType||"application/x-www-form-urlencoded";
this.requests.push(o);
var s=this.getState();
if(s=="Uninitialized"||s=="Complete"){this.sendRequest()
}},serialize:function(data){var r=[""],rl=0;
if(data){if(typeof data=="string"){r[rl++]=data
}else{if(data.innerHTML&&data.elements){for(var i=0,el,l=(el=data.elements).length;
i<l;
i++){if(el[i].name){r[rl++]=encodeURIComponent(el[i].name);
r[rl++]="=";
r[rl++]=encodeURIComponent(el[i].value);
r[rl++]="&"
}}}else{for(param in data){r[rl++]=encodeURIComponent(param);
r[rl++]="=";
r[rl++]=encodeURIComponent(data[param]);
r[rl++]="&"
}}}}return r.join("").replace(/&$/,"")
},sendRequest:function(){var t=FBL.Ajax.transport,r=FBL.Ajax.requests.shift(),data;
t.open(r.type,r.url,r.async);
t.setRequestHeader("X-Requested-With","XMLHttpRequest");
if(data=FBL.Ajax.serialize(r.data)){t.setRequestHeader("Content-Type",r.contentType)
}t.onreadystatechange=function(){FBL.Ajax.onStateChange(r)
};
t.send(data)
},onStateChange:function(options){var fn,o=options,t=this.transport;
var state=this.getState(t);
if(fn=o["on"+state]){fn(this.getResponse(o),o)
}if(state=="Complete"){var success=t.status==200,response=this.getResponse(o);
if(fn=o.onUpdate){fn(response,o)
}if(fn=o["on"+(success?"Success":"Failure")]){fn(response,o)
}t.onreadystatechange=FBL.emptyFn;
if(this.requests.length>0){setTimeout(this.sendRequest,10)
}}},getResponse:function(options){var t=this.transport,type=options.dataType;
if(t.status!=200){return t.statusText
}else{if(type=="text"){return t.responseText
}else{if(type=="html"){return t.responseText
}else{if(type=="xml"){return t.responseXML
}else{if(type=="json"){return eval("("+t.responseText+")")
}}}}}},getState:function(){return this.states[this.transport.readyState]
}};
this.Ajax.initialize();
this.createCookie=function(name,value,days){if(days){var date=new Date();
date.setTime(date.getTime()+(days*24*60*60*1000));
var expires="; expires="+date.toGMTString()
}else{var expires=""
}document.cookie=name+"="+value+expires+"; path=/"
};
this.readCookie=function(name){var nameEQ=name+"=";
var ca=document.cookie.split(";");
for(var i=0;
i<ca.length;
i++){var c=ca[i];
while(c.charAt(0)==" "){c=c.substring(1,c.length)
}if(c.indexOf(nameEQ)==0){return c.substring(nameEQ.length,c.length)
}}return null
};
this.eraseCookie=function(name){createCookie(name,"",-1)
};
var fixIE6BackgroundImageCache=function(doc){doc=doc||document;
try{doc.execCommand("BackgroundImageCache",false,true)
}catch(E){}}
}).apply(FBL);
FBL.FBTrace={};
(function(){var e={DBG_TIMESTAMP:1,DBG_INITIALIZE:1,DBG_CHROME:1,DBG_ERRORS:1,DBG_DISPATCH:1};
this.messageQueue=[];
this.module=null;
this.initialize=function(){for(var h in e){this[h]=e[h]
}};
this.sysout=function(){return this.logFormatted(arguments,"")
};
this.dumpProperties=function(i,h){return this.logFormatted("dumpProperties() not supported.","warning")
};
this.dumpStack=function(){return this.logFormatted("dumpStack() not supported.","warning")
};
this.flush=function(k){this.module=k;
var h=this.messageQueue;
this.messageQueue=[];
for(var j=0;
j<h.length;
++j){this.writeMessage(h[j][0],h[j][1],h[j][2])
}};
this.getPanel=function(){return this.module?this.module.getPanel():null
};
this.logFormatted=function(o,m){var k=this.DBG_TIMESTAMP?[d()," | "]:[];
var n=o.length;
for(var j=0;
j<n;
++j){g(" ",k);
var h=o[j];
if(j==0){k.push("<b>");
g(h,k);
k.push("</b>")
}else{g(h,k)
}}return this.logRow(k,m)
};
this.logRow=function(j,i){var h=this.getPanel();
if(h&&h.contentNode){this.writeMessage(j,i)
}else{this.messageQueue.push([j,i])
}return this.LOG_COMMAND
};
this.writeMessage=function(j,i){var h=this.getPanel().containerNode;
var k=h.scrollTop+h.offsetHeight>=h.scrollHeight;
this.writeRow.call(this,j,i);
if(k){h.scrollTop=h.scrollHeight-h.offsetHeight
}};
this.appendRow=function(i){var h=this.getPanel().contentNode;
h.appendChild(i)
};
this.writeRow=function(i,h){var j=this.getPanel().contentNode.ownerDocument.createElement("div");
j.className="logRow"+(h?" logRow-"+h:"");
j.innerHTML=i.join("");
this.appendRow(j)
};
function g(h,i){i.push(f(c(h)))
}function d(){var i=new Date();
var h=""+(i.getMilliseconds()/1000).toFixed(3);
h=h.substr(2);
return i.toLocaleTimeString()+"."+h
}var a={"<":"&lt;",">":"&gt;","&":"&amp;","'":"&#39;",'"':"&quot;"};
function b(h){return a[h]
}function f(h){return(h+"").replace(/[<>&"']/g,b)
}function c(i){try{return i+""
}catch(h){return null
}}}).apply(FBL.FBTrace);
FBL.ns(function(){with(FBL){FBL.cacheID="___FBL_";
FBL.documentCache={};
var modules=[];
var panelTypes=[];
var panelTypeMap={};
var reps=[];
Application.browser.window.Firebug=FBL.Firebug={version:"Firebug Lite 1.3.0a2",revision:"$Revision: 4001 $",modules:modules,panelTypes:panelTypes,reps:reps,initialize:function(){if(FBTrace.DBG_INITIALIZE){FBTrace.sysout("Firebug.initialize","initializing application")
}Firebug.browser=new Context(Application.browser);
Firebug.context=Firebug.browser;
cacheDocument();
FirebugChrome.initialize()
},shutdown:function(){documentCache={};
dispatch(modules,"shutdown",[])
},registerModule:function(){modules.push.apply(modules,arguments);
if(FBTrace.DBG_INITIALIZE){FBTrace.sysout("Firebug.registerModule")
}},registerPanel:function(){panelTypes.push.apply(panelTypes,arguments);
for(var i=0;
i<arguments.length;
++i){panelTypeMap[arguments[i].prototype.name]=arguments[i]
}if(FBTrace.DBG_INITIALIZE){for(var i=0;
i<arguments.length;
++i){FBTrace.sysout("Firebug.registerPanel",arguments[i].prototype.name)
}}},registerRep:function(){reps.push.apply(reps,arguments)
},unregisterRep:function(){for(var i=0;
i<arguments.length;
++i){remove(reps,arguments[i])
}},setDefaultReps:function(funcRep,rep){defaultRep=rep;
defaultFuncRep=funcRep
},getRep:function(object){var type=typeof(object);
if(isIE&&isFunction(object)){type="function"
}for(var i=0;
i<reps.length;
++i){var rep=reps[i];
try{if(rep.supportsObject(object,type)){if(FBTrace.DBG_DOM){FBTrace.sysout("getRep type: "+type+" object: "+object,rep)
}return rep
}}catch(exc){if(FBTrace.DBG_ERRORS){FBTrace.sysout("firebug.getRep FAILS: ",exc.message||exc);
FBTrace.sysout("firebug.getRep reps["+i+"/"+reps.length+"]: Rep="+reps[i].className)
}}}return(type=="function")?defaultFuncRep:defaultRep
},getRepObject:function(node){var target=null;
for(var child=node;
child;
child=child.parentNode){if(hasClass(child,"repTarget")){target=child
}if(child.repObject){if(!target&&hasClass(child,"repIgnore")){break
}else{return child.repObject
}}}},getRepNode:function(node){for(var child=node;
child;
child=child.parentNode){if(child.repObject){return child
}}},getElementByRepObject:function(element,object){for(var child=element.firstChild;
child;
child=child.nextSibling){if(child.repObject==object){return child
}}}};
Firebug.Rep=domplate({className:"",inspectable:true,supportsObject:function(object,type){return false
},inspectObject:function(object,context){Firebug.chrome.select(object)
},browseObject:function(object,context){},persistObject:function(object,context){},getRealObject:function(object,context){return object
},getTitle:function(object){var label=safeToString(object);
var re=/\[object (.*?)\]/;
var m=re.exec(label);
return m?m[1]:label
},getTooltip:function(object){return null
},getContextMenuItems:function(object,target,context){return[]
},STR:function(name){return $STR(name)
},cropString:function(text){return cropString(text)
},toLowerCase:function(text){return text?text.toLowerCase():text
},plural:function(n){return n==1?"":"s"
}});
var cacheDocument=function cacheDocument(){var els=Firebug.browser.document.getElementsByTagName("*");
for(var i=0,l=els.length,el;
i<l;
i++){el=els[i];
el[cacheID]=i;
documentCache[i]=el
}};
Firebug.Controller={controllers:null,controllerContext:null,initialize:function(context){this.controllers=[];
this.controllerContext=context||Firebug.chrome
},shutdown:function(){this.removeControllers()
},addController:function(){for(var i=0,arg;
arg=arguments[i];
i++){if(typeof arg[0]=="string"){arg[0]=$$(arg[0],this.controllerContext)
}var handler=arg[2];
arg[2]=bind(handler,this);
arg[3]=handler;
this.controllers.push(arg);
addEvent.apply(this,arg)
}},removeController:function(){for(var i=0,arg;
arg=arguments[i];
i++){for(var j=0,c;
c=this.controllers[j];
j++){if(arg[0]==c[0]&&arg[1]==c[1]&&arg[2]==c[3]){removeEvent.apply(this,c)
}}}},removeControllers:function(){for(var i=0,c;
c=this.controllers[i];
i++){removeEvent.apply(this,c)
}}};
Firebug.Module={initialize:function(){},shutdown:function(){},initContext:function(context){},reattachContext:function(browser,context){},destroyContext:function(context,persistedState){},showContext:function(browser,context){},loadedContext:function(context){},showPanel:function(browser,panel){},showSidePanel:function(browser,panel){},updateOption:function(name,value){},getObjectByURL:function(context,url){}};
Firebug.Panel={name:"HelloWorld",title:"Hello World!",parentPanel:null,options:{hasCommandLine:false,hasSidePanel:false,hasStatusBar:false,hasToolButtons:false,isPreRendered:false,panelHTML:"",panelCSS:"",toolButtonsHTML:""},tabNode:null,panelNode:null,sidePanelNode:null,statusBarNode:null,toolButtonsNode:null,panelBarNode:null,panelBar:null,commandLine:null,toolButtons:null,statusBar:null,searchable:false,editable:true,order:2147483647,statusSeparator:"<",create:function(context,doc){var options=this.options=extend(Firebug.Panel.options,this.options);
var panelId="fb"+this.name;
if(options.isPreRendered){this.panelNode=$(panelId);
this.tabNode=$(panelId+"Tab");
this.tabNode.style.display="block";
if(options.hasToolButtons){this.toolButtonsNode=$(panelId+"Buttons")
}if(options.hasStatusBar){this.statusBarBox=$("fbStatusBarBox");
this.statusBarNode=$(panelId+"StatusBar")
}if(options.hasSidePanel){}}else{var panelNode=this.panelNode=createElement("div",{id:panelId,className:"fbPanel"});
$("fbPanel1").appendChild(panelNode);
var tabHTML='<span class="fbTabL"></span><span class="fbTabText">'+this.title+'</span><span class="fbTabR"></span>';
var tabNode=this.tabNode=createElement("a",{id:panelId+"Tab",className:"fbTab fbHover",innerHTML:tabHTML});
if(isIE6){tabNode.href="javascript:void(0)"
}$("fbPanelBar1").appendChild(tabNode);
tabNode.style.display="block";
if(options.hasToolButtons){this.toolButtonsNode=createElement("span",{id:panelId+"Buttons",className:"fbToolbarButtons"})
}$("fbToolbarButtons").appendChild(this.toolButtonsNode)
}var contentNode=this.contentNode=createElement("div");
this.panelNode.appendChild(contentNode);
this.containerNode=this.panelNode.parentNode;
if(FBTrace.DBG_INITIALIZE){FBTrace.sysout("Firebug.Panel.initialize",this.name)
}},destroy:function(state){if(FBTrace.DBG_INITIALIZE){FBTrace.sysout("Firebug.Panel.destroy",this.name)
}if(this.panelNode){delete this.panelNode.ownerPanel
}this.destroyNode()
},initialize:function(){var options=this.options=extend(Firebug.Panel.options,this.options);
var panelId="fb"+this.name;
this.panelNode=$(panelId);
this.tabNode=$(panelId+"Tab");
this.tabNode.style.display="block";
if(options.hasSidePanel){}if(options.hasStatusBar){this.statusBarBox=$("fbStatusBarBox");
this.statusBarNode=$(panelId+"StatusBar")
}if(options.hasToolButtons){this.toolButtonsNode=$(panelId+"Buttons")
}this.containerNode=this.panelNode.parentNode
},shutdown:function(){},detach:function(oldChrome,newChrome){this.lastScrollTop=this.panelNode.scrollTop
},reattach:function(doc){this.document=doc;
if(this.panelNode){this.panelNode=doc.adoptNode(this.panelNode,true);
this.panelNode.ownerPanel=this;
doc.body.appendChild(this.panelNode);
this.panelNode.scrollTop=this.lastScrollTop;
delete this.lastScrollTop
}},show:function(state){var options=this.options;
if(options.hasSidePanel){}if(options.hasStatusBar){this.statusBarBox.style.display="inline";
this.statusBarNode.style.display="inline"
}if(options.hasToolButtons){this.toolButtonsNode.style.display="inline"
}this.panelNode.style.display="block";
Firebug.chrome.layout(this)
},hide:function(state){var options=this.options;
if(options.hasSidePanel){}if(options.hasStatusBar){this.statusBarBox.style.display="none";
this.statusBarNode.style.display="none"
}if(options.hasToolButtons){this.toolButtonsNode.style.display="none"
}this.panelNode.style.display="none"
},watchWindow:function(win){},unwatchWindow:function(win){},updateOption:function(name,value){},showToolbarButtons:function(buttonsId,show){try{if(!this.context.browser){if(FBTrace.DBG_ERRORS){FBTrace.sysout("firebug.Panel showToolbarButtons this.context has no browser, this:",this)
}return
}var buttons=this.context.browser.chrome.$(buttonsId);
if(buttons){collapse(buttons,show?"false":"true")
}}catch(exc){if(FBTrace.DBG_ERRORS){FBTrace.dumpProperties("firebug.Panel showToolbarButtons FAILS",exc);
if(!this.context.browser){FBTrace.dumpStack("firebug.Panel showToolbarButtons no browser")
}}}},supportsObject:function(object){return 0
},refresh:function(){},startInspecting:function(){},stopInspecting:function(object,cancelled){},search:function(text){}};
Firebug.PanelBar={selectedPanel:null,create:function(){this.panelMap={}
},initialize:function(){for(var name in this.panelMap){(function(self,name){var onTabClick=function onTabClick(){self.selectPanel(name);
return false
};
Firebug.chrome.addController([self.panelMap[name].tabNode,"mousedown",onTabClick])
})(this,name)
}},shutdown:function(){},addPanel:function(panelName,parentPanel){var PanelType=panelTypeMap[panelName];
var panel=this.panelMap[panelName]=new PanelType();
panel.create()
},removePanel:function(panelName){},selectPanel:function(panelName){var selectedPanel=this.selectedPanel;
var panel=this.panelMap[panelName];
if(panel&&selectedPanel!=panel){if(selectedPanel){removeClass(selectedPanel.tabNode,"fbSelectedTab");
selectedPanel.hide();
panel.shutdown()
}if(!panel.parentPanel){FirebugChrome.selectedPanel=panelName
}this.selectedPanel=panel;
setClass(panel.tabNode,"fbSelectedTab");
panel.initialize();
panel.show()
}},getPanel:function(panelName){var panel=this.panelMap[panelName];
return panel
},getSelectedPanel:function(){return this.selectedPanel
}};
Firebug.Button=function(options){options=options||{};
this.state="unpressed";
this.display="unpressed";
this.type=options.type||"normal";
this.onClick=options.onClick;
this.onPress=options.onPress;
this.onUnpress=options.onUnpress;
if(options.node){this.node=options.node;
this.owner=options.owner;
this.container=this.node.parentNode
}else{var caption=options.caption||"caption";
var title=options.title||"title";
this.owner=this.module=options.module;
this.panel=options.panel||this.module.getPanel();
this.container=this.panel.toolButtonsNode;
this.node=createElement("a",{className:"fbHover",title:title,innerHTML:caption});
this.container.appendChild(this.node)
}};
Firebug.Button.prototype=extend(Firebug.Controller,{type:null,node:null,owner:null,module:null,panel:null,container:null,state:null,display:null,destroy:function(){this.shutdown();
this.container.removeChild(this.node)
},initialize:function(){Firebug.Controller.initialize.apply(this);
var node=this.node;
this.addController([node,"mousedown",this.handlePress]);
if(this.type=="normal"){this.addController([node,"mouseup",this.handleUnpress],[node,"mouseout",this.handleUnpress],[node,"click",this.handleClick])
}},shutdown:function(){Firebug.Controller.shutdown.apply(this)
},restore:function(){this.changeState("unpressed")
},changeState:function(state){this.state=state;
this.changeDisplay(state)
},changeDisplay:function(display){if(display!=this.display){if(display=="pressed"){setClass(this.node,"fbBtnPressed")
}else{if(display=="unpressed"){removeClass(this.node,"fbBtnPressed")
}}this.display=display
}},handlePress:function(event){cancelEvent(event,true);
if(this.type=="normal"){this.changeDisplay("pressed");
this.beforeClick=true
}else{if(this.type=="toggle"){if(this.state=="pressed"){this.changeState("unpressed");
if(this.onUnpress){this.onUnpress.apply(this.owner)
}}else{this.changeState("pressed");
if(this.onPress){this.onPress.apply(this.owner)
}}}}return false
},handleUnpress:function(event){cancelEvent(event,true);
if(this.beforeClick){this.changeDisplay("unpressed")
}return false
},handleClick:function(event){cancelEvent(event,true);
if(this.type=="normal"){if(this.onClick){this.onClick.apply(this.owner)
}this.changeState("unpressed")
}this.beforeClick=false;
return false
},addButton:function(caption,title,handler){},removeAllButtons:function(){}});
function StatusBar(){}StatusBar.prototype=extend(Firebug.Controller,{});
function PanelOptions(){}PanelOptions.prototype=extend(Firebug.Controller,{})
}});
function DomplateTag(a){this.tagName=a
}function DomplateEmbed(){}function DomplateLoop(){}(function(){var womb=null;
domplate=function(){var lastSubject;
for(var i=0;
i<arguments.length;
++i){lastSubject=lastSubject?copyObject(lastSubject,arguments[i]):arguments[i]
}for(var name in lastSubject){var val=lastSubject[name];
if(isTag(val)){val.tag.subject=lastSubject
}}return lastSubject
};
domplate.context=function(context,fn){var lastContext=domplate.lastContext;
domplate.topContext=context;
fn.apply(context);
domplate.topContext=lastContext
};
FBL.TAG=function(){var embed=new DomplateEmbed();
return embed.merge(arguments)
};
FBL.FOR=function(){var loop=new DomplateLoop();
return loop.merge(arguments)
};
DomplateTag.prototype={merge:function(args,oldTag){if(oldTag){this.tagName=oldTag.tagName
}this.context=oldTag?oldTag.context:null;
this.subject=oldTag?oldTag.subject:null;
this.attrs=oldTag?copyObject(oldTag.attrs):{};
this.classes=oldTag?copyObject(oldTag.classes):{};
this.props=oldTag?copyObject(oldTag.props):null;
this.listeners=oldTag?copyArray(oldTag.listeners):null;
this.children=oldTag?copyArray(oldTag.children):[];
this.vars=oldTag?copyArray(oldTag.vars):[];
var attrs=args.length?args[0]:null;
var hasAttrs=typeof(attrs)=="object"&&!isTag(attrs);
this.children=[];
if(domplate.topContext){this.context=domplate.topContext
}if(args.length){parseChildren(args,hasAttrs?1:0,this.vars,this.children)
}if(hasAttrs){this.parseAttrs(attrs)
}return creator(this,DomplateTag)
},parseAttrs:function(args){for(var name in args){var val=parseValue(args[name]);
readPartNames(val,this.vars);
if(name.indexOf("on")==0){var eventName=name.substr(2);
if(!this.listeners){this.listeners=[]
}this.listeners.push(eventName,val)
}else{if(name.indexOf("_")==0){var propName=name.substr(1);
if(!this.props){this.props={}
}this.props[propName]=val
}else{if(name.indexOf("$")==0){var className=name.substr(1);
if(!this.classes){this.classes={}
}this.classes[className]=val
}else{if(name=="class"&&this.attrs.hasOwnProperty(name)){this.attrs[name]+=" "+val
}else{this.attrs[name]=val
}}}}}},compile:function(){if(this.renderMarkup){return
}this.compileMarkup();
this.compileDOM()
},compileMarkup:function(){this.markupArgs=[];
var topBlock=[],topOuts=[],blocks=[],info={args:this.markupArgs,argIndex:0};
this.generateMarkup(topBlock,topOuts,blocks,info);
this.addCode(topBlock,topOuts,blocks);
var fnBlock=["r=(function (__code__, __context__, __in__, __out__"];
for(var i=0;
i<info.argIndex;
++i){fnBlock.push(", s",i)
}fnBlock.push(") {");
if(this.subject){fnBlock.push("with (this) {")
}if(this.context){fnBlock.push("with (__context__) {")
}fnBlock.push("with (__in__) {");
fnBlock.push.apply(fnBlock,blocks);
if(this.subject){fnBlock.push("}")
}if(this.context){fnBlock.push("}")
}fnBlock.push("}})");
function __link__(tag,code,outputs,args){if(!tag||!tag.tag){return
}tag.tag.compile();
var tagOutputs=[];
var markupArgs=[code,tag.tag.context,args,tagOutputs];
markupArgs.push.apply(markupArgs,tag.tag.markupArgs);
tag.tag.renderMarkup.apply(tag.tag.subject,markupArgs);
outputs.push(tag);
outputs.push(tagOutputs)
}function __escape__(value){function replaceChars(ch){switch(ch){case"<":return"&lt;";
case">":return"&gt;";
case"&":return"&amp;";
case"'":return"&#39;";
case'"':return"&quot;"
}return"?"
}return String(value).replace(/[<>&"']/g,replaceChars)
}function __loop__(iter,outputs,fn){var iterOuts=[];
outputs.push(iterOuts);
if(iter instanceof Array){iter=new ArrayIterator(iter)
}try{while(1){var value=iter.next();
var itemOuts=[0,0];
iterOuts.push(itemOuts);
fn.apply(this,[value,itemOuts])
}}catch(exc){if(exc!=StopIteration){throw exc
}}}var js=fnBlock.join("");
var r=null;
eval(js);
this.renderMarkup=r
},getVarNames:function(args){if(this.vars){args.push.apply(args,this.vars)
}for(var i=0;
i<this.children.length;
++i){var child=this.children[i];
if(isTag(child)){child.tag.getVarNames(args)
}else{if(child instanceof Parts){for(var i=0;
i<child.parts.length;
++i){if(child.parts[i] instanceof Variable){var name=child.parts[i].name;
var names=name.split(".");
args.push(names[0])
}}}}}},generateMarkup:function(topBlock,topOuts,blocks,info){topBlock.push(',"<',this.tagName,'"');
for(var name in this.attrs){if(name!="class"){var val=this.attrs[name];
topBlock.push(', " ',name,'=\\""');
addParts(val,",",topBlock,info,true);
topBlock.push(', "\\""')
}}if(this.listeners){for(var i=0;
i<this.listeners.length;
i+=2){readPartNames(this.listeners[i+1],topOuts)
}}if(this.props){for(var name in this.props){readPartNames(this.props[name],topOuts)
}}if(this.attrs.hasOwnProperty("class")||this.classes){topBlock.push(', " class=\\""');
if(this.attrs.hasOwnProperty("class")){addParts(this.attrs["class"],",",topBlock,info,true)
}topBlock.push(', " "');
for(var name in this.classes){topBlock.push(", (");
addParts(this.classes[name],"",topBlock,info);
topBlock.push(' ? "',name,'" + " " : "")')
}topBlock.push(', "\\""')
}topBlock.push(',">"');
this.generateChildMarkup(topBlock,topOuts,blocks,info);
topBlock.push(',"</',this.tagName,'>"')
},generateChildMarkup:function(topBlock,topOuts,blocks,info){for(var i=0;
i<this.children.length;
++i){var child=this.children[i];
if(isTag(child)){child.tag.generateMarkup(topBlock,topOuts,blocks,info)
}else{addParts(child,",",topBlock,info,true)
}}},addCode:function(topBlock,topOuts,blocks){if(topBlock.length){blocks.push('__code__.push(""',topBlock.join(""),");")
}if(topOuts.length){blocks.push("__out__.push(",topOuts.join(","),");")
}topBlock.splice(0,topBlock.length);
topOuts.splice(0,topOuts.length)
},addLocals:function(blocks){var varNames=[];
this.getVarNames(varNames);
var map={};
for(var i=0;
i<varNames.length;
++i){var name=varNames[i];
if(map.hasOwnProperty(name)){continue
}map[name]=1;
var names=name.split(".");
blocks.push("var ",names[0]+" = __in__."+names[0]+";")
}},compileDOM:function(){var path=[];
var blocks=[];
this.domArgs=[];
path.embedIndex=0;
path.loopIndex=0;
path.staticIndex=0;
path.renderIndex=0;
var nodeCount=this.generateDOM(path,blocks,this.domArgs);
var fnBlock=["r=(function (root, context, o"];
for(var i=0;
i<path.staticIndex;
++i){fnBlock.push(", ","s"+i)
}for(var i=0;
i<path.renderIndex;
++i){fnBlock.push(", ","d"+i)
}fnBlock.push(") {");
for(var i=0;
i<path.loopIndex;
++i){fnBlock.push("var l",i," = 0;")
}for(var i=0;
i<path.embedIndex;
++i){fnBlock.push("var e",i," = 0;")
}if(this.subject){fnBlock.push("with (this) {")
}if(this.context){fnBlock.push("with (context) {")
}fnBlock.push(blocks.join(""));
if(this.subject){fnBlock.push("}")
}if(this.context){fnBlock.push("}")
}fnBlock.push("return ",nodeCount,";");
fnBlock.push("})");
function __bind__(object,fn){return function(event){return fn.apply(object,[event])
}
}function __link__(node,tag,args){if(!tag||!tag.tag){return
}tag.tag.compile();
var domArgs=[node,tag.tag.context,0];
domArgs.push.apply(domArgs,tag.tag.domArgs);
domArgs.push.apply(domArgs,args);
return tag.tag.renderDOM.apply(tag.tag.subject,domArgs)
}var self=this;
function __loop__(iter,fn){var nodeCount=0;
for(var i=0;
i<iter.length;
++i){iter[i][0]=i;
iter[i][1]=nodeCount;
nodeCount+=fn.apply(this,iter[i])
}return nodeCount
}function __path__(parent,offset){var root=parent;
for(var i=2;
i<arguments.length;
++i){var index=arguments[i];
if(i==3){index+=offset
}if(index==-1){parent=parent.parentNode
}else{parent=parent.childNodes[index]
}}return parent
}var js=fnBlock.join("");
var r=null;
eval(js);
this.renderDOM=r
},generateDOM:function(path,blocks,args){if(this.listeners||this.props){this.generateNodePath(path,blocks)
}if(this.listeners){for(var i=0;
i<this.listeners.length;
i+=2){var val=this.listeners[i+1];
var arg=generateArg(val,path,args);
blocks.push('addEvent(node, "',this.listeners[i],'", __bind__(this, ',arg,"), false);")
}}if(this.props){for(var name in this.props){var val=this.props[name];
var arg=generateArg(val,path,args);
blocks.push("node.",name," = ",arg,";")
}}this.generateChildDOM(path,blocks,args);
return 1
},generateNodePath:function(path,blocks){blocks.push("var node = __path__(root, o");
for(var i=0;
i<path.length;
++i){blocks.push(",",path[i])
}blocks.push(");")
},generateChildDOM:function(path,blocks,args){path.push(0);
for(var i=0;
i<this.children.length;
++i){var child=this.children[i];
if(isTag(child)){path[path.length-1]+="+"+child.tag.generateDOM(path,blocks,args)
}else{path[path.length-1]+="+1"
}}path.pop()
}};
DomplateEmbed.prototype=copyObject(DomplateTag.prototype,{merge:function(args,oldTag){this.value=oldTag?oldTag.value:parseValue(args[0]);
this.attrs=oldTag?oldTag.attrs:{};
this.vars=oldTag?copyArray(oldTag.vars):[];
var attrs=args[1];
for(var name in attrs){var val=parseValue(attrs[name]);
this.attrs[name]=val;
readPartNames(val,this.vars)
}return creator(this,DomplateEmbed)
},getVarNames:function(names){if(this.value instanceof Parts){names.push(this.value.parts[0].name)
}if(this.vars){names.push.apply(names,this.vars)
}},generateMarkup:function(topBlock,topOuts,blocks,info){this.addCode(topBlock,topOuts,blocks);
blocks.push("__link__(");
addParts(this.value,"",blocks,info);
blocks.push(", __code__, __out__, {");
var lastName=null;
for(var name in this.attrs){if(lastName){blocks.push(",")
}lastName=name;
var val=this.attrs[name];
blocks.push('"',name,'":');
addParts(val,"",blocks,info)
}blocks.push("});")
},generateDOM:function(path,blocks,args){var embedName="e"+path.embedIndex++;
this.generateNodePath(path,blocks);
var valueName="d"+path.renderIndex++;
var argsName="d"+path.renderIndex++;
blocks.push(embedName+" = __link__(node, ",valueName,", ",argsName,");");
return embedName
}});
DomplateLoop.prototype=copyObject(DomplateTag.prototype,{merge:function(args,oldTag){this.varName=oldTag?oldTag.varName:args[0];
this.iter=oldTag?oldTag.iter:parseValue(args[1]);
this.vars=[];
this.children=oldTag?copyArray(oldTag.children):[];
var offset=Math.min(args.length,2);
parseChildren(args,offset,this.vars,this.children);
return creator(this,DomplateLoop)
},getVarNames:function(names){if(this.iter instanceof Parts){names.push(this.iter.parts[0].name)
}DomplateTag.prototype.getVarNames.apply(this,[names])
},generateMarkup:function(topBlock,topOuts,blocks,info){this.addCode(topBlock,topOuts,blocks);
var iterName;
if(this.iter instanceof Parts){var part=this.iter.parts[0];
iterName=part.name;
if(part.format){for(var i=0;
i<part.format.length;
++i){iterName=part.format[i]+"("+iterName+")"
}}}else{iterName=this.iter
}blocks.push("__loop__.apply(this, [",iterName,", __out__, function(",this.varName,", __out__) {");
this.generateChildMarkup(topBlock,topOuts,blocks,info);
this.addCode(topBlock,topOuts,blocks);
blocks.push("}]);")
},generateDOM:function(path,blocks,args){var iterName="d"+path.renderIndex++;
var counterName="i"+path.loopIndex;
var loopName="l"+path.loopIndex++;
if(!path.length){path.push(-1,0)
}var preIndex=path.renderIndex;
path.renderIndex=0;
var nodeCount=0;
var subBlocks=[];
var basePath=path[path.length-1];
for(var i=0;
i<this.children.length;
++i){path[path.length-1]=basePath+"+"+loopName+"+"+nodeCount;
var child=this.children[i];
if(isTag(child)){nodeCount+="+"+child.tag.generateDOM(path,subBlocks,args)
}else{nodeCount+="+1"
}}path[path.length-1]=basePath+"+"+loopName;
blocks.push(loopName," = __loop__.apply(this, [",iterName,", function(",counterName,",",loopName);
for(var i=0;
i<path.renderIndex;
++i){blocks.push(",d"+i)
}blocks.push(") {");
blocks.push(subBlocks.join(""));
blocks.push("return ",nodeCount,";");
blocks.push("}]);");
path.renderIndex=preIndex;
return loopName
}});
function Variable(name,format){this.name=name;
this.format=format
}function Parts(parts){this.parts=parts
}function parseParts(str){var re=/\$([_A-Za-z][_A-Za-z0-9.|]*)/g;
var index=0;
var parts=[];
var m;
while(m=re.exec(str)){var pre=str.substr(index,(re.lastIndex-m[0].length)-index);
if(pre){parts.push(pre)
}var expr=m[1].split("|");
parts.push(new Variable(expr[0],expr.slice(1)));
index=re.lastIndex
}if(!index){return str
}var post=str.substr(index);
if(post){parts.push(post)
}return new Parts(parts)
}function parseValue(val){return typeof(val)=="string"?parseParts(val):val
}function parseChildren(args,offset,vars,children){for(var i=offset;
i<args.length;
++i){var val=parseValue(args[i]);
children.push(val);
readPartNames(val,vars)
}}function readPartNames(val,vars){if(val instanceof Parts){for(var i=0;
i<val.parts.length;
++i){var part=val.parts[i];
if(part instanceof Variable){vars.push(part.name)
}}}}function generateArg(val,path,args){if(val instanceof Parts){var vals=[];
for(var i=0;
i<val.parts.length;
++i){var part=val.parts[i];
if(part instanceof Variable){var varName="d"+path.renderIndex++;
if(part.format){for(var j=0;
j<part.format.length;
++j){varName=part.format[j]+"("+varName+")"
}}vals.push(varName)
}else{vals.push('"'+part.replace(/"/g,'\\"')+'"')
}}return vals.join("+")
}else{args.push(val);
return"s"+path.staticIndex++
}}function addParts(val,delim,block,info,escapeIt){var vals=[];
if(val instanceof Parts){for(var i=0;
i<val.parts.length;
++i){var part=val.parts[i];
if(part instanceof Variable){var partName=part.name;
if(part.format){for(var j=0;
j<part.format.length;
++j){partName=part.format[j]+"("+partName+")"
}}if(escapeIt){vals.push("__escape__("+partName+")")
}else{vals.push(partName)
}}else{vals.push('"'+part+'"')
}}}else{if(isTag(val)){info.args.push(val);
vals.push("s"+info.argIndex++)
}else{vals.push('"'+val+'"')
}}var parts=vals.join(delim);
if(parts){block.push(delim,parts)
}}function isTag(obj){return(typeof(obj)=="function"||obj instanceof Function)&&!!obj.tag
}function creator(tag,cons){var fn=new Function("var tag = arguments.callee.tag;var cons = arguments.callee.cons;var newTag = new cons();return newTag.merge(arguments, tag);");
fn.tag=tag;
fn.cons=cons;
extend(fn,Renderer);
return fn
}function copyArray(oldArray){var ary=[];
if(oldArray){for(var i=0;
i<oldArray.length;
++i){ary.push(oldArray[i])
}}return ary
}function copyObject(l,r){var m={};
extend(m,l);
extend(m,r);
return m
}function extend(l,r){for(var n in r){l[n]=r[n]
}}function addEvent(object,name,handler){if(document.all){object.attachEvent("on"+name,handler)
}else{object.addEventListener(name,handler,false)
}}function ArrayIterator(array){var index=-1;
this.next=function(){if(++index>=array.length){throw StopIteration
}return array[index]
}
}function StopIteration(){}FBL.$break=function(){throw StopIteration
};
var Renderer={renderHTML:function(args,outputs,self){var code=[];
var markupArgs=[code,this.tag.context,args,outputs];
markupArgs.push.apply(markupArgs,this.tag.markupArgs);
this.tag.renderMarkup.apply(self?self:this.tag.subject,markupArgs);
return code.join("")
},insertRows:function(args,before,self){this.tag.compile();
var outputs=[];
var html=this.renderHTML(args,outputs,self);
var doc=before.ownerDocument;
var div=doc.createElement("div");
div.innerHTML="<table><tbody>"+html+"</tbody></table>";
var tbody=div.firstChild.firstChild;
var parent=before.tagName=="TR"?before.parentNode:before;
var after=before.tagName=="TR"?before.nextSibling:null;
var firstRow=tbody.firstChild,lastRow;
while(tbody.firstChild){lastRow=tbody.firstChild;
if(after){parent.insertBefore(lastRow,after)
}else{parent.appendChild(lastRow)
}}var offset=0;
if(before.tagName=="TR"){var node=firstRow.parentNode.firstChild;
for(;
node&&node!=firstRow;
node=node.nextSibling){++offset
}}var domArgs=[firstRow,this.tag.context,offset];
domArgs.push.apply(domArgs,this.tag.domArgs);
domArgs.push.apply(domArgs,outputs);
this.tag.renderDOM.apply(self?self:this.tag.subject,domArgs);
return[firstRow,lastRow]
},insertAfter:function(args,before,self){this.tag.compile();
var outputs=[];
var html=this.renderHTML(args,outputs,self);
var doc=before.ownerDocument;
if(!womb||womb.ownerDocument!=doc){womb=doc.createElement("div")
}womb.innerHTML=html;
root=womb.firstChild;
while(womb.firstChild){if(before.nextSibling){before.parentNode.insertBefore(womb.firstChild,before.nextSibling)
}else{before.parentNode.appendChild(womb.firstChild)
}}var domArgs=[root,this.tag.context,0];
domArgs.push.apply(domArgs,this.tag.domArgs);
domArgs.push.apply(domArgs,outputs);
this.tag.renderDOM.apply(self?self:(this.tag.subject?this.tag.subject:null),domArgs);
return root
},replace:function(args,parent,self){this.tag.compile();
var outputs=[];
var html=this.renderHTML(args,outputs,self);
var root;
if(parent.nodeType==1){parent.innerHTML=html;
root=parent.firstChild
}else{if(!parent||parent.nodeType!=9){parent=document
}if(!womb||womb.ownerDocument!=parent){womb=parent.createElement("div")
}womb.innerHTML=html;
root=womb.firstChild
}var domArgs=[root,this.tag.context,0];
domArgs.push.apply(domArgs,this.tag.domArgs);
domArgs.push.apply(domArgs,outputs);
this.tag.renderDOM.apply(self?self:this.tag.subject,domArgs);
return root
},append:function(args,parent,self){this.tag.compile();
var outputs=[];
var html=this.renderHTML(args,outputs,self);
if(!womb||womb.ownerDocument!=parent.ownerDocument){womb=parent.ownerDocument.createElement("div")
}womb.innerHTML=html;
root=womb.firstChild;
while(womb.firstChild){parent.appendChild(womb.firstChild)
}var domArgs=[root,this.tag.context,0];
domArgs.push.apply(domArgs,this.tag.domArgs);
domArgs.push.apply(domArgs,outputs);
this.tag.renderDOM.apply(self?self:this.tag.subject,domArgs);
return root
}};
function defineTags(){for(var i=0;
i<arguments.length;
++i){var tagName=arguments[i];
var fn=new Function("var newTag = new DomplateTag('"+tagName+"'); return newTag.merge(arguments);");
var fnName=tagName.toUpperCase();
FBL[fnName]=fn
}}defineTags("a","button","br","canvas","col","colgroup","div","fieldset","form","h1","h2","h3","hr","img","input","label","legend","li","ol","optgroup","option","p","pre","select","span","strong","table","tbody","td","textarea","tfoot","th","thead","tr","tt","ul","iframe")
})();
FBL.ns(function(){with(FBL){Firebug.Reps={appendText:function(object,html){html.push(escapeHTML(objectToString(object)))
},appendNull:function(object,html){html.push('<span class="objectBox-null">',escapeHTML(objectToString(object)),"</span>")
},appendString:function(object,html){html.push('<span class="objectBox-string">&quot;',escapeHTML(objectToString(object)),"&quot;</span>")
},appendInteger:function(object,html){html.push('<span class="objectBox-number">',escapeHTML(objectToString(object)),"</span>")
},appendFloat:function(object,html){html.push('<span class="objectBox-number">',escapeHTML(objectToString(object)),"</span>")
},appendFunction:function(object,html){var reName=/function ?(.*?)\(/;
var m=reName.exec(objectToString(object));
var name=m&&m[1]?m[1]:"function";
html.push('<span class="objectBox-function">',escapeHTML(name),"()</span>")
},appendObject:function(object,html){try{if(object==undefined){this.appendNull("undefined",html)
}else{if(object==null){this.appendNull("null",html)
}else{if(typeof object=="string"){this.appendString(object,html)
}else{if(typeof object=="number"){this.appendInteger(object,html)
}else{if(typeof object=="boolean"){this.appendInteger(object,html)
}else{if(typeof object=="function"){this.appendFunction(object,html)
}else{if(object.nodeType==1){this.appendSelector(object,html)
}else{if(typeof object=="object"){if(typeof object.length!="undefined"){this.appendArray(object,html)
}else{this.appendObjectFormatted(object,html)
}}else{this.appendText(object,html)
}}}}}}}}}catch(exc){}},appendObjectFormatted:function(object,html){var text=objectToString(object);
var reObject=/\[object (.*?)\]/;
var m=reObject.exec(text);
html.push('<span class="objectBox-object">',m?m[1]:text,"</span>")
},appendSelector:function(object,html){var uid=object[cacheID];
var uidString=uid?[cacheID,'="',uid,'" id="',uid,'"'].join(""):"";
html.push('<span class="objectBox-selector"',uidString,">");
html.push('<span class="selectorTag">',escapeHTML(object.nodeName.toLowerCase()),"</span>");
if(object.id){html.push('<span class="selectorId">#',escapeHTML(object.id),"</span>")
}if(object.className){html.push('<span class="selectorClass">.',escapeHTML(object.className),"</span>")
}html.push("</span>")
},appendNode:function(node,html){if(node.nodeType==1){var uid=node[cacheID];
var uidString=uid?[cacheID,'="',uid,'" id="',uid,'"'].join(""):"";
html.push('<div class="objectBox-element"',uidString,'">',"<span ",cacheID,'="',uid,'" class="nodeBox">','&lt;<span class="nodeTag">',node.nodeName.toLowerCase(),"</span>");
for(var i=0;
i<node.attributes.length;
++i){var attr=node.attributes[i];
if(!attr.specified||attr.nodeName==cacheID){continue
}html.push('&nbsp;<span class="nodeName">',attr.nodeName.toLowerCase(),'</span>=&quot;<span class="nodeValue">',escapeHTML(attr.nodeValue),"</span>&quot;")
}if(node.firstChild){html.push('&gt;</div><div class="nodeChildren">');
for(var child=node.firstChild;
child;
child=child.nextSibling){this.appendNode(child,html)
}html.push('</div><div class="objectBox-element">&lt;/<span class="nodeTag">',node.nodeName.toLowerCase(),"&gt;</span></span></div>")
}else{html.push("/&gt;</span></div>")
}}else{if(node.nodeType==3){html.push('<div class="nodeText">',escapeHTML(node.nodeValue),"</div>")
}}},appendArray:function(object,html){html.push('<span class="objectBox-array"><b>[</b> ');
for(var i=0,l=object.length,obj;
i<l;
++i){this.appendObject(object[i],html);
if(i<l-1){html.push(", ")
}}html.push(" <b>]</b></span>")
}}
}});
var FirebugReps=FBL.ns(function(){with(FBL){var OBJECTBOX=this.OBJECTBOX=SPAN({"class":"objectBox objectBox-$className"});
var OBJECTBLOCK=this.OBJECTBLOCK=DIV({"class":"objectBox objectBox-$className"});
var OBJECTLINK=this.OBJECTLINK=A({"class":"objectLink objectLink-$className a11yFocus",_repObject:"$object"});
this.Undefined=domplate(Firebug.Rep,{tag:OBJECTBOX("undefined"),className:"undefined",supportsObject:function(object,type){return type=="undefined"
}});
this.Null=domplate(Firebug.Rep,{tag:OBJECTBOX("null"),className:"null",supportsObject:function(object,type){return object==null
}});
this.Nada=domplate(Firebug.Rep,{tag:SPAN(""),className:"nada"});
this.Number=domplate(Firebug.Rep,{tag:OBJECTBOX("$object"),className:"number",supportsObject:function(object,type){return type=="boolean"||type=="number"
}});
this.String=domplate(Firebug.Rep,{tag:OBJECTBOX("&quot;$object&quot;"),shortTag:OBJECTBOX("&quot;$object|cropString&quot;"),className:"string",supportsObject:function(object,type){return type=="string"
}});
this.Text=domplate(Firebug.Rep,{tag:OBJECTBOX("$object"),shortTag:OBJECTBOX("$object|cropString"),className:"text"});
this.Caption=domplate(Firebug.Rep,{tag:SPAN({"class":"caption"},"$object")});
this.Warning=domplate(Firebug.Rep,{tag:DIV({"class":"warning focusRow",role:"listitem"},"$object|STR")});
this.Func=domplate(Firebug.Rep,{tag:OBJECTLINK("$object|summarizeFunction"),summarizeFunction:function(fn){var fnRegex=/function ([^(]+\([^)]*\)) \{/;
var fnText=safeToString(fn);
var m=fnRegex.exec(fnText);
return m?m[1]:"function()"
},copySource:function(fn){copyToClipboard(safeToString(fn))
},monitor:function(fn,script,monitored){if(monitored){Firebug.Debugger.unmonitorScript(fn,script,"monitor")
}else{Firebug.Debugger.monitorScript(fn,script,"monitor")
}},className:"function",supportsObject:function(object,type){return type=="function"
},inspectObject:function(fn,context){var sourceLink=findSourceForFunction(fn,context);
if(sourceLink){Firebug.chrome.select(sourceLink)
}if(FBTrace.DBG_FUNCTION_NAME){FBTrace.sysout("reps.function.inspectObject selected sourceLink is ",sourceLink)
}},getTooltip:function(fn,context){var script=findScriptForFunctionInContext(context,fn);
if(script){return $STRF("Line",[normalizeURL(script.fileName),script.baseLineNumber])
}else{if(fn.toString){return fn.toString()
}}},getTitle:function(fn,context){var name=fn.name?fn.name:"function";
return name+"()"
},getContextMenuItems:function(fn,target,context,script){if(!script){script=findScriptForFunctionInContext(context,fn)
}if(!script){return
}var scriptInfo=getSourceFileAndLineByScript(context,script);
var monitored=scriptInfo?fbs.isMonitored(scriptInfo.sourceFile.href,scriptInfo.lineNo):false;
var name=script?getFunctionName(script,context):fn.name;
return[{label:"CopySource",command:bindFixed(this.copySource,this,fn)},"-",{label:$STRF("ShowCallsInConsole",[name]),nol10n:true,type:"checkbox",checked:monitored,command:bindFixed(this.monitor,this,fn,script,monitored)}]
}});
this.jsdScript=domplate(Firebug.Rep,{copySource:function(script){var fn=script.functionObject.getWrappedValue();
return FirebugReps.Func.copySource(fn)
},monitor:function(fn,script,monitored){fn=script.functionObject.getWrappedValue();
return FirebugReps.Func.monitor(fn,script,monitored)
},className:"jsdScript",inspectable:false,supportsObject:function(object,type){return object instanceof jsdIScript
},inspectObject:function(script,context){var sourceLink=getSourceLinkForScript(script,context);
if(sourceLink){Firebug.chrome.select(sourceLink)
}},getRealObject:function(script,context){return script
},getTooltip:function(script){return $STRF("jsdIScript",[script.tag])
},getTitle:function(script,context){var fn=script.functionObject.getWrappedValue();
return FirebugReps.Func.getTitle(fn,context)
},getContextMenuItems:function(script,target,context){var fn=script.functionObject.getWrappedValue();
var scriptInfo=getSourceFileAndLineByScript(context,script);
var monitored=scriptInfo?fbs.isMonitored(scriptInfo.sourceFile.href,scriptInfo.lineNo):false;
var name=getFunctionName(script,context);
return[{label:"CopySource",command:bindFixed(this.copySource,this,script)},"-",{label:$STRF("ShowCallsInConsole",[name]),nol10n:true,type:"checkbox",checked:monitored,command:bindFixed(this.monitor,this,fn,script,monitored)}]
}});
this.Obj=domplate(Firebug.Rep,{tag:OBJECTLINK(SPAN({"class":"objectTitle"},"$object|getTitle"),FOR("prop","$object|propIterator"," $prop.name=",SPAN({"class":"objectPropValue"},"$prop.value|cropString"))),propIterator:function(object){if(!object){return[]
}var props=[];
var len=0;
try{for(var name in object){var val;
try{val=object[name]
}catch(exc){continue
}var t=typeof(val);
if(t=="boolean"||t=="number"||(t=="string"&&val)||(t=="object"&&val&&val.toString)){var title=(t=="object")?Firebug.getRep(val).getTitle(val):val+"";
len+=name.length+title.length+1;
if(len<50){props.push({name:name,value:title})
}else{break
}}}}catch(exc){}return props
},className:"object",supportsObject:function(object,type){return true
}});
this.Arr=domplate(Firebug.Rep,{tag:OBJECTBOX({_repObject:"$object"},SPAN({"class":"arrayLeftBracket",role:"presentation"},"["),FOR("item","$object|arrayIterator",TAG("$item.tag",{object:"$item.object"}),SPAN({"class":"arrayComma",role:"presentation"},"$item.delim")),SPAN({"class":"arrayRightBracket",role:"presentation"},"]")),shortTag:OBJECTBOX({_repObject:"$object"},SPAN({"class":"arrayLeftBracket",role:"presentation"},"["),FOR("item","$object|shortArrayIterator",TAG("$item.tag",{object:"$item.object"}),SPAN({"class":"arrayComma",role:"presentation"},"$item.delim")),SPAN({"class":"arrayRightBracket"},"]")),arrayIterator:function(array){var items=[];
for(var i=0;
i<array.length;
++i){var value=array[i];
var rep=Firebug.getRep(value);
var tag=rep.shortTag?rep.shortTag:rep.tag;
var delim=(i==array.length-1?"":", ");
items.push({object:value,tag:tag,delim:delim})
}return items
},shortArrayIterator:function(array){var items=[];
for(var i=0;
i<array.length&&i<3;
++i){var value=array[i];
var rep=Firebug.getRep(value);
var tag=rep.shortTag?rep.shortTag:rep.tag;
var delim=(i==array.length-1?"":", ");
items.push({object:value,tag:tag,delim:delim})
}if(array.length>3){items.push({object:(array.length-3)+" more...",tag:FirebugReps.Caption.tag,delim:""})
}return items
},shortPropIterator:this.Obj.propIterator,getItemIndex:function(child){var arrayIndex=0;
for(child=child.previousSibling;
child;
child=child.previousSibling){if(child.repObject){++arrayIndex
}}return arrayIndex
},className:"array",supportsObject:function(object){return this.isArray(object)
},isArray:function(obj){try{if(!obj){return false
}else{if(isIE&&typeof obj=="object"&&isFinite(obj.length)&&obj.nodeType!=8){return true
}else{if(isFinite(obj.length)&&typeof obj.splice==="function"){return true
}else{if(isFinite(obj.length)&&typeof obj.callee==="function"){return true
}else{if(obj instanceof HTMLCollection){return true
}else{if(obj instanceof NodeList){return true
}else{return false
}}}}}}}catch(exc){if(FBTrace.DBG_ERRORS){FBTrace.sysout("isArray FAILS:",exc);
FBTrace.sysout("isArray Fails on obj",obj)
}}return false
},getTitle:function(object,context){return"["+object.length+"]"
}});
this.Property=domplate(Firebug.Rep,{supportsObject:function(object){return object instanceof Property
},getRealObject:function(prop,context){return prop.object[prop.name]
},getTitle:function(prop,context){return prop.name
}});
this.NetFile=domplate(this.Obj,{supportsObject:function(object){return object instanceof Firebug.NetFile
},browseObject:function(file,context){openNewTab(file.href);
return true
},getRealObject:function(file,context){return null
}});
this.Except=domplate(Firebug.Rep,{tag:OBJECTBOX({_repObject:"$object"},"$object.message"),className:"exception",supportsObject:function(object){return object instanceof ErrorCopy
}});
this.Element=domplate(Firebug.Rep,{tag:OBJECTLINK("&lt;",SPAN({"class":"nodeTag"},"$object.tagName|toLowerCase"),FOR("attr","$object|attrIterator","&nbsp;$attr.tagName=&quot;",SPAN({"class":"nodeValue"},"$attr.nodeValue"),"&quot;"),"&gt;"),shortTag:OBJECTLINK(SPAN({"class":"$object|getVisible"},SPAN({"class":"selectorTag"},"$object|getSelectorTag"),SPAN({"class":"selectorId"},"$object|getSelectorId"),SPAN({"class":"selectorClass"},"$object|getSelectorClass"),SPAN({"class":"selectorValue"},"$object|getValue"))),getVisible:function(elt){return isVisible(elt)?"":"selectorHidden"
},getSelectorTag:function(elt){return elt.tagName.toLowerCase()
},getSelectorId:function(elt){return elt.id?("#"+elt.id):""
},getSelectorClass:function(elt){return"";
return elt.getAttribute("class")?("."+elt.getAttribute("class").split(" ")[0]):""
},getValue:function(elt){return"";
var value;
if(elt instanceof HTMLImageElement){value=getFileName(elt.src)
}else{if(elt instanceof HTMLAnchorElement){value=getFileName(elt.href)
}else{if(elt instanceof HTMLInputElement){value=elt.value
}else{if(elt instanceof HTMLFormElement){value=getFileName(elt.action)
}else{if(elt instanceof HTMLScriptElement){value=getFileName(elt.src)
}}}}}return value?" "+cropString(value,20):""
},attrIterator:function(elt){var attrs=[];
var idAttr,classAttr;
if(elt.attributes){for(var i=0;
i<elt.attributes.length;
++i){var attr=elt.attributes[i];
if(attr.tagName&&attr.tagName.indexOf("firebug-")!=-1){continue
}else{if(attr.tagName=="id"){idAttr=attr
}else{if(attr.tagName=="class"){classAttr=attr
}else{attrs.push(attr)
}}}}}if(classAttr){attrs.splice(0,0,classAttr)
}if(idAttr){attrs.splice(0,0,idAttr)
}return attrs
},shortAttrIterator:function(elt){var attrs=[];
if(elt.attributes){for(var i=0;
i<elt.attributes.length;
++i){var attr=elt.attributes[i];
if(attr.tagName=="id"||attr.tagName=="class"){attrs.push(attr)
}}}return attrs
},getHidden:function(elt){return isVisible(elt)?"":"nodeHidden"
},getXPath:function(elt){return getElementTreeXPath(elt)
},getNodeText:function(element){var text=element.textContent;
if(Firebug.showFullTextNodes){return text
}else{return cropString(text,50)
}},copyHTML:function(elt){var html=getElementXML(elt);
copyToClipboard(html)
},copyInnerHTML:function(elt){copyToClipboard(elt.innerHTML)
},copyXPath:function(elt){var xpath=getElementXPath(elt);
copyToClipboard(xpath)
},persistor:function(context,xpath){var elts=xpath?getElementsByXPath(context.window.document,xpath):null;
return elts&&elts.length?elts[0]:null
},className:"element",supportsObject:function(object){return instanceOf(object,"Element")
},browseObject:function(elt,context){var tag=elt.tagName.toLowerCase();
if(tag=="script"){openNewTab(elt.src)
}else{if(tag=="link"){openNewTab(elt.href)
}else{if(tag=="a"){openNewTab(elt.href)
}else{if(tag=="img"){openNewTab(elt.src)
}}}}return true
},persistObject:function(elt,context){var xpath=getElementXPath(elt);
return bind(this.persistor,top,xpath)
},getTitle:function(element,context){return getElementCSSSelector(element)
},getTooltip:function(elt){return this.getXPath(elt)
},getContextMenuItems:function(elt,target,context){var monitored=areEventsMonitored(elt,null,context);
return[{label:"CopyHTML",command:bindFixed(this.copyHTML,this,elt)},{label:"CopyInnerHTML",command:bindFixed(this.copyInnerHTML,this,elt)},{label:"CopyXPath",command:bindFixed(this.copyXPath,this,elt)},"-",{label:"ShowEventsInConsole",type:"checkbox",checked:monitored,command:bindFixed(toggleMonitorEvents,FBL,elt,null,monitored,context)},"-",{label:"ScrollIntoView",command:bindFixed(elt.scrollIntoView,elt)}]
}});
this.TextNode=domplate(Firebug.Rep,{tag:OBJECTLINK("&lt;",SPAN({"class":"nodeTag"},"TextNode"),"&nbsp;textContent=&quot;",SPAN({"class":"nodeValue"},"$object.textContent|cropString"),"&quot;","&gt;"),className:"textNode",supportsObject:function(object){return object instanceof Text
}});
this.Document=domplate(Firebug.Rep,{tag:OBJECTLINK("Document ",SPAN({"class":"objectPropValue"},"$object|getLocation")),getLocation:function(doc){return doc.location?getFileName(doc.location.href):""
},className:"object",supportsObject:function(object){return instanceOf(object,"Document")
},browseObject:function(doc,context){openNewTab(doc.location.href);
return true
},persistObject:function(doc,context){return this.persistor
},persistor:function(context){return context.window.document
},getTitle:function(win,context){return"document"
},getTooltip:function(doc){return doc.location.href
}});
this.StyleSheet=domplate(Firebug.Rep,{tag:OBJECTLINK("StyleSheet ",SPAN({"class":"objectPropValue"},"$object|getLocation")),getLocation:function(styleSheet){return getFileName(styleSheet.href)
},copyURL:function(styleSheet){copyToClipboard(styleSheet.href)
},openInTab:function(styleSheet){openNewTab(styleSheet.href)
},className:"object",supportsObject:function(object){return object instanceof CSSStyleSheet
},browseObject:function(styleSheet,context){openNewTab(styleSheet.href);
return true
},persistObject:function(styleSheet,context){return bind(this.persistor,top,styleSheet.href)
},getTooltip:function(styleSheet){return styleSheet.href
},getContextMenuItems:function(styleSheet,target,context){return[{label:"CopyLocation",command:bindFixed(this.copyURL,this,styleSheet)},"-",{label:"OpenInTab",command:bindFixed(this.openInTab,this,styleSheet)}]
},persistor:function(context,href){return getStyleSheetByHref(href,context)
}});
this.Window=domplate(Firebug.Rep,{tag:OBJECTLINK("Window ",SPAN({"class":"objectPropValue"},"$object|getLocation")),getLocation:function(win){try{return(win&&win.location&&!win.closed)?getFileName(win.location.href):""
}catch(exc){if(FBTrace.DBG_ERRORS){FBTrace.sysout("reps.Window window closed?")
}}},className:"object",supportsObject:function(object){return instanceOf(object,"Window")
},browseObject:function(win,context){openNewTab(win.location.href);
return true
},persistObject:function(win,context){return this.persistor
},persistor:function(context){return context.window
},getTitle:function(win,context){return"window"
},getTooltip:function(win){if(win&&!win.closed){return win.location.href
}}});
this.Event=domplate(Firebug.Rep,{tag:TAG("$copyEventTag",{object:"$object|copyEvent"}),copyEventTag:OBJECTLINK("$object|summarizeEvent"),summarizeEvent:function(event){var info=[event.type," "];
var eventFamily=getEventFamily(event.type);
if(eventFamily=="mouse"){info.push("clientX=",event.clientX,", clientY=",event.clientY)
}else{if(eventFamily=="key"){info.push("charCode=",event.charCode,", keyCode=",event.keyCode)
}}return info.join("")
},copyEvent:function(event){return new EventCopy(event)
},className:"object",supportsObject:function(object){return object instanceof Event||object instanceof EventCopy
},getTitle:function(event,context){return"Event "+event.type
}});
this.SourceLink=domplate(Firebug.Rep,{tag:OBJECTLINK({$collapsed:"$object|hideSourceLink"},"$object|getSourceLinkTitle"),hideSourceLink:function(sourceLink){return sourceLink?sourceLink.href.indexOf("XPCSafeJSObjectWrapper")!=-1:true
},getSourceLinkTitle:function(sourceLink){if(!sourceLink){return""
}try{var fileName=getFileName(sourceLink.href);
fileName=decodeURIComponent(fileName);
fileName=cropString(fileName,17)
}catch(exc){if(FBTrace.DBG_ERRORS){FBTrace.sysout("reps.getSourceLinkTitle decodeURIComponent fails for '"+fileName+"': "+exc,exc)
}}return $STRF("Line",[fileName,sourceLink.line])
},copyLink:function(sourceLink){copyToClipboard(sourceLink.href)
},openInTab:function(sourceLink){openNewTab(sourceLink.href)
},className:"sourceLink",supportsObject:function(object){return object instanceof SourceLink
},getTooltip:function(sourceLink){return decodeURI(sourceLink.href)
},inspectObject:function(sourceLink,context){if(sourceLink.type=="js"){var scriptFile=getSourceFileByHref(sourceLink.href,context);
if(scriptFile){return Firebug.chrome.select(sourceLink)
}}else{if(sourceLink.type=="css"){if(sourceLink.object){Firebug.chrome.select(sourceLink.object);
return
}var stylesheet=getStyleSheetByHref(sourceLink.href,context);
if(stylesheet){var ownerNode=stylesheet.ownerNode;
if(ownerNode){Firebug.chrome.select(sourceLink,"html");
return
}var panel=context.getPanel("stylesheet");
if(panel&&panel.getRuleByLine(stylesheet,sourceLink.line)){return Firebug.chrome.select(sourceLink)
}}}}viewSource(sourceLink.href,sourceLink.line)
},browseObject:function(sourceLink,context){openNewTab(sourceLink.href);
return true
},getContextMenuItems:function(sourceLink,target,context){return[{label:"CopyLocation",command:bindFixed(this.copyLink,this,sourceLink)},"-",{label:"OpenInTab",command:bindFixed(this.openInTab,this,sourceLink)}]
}});
this.SourceFile=domplate(this.SourceLink,{tag:OBJECTLINK({$collapsed:"$object|hideSourceLink"},"$object|getSourceLinkTitle"),persistor:function(context,href){return getSourceFileByHref(href,context)
},className:"sourceFile",supportsObject:function(object){return object instanceof SourceFile
},persistObject:function(sourceFile){return bind(this.persistor,top,sourceFile.href)
},browseObject:function(sourceLink,context){},getTooltip:function(sourceFile){return sourceFile.href
}});
this.StackFrame=domplate(Firebug.Rep,{tag:OBJECTBLOCK(A({"class":"objectLink focusRow a11yFocus",_repObject:"$object"},"$object|getCallName"),"(",FOR("arg","$object|argIterator",TAG("$arg.tag",{object:"$arg.value"}),SPAN({"class":"arrayComma"},"$arg.delim")),")",SPAN({"class":"objectLink-sourceLink objectLink"},"$object|getSourceLinkTitle")),getCallName:function(frame){return getFunctionName(frame.script,frame.context)
},getSourceLinkTitle:function(frame){var fileName=cropString(getFileName(frame.href),17);
return $STRF("Line",[fileName,frame.lineNo])
},argIterator:function(frame){if(!frame.args){return[]
}var items=[];
for(var i=0;
i<frame.args.length;
++i){var arg=frame.args[i];
if(!arg){break
}var rep=Firebug.getRep(arg.value);
var tag=rep.shortTag?rep.shortTag:rep.tag;
var delim=(i==frame.args.length-1?"":", ");
items.push({name:arg.name,value:arg.value,tag:tag,delim:delim})
}return items
},className:"stackFrame",supportsObject:function(object){return object instanceof StackFrame
},inspectObject:function(stackFrame,context){var sourceLink=new SourceLink(stackFrame.href,stackFrame.lineNo,"js");
Firebug.chrome.select(sourceLink)
},getTooltip:function(stackFrame,context){return $STRF("Line",[stackFrame.href,stackFrame.lineNo])
}});
this.StackTrace=domplate(Firebug.Rep,{tag:FOR("frame","$object.frames focusRow",TAG(this.StackFrame.tag,{object:"$frame"})),className:"stackTrace",supportsObject:function(object){return object instanceof StackTrace
}});
this.jsdStackFrame=domplate(Firebug.Rep,{inspectable:false,supportsObject:function(object){return(object instanceof jsdIStackFrame)&&(object.isValid)
},getTitle:function(frame,context){if(!frame.isValid){return"(invalid frame)"
}return getFunctionName(frame.script,context)
},getTooltip:function(frame,context){if(!frame.isValid){return"(invalid frame)"
}var sourceInfo=FBL.getSourceFileAndLineByScript(context,frame.script,frame);
if(sourceInfo){return $STRF("Line",[sourceInfo.sourceFile.href,sourceInfo.lineNo])
}else{return $STRF("Line",[frame.script.fileName,frame.line])
}},getContextMenuItems:function(frame,target,context){var fn=frame.script.functionObject.getWrappedValue();
return FirebugReps.Func.getContextMenuItems(fn,target,context,frame.script)
}});
this.ErrorMessage=domplate(Firebug.Rep,{tag:OBJECTBOX({$hasTwisty:"$object|hasStackTrace",$hasBreakSwitch:"$object|hasBreakSwitch",$breakForError:"$object|hasErrorBreak",_repObject:"$object",_stackTrace:"$object|getLastErrorStackTrace",onclick:"$onToggleError"},DIV({"class":"errorTitle a11yFocus",role:"checkbox","aria-checked":"false"},"$object.message|getMessage"),DIV({"class":"errorTrace"}),DIV({"class":"errorSourceBox errorSource-$object|getSourceType"},IMG({"class":"errorBreak a11yFocus",src:"blank.gif",role:"checkbox","aria-checked":"false",title:"Break on this error"}),A({"class":"errorSource a11yFocus"},"$object|getLine")),TAG(this.SourceLink.tag,{object:"$object|getSourceLink"})),getLastErrorStackTrace:function(error){return error.trace
},hasStackTrace:function(error){var url=error.href.toString();
var fromCommandLine=(url.indexOf("XPCSafeJSObjectWrapper")!=-1);
return !fromCommandLine&&error.trace
},hasBreakSwitch:function(error){return error.href&&error.lineNo>0
},hasErrorBreak:function(error){return fbs.hasErrorBreakpoint(error.href,error.lineNo)
},getMessage:function(message){var re=/\[Exception... "(.*?)" nsresult:/;
var m=re.exec(message);
return m?m[1]:message
},getLine:function(error){if(error.category=="js"){if(error.source){return cropString(error.source,80)
}else{if(error.href&&error.href.indexOf("XPCSafeJSObjectWrapper")==-1){return cropString(error.getSourceLine(),80)
}}}},getSourceLink:function(error){var ext=error.category=="css"?"css":"js";
return error.lineNo?new SourceLink(error.href,error.lineNo,ext):null
},getSourceType:function(error){if(error.source){return"syntax"
}else{if(error.lineNo==1&&getFileExtension(error.href)!="js"){return"none"
}else{if(error.category=="css"){return"none"
}else{if(!error.href||!error.lineNo){return"none"
}else{return"exec"
}}}}},onToggleError:function(event){var target=event.currentTarget;
if(hasClass(event.target,"errorBreak")){this.breakOnThisError(target.repObject)
}else{if(hasClass(event.target,"errorSource")){var panel=Firebug.getElementPanel(event.target);
this.inspectObject(target.repObject,panel.context)
}else{if(hasClass(event.target,"errorTitle")){var traceBox=target.childNodes[1];
toggleClass(target,"opened");
event.target.setAttribute("aria-checked",hasClass(target,"opened"));
if(hasClass(target,"opened")){if(target.stackTrace){var node=FirebugReps.StackTrace.tag.append({object:target.stackTrace},traceBox)
}if(Firebug.A11yModel.enabled){var panel=Firebug.getElementPanel(event.target);
dispatch([Firebug.A11yModel],"onLogRowContentCreated",[panel,traceBox])
}}else{clearNode(traceBox)
}}}}},copyError:function(error){var message=[this.getMessage(error.message),error.href,"Line "+error.lineNo];
copyToClipboard(message.join("\n"))
},breakOnThisError:function(error){if(this.hasErrorBreak(error)){Firebug.Debugger.clearErrorBreakpoint(error.href,error.lineNo)
}else{Firebug.Debugger.setErrorBreakpoint(error.href,error.lineNo)
}},className:"errorMessage",inspectable:false,supportsObject:function(object){return object instanceof ErrorMessage
},inspectObject:function(error,context){var sourceLink=this.getSourceLink(error);
FirebugReps.SourceLink.inspectObject(sourceLink,context)
},getContextMenuItems:function(error,target,context){var breakOnThisError=this.hasErrorBreak(error);
var items=[{label:"CopyError",command:bindFixed(this.copyError,this,error)}];
if(error.category=="css"){items.push("-",{label:"BreakOnThisError",type:"checkbox",checked:breakOnThisError,command:bindFixed(this.breakOnThisError,this,error)},optionMenu("BreakOnAllErrors","breakOnErrors"))
}return items
}});
this.Assert=domplate(Firebug.Rep,{tag:DIV(DIV({"class":"errorTitle"}),DIV({"class":"assertDescription"})),className:"assert",inspectObject:function(error,context){var sourceLink=this.getSourceLink(error);
Firebug.chrome.select(sourceLink)
},getContextMenuItems:function(error,target,context){var breakOnThisError=this.hasErrorBreak(error);
return[{label:"CopyError",command:bindFixed(this.copyError,this,error)},"-",{label:"BreakOnThisError",type:"checkbox",checked:breakOnThisError,command:bindFixed(this.breakOnThisError,this,error)},{label:"BreakOnAllErrors",type:"checkbox",checked:Firebug.breakOnErrors,command:bindFixed(this.breakOnAllErrors,this,error)}]
}});
this.SourceText=domplate(Firebug.Rep,{tag:DIV(FOR("line","$object|lineIterator",DIV({"class":"sourceRow",role:"presentation"},SPAN({"class":"sourceLine",role:"presentation"},"$line.lineNo"),SPAN({"class":"sourceRowText",role:"presentation"},"$line.text")))),lineIterator:function(sourceText){var maxLineNoChars=(sourceText.lines.length+"").length;
var list=[];
for(var i=0;
i<sourceText.lines.length;
++i){var lineNo=(i+1)+"";
while(lineNo.length<maxLineNoChars){lineNo=" "+lineNo
}list.push({lineNo:lineNo,text:sourceText.lines[i]})
}return list
},getHTML:function(sourceText){return getSourceLineRange(sourceText,1,sourceText.lines.length)
}});
this.nsIDOMHistory=domplate(Firebug.Rep,{tag:OBJECTBOX({onclick:"$showHistory"},OBJECTLINK("$object|summarizeHistory")),className:"nsIDOMHistory",summarizeHistory:function(history){try{var items=history.length;
return items+" history entries"
}catch(exc){return"object does not support history (nsIDOMHistory)"
}},showHistory:function(history){try{var items=history.length;
Firebug.chrome.select(history)
}catch(exc){}},supportsObject:function(object,type){return(object instanceof Ci.nsIDOMHistory)
}});
this.ApplicationCache=domplate(Firebug.Rep,{tag:OBJECTBOX({onclick:"$showApplicationCache"},OBJECTLINK("$object|summarizeCache")),summarizeCache:function(applicationCache){try{return applicationCache.length+" items in offline cache"
}catch(exc){return"https://bugzilla.mozilla.org/show_bug.cgi?id=422264"
}},showApplicationCache:function(event){openNewTab("https://bugzilla.mozilla.org/show_bug.cgi?id=422264")
},className:"applicationCache",supportsObject:function(object,type){if(Ci.nsIDOMOfflineResourceList){return(object instanceof Ci.nsIDOMOfflineResourceList)
}}});
this.Storage=domplate(Firebug.Rep,{tag:OBJECTBOX({onclick:"$show"},OBJECTLINK("$object|summarize")),summarize:function(storage){return storage.length+" items in Storage"
},show:function(storage){openNewTab("http://dev.w3.org/html5/webstorage/#storage-0")
},className:"Storage",supportsObject:function(object,type){return(object instanceof Storage)
}});
Firebug.registerRep(this.Undefined,this.Null,this.Number,this.String,this.Window,this.Element,this.Document,this.StyleSheet,this.Event,this.Property,this.Except,this.Arr);
Firebug.setDefaultReps(this.Func,this.Obj)
}});
FBL.ns(function(){with(FBL){FBL.Context=function(win){this.window=win.window;
this.document=win.document;
if(isIE&&!this.window.eval){this.window.execScript("null");
if(!this.window.eval){throw new Error("Firebug Error: eval() method not found in this window")
}}this.eval=this.window.eval("new Function('try{ return window.eval.apply(window,arguments) }catch(E){ E."+evalError+"=true; return E }')")
};
FBL.Context.prototype={evaluate:function(expr,context,api,errorHandler){context=context||"window";
var cmd=api?"(function(arguments){ with("+api+"){ return "+expr+" } }).call("+context+",undefined)":"(function(arguments){ return "+expr+" }).call("+context+",undefined)";
var r=this.eval(cmd);
if(r&&r[evalError]){cmd=api?"(function(arguments){ with("+api+"){ "+expr+" } }).call("+context+",undefined)":"(function(arguments){ "+expr+" }).call("+context+",undefined)";
r=this.eval(cmd);
if(r&&r[evalError]){if(errorHandler){r=errorHandler(r.message||r)
}else{r=r.message||r
}}}return r
},getWindowSize:function(){var width=0,height=0,el;
if(typeof this.window.innerWidth=="number"){width=this.window.innerWidth;
height=this.window.innerHeight
}else{if((el=this.document.documentElement)&&(el.clientHeight||el.clientWidth)){width=el.clientWidth;
height=el.clientHeight
}else{if((el=this.document.body)&&(el.clientHeight||el.clientWidth)){width=el.clientWidth;
height=el.clientHeight
}}}return{width:width,height:height}
},getWindowScrollSize:function(){var width=0,height=0,el;
if(!isIEQuiksMode&&(el=this.document.documentElement)&&(el.scrollHeight||el.scrollWidth)){width=el.scrollWidth;
height=el.scrollHeight
}else{if((el=this.document.body)&&(el.scrollHeight||el.scrollWidth)){width=el.scrollWidth;
height=el.scrollHeight
}}return{width:width,height:height}
},getWindowScrollPosition:function(){var top=0,left=0,el;
if(typeof this.window.pageYOffset=="number"){top=this.window.pageYOffset;
left=this.window.pageXOffset
}else{if((el=this.document.body)&&(el.scrollTop||el.scrollLeft)){top=el.scrollTop;
left=el.scrollLeft
}else{if((el=this.document.documentElement)&&(el.scrollTop||el.scrollLeft)){top=el.scrollTop;
left=el.scrollLeft
}}}return{top:top,left:left}
},getElementFromPoint:function(x,y){if(isOpera||isSafari){var scroll=this.getWindowScrollPosition();
return this.document.elementFromPoint(x+scroll.left,y+scroll.top)
}else{return this.document.elementFromPoint(x,y)
}},getElementPosition:function(el){var left=0;
var top=0;
do{left+=el.offsetLeft;
top+=el.offsetTop
}while(el=el.offsetParent);
return{left:left,top:top}
},getElementBox:function(el){var result={};
if(el.getBoundingClientRect){var rect=el.getBoundingClientRect();
var offset=isIE?this.document.body.clientTop||this.document.documentElement.clientTop:0;
var scroll=this.getWindowScrollPosition();
result.top=Math.round(rect.top-offset+scroll.top);
result.left=Math.round(rect.left-offset+scroll.left);
result.height=Math.round(rect.bottom-rect.top);
result.width=Math.round(rect.right-rect.left)
}else{var position=this.getElementPosition(el);
result.top=position.top;
result.left=position.left;
result.height=el.offsetHeight;
result.width=el.offsetWidth
}return result
},getMeasurement:function(el,name){var result={value:0,unit:"px"};
var cssValue=this.getCSS(el,name);
if(!cssValue){return result
}if(cssValue.toLowerCase()=="auto"){return result
}var reMeasure=/(\d+\.?\d*)(.*)/;
var m=cssValue.match(reMeasure);
if(m){result.value=m[1]-0;
result.unit=m[2].toLowerCase()
}return result
},getMeasurementInPixels:function(el,name){if(!el){return null
}var m=this.getMeasurement(el,name);
var value=m.value;
var unit=m.unit;
if(unit=="px"){return value
}else{if(unit=="pt"){return this.pointsToPixels(name,value)
}}if(unit=="em"){return this.emToPixels(el,value)
}else{if(unit=="%"){return this.percentToPixels(el,value)
}}},getMeasurementBox:function(el,name){var sufixes=["Top","Left","Bottom","Right"];
var result=[];
for(var i=0,sufix;
sufix=sufixes[i];
i++){result[i]=Math.round(this.getMeasurementInPixels(el,name+sufix))
}return{top:result[0],left:result[1],bottom:result[2],right:result[3]}
},getFontSizeInPixels:function(el){var size=this.getMeasurement(el,"fontSize");
if(size.unit=="px"){return size.value
}var computeDirtyFontSize=function(el,calibration){var div=this.document.createElement("div");
var divStyle=offscreenStyle;
if(calibration){divStyle+=" font-size:"+calibration+"px;"
}div.style.cssText=divStyle;
div.innerHTML="A";
el.appendChild(div);
var value=div.offsetHeight;
el.removeChild(div);
return value
};
var rate=200/225;
var value=computeDirtyFontSize(el);
return value*rate
},pointsToPixels:function(name,value){var axis=/Top$|Bottom$/.test(name)?"y":"x";
var result=value*pixelsPerInch[axis]/72;
return returnFloat?result:Math.round(result)
},emToPixels:function(el,value){if(!el){return null
}var fontSize=this.getFontSizeInPixels(el);
return Math.round(value*fontSize)
},exToPixels:function(el,value){if(!el){return null
}var div=this.document.createElement("div");
div.style.cssText=offscreenStyle+"width:"+value+"ex;";
el.appendChild(div);
var value=div.offsetWidth;
el.removeChild(div);
return value
},percentToPixels:function(el,value){if(!el){return null
}var div=this.document.createElement("div");
div.style.cssText=offscreenStyle+"width:"+value+"%;";
el.appendChild(div);
var value=div.offsetWidth;
el.removeChild(div);
return value
},getCSS:isIE?function(el,name){return el.currentStyle[name]||el.style[name]||undefined
}:function(el,name){return this.document.defaultView.getComputedStyle(el,null)[name]||el.style[name]||undefined
}};
var evalError="___firebug_evaluation_error___";
var pixelsPerInch;
var resetStyle="margin:0; padding:0; border:0; position:absolute; overflow:hidden; display:block;";
var offscreenStyle=resetStyle+"top:-1234px; left:-1234px;";
var calculatePixelsPerInch=function calculatePixelsPerInch(){var inch=this.document.createElement("div");
inch.style.cssText=resetStyle+"width:1in; height:1in; position:absolute; top:-1234px; left:-1234px;";
this.document.body.appendChild(inch);
pixelsPerInch={x:inch.offsetWidth,y:inch.offsetHeight};
this.document.body.removeChild(inch)
}
}});
FBL.ns(function(){with(FBL){FBL.chromeMap={};
FBL.FirebugChrome={commandLineVisible:true,sidePanelVisible:false,sidePanelWidth:300,selectedPanel:"Console",height:250,isOpen:false,create:function(){createChrome({onLoad:onChromeLoad})
},initialize:function(){if(Application.chrome.type=="frame"){ChromeMini.create(Application.chrome)
}if(Application.browser.document.documentElement.getAttribute("debug")=="true"){Application.openAtStartup=true
}var chrome=Firebug.chrome=new Chrome(Application.chrome);
chromeMap[chrome.type]=chrome;
addGlobalEvent("keydown",onPressF12);
if(Application.isPersistentMode&&chrome.type=="popup"){chrome.initialize()
}}};
var reattach=function(){FBTrace.sysout("reattach","-------------------------");
var frame=chromeMap.frame;
var popup=chromeMap.popup;
FBL.FirebugChrome.commandLineVisible=frame.commandLineVisible;
FBL.FirebugChrome.sidePanelVisible=frame.sidePanelVisible;
var framePanelMap=frame.panelMap;
var popupPanelMap=popup.panelMap;
for(var name in framePanelMap){framePanelMap[name].contentNode.innerHTML=popupPanelMap[name].contentNode.innerHTML
}Firebug.chrome=frame;
chromeMap.popup=null;
if(FirebugChrome.selectedElement){Firebug.HTML.selectTreeNode(FirebugChrome.selectedElement)
}};
var ChromeDefaultOptions={type:"frame",id:"FirebugChrome",height:250};
var createChrome=function(options){options=options||{};
options=extend(ChromeDefaultOptions,options);
var context=options.context||Application.browser;
var onLoad=options.onLoad;
var chrome={};
chrome.type=options.type;
var isChromeFrame=chrome.type=="frame";
var isBookmarletMode=Application.isBookmarletMode;
var url=isBookmarletMode?"about:blank":Application.location.skin;
if(isChromeFrame){var node=chrome.node=context.document.createElement("iframe");
node.setAttribute("id",options.id);
node.setAttribute("frameBorder","0");
node.style.border="0";
node.style.visibility="hidden";
node.style.zIndex="2147483647";
node.style.position=noFixedPosition?"absolute":"fixed";
node.style.width="100%";
node.style.left="0";
node.style.bottom=noFixedPosition?"-1px":"0";
node.style.height=options.height+"px";
if(isFirefox){node.style.display="none"
}if(!isBookmarletMode){node.setAttribute("src",Application.location.skin)
}context.document.body.appendChild(node)
}else{var height=FirebugChrome.height||options.height;
var options=["true,top=",Math.max(screen.availHeight-height-61,0),",left=0,height=",height,",width=",screen.availWidth-10,",resizable"].join("");
var node=chrome.node=context.window.open(url,"popup",options);
if(node){try{node.focus()
}catch(E){alert("Firebug Error: Firebug popup was blocked.");
return
}}else{alert("Firebug Error: Firebug popup was blocked.");
return
}}if(isBookmarletMode){var tpl=getChromeTemplate();
var doc=isChromeFrame?node.contentWindow.document:node.document;
doc.write(tpl);
doc.close()
}var win;
var waitDelay=!isBookmarletMode?isChromeFrame?200:300:100;
var waitForChrome=function(){if(isChromeFrame&&(win=node.contentWindow)&&node.contentWindow.document.getElementById("fbCommandLine")||!isChromeFrame&&(win=node.window)&&node.document&&node.document.getElementById("fbCommandLine")){chrome.window=win.window;
chrome.document=win.document;
if(onLoad){onLoad(chrome)
}}else{setTimeout(waitForChrome,waitDelay)
}};
waitForChrome()
};
var onChromeLoad=function onChromeLoad(chrome){Application.chrome=chrome;
if(FBTrace.DBG_INITIALIZE){FBTrace.sysout("Chrome onChromeLoad","chrome loaded")
}if(Application.isPersistentMode){chrome.window.FirebugApplication=Application;
if(Application.isDevelopmentMode){Application.browser.window.FBDev.loadChromeApplication(chrome)
}else{var doc=chrome.document;
var script=doc.createElement("script");
script.src=Application.location.app;
doc.getElementsByTagName("head")[0].appendChild(script)
}}else{if(chrome.type=="frame"){setTimeout(function(){FBL.Firebug.initialize()
},100)
}else{if(chrome.type=="popup"){FBTrace.sysout("onPopupChromeLoad","-------------------------");
var frame=chromeMap.frame;
if(frame){frame.close()
}FBL.FirebugChrome.commandLineVisible=true;
FBL.FirebugChrome.sidePanelVisible=false;
var popup=Firebug.chrome=new Chrome(chrome);
var framePanelMap=frame.panelMap;
var popupPanelMap=popup.panelMap;
for(var name in framePanelMap){popupPanelMap[name].contentNode.innerHTML=framePanelMap[name].contentNode.innerHTML
}popup.initialize();
dispatch(Firebug.modules,"initialize",[]);
if(FirebugChrome.selectedElement){Firebug.HTML.selectTreeNode(FirebugChrome.selectedElement)
}}}}};
var getChromeTemplate=function(){var tpl=FirebugChrome.injected;
var r=[],i=-1;
r[++i]='<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/DTD/strict.dtd">';
r[++i]="<html><head><title>";
r[++i]=Firebug.version;
r[++i]="</title><style>";
r[++i]=tpl.CSS;
r[++i]=(isIE6&&tpl.IE6CSS)?tpl.IE6CSS:"";
r[++i]="</style>";
r[++i]="</head><body>";
r[++i]=tpl.HTML;
r[++i]="</body></html>";
return r.join("")
};
var Chrome=function Chrome(chrome){var type=chrome.type;
var Base=type=="frame"?ChromeFrameBase:ChromePopupBase;
append(this,chrome);
append(this,Base);
chromeMap[type]=this;
Firebug.chrome=this;
this.create();
return this
};
var ChromeBase=extend(Firebug.Controller,Firebug.PanelBar);
var ChromeBase=extend(ChromeBase,{create:function(){Firebug.PanelBar.create.apply(this);
var panelMap=Firebug.panelTypes;
for(var i=0,p;
p=panelMap[i];
i++){if(!p.parentPanel){this.addPanel(p.prototype.name)
}}this.inspectButton=new Firebug.Button({type:"toggle",node:$("fbChrome_btInspect"),owner:Firebug.Inspector,onPress:Firebug.Inspector.startInspecting,onUnpress:Firebug.Inspector.stopInspecting})
},destroy:function(){this.shutdown()
},initialize:function(){Firebug.Console.flush();
if(Firebug.Trace){FBTrace.flush(Firebug.Trace)
}if(FBTrace.DBG_INITIALIZE){FBTrace.sysout("Firebug.chrome.initialize","initializing chrome")
}Firebug.Controller.initialize.apply(this);
Firebug.PanelBar.initialize.apply(this);
fbTop=$("fbTop");
fbContent=$("fbContent");
fbContentStyle=fbContent.style;
fbBottom=$("fbBottom");
fbBtnInspect=$("fbBtnInspect");
fbToolbar=$("fbToolbar");
fbPanelBox1=$("fbPanelBox1");
fbPanelBox1Style=fbPanelBox1.style;
fbPanelBox2=$("fbPanelBox2");
fbPanelBox2Style=fbPanelBox2.style;
fbPanelBar2Box=$("fbPanelBar2Box");
fbPanelBar2BoxStyle=fbPanelBar2Box.style;
fbHSplitter=$("fbHSplitter");
fbVSplitter=$("fbVSplitter");
fbVSplitterStyle=fbVSplitter.style;
fbPanel1=$("fbPanel1");
fbPanel1Style=fbPanel1.style;
fbPanel2=$("fbPanel2");
fbConsole=$("fbConsole");
fbConsoleStyle=fbConsole.style;
fbHTML=$("fbHTML");
fbCommandLine=$("fbCommandLine");
topHeight=fbTop.offsetHeight;
topPartialHeight=fbToolbar.offsetHeight;
disableTextSelection($("fbToolbar"));
disableTextSelection($("fbPanelBarBox"));
commandLine=new Firebug.CommandLine(fbCommandLine);
if(isIE){var as=$$(".fbHover");
for(var i=0,a;
a=as[i];
i++){a.setAttribute("href","javascript:void(0)")
}}this.selectPanel(FirebugChrome.selectedPanel);
Firebug.Inspector.initialize();
this.inspectButton.initialize();
addEvent(fbPanel1,"mousemove",Firebug.HTML.onListMouseMove);
addEvent(fbContent,"mouseout",Firebug.HTML.onListMouseMove);
addEvent(this.node,"mouseout",Firebug.HTML.onListMouseMove)
},shutdown:function(){this.inspectButton.shutdown();
removeEvent(fbPanel1,"mousemove",Firebug.HTML.onListMouseMove);
removeEvent(fbContent,"mouseout",Firebug.HTML.onListMouseMove);
removeEvent(this.node,"mouseout",Firebug.HTML.onListMouseMove);
fbTop=null;
fbContent=null;
fbContentStyle=null;
fbBottom=null;
fbBtnInspect=null;
fbToolbar=null;
fbPanelBox1=null;
fbPanelBox1Style=null;
fbPanelBox2=null;
fbPanelBox2Style=null;
fbPanelBar2Box=null;
fbPanelBar2BoxStyle=null;
fbHSplitter=null;
fbVSplitter=null;
fbVSplitterStyle=null;
fbPanel1=null;
fbPanel1Style=null;
fbPanel2=null;
fbConsole=null;
fbConsoleStyle=null;
fbHTML=null;
fbCommandLine=null;
topHeight=null;
topPartialHeight=null;
Firebug.Controller.shutdown.apply(this);
Firebug.PanelBar.shutdown.apply(this);
commandLine.destroy()
},toggle:function(forceOpen,popup){if(popup){this.detach()
}else{if(Firebug.chrome.type=="popup"){return
}var shouldOpen=forceOpen||!FirebugChrome.isOpen;
if(shouldOpen){this.open()
}else{this.close()
}}},detach:function(){if(!chromeMap.popup){createChrome({type:"popup",onLoad:onChromeLoad})
}},reattach:function(){},draw:function(){var size=Firebug.chrome.getWindowSize();
var chromeHeight=size.height;
var commandLineHeight=FirebugChrome.commandLineVisible?fbCommandLine.offsetHeight:0;
var fixedHeight=topHeight+commandLineHeight;
var y=Math.max(chromeHeight,topHeight);
fbPanel1Style.height=Math.max(y-fixedHeight,0)+"px";
fbPanelBox1Style.height=Math.max(y-fixedHeight,0)+"px";
if(isIE||isOpera){fbVSplitterStyle.height=Math.max(y-topPartialHeight-commandLineHeight,0)+"px"
}else{if(isFirefox){fbContentStyle.maxHeight=Math.max(y-fixedHeight,0)+"px"
}}var chromeWidth=size.width;
var sideWidth=FirebugChrome.sidePanelVisible?FirebugChrome.sidePanelWidth:0;
fbPanelBox1Style.width=Math.max(chromeWidth-sideWidth,0)+"px";
fbPanel1Style.width=Math.max(chromeWidth-sideWidth,0)+"px";
if(FirebugChrome.sidePanelVisible){fbPanelBox2Style.width=sideWidth+"px";
fbPanelBar2BoxStyle.width=Math.max(sideWidth,0)+"px";
fbVSplitterStyle.right=Math.max(sideWidth-6,0)+"px"
}},resize:function(){var self=this;
setTimeout(function(){self.draw();
if(noFixedPosition&&self.type=="frame"){self.fixIEPosition()
}},0)
},layout:function(panel){if(FBTrace.DBG_CHROME){FBTrace.sysout("Chrome.layout","")
}var options=panel.options;
changeCommandLineVisibility(options.hasCommandLine);
changeSidePanelVisibility(options.hasSidePanel);
Firebug.chrome.draw()
}});
var ChromeContext=extend(ChromeBase,Context.prototype);
var ChromeFrameBase=extend(ChromeContext,{create:function(){ChromeBase.create.call(this);
if(isFirefox){this.node.style.display="block"
}if(Application.openAtStartup){this.open()
}else{FirebugChrome.isOpen=true;
this.close()
}},initialize:function(){ChromeBase.initialize.call(this);
this.addController([Firebug.browser.window,"resize",this.resize],[Firebug.browser.window,"unload",this.destroy],[$("fbChrome_btClose"),"click",this.close],[$("fbChrome_btDetach"),"click",this.detach]);
if(noFixedPosition){this.addController([Firebug.browser.window,"scroll",this.fixIEPosition])
}fbVSplitter.onmousedown=onVSplitterMouseDown;
fbHSplitter.onmousedown=onHSplitterMouseDown;
this.isInitialized=true
},shutdown:function(){fbVSplitter.onmousedown=null;
fbHSplitter.onmousedown=null;
ChromeBase.shutdown.apply(this);
this.isInitialized=false
},open:function(){if(!FirebugChrome.isOpen){var node=this.node;
node.style.visibility="hidden";
if(ChromeMini.isInitialized){ChromeMini.shutdown()
}var main=$("fbChrome");
main.style.display="block";
FirebugChrome.isOpen=true;
var self=this;
setTimeout(function(){dispatch(Firebug.modules,"initialize",[]);
self.initialize();
if(noFixedPosition){self.fixIEPosition()
}self.draw();
node.style.visibility="visible"
},10)
}},close:function(){if(FirebugChrome.isOpen){var node=this.node;
node.style.visibility="hidden";
if(this.isInitialized){dispatch(Firebug.modules,"shutdown",[]);
this.shutdown()
}var main=$("fbChrome");
main.style.display="none";
FirebugChrome.isOpen=false;
ChromeMini.initialize();
node.style.visibility="visible"
}},fixIEPosition:function(){var doc=this.document;
var offset=isIE?doc.body.clientTop||doc.documentElement.clientTop:0;
var size=Firebug.browser.getWindowSize();
var scroll=Firebug.browser.getWindowScrollPosition();
var maxHeight=size.height;
var height=this.node.offsetHeight;
var bodyStyle=doc.body.currentStyle;
this.node.style.top=maxHeight-height+scroll.top+"px";
if(this.type=="frame"&&(bodyStyle.marginLeft||bodyStyle.marginRight)){this.node.style.width=size.width+"px"
}}});
var ChromeMini=extend(Firebug.Controller,{create:function(chrome){append(this,chrome);
this.type="mini"
},initialize:function(){Firebug.Controller.initialize.apply(this);
var mini=$("fbMiniChrome");
mini.style.display="block";
var miniIcon=$("fbMiniIcon");
var width=miniIcon.offsetWidth+10;
miniIcon.title="Open "+Firebug.version;
var errors=$("fbMiniErrors");
if(errors.offsetWidth){width+=errors.offsetWidth+10
}var node=this.node;
node.style.height="27px";
node.style.width=width+"px";
node.style.left="";
node.style.right=0;
node.setAttribute("allowTransparency","true");
if(noFixedPosition){this.fixIEPosition()
}this.document.body.style.backgroundColor="transparent";
this.addController([$("fbMiniIcon"),"click",onMiniIconClick]);
if(noFixedPosition){this.addController([Firebug.browser.window,"scroll",this.fixIEPosition])
}this.isInitialized=true
},shutdown:function(){var node=this.node;
node.style.height=FirebugChrome.height+"px";
node.style.width="100%";
node.style.left=0;
node.style.right="";
node.setAttribute("allowTransparency","false");
if(noFixedPosition){this.fixIEPosition()
}this.document.body.style.backgroundColor="#fff";
var mini=$("fbMiniChrome");
mini.style.display="none";
Firebug.Controller.shutdown.apply(this);
this.isInitialized=false
},draw:function(){},fixIEPosition:ChromeFrameBase.fixIEPosition});
var ChromePopupBase=extend(ChromeContext,{initialize:function(){this.document.body.className="FirebugPopup";
ChromeBase.initialize.call(this);
this.addController([Firebug.chrome.window,"resize",this.resize],[Firebug.chrome.window,"unload",this.destroy],[Firebug.browser.window,"unload",this.close]);
fbVSplitter.onmousedown=onVSplitterMouseDown
},destroy:function(){reattach();
ChromeBase.destroy.apply(this)
},close:function(){this.shutdown();
this.node.close()
}});
var commandLine=null;
var fbTop=null;
var fbContent=null;
var fbContentStyle=null;
var fbBottom=null;
var fbBtnInspect=null;
var fbToolbar=null;
var fbPanelBox1=null;
var fbPanelBox1Style=null;
var fbPanelBox2=null;
var fbPanelBox2Style=null;
var fbPanelBar2Box=null;
var fbPanelBar2BoxStyle=null;
var fbHSplitter=null;
var fbVSplitter=null;
var fbVSplitterStyle=null;
var fbPanel1=null;
var fbPanel1Style=null;
var fbPanel2=null;
var fbConsole=null;
var fbConsoleStyle=null;
var fbHTML=null;
var fbCommandLine=null;
var topHeight=null;
var topPartialHeight=null;
var chromeRedrawSkipRate=isIE?30:isOpera?80:75;
var changeCommandLineVisibility=function changeCommandLineVisibility(visibility){var last=FirebugChrome.commandLineVisible;
Firebug.chrome.commandLineVisible=FirebugChrome.commandLineVisible=typeof visibility=="boolean"?visibility:!FirebugChrome.commandLineVisible;
if(FirebugChrome.commandLineVisible!=last){fbBottom.className=FirebugChrome.commandLineVisible?"":"hide"
}};
var changeSidePanelVisibility=function changeSidePanelVisibility(visibility){var last=FirebugChrome.sidePanelVisible;
Firebug.chrome.sidePanelVisible=FirebugChrome.sidePanelVisible=typeof visibility=="boolean"?visibility:!FirebugChrome.sidePanelVisible;
if(FirebugChrome.sidePanelVisible!=last){fbPanelBox2.className=FirebugChrome.sidePanelVisible?"":"hide";
fbPanelBar2Box.className=FirebugChrome.sidePanelVisible?"":"hide"
}};
var onPressF12=function onPressF12(event){if(event.keyCode==123&&(!isFirefox&&!event.shiftKey||event.shiftKey&&isFirefox)){Firebug.chrome.toggle(false,event.ctrlKey);
cancelEvent(event,true)
}};
var onMiniIconClick=function onMiniIconClick(event){Firebug.chrome.toggle(false,event.ctrlKey);
cancelEvent(event,true)
};
var onHSplitterMouseDown=function onHSplitterMouseDown(event){addGlobalEvent("mousemove",onHSplitterMouseMove);
addGlobalEvent("mouseup",onHSplitterMouseUp);
fbHSplitter.className="fbOnMovingHSplitter";
return false
};
var lastHSplitterMouseMove=0;
var onHSplitterMouseMoveBuffer=null;
var onHSplitterMouseMoveTimer=null;
var onHSplitterMouseMove=function onHSplitterMouseMove(event){cancelEvent(event,true);
var clientY=event.clientY;
var win=isIE?event.srcElement.ownerDocument.parentWindow:event.target.ownerDocument&&event.target.ownerDocument.defaultView;
if(!win){return
}if(win!=win.parent){var frameElement=win.frameElement;
if(frameElement){var framePos=Firebug.browser.getElementPosition(frameElement).top;
clientY+=framePos;
if(frameElement.style.position!="fixed"){clientY-=Firebug.browser.getWindowScrollPosition().top
}}}if(isOpera&&isQuiksMode&&win.frameElement.id=="FirebugChrome"){clientY=Firebug.browser.getWindowSize().height-win.frameElement.offsetHeight+clientY
}onHSplitterMouseMoveBuffer=clientY;
if(new Date().getTime()-lastHSplitterMouseMove>chromeRedrawSkipRate){lastHSplitterMouseMove=new Date().getTime();
handleHSplitterMouseMove()
}else{if(!onHSplitterMouseMoveTimer){onHSplitterMouseMoveTimer=setTimeout(handleHSplitterMouseMove,chromeRedrawSkipRate)
}}return false
};
var handleHSplitterMouseMove=function(){if(onHSplitterMouseMoveTimer){clearTimeout(onHSplitterMouseMoveTimer);
onHSplitterMouseMoveTimer=null
}var clientY=onHSplitterMouseMoveBuffer;
var windowSize=Firebug.browser.getWindowSize();
var scrollSize=Firebug.browser.getWindowScrollSize();
var commandLineHeight=FirebugChrome.commandLineVisible?fbCommandLine.offsetHeight:0;
var fixedHeight=topHeight+commandLineHeight;
var chromeNode=Firebug.chrome.node;
var scrollbarSize=!isIE&&(scrollSize.width>windowSize.width)?17:0;
var height=windowSize.height;
var chromeHeight=Math.max(height-clientY+5-scrollbarSize,fixedHeight);
chromeHeight=Math.min(chromeHeight,windowSize.height-scrollbarSize);
FirebugChrome.height=chromeHeight;
chromeNode.style.height=chromeHeight+"px";
if(noFixedPosition){Firebug.chrome.fixIEPosition()
}Firebug.chrome.draw()
};
var onHSplitterMouseUp=function onHSplitterMouseUp(event){removeGlobalEvent("mousemove",onHSplitterMouseMove);
removeGlobalEvent("mouseup",onHSplitterMouseUp);
fbHSplitter.className="";
Firebug.chrome.draw()
};
var onVSplitterMouseDown=function onVSplitterMouseDown(event){addGlobalEvent("mousemove",onVSplitterMouseMove);
addGlobalEvent("mouseup",onVSplitterMouseUp);
return false
};
var lastVSplitterMouseMove=0;
var onVSplitterMouseMove=function onVSplitterMouseMove(event){if(new Date().getTime()-lastVSplitterMouseMove>chromeRedrawSkipRate){var target=event.target||event.srcElement;
if(target&&target.ownerDocument){var clientX=event.clientX;
var win=document.all?event.srcElement.ownerDocument.parentWindow:event.target.ownerDocument.defaultView;
if(win!=win.parent){clientX+=win.frameElement?win.frameElement.offsetLeft:0
}var size=Firebug.chrome.getWindowSize();
var x=Math.max(size.width-clientX+3,6);
FirebugChrome.sidePanelWidth=x;
Firebug.chrome.draw()
}lastVSplitterMouseMove=new Date().getTime()
}cancelEvent(event,true);
return false
};
var onVSplitterMouseUp=function onVSplitterMouseUp(event){removeGlobalEvent("mousemove",onVSplitterMouseMove);
removeGlobalEvent("mouseup",onVSplitterMouseUp);
Firebug.chrome.draw()
}
}});
FBL.ns(function(){with(FBL){FirebugChrome.injected={CSS:'.twisty,.logRow-errorMessage > .hasTwisty > .errorTitle,.logRow-spy .spyHead .spyTitle,.logGroup > .logRow,.memberRow.hasChildren > .memberLabelCell > .memberLabel,.hasHeaders .netHrefLabel{background-image:url(http://fbug.googlecode.com/svn/lite/branches/firebug1.3/skin/xp/tree_open.gif);background-repeat:no-repeat;background-position:2px 2px;}.logRow-errorMessage > .hasTwisty.opened > .errorTitle,.logRow-spy.opened .spyHead .spyTitle,.logGroup.opened > .logRow,.memberRow.hasChildren.opened > .memberLabelCell > .memberLabel,.nodeBox.highlightOpen > .nodeLabel > .twisty,.nodeBox.open > .nodeLabel > .twisty,.netRow.opened > .netCol > .netHrefLabel{background-image:url(http://fbug.googlecode.com/svn/lite/branches/firebug1.3/skin/xp/tree_close.gif);}.twisty{background-position:2px 0;}.panelNode-console{overflow-x:hidden;}.objectLink:hover{cursor:pointer;text-decoration:underline;}.logRow{position:relative;margin:0;border-bottom:1px solid #D7D7D7;padding:2px 4px 1px 6px;background-color:#FFFFFF;}.useA11y .logRow:focus{border-bottom:1px solid #000000 !important;outline:none !important;background-color:#FFFFAD !important;}.useA11y .logRow:focus a.objectLink-sourceLink{background-color:#FFFFAD;}.useA11y .a11yFocus:focus,.useA11y .objectBox:focus{outline:2px solid #FF9933;background-color:#FFFFAD;}.useA11y .objectBox-null:focus,.useA11y .objectBox-undefined:focus{background-color:#888888 !important;}.useA11y .logGroup.opened > .logRow{border-bottom:1px solid #ffffff;}.logGroup{padding:0;border:none;}.logGroupBody{display:none;margin-left:16px;border-left:1px solid #D7D7D7;border-top:1px solid #D7D7D7;background:#FFFFFF;}.logGroup > .logRow{background-color:transparent !important;font-weight:bold;}.logGroup.opened > .logRow{border-bottom:none;}.logGroup.opened > .logGroupBody{display:block;}.logRow-command > .objectBox-text{font-family:Monaco,monospace;color:#0000FF;white-space:pre-wrap;}.logRow-info,.logRow-warn,.logRow-error,.logRow-assert,.logRow-warningMessage,.logRow-errorMessage{padding-left:22px;background-repeat:no-repeat;background-position:4px 2px;}.logRow-assert,.logRow-warningMessage,.logRow-errorMessage{padding-top:0;padding-bottom:0;}.logRow-info,.logRow-info .objectLink-sourceLink{background-color:#FFFFFF;}.logRow-warn,.logRow-warningMessage,.logRow-warn .objectLink-sourceLink,.logRow-warningMessage .objectLink-sourceLink{background-color:cyan;}.logRow-error,.logRow-assert,.logRow-errorMessage,.logRow-error .objectLink-sourceLink,.logRow-errorMessage .objectLink-sourceLink{background-color:LightYellow;}.logRow-error,.logRow-assert,.logRow-errorMessage{color:#FF0000;}.logRow-info{}.logRow-warn,.logRow-warningMessage{}.logRow-error,.logRow-assert,.logRow-errorMessage{}.objectBox-string,.objectBox-text,.objectBox-number,.objectLink-element,.objectLink-textNode,.objectLink-function,.objectBox-stackTrace,.objectLink-profile{font-family:Monaco,monospace;}.objectBox-string,.objectBox-text,.objectLink-textNode{white-space:pre-wrap;}.objectBox-number,.objectLink-styleRule,.objectLink-element,.objectLink-textNode{color:#000088;}.objectBox-string{color:#FF0000;}.objectLink-function,.objectBox-stackTrace,.objectLink-profile{color:DarkGreen;}.objectBox-null,.objectBox-undefined{padding:0 2px;outline:1px solid #666666;background-color:#888888;color:#FFFFFF;}.objectBox-exception{padding:0 2px 0 18px;color:red;}.objectLink-sourceLink{position:absolute;right:4px;top:2px;padding-left:8px;font-family:Lucida Grande,sans-serif;font-weight:bold;color:#0000FF;}.errorTitle{margin-top:0px;margin-bottom:1px;padding-top:2px;padding-bottom:2px;}.errorTrace{margin-left:17px;}.errorSourceBox{margin:2px 0;}.errorSource-none{display:none;}.errorSource-syntax > .errorBreak{visibility:hidden;}.errorSource{cursor:pointer;font-family:Monaco,monospace;color:DarkGreen;}.errorSource:hover{text-decoration:underline;}.errorBreak{cursor:pointer;display:none;margin:0 6px 0 0;width:13px;height:14px;vertical-align:bottom;opacity:0.1;}.hasBreakSwitch .errorBreak{display:inline;}.breakForError .errorBreak{opacity:1;}.assertDescription{margin:0;}.logRow-profile > .logRow > .objectBox-text{font-family:Lucida Grande,Tahoma,sans-serif;color:#000000;}.logRow-profile > .logRow > .objectBox-text:last-child{color:#555555;font-style:italic;}.logRow-profile.opened > .logRow{padding-bottom:4px;}.profilerRunning > .logRow{padding-left:22px !important;}.profileSizer{width:100%;overflow-x:auto;overflow-y:scroll;}.profileTable{border-bottom:1px solid #D7D7D7;padding:0 0 4px 0;}.profileTable tr[odd="1"]{background-color:#F5F5F5;vertical-align:middle;}.profileTable a{vertical-align:middle;}.profileTable td{padding:1px 4px 0 4px;}.headerCell{cursor:pointer;-moz-user-select:none;border-bottom:1px solid #9C9C9C;padding:0 !important;font-weight:bold;}.headerCellBox{padding:2px 4px;border-left:1px solid #D9D9D9;border-right:1px solid #9C9C9C;}.headerCell:hover:active{}.headerSorted{}.headerSorted > .headerCellBox{border-right-color:#6B7C93;}.headerSorted.sortedAscending > .headerCellBox{}.headerSorted:hover:active{}.linkCell{text-align:right;}.linkCell > .objectLink-sourceLink{position:static;}.logRow-stackTrace{padding-top:0;background:#F8F8F8;}.logRow-stackTrace > .objectBox-stackFrame{position:relative;padding-top:2px;}.objectLink-object{font-family:Lucida Grande,sans-serif;font-weight:bold;color:DarkGreen;white-space:pre-wrap;}.objectPropValue{font-weight:normal;font-style:italic;color:#555555;}.selectorTag,.selectorId,.selectorClass{font-family:Monaco,monospace;font-weight:normal;}.selectorTag{color:#0000FF;}.selectorId{color:DarkBlue;}.selectorClass{color:red;}.selectorHidden > .selectorTag{color:#5F82D9;}.selectorHidden > .selectorId{color:#888888;}.selectorHidden > .selectorClass{color:#D86060;}.selectorValue{font-family:Lucida Grande,sans-serif;font-style:italic;color:#555555;}.panelNode.searching .logRow{display:none;}.logRow.matched{display:block !important;}.logRow.matching{position:absolute;left:-1000px;top:-1000px;max-width:0;max-height:0;overflow:hidden;}.arrayLeftBracket,.arrayRightBracket,.arrayComma{font-family:Monaco,monospace;}.arrayLeftBracket,.arrayRightBracket{font-weight:bold;}.arrayLeftBracket{margin-right:4px;}.arrayRightBracket{margin-left:4px;}.logRow-dir{padding:0;}.logRow-errorMessage > .hasTwisty > .errorTitle,.logRow-spy .spyHead .spyTitle,.logGroup > .logRow{cursor:pointer;padding-left:18px;background-repeat:no-repeat;background-position:3px 3px;}.logRow-errorMessage > .hasTwisty > .errorTitle{background-position:2px 3px;}.logRow-errorMessage > .hasTwisty > .errorTitle:hover,.logRow-spy .spyHead .spyTitle:hover,.logGroup > .logRow:hover{text-decoration:underline;}.logRow-spy{padding:0px 0 1px 0;}.logRow-spy,.logRow-spy .objectLink-sourceLink{padding-right:4px;right:0;}.logRow-spy.opened{padding-bottom:4px;border-bottom:none;}.spyTitle{color:#000000;font-weight:bold;-moz-box-sizing:padding-box;overflow:hidden;z-index:100;padding-left:18px;}.spyCol{padding:0;white-space:nowrap;}.spyTitleCol:hover > .objectLink-sourceLink,.spyTitleCol:hover > .spyTime,.spyTitleCol:hover > .spyStatus,.spyTitleCol:hover > .spyTitle{display:none;}.spyFullTitle{display:none;-moz-user-select:none;max-width:100%;background-color:Transparent;}.spyTitleCol:hover > .spyFullTitle{display:block;}.spyStatus{padding-left:10px;color:rgb(128,128,128);}.spyTime{margin-left:4px;margin-right:4px;color:rgb(128,128,128);}.spyIcon{margin-right:4px;margin-left:4px;width:16px;height:16px;vertical-align:middle;background:transparent no-repeat 0 0;}.logRow-spy.loading .spyHead .spyRow .spyIcon{}.logRow-spy.loaded:not(.error) .spyHead .spyRow .spyIcon{width:0;margin:0;}.logRow-spy.error .spyHead .spyRow .spyIcon{background-position:2px 2px;}.logRow-spy .spyHead .netInfoBody{display:none;}.logRow-spy.opened .spyHead .netInfoBody{margin-top:10px;display:block;}.logRow-spy.error .spyTitle,.logRow-spy.error .spyStatus,.logRow-spy.error .spyTime{color:red;}.logRow-spy.loading .spyResponseText{font-style:italic;color:#888888;}.caption{font-family:Lucida Grande,Tahoma,sans-serif;font-weight:bold;color:#444444;}.warning{padding:10px;font-family:Lucida Grande,Tahoma,sans-serif;font-weight:bold;color:#888888;}.panelNode-dom{overflow-x:hidden !important;}.domTable{font-size:11px;width:100%;}.memberLabelCell{padding:2px 0 2px 0;vertical-align:top;}.memberValueCell{padding:1px 0 1px 5px;display:block;overflow:hidden;}.memberLabel{cursor:default;-moz-user-select:none;overflow:hidden;padding-left:18px;white-space:nowrap;background-color:#FFFFFF;}.memberRow.hasChildren > .memberLabelCell > .memberLabel:hover{cursor:pointer;color:blue;text-decoration:underline;}.userLabel{color:#000000;font-weight:bold;}.userClassLabel{color:#E90000;font-weight:bold;}.userFunctionLabel{color:#025E2A;font-weight:bold;}.domLabel{color:#000000;}.domFunctionLabel{color:#025E2A;}.ordinalLabel{color:SlateBlue;font-weight:bold;}.scopesRow{padding:2px 18px;background-color:LightYellow;border-bottom:5px solid #BEBEBE;color:#666666;}.scopesLabel{background-color:LightYellow;}.watchEditCell{padding:2px 18px;background-color:LightYellow;border-bottom:1px solid #BEBEBE;color:#666666;}.editor-watchNewRow,.editor-memberRow{font-family:Monaco,monospace !important;}.editor-memberRow{padding:1px 0 !important;}.editor-watchRow{padding-bottom:0 !important;}.watchRow > .memberLabelCell{font-family:Monaco,monospace;padding-top:1px;padding-bottom:1px;}.watchRow > .memberLabelCell > .memberLabel{background-color:transparent;}.watchRow > .memberValueCell{padding-top:2px;padding-bottom:2px;}.watchRow > .memberLabelCell,.watchRow > .memberValueCell{background-color:#F5F5F5;border-bottom:1px solid #BEBEBE;}.watchToolbox{z-index:2147483647;position:absolute;right:0;padding:1px 2px;}.fbBtnPressed{background:#ECEBE3;padding:3px 6px 2px 7px !important;margin:1px 0 0 1px;_margin:1px -1px 0 1px;border:1px solid #ACA899 !important;border-color:#ACA899 #ECEBE3 #ECEBE3 #ACA899 !important;}.fbToolbarButtons{display:none;}#fbStatusBarBox{display:none;}#fbErrorPopup{position:absolute;right:0;bottom:0;height:19px;width:75px;background:url(http://fbug.googlecode.com/svn/lite/branches/firebug1.3/skin/xp/sprite.png) #f1f2ee 0 0;z-index:999;}#fbErrorPopupContent{position:absolute;right:0;top:1px;height:18px;width:75px;_width:74px;border-left:1px solid #aca899;}#fbErrorIndicator{position:absolute;top:2px;right:5px;}.fbBtnInspectActive{background:#aaa;color:#fff !important;}html,body{margin:0;padding:0;overflow:hidden;}body{font-family:Lucida Grande,Tahoma,sans-serif;font-size:11px;background:#fff;}.clear{clear:both;}#fbMiniChrome{display:none;right:0;height:27px;background:url(http://fbug.googlecode.com/svn/lite/branches/firebug1.3/skin/xp/sprite.png) #f1f2ee 0 0;margin-left:1px;}#fbMiniContent{display:block;position:relative;left:-1px;right:0;top:1px;height:25px;border-left:1px solid #aca899;}#fbToolbarSearch{float:right;border:1px solid #ccc;margin:0 5px 0 0;background:#fff url(http://fbug.googlecode.com/svn/lite/branches/firebug1.3/skin/xp/search.png) no-repeat 4px 2px;padding-left:20px;font-size:11px;}#fbToolbarErrors{float:right;margin:1px 4px 0 0;font-size:11px;}#fbLeftToolbarErrors{float:left;margin:7px 0px 0 5px;font-size:11px;}.fbErrors{padding-left:20px;height:14px;background:url(http://fbug.googlecode.com/svn/lite/branches/firebug1.3/skin/xp/errorIcon.png) no-repeat;color:#f00;font-weight:bold;}#fbMiniErrors{display:inline;display:none;float:right;margin:5px 2px 0 5px;}#fbMiniIcon{float:right;margin:3px 4px 0;height:20px;width:20px;float:right;background:url(http://fbug.googlecode.com/svn/lite/branches/firebug1.3/skin/xp/sprite.png) 0 -135px;cursor:pointer;}#fbChrome{position:fixed;overflow:hidden;height:100%;width:100%;border-collapse:collapse;background:#fff;}#fbTop{height:49px;}#fbToolbar{position:absolute;z-index:5;width:100%;top:0;background:url(http://fbug.googlecode.com/svn/lite/branches/firebug1.3/skin/xp/sprite.png) #f1f2ee 0 0;height:27px;font-size:11px;overflow:hidden;}#fbPanelBarBox{top:27px;position:absolute;z-index:8;width:100%;background:url(http://fbug.googlecode.com/svn/lite/branches/firebug1.3/skin/xp/sprite.png) #dbd9c9 0 -27px;height:22px;}#fbContent{height:100%;vertical-align:top;}#fbBottom{height:18px;background:#fff;}#fbToolbarIcon{float:left;padding:4px 5px 0;}#fbToolbarIcon a{display:block;height:20px;width:20px;background:url(http://fbug.googlecode.com/svn/lite/branches/firebug1.3/skin/xp/sprite.png) 0 -135px;text-decoration:none;cursor:default;}#fbToolbarButtons{float:left;padding:4px 2px 0 5px;}#fbToolbarButtons a{text-decoration:none;display:block;float:left;color:#000;padding:4px 8px 4px;cursor:default;}#fbToolbarButtons a:hover{color:#333;padding:3px 7px 3px;border:1px solid #fff;border-bottom:1px solid #bbb;border-right:1px solid #bbb;}#fbStatusBarBox{position:relative;top:5px;line-height:19px;cursor:default;}.fbToolbarSeparator{overflow:hidden;border:1px solid;border-color:transparent #fff transparent #777;_border-color:#eee #fff #eee #777;height:7px;margin:10px 6px 0 0;float:left;}.fbStatusBar span{color:#808080;padding:0 4px 0 0;}.fbStatusBar span a{text-decoration:none;color:black;}.fbStatusBar span a:hover{color:blue;cursor:pointer;}#fbChromeButtons{position:absolute;white-space:nowrap;right:0;top:0;height:17px;width:50px;padding:5px 0 5px 5px;z-index:6;background:url(http://fbug.googlecode.com/svn/lite/branches/firebug1.3/skin/xp/sprite.png) #f1f2ee 0 0;}#fbPanelBar1{width:255px; z-index:8;left:0;white-space:nowrap;background:url(http://fbug.googlecode.com/svn/lite/branches/firebug1.3/skin/xp/sprite.png) #dbd9c9 0 -27px;position:absolute;left:4px;}#fbPanelBar2Box{background:url(http://fbug.googlecode.com/svn/lite/branches/firebug1.3/skin/xp/sprite.png) #dbd9c9 0 -27px;position:absolute;height:22px;width:300px; z-index:9;right:0;}#fbPanelBar2{position:absolute;width:290px; height:22px;padding-left:10px;}.fbPanel{display:none;}#fbPanelBox1,#fbPanelBox2{max-height:inherit;height:100%;font-size:11px;}#fbPanelBox2{background:#fff;}#fbPanelBox2{width:300px;background:#fff;}#fbPanel2{padding-left:6px;background:#fff;}.hide{overflow:hidden !important;position:fixed !important;display:none !important;visibility:hidden !important;}#fbCommand{height:18px;}#fbCommandBox{position:fixed;_position:absolute;width:100%;height:18px;bottom:0;overflow:hidden;z-index:9;background:#fff;border:0;border-top:1px solid #ccc;}#fbCommandIcon{position:absolute;color:#00f;top:2px;left:7px;display:inline;font:11px Monaco,monospace;z-index:10;}#fbCommandLine{position:absolute;width:100%;top:0;left:0;border:0;margin:0;padding:2px 0 2px 32px;font:11px Monaco,monospace;z-index:9;}div.fbFitHeight{overflow:auto;position:relative;}#fbChromeButtons a{font-size:1px;width:16px;height:16px;display:block;float:right;margin-right:4px;text-decoration:none;cursor:default;}#fbChrome_btClose{background:url(http://fbug.googlecode.com/svn/lite/branches/firebug1.3/skin/xp/sprite.png) 0 -119px;}#fbChrome_btClose:hover{background:url(http://fbug.googlecode.com/svn/lite/branches/firebug1.3/skin/xp/sprite.png) -16px -119px;}#fbChrome_btDetach{background:url(http://fbug.googlecode.com/svn/lite/branches/firebug1.3/skin/xp/sprite.png) -32px -119px;}#fbChrome_btDetach:hover{background:url(http://fbug.googlecode.com/svn/lite/branches/firebug1.3/skin/xp/sprite.png) -48px -119px;}.fbTab{text-decoration:none;display:none;float:left;width:auto;float:left;cursor:default;font-family:Lucida Grande,Tahoma,sans-serif;font-size:11px;font-weight:bold;height:22px;color:#565656;}.fbPanelBar span{display:block;float:left;}.fbPanelBar .fbTabL,.fbPanelBar .fbTabR{height:22px;width:8px;}.fbPanelBar .fbTabText{padding:4px 1px 0;}a.fbTab:hover{background:url(http://fbug.googlecode.com/svn/lite/branches/firebug1.3/skin/xp/sprite.png) 0 -73px;}a.fbTab:hover .fbTabL{background:url(http://fbug.googlecode.com/svn/lite/branches/firebug1.3/skin/xp/sprite.png) -16px -96px;}a.fbTab:hover .fbTabR{background:url(http://fbug.googlecode.com/svn/lite/branches/firebug1.3/skin/xp/sprite.png) -24px -96px;}.fbSelectedTab{background:url(http://fbug.googlecode.com/svn/lite/branches/firebug1.3/skin/xp/sprite.png) #f1f2ee 0 -50px !important;color:#000;}.fbSelectedTab .fbTabL{background:url(http://fbug.googlecode.com/svn/lite/branches/firebug1.3/skin/xp/sprite.png) 0 -96px !important;}.fbSelectedTab .fbTabR{background:url(http://fbug.googlecode.com/svn/lite/branches/firebug1.3/skin/xp/sprite.png) -8px -96px !important;}#fbHSplitter{position:absolute;left:0;top:0;width:100%;height:5px;overflow:hidden;cursor:n-resize !important;background:url(http://fbug.googlecode.com/svn/lite/branches/firebug1.3/skin/xp/pixel_transparent.gif);z-index:9;}#fbHSplitter.fbOnMovingHSplitter{height:100%;z-index:100;}.fbVSplitter{background:#ece9d8;color:#000;border:1px solid #716f64;border-width:0 1px;border-left-color:#aca899;width:4px;cursor:e-resize;overflow:hidden;right:294px;text-decoration:none;z-index:9;position:absolute;height:100%;top:27px;_width:6px;}div.lineNo{font:11px Monaco,monospace;float:left;display:inline;position:relative;margin:0;padding:0 5px 0 20px;background:#eee;color:#888;border-right:1px solid #ccc;text-align:right;}pre.nodeCode{font:11px Monaco,monospace;margin:0;padding-left:10px;overflow:hidden;}.nodeControl{margin-top:3px;margin-left:-14px;float:left;width:9px;height:9px;overflow:hidden;cursor:default;background:url(http://fbug.googlecode.com/svn/lite/branches/firebug1.3/skin/xp/tree_open.gif);_float:none;_display:inline;_position:absolute;}div.nodeMaximized{background:url(http://fbug.googlecode.com/svn/lite/branches/firebug1.3/skin/xp/tree_close.gif);}div.objectBox-element{padding:1px 3px;}.objectBox-selector{cursor:default;}.selectedElement{background:highlight;color:#fff !important;}.selectedElement span{color:#fff !important;}@media screen and (-webkit-min-device-pixel-ratio:0){.selectedElement{background:#316AC5;color:#fff !important;}}.logRow *{font-size:11px;}.logRow{position:relative;border-bottom:1px solid #D7D7D7;padding:2px 4px 1px 6px;background-color:#FFFFFF;}.logRow-command{font-family:Monaco,monospace;color:blue;}.objectBox-string,.objectBox-text,.objectBox-number,.objectBox-function,.objectLink-element,.objectLink-textNode,.objectLink-function,.objectBox-stackTrace,.objectLink-profile{font-family:Monaco,monospace;}.objectBox-null{padding:0 2px;border:1px solid #666666;background-color:#888888;color:#FFFFFF;}.objectBox-string{color:red;white-space:pre;}.objectBox-number{color:#000088;}.objectBox-function{color:DarkGreen;}.objectBox-object{color:DarkGreen;font-weight:bold;font-family:Lucida Grande,sans-serif;}.objectBox-array{color:#000;}.logRow-info,.logRow-error,.logRow-warning{background:#fff no-repeat 2px 2px;padding-left:20px;padding-bottom:3px;}.logRow-info{background-image:url(http://fbug.googlecode.com/svn/lite/branches/firebug1.3/skin/xp/infoIcon.png);}.logRow-warning{background-color:cyan;background-image:url(http://fbug.googlecode.com/svn/lite/branches/firebug1.3/skin/xp/warningIcon.png);}.logRow-error{background-color:LightYellow;background-image:url(http://fbug.googlecode.com/svn/lite/branches/firebug1.3/skin/xp/errorIcon.png);color:#f00;}.errorMessage{vertical-align:top;color:#f00;}.objectBox-sourceLink{position:absolute;right:4px;top:2px;padding-left:8px;font-family:Lucida Grande,sans-serif;font-weight:bold;color:#0000FF;}.logRow-group{background:#EEEEEE;border-bottom:none;}.logGroup{background:#EEEEEE;}.logGroupBox{margin-left:24px;border-top:1px solid #D7D7D7;border-left:1px solid #D7D7D7;}.selectorTag,.selectorId,.selectorClass{font-family:Monaco,monospace;font-weight:normal;}.selectorTag{color:#0000FF;}.selectorId{color:DarkBlue;}.selectorClass{color:red;}.objectBox-element{font-family:Monaco,monospace;color:#000088;}.nodeChildren{padding-left:26px;}.nodeTag{color:blue;cursor:pointer;}.nodeValue{color:#FF0000;font-weight:normal;}.nodeText,.nodeComment{margin:0 2px;vertical-align:top;}.nodeText{color:#333333;font-family:Monaco,monospace;}.nodeComment{color:DarkGreen;}.nodeHidden,.nodeHidden *{color:#888888;}.nodeHidden .nodeTag{color:#5F82D9;}.nodeHidden .nodeValue{color:#D86060;}.selectedElement .nodeHidden,.selectedElement .nodeHidden *{color:SkyBlue !important;}.log-object{}.property{position:relative;clear:both;height:15px;}.propertyNameCell{vertical-align:top;float:left;width:28%;position:absolute;left:0;z-index:0;}.propertyValueCell{float:right;width:68%;background:#fff;position:absolute;padding-left:5px;display:table-cell;right:0;z-index:1;}.propertyName{font-weight:bold;}.FirebugPopup{height:100% !important;}.FirebugPopup #fbChromeButtons{display:none !important;}.FirebugPopup #fbHSplitter{display:none !important;}',HTML:'<table id="fbChrome" cellpadding="0" cellspacing="0" border="0"><tbody><tr><td id="fbTop" colspan="2"><div id="fbHSplitter">&nbsp;</div><div id="fbChromeButtons"><a id="fbChrome_btClose" class="fbHover" title="Minimize Firebug">&nbsp;</a><a id="fbChrome_btDetach" class="fbHover" title="Open Firebug in popup window">&nbsp;</a></div><div id="fbToolbar"><span id="fbToolbarIcon"><a title="Firebug Lite Homepage" href="http://getfirebug.com/lite.html">&nbsp;</a></span><span id="fbToolbarButtons"><span id="fbFixedButtons"><a id="fbChrome_btInspect" class="fbHover" title="Click an element in the page to inspect">Inspect</a></span><span id="fbConsoleButtons" class="fbToolbarButtons"><a id="fbConsole_btClear" class="fbHover" title="Clear the console">Clear</a></span></span><span id="fbStatusBarBox"><span class="fbToolbarSeparator"></span><span id="fbHTMLStatusBar" class="fbStatusBar"><span><a class="fbHover"><b>body</b></a></span><span>&lt;</span><span><a class="fbHover">html</a></span><span>&lt;</span><span><a class="fbHover">iframe</a></span><span>&lt;</span><span><a class="fbHover">div</a></span><span>&lt;</span><span><a class="fbHover">div.class</a></span><span>&lt;</span><span><a class="fbHover">iframe</a></span><span>&lt;</span><span><a class="fbHover">body</a></span><span>&lt;</span><span><a class="fbHover">html</a></span><span>&lt;</span><span><a class="fbHover">div</a></span><span>&lt;</span><span><a class="fbHover">div</a></span></span></span></div><div id="fbPanelBarBox"><div id="fbPanelBar1" class="fbPanelBar"><a id="fbConsoleTab" class="fbTab fbHover"><span class="fbTabL"></span><span class="fbTabText">Console</span><span class="fbTabR"></span></a><a id="fbHTMLTab" class="fbTab fbHover"><span class="fbTabL"></span><span class="fbTabText">HTML</span><span class="fbTabR"></span></a><a class="fbTab fbHover"><span class="fbTabL"></span><span class="fbTabText">CSS</span><span class="fbTabR"></span></a><a class="fbTab fbHover"><span class="fbTabL"></span><span class="fbTabText">Script</span><span class="fbTabR"></span></a><a class="fbTab fbHover"><span class="fbTabL"></span><span class="fbTabText">DOM</span><span class="fbTabR"></span></a></div><div id="fbPanelBar2Box" class="hide"><div id="fbPanelBar2" class="fbPanelBar"><a class="fbTab fbHover"><span class="fbTabL"></span><span class="fbTabText">Style</span><span class="fbTabR"></span></a><a class="fbTab fbHover"><span class="fbTabL"></span><span class="fbTabText">Layout</span><span class="fbTabR"></span></a><a class="fbTab fbHover"><span class="fbTabL"></span><span class="fbTabText">DOM</span><span class="fbTabR"></span></a></div></div></div></td></tr><tr id="fbContent"><td id="fbPanelBox1"><div id="fbPanel1" class="fbFitHeight"><div id="fbConsole" class="fbPanel"></div><div id="fbHTML" class="fbPanel"></div></div></td><td id="fbPanelBox2" class="hide"><div id="fbVSplitter" class="fbVSplitter">&nbsp;</div><div id="fbPanel2" class="fbFitHeight"><div id="fbHTML_Style" class="fbPanel"></div><div id="fbHTML_Layout" class="fbPanel"></div><div id="fbHTML_DOM" class="fbPanel"></div></div></td></tr><tr id="fbBottom"><td id="fbCommand" colspan="2"><div id="fbCommandBox"><div id="fbCommandIcon">&gt;&gt;&gt;</div><input id="fbCommandLine" name="fbCommandLine" type="text"/></div></td></tr></tbody></table><span id="fbMiniChrome"><span id="fbMiniContent"><span id="fbMiniIcon" title="Open Firebug Lite"></span><span id="fbMiniErrors" class="fbErrors">2 errors</span></span></span>'}
}});
FBL.ns(function(){with(FBL){var ConsoleAPI={firebuglite:Firebug.version,log:function(){return Firebug.Console.logFormatted(arguments,"")
},debug:function(){return Firebug.Console.logFormatted(arguments,"debug")
},info:function(){return Firebug.Console.logFormatted(arguments,"info")
},warn:function(){return Firebug.Console.logFormatted(arguments,"warning")
},error:function(){return Firebug.Console.logFormatted(arguments,"error")
},assert:function(truth,message){if(!truth){var args=[];
for(var i=1;
i<arguments.length;
++i){args.push(arguments[i])
}Firebug.Console.logFormatted(args.length?args:["Assertion Failure"],"error");
throw message?message:"Assertion Failure"
}return Firebug.Console.LOG_COMMAND
},dir:function(object){var html=[];
var pairs=[];
for(var name in object){try{pairs.push([name,object[name]])
}catch(exc){}}pairs.sort(function(a,b){return a[0]<b[0]?-1:1
});
html.push('<div class="log-object">');
for(var i=0;
i<pairs.length;
++i){var name=pairs[i][0],value=pairs[i][1];
html.push('<div class="property">','<div class="propertyValueCell"><span class="propertyValue">');
Firebug.Reps.appendObject(value,html);
html.push('</span></div><div class="propertyNameCell"><span class="propertyName">',escapeHTML(name),"</span></div>");
html.push("</div>")
}html.push("</div>");
return Firebug.Console.logRow(html,"dir")
},dirxml:function(node){var html=[];
Firebug.Reps.appendNode(node,html);
return Firebug.Console.logRow(html,"dirxml")
},group:function(){return Firebug.Console.logRow(arguments,"group",Firebug.Console.pushGroup)
},groupEnd:function(){return Firebug.Console.logRow(arguments,"",Firebug.Console.popGroup)
},time:function(name){this.timeMap[name]=(new Date()).getTime();
return Firebug.Console.LOG_COMMAND
},timeEnd:function(name){if(name in this.timeMap){var delta=(new Date()).getTime()-this.timeMap[name];
Firebug.Console.logFormatted([name+":",delta+"ms"]);
delete this.timeMap[name]
}return Firebug.Console.LOG_COMMAND
},count:function(){return this.warn(["count() not supported."])
},trace:function(){return this.warn(["trace() not supported."])
},profile:function(){return this.warn(["profile() not supported."])
},profileEnd:function(){return Firebug.Console.LOG_COMMAND
},clear:function(){Firebug.Console.getPanel().contentNode.innerHTML="";
return Firebug.Console.LOG_COMMAND
},open:function(){toggleConsole(true);
return Firebug.Console.LOG_COMMAND
},close:function(){if(frameVisible){toggleConsole()
}return Firebug.Console.LOG_COMMAND
}};
var ConsoleModule=extend(Firebug.Module,ConsoleAPI);
Firebug.Console=extend(ConsoleModule,{LOG_COMMAND:{},messageQueue:[],groupStack:[],timeMap:{},getPanel:function(){return Firebug.chrome?Firebug.chrome.getPanel("Console"):null
},flush:function(){var queue=this.messageQueue;
this.messageQueue=[];
for(var i=0;
i<queue.length;
++i){this.writeMessage(queue[i][0],queue[i][1],queue[i][2])
}},logFormatted:function(objects,className){var html=[];
var format=objects[0];
var objIndex=0;
if(typeof(format)!="string"){format="";
objIndex=-1
}var parts=this.parseFormat(format);
for(var i=0;
i<parts.length;
++i){var part=parts[i];
if(part&&typeof(part)=="object"){var object=objects[++objIndex];
part.appender(object,html)
}else{Firebug.Reps.appendText(part,html)
}}for(var i=objIndex+1;
i<objects.length;
++i){Firebug.Reps.appendText(" ",html);
var object=objects[i];
if(typeof(object)=="string"){Firebug.Reps.appendText(object,html)
}else{Firebug.Reps.appendObject(object,html)
}}return this.logRow(html,className)
},parseFormat:function(format){var parts=[];
var reg=/((^%|[^\\]%)(\d+)?(\.)([a-zA-Z]))|((^%|[^\\]%)([a-zA-Z]))/;
var Reps=Firebug.Reps;
var appenderMap={s:Reps.appendText,d:Reps.appendInteger,i:Reps.appendInteger,f:Reps.appendFloat};
for(var m=reg.exec(format);
m;
m=reg.exec(format)){var type=m[8]?m[8]:m[5];
var appender=type in appenderMap?appenderMap[type]:Reps.appendObject;
var precision=m[3]?parseInt(m[3]):(m[4]=="."?-1:0);
parts.push(format.substr(0,m[0][0]=="%"?m.index:m.index+1));
parts.push({appender:appender,precision:precision});
format=format.substr(m.index+m[0].length)
}parts.push(format);
return parts
},logRow:function(message,className,handler){var panel=this.getPanel();
if(panel&&panel.contentNode){this.writeMessage(message,className,handler)
}else{this.messageQueue.push([message,className,handler])
}return this.LOG_COMMAND
},writeMessage:function(message,className,handler){var container=this.getPanel().containerNode;
var isScrolledToBottom=container.scrollTop+container.offsetHeight>=container.scrollHeight;
if(!handler){handler=this.writeRow
}handler.call(this,message,className);
if(isScrolledToBottom){container.scrollTop=container.scrollHeight-container.offsetHeight
}},appendRow:function(row){if(this.groupStack.length>0){var container=this.groupStack[this.groupStack.length-1]
}else{var container=this.getPanel().contentNode
}container.appendChild(row)
},writeRow:function(message,className){var row=this.getPanel().contentNode.ownerDocument.createElement("div");
row.className="logRow"+(className?" logRow-"+className:"");
row.innerHTML=message.join("");
this.appendRow(row)
},pushGroup:function(message,className){this.logFormatted(message,className);
var groupRow=this.getPanel().contentNode.ownerDocument.createElement("div");
groupRow.className="logGroup";
var groupRowBox=this.getPanel().contentNode.ownerDocument.createElement("div");
groupRowBox.className="logGroupBox";
groupRow.appendChild(groupRowBox);
this.appendRow(groupRowBox);
this.groupStack.push(groupRowBox)
},popGroup:function(){this.groupStack.pop()
}});
Firebug.registerModule(Firebug.Console);
function ConsolePanel(){}ConsolePanel.prototype=extend(Firebug.Panel,{name:"Console",title:"Console",options:{hasCommandLine:true,hasToolButtons:true,isPreRendered:true},create:function(){Firebug.Panel.create.apply(this,arguments);
this.clearButton=new Firebug.Button({node:$("fbConsole_btClear"),owner:Firebug.Console,onClick:Firebug.Console.clear})
},initialize:function(){Firebug.Panel.initialize.apply(this,arguments);
this.clearButton.initialize()
}});
Firebug.registerPanel(ConsolePanel);
FBL.onError=function(msg,href,lineNo){var html=[];
var lastSlash=href.lastIndexOf("/");
var fileName=lastSlash==-1?href:href.substr(lastSlash+1);
html.push('<span class="errorMessage">',msg,"</span>",'<div class="objectBox-sourceLink">',fileName," (line ",lineNo,")</div>");
Firebug.Console.logRow(html,"error")
};
if(!isFirefox){Application.browser.window.console=ConsoleAPI
}}});
FBL.ns(function(){with(FBL){
/*
 * Sizzle CSS Selector Engine - v1.0
 *  Copyright 2009, The Dojo Foundation
 *  Released under the MIT, BSD, and GPL Licenses.
 *  More information: http://sizzlejs.com/
 */
var chunker=/((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^[\]]*\]|['"][^'"]*['"]|[^[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?/g,done=0,toString=Object.prototype.toString,hasDuplicate=false;
var Sizzle=function(selector,context,results,seed){results=results||[];
var origContext=context=context||document;
if(context.nodeType!==1&&context.nodeType!==9){return[]
}if(!selector||typeof selector!=="string"){return results
}var parts=[],m,set,checkSet,check,mode,extra,prune=true,contextXML=isXML(context);
chunker.lastIndex=0;
while((m=chunker.exec(selector))!==null){parts.push(m[1]);
if(m[2]){extra=RegExp.rightContext;
break
}}if(parts.length>1&&origPOS.exec(selector)){if(parts.length===2&&Expr.relative[parts[0]]){set=posProcess(parts[0]+parts[1],context)
}else{set=Expr.relative[parts[0]]?[context]:Sizzle(parts.shift(),context);
while(parts.length){selector=parts.shift();
if(Expr.relative[selector]){selector+=parts.shift()
}set=posProcess(selector,set)
}}}else{if(!seed&&parts.length>1&&context.nodeType===9&&!contextXML&&Expr.match.ID.test(parts[0])&&!Expr.match.ID.test(parts[parts.length-1])){var ret=Sizzle.find(parts.shift(),context,contextXML);
context=ret.expr?Sizzle.filter(ret.expr,ret.set)[0]:ret.set[0]
}if(context){var ret=seed?{expr:parts.pop(),set:makeArray(seed)}:Sizzle.find(parts.pop(),parts.length===1&&(parts[0]==="~"||parts[0]==="+")&&context.parentNode?context.parentNode:context,contextXML);
set=ret.expr?Sizzle.filter(ret.expr,ret.set):ret.set;
if(parts.length>0){checkSet=makeArray(set)
}else{prune=false
}while(parts.length){var cur=parts.pop(),pop=cur;
if(!Expr.relative[cur]){cur=""
}else{pop=parts.pop()
}if(pop==null){pop=context
}Expr.relative[cur](checkSet,pop,contextXML)
}}else{checkSet=parts=[]
}}if(!checkSet){checkSet=set
}if(!checkSet){throw"Syntax error, unrecognized expression: "+(cur||selector)
}if(toString.call(checkSet)==="[object Array]"){if(!prune){results.push.apply(results,checkSet)
}else{if(context&&context.nodeType===1){for(var i=0;
checkSet[i]!=null;
i++){if(checkSet[i]&&(checkSet[i]===true||checkSet[i].nodeType===1&&contains(context,checkSet[i]))){results.push(set[i])
}}}else{for(var i=0;
checkSet[i]!=null;
i++){if(checkSet[i]&&checkSet[i].nodeType===1){results.push(set[i])
}}}}}else{makeArray(checkSet,results)
}if(extra){Sizzle(extra,origContext,results,seed);
Sizzle.uniqueSort(results)
}return results
};
Sizzle.uniqueSort=function(results){if(sortOrder){hasDuplicate=false;
results.sort(sortOrder);
if(hasDuplicate){for(var i=1;
i<results.length;
i++){if(results[i]===results[i-1]){results.splice(i--,1)
}}}}};
Sizzle.matches=function(expr,set){return Sizzle(expr,null,null,set)
};
Sizzle.find=function(expr,context,isXML){var set,match;
if(!expr){return[]
}for(var i=0,l=Expr.order.length;
i<l;
i++){var type=Expr.order[i],match;
if((match=Expr.match[type].exec(expr))){var left=RegExp.leftContext;
if(left.substr(left.length-1)!=="\\"){match[1]=(match[1]||"").replace(/\\/g,"");
set=Expr.find[type](match,context,isXML);
if(set!=null){expr=expr.replace(Expr.match[type],"");
break
}}}}if(!set){set=context.getElementsByTagName("*")
}return{set:set,expr:expr}
};
Sizzle.filter=function(expr,set,inplace,not){var old=expr,result=[],curLoop=set,match,anyFound,isXMLFilter=set&&set[0]&&isXML(set[0]);
while(expr&&set.length){for(var type in Expr.filter){if((match=Expr.match[type].exec(expr))!=null){var filter=Expr.filter[type],found,item;
anyFound=false;
if(curLoop==result){result=[]
}if(Expr.preFilter[type]){match=Expr.preFilter[type](match,curLoop,inplace,result,not,isXMLFilter);
if(!match){anyFound=found=true
}else{if(match===true){continue
}}}if(match){for(var i=0;
(item=curLoop[i])!=null;
i++){if(item){found=filter(item,match,i,curLoop);
var pass=not^!!found;
if(inplace&&found!=null){if(pass){anyFound=true
}else{curLoop[i]=false
}}else{if(pass){result.push(item);
anyFound=true
}}}}}if(found!==undefined){if(!inplace){curLoop=result
}expr=expr.replace(Expr.match[type],"");
if(!anyFound){return[]
}break
}}}if(expr==old){if(anyFound==null){throw"Syntax error, unrecognized expression: "+expr
}else{break
}}old=expr
}return curLoop
};
var Expr=Sizzle.selectors={order:["ID","NAME","TAG"],match:{ID:/#((?:[\w\u00c0-\uFFFF_-]|\\.)+)/,CLASS:/\.((?:[\w\u00c0-\uFFFF_-]|\\.)+)/,NAME:/\[name=['"]*((?:[\w\u00c0-\uFFFF_-]|\\.)+)['"]*\]/,ATTR:/\[\s*((?:[\w\u00c0-\uFFFF_-]|\\.)+)\s*(?:(\S?=)\s*(['"]*)(.*?)\3|)\s*\]/,TAG:/^((?:[\w\u00c0-\uFFFF\*_-]|\\.)+)/,CHILD:/:(only|nth|last|first)-child(?:\((even|odd|[\dn+-]*)\))?/,POS:/:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^-]|$)/,PSEUDO:/:((?:[\w\u00c0-\uFFFF_-]|\\.)+)(?:\((['"]*)((?:\([^\)]+\)|[^\2\(\)]*)+)\2\))?/},attrMap:{"class":"className","for":"htmlFor"},attrHandle:{href:function(elem){return elem.getAttribute("href")
}},relative:{"+":function(checkSet,part,isXML){var isPartStr=typeof part==="string",isTag=isPartStr&&!/\W/.test(part),isPartStrNotTag=isPartStr&&!isTag;
if(isTag&&!isXML){part=part.toUpperCase()
}for(var i=0,l=checkSet.length,elem;
i<l;
i++){if((elem=checkSet[i])){while((elem=elem.previousSibling)&&elem.nodeType!==1){}checkSet[i]=isPartStrNotTag||elem&&elem.nodeName===part?elem||false:elem===part
}}if(isPartStrNotTag){Sizzle.filter(part,checkSet,true)
}},">":function(checkSet,part,isXML){var isPartStr=typeof part==="string";
if(isPartStr&&!/\W/.test(part)){part=isXML?part:part.toUpperCase();
for(var i=0,l=checkSet.length;
i<l;
i++){var elem=checkSet[i];
if(elem){var parent=elem.parentNode;
checkSet[i]=parent.nodeName===part?parent:false
}}}else{for(var i=0,l=checkSet.length;
i<l;
i++){var elem=checkSet[i];
if(elem){checkSet[i]=isPartStr?elem.parentNode:elem.parentNode===part
}}if(isPartStr){Sizzle.filter(part,checkSet,true)
}}},"":function(checkSet,part,isXML){var doneName=done++,checkFn=dirCheck;
if(!part.match(/\W/)){var nodeCheck=part=isXML?part:part.toUpperCase();
checkFn=dirNodeCheck
}checkFn("parentNode",part,doneName,checkSet,nodeCheck,isXML)
},"~":function(checkSet,part,isXML){var doneName=done++,checkFn=dirCheck;
if(typeof part==="string"&&!part.match(/\W/)){var nodeCheck=part=isXML?part:part.toUpperCase();
checkFn=dirNodeCheck
}checkFn("previousSibling",part,doneName,checkSet,nodeCheck,isXML)
}},find:{ID:function(match,context,isXML){if(typeof context.getElementById!=="undefined"&&!isXML){var m=context.getElementById(match[1]);
return m?[m]:[]
}},NAME:function(match,context,isXML){if(typeof context.getElementsByName!=="undefined"){var ret=[],results=context.getElementsByName(match[1]);
for(var i=0,l=results.length;
i<l;
i++){if(results[i].getAttribute("name")===match[1]){ret.push(results[i])
}}return ret.length===0?null:ret
}},TAG:function(match,context){return context.getElementsByTagName(match[1])
}},preFilter:{CLASS:function(match,curLoop,inplace,result,not,isXML){match=" "+match[1].replace(/\\/g,"")+" ";
if(isXML){return match
}for(var i=0,elem;
(elem=curLoop[i])!=null;
i++){if(elem){if(not^(elem.className&&(" "+elem.className+" ").indexOf(match)>=0)){if(!inplace){result.push(elem)
}}else{if(inplace){curLoop[i]=false
}}}}return false
},ID:function(match){return match[1].replace(/\\/g,"")
},TAG:function(match,curLoop){for(var i=0;
curLoop[i]===false;
i++){}return curLoop[i]&&isXML(curLoop[i])?match[1]:match[1].toUpperCase()
},CHILD:function(match){if(match[1]=="nth"){var test=/(-?)(\d*)n((?:\+|-)?\d*)/.exec(match[2]=="even"&&"2n"||match[2]=="odd"&&"2n+1"||!/\D/.test(match[2])&&"0n+"+match[2]||match[2]);
match[2]=(test[1]+(test[2]||1))-0;
match[3]=test[3]-0
}match[0]=done++;
return match
},ATTR:function(match,curLoop,inplace,result,not,isXML){var name=match[1].replace(/\\/g,"");
if(!isXML&&Expr.attrMap[name]){match[1]=Expr.attrMap[name]
}if(match[2]==="~="){match[4]=" "+match[4]+" "
}return match
},PSEUDO:function(match,curLoop,inplace,result,not){if(match[1]==="not"){if(match[3].match(chunker).length>1||/^\w/.test(match[3])){match[3]=Sizzle(match[3],null,null,curLoop)
}else{var ret=Sizzle.filter(match[3],curLoop,inplace,true^not);
if(!inplace){result.push.apply(result,ret)
}return false
}}else{if(Expr.match.POS.test(match[0])||Expr.match.CHILD.test(match[0])){return true
}}return match
},POS:function(match){match.unshift(true);
return match
}},filters:{enabled:function(elem){return elem.disabled===false&&elem.type!=="hidden"
},disabled:function(elem){return elem.disabled===true
},checked:function(elem){return elem.checked===true
},selected:function(elem){elem.parentNode.selectedIndex;
return elem.selected===true
},parent:function(elem){return !!elem.firstChild
},empty:function(elem){return !elem.firstChild
},has:function(elem,i,match){return !!Sizzle(match[3],elem).length
},header:function(elem){return/h\d/i.test(elem.nodeName)
},text:function(elem){return"text"===elem.type
},radio:function(elem){return"radio"===elem.type
},checkbox:function(elem){return"checkbox"===elem.type
},file:function(elem){return"file"===elem.type
},password:function(elem){return"password"===elem.type
},submit:function(elem){return"submit"===elem.type
},image:function(elem){return"image"===elem.type
},reset:function(elem){return"reset"===elem.type
},button:function(elem){return"button"===elem.type||elem.nodeName.toUpperCase()==="BUTTON"
},input:function(elem){return/input|select|textarea|button/i.test(elem.nodeName)
}},setFilters:{first:function(elem,i){return i===0
},last:function(elem,i,match,array){return i===array.length-1
},even:function(elem,i){return i%2===0
},odd:function(elem,i){return i%2===1
},lt:function(elem,i,match){return i<match[3]-0
},gt:function(elem,i,match){return i>match[3]-0
},nth:function(elem,i,match){return match[3]-0==i
},eq:function(elem,i,match){return match[3]-0==i
}},filter:{PSEUDO:function(elem,match,i,array){var name=match[1],filter=Expr.filters[name];
if(filter){return filter(elem,i,match,array)
}else{if(name==="contains"){return(elem.textContent||elem.innerText||"").indexOf(match[3])>=0
}else{if(name==="not"){var not=match[3];
for(i=0,l=not.length;
i<l;
i++){if(not[i]===elem){return false
}}return true
}}}},CHILD:function(elem,match){var type=match[1],node=elem;
switch(type){case"only":case"first":while((node=node.previousSibling)){if(node.nodeType===1){return false
}}if(type=="first"){return true
}node=elem;
case"last":while((node=node.nextSibling)){if(node.nodeType===1){return false
}}return true;
case"nth":var first=match[2],last=match[3];
if(first==1&&last==0){return true
}var doneName=match[0],parent=elem.parentNode;
if(parent&&(parent.sizcache!==doneName||!elem.nodeIndex)){var count=0;
for(node=parent.firstChild;
node;
node=node.nextSibling){if(node.nodeType===1){node.nodeIndex=++count
}}parent.sizcache=doneName
}var diff=elem.nodeIndex-last;
if(first==0){return diff==0
}else{return(diff%first==0&&diff/first>=0)
}}},ID:function(elem,match){return elem.nodeType===1&&elem.getAttribute("id")===match
},TAG:function(elem,match){return(match==="*"&&elem.nodeType===1)||elem.nodeName===match
},CLASS:function(elem,match){return(" "+(elem.className||elem.getAttribute("class"))+" ").indexOf(match)>-1
},ATTR:function(elem,match){var name=match[1],result=Expr.attrHandle[name]?Expr.attrHandle[name](elem):elem[name]!=null?elem[name]:elem.getAttribute(name),value=result+"",type=match[2],check=match[4];
return result==null?type==="!=":type==="="?value===check:type==="*="?value.indexOf(check)>=0:type==="~="?(" "+value+" ").indexOf(check)>=0:!check?value&&result!==false:type==="!="?value!=check:type==="^="?value.indexOf(check)===0:type==="$="?value.substr(value.length-check.length)===check:type==="|="?value===check||value.substr(0,check.length+1)===check+"-":false
},POS:function(elem,match,i,array){var name=match[2],filter=Expr.setFilters[name];
if(filter){return filter(elem,i,match,array)
}}}};
var origPOS=Expr.match.POS;
for(var type in Expr.match){Expr.match[type]=new RegExp(Expr.match[type].source+/(?![^\[]*\])(?![^\(]*\))/.source)
}var makeArray=function(array,results){array=Array.prototype.slice.call(array);
if(results){results.push.apply(results,array);
return results
}return array
};
try{Array.prototype.slice.call(document.documentElement.childNodes)
}catch(e){makeArray=function(array,results){var ret=results||[];
if(toString.call(array)==="[object Array]"){Array.prototype.push.apply(ret,array)
}else{if(typeof array.length==="number"){for(var i=0,l=array.length;
i<l;
i++){ret.push(array[i])
}}else{for(var i=0;
array[i];
i++){ret.push(array[i])
}}}return ret
}
}var sortOrder;
if(document.documentElement.compareDocumentPosition){sortOrder=function(a,b){var ret=a.compareDocumentPosition(b)&4?-1:a===b?0:1;
if(ret===0){hasDuplicate=true
}return ret
}
}else{if("sourceIndex" in document.documentElement){sortOrder=function(a,b){var ret=a.sourceIndex-b.sourceIndex;
if(ret===0){hasDuplicate=true
}return ret
}
}else{if(document.createRange){sortOrder=function(a,b){var aRange=a.ownerDocument.createRange(),bRange=b.ownerDocument.createRange();
aRange.selectNode(a);
aRange.collapse(true);
bRange.selectNode(b);
bRange.collapse(true);
var ret=aRange.compareBoundaryPoints(Range.START_TO_END,bRange);
if(ret===0){hasDuplicate=true
}return ret
}
}}}(function(){var form=document.createElement("div"),id="script"+(new Date).getTime();
form.innerHTML="<a name='"+id+"'/>";
var root=document.documentElement;
root.insertBefore(form,root.firstChild);
if(!!document.getElementById(id)){Expr.find.ID=function(match,context,isXML){if(typeof context.getElementById!=="undefined"&&!isXML){var m=context.getElementById(match[1]);
return m?m.id===match[1]||typeof m.getAttributeNode!=="undefined"&&m.getAttributeNode("id").nodeValue===match[1]?[m]:undefined:[]
}};
Expr.filter.ID=function(elem,match){var node=typeof elem.getAttributeNode!=="undefined"&&elem.getAttributeNode("id");
return elem.nodeType===1&&node&&node.nodeValue===match
}
}root.removeChild(form);
root=form=null
})();
(function(){var div=document.createElement("div");
div.appendChild(document.createComment(""));
if(div.getElementsByTagName("*").length>0){Expr.find.TAG=function(match,context){var results=context.getElementsByTagName(match[1]);
if(match[1]==="*"){var tmp=[];
for(var i=0;
results[i];
i++){if(results[i].nodeType===1){tmp.push(results[i])
}}results=tmp
}return results
}
}div.innerHTML="<a href='#'></a>";
if(div.firstChild&&typeof div.firstChild.getAttribute!=="undefined"&&div.firstChild.getAttribute("href")!=="#"){Expr.attrHandle.href=function(elem){return elem.getAttribute("href",2)
}
}div=null
})();
if(document.querySelectorAll){(function(){var oldSizzle=Sizzle,div=document.createElement("div");
div.innerHTML="<p class='TEST'></p>";
if(div.querySelectorAll&&div.querySelectorAll(".TEST").length===0){return
}Sizzle=function(query,context,extra,seed){context=context||document;
if(!seed&&context.nodeType===9&&!isXML(context)){try{return makeArray(context.querySelectorAll(query),extra)
}catch(e){}}return oldSizzle(query,context,extra,seed)
};
for(var prop in oldSizzle){Sizzle[prop]=oldSizzle[prop]
}div=null
})()
}if(document.getElementsByClassName&&document.documentElement.getElementsByClassName){(function(){var div=document.createElement("div");
div.innerHTML="<div class='test e'></div><div class='test'></div>";
if(div.getElementsByClassName("e").length===0){return
}div.lastChild.className="e";
if(div.getElementsByClassName("e").length===1){return
}Expr.order.splice(1,0,"CLASS");
Expr.find.CLASS=function(match,context,isXML){if(typeof context.getElementsByClassName!=="undefined"&&!isXML){return context.getElementsByClassName(match[1])
}};
div=null
})()
}function dirNodeCheck(dir,cur,doneName,checkSet,nodeCheck,isXML){var sibDir=dir=="previousSibling"&&!isXML;
for(var i=0,l=checkSet.length;
i<l;
i++){var elem=checkSet[i];
if(elem){if(sibDir&&elem.nodeType===1){elem.sizcache=doneName;
elem.sizset=i
}elem=elem[dir];
var match=false;
while(elem){if(elem.sizcache===doneName){match=checkSet[elem.sizset];
break
}if(elem.nodeType===1&&!isXML){elem.sizcache=doneName;
elem.sizset=i
}if(elem.nodeName===cur){match=elem;
break
}elem=elem[dir]
}checkSet[i]=match
}}}function dirCheck(dir,cur,doneName,checkSet,nodeCheck,isXML){var sibDir=dir=="previousSibling"&&!isXML;
for(var i=0,l=checkSet.length;
i<l;
i++){var elem=checkSet[i];
if(elem){if(sibDir&&elem.nodeType===1){elem.sizcache=doneName;
elem.sizset=i
}elem=elem[dir];
var match=false;
while(elem){if(elem.sizcache===doneName){match=checkSet[elem.sizset];
break
}if(elem.nodeType===1){if(!isXML){elem.sizcache=doneName;
elem.sizset=i
}if(typeof cur!=="string"){if(elem===cur){match=true;
break
}}else{if(Sizzle.filter(cur,[elem]).length>0){match=elem;
break
}}}elem=elem[dir]
}checkSet[i]=match
}}}var contains=document.compareDocumentPosition?function(a,b){return a.compareDocumentPosition(b)&16
}:function(a,b){return a!==b&&(a.contains?a.contains(b):true)
};
var isXML=function(elem){return elem.nodeType===9&&elem.documentElement.nodeName!=="HTML"||!!elem.ownerDocument&&elem.ownerDocument.documentElement.nodeName!=="HTML"
};
var posProcess=function(selector,context){var tmpSet=[],later="",match,root=context.nodeType?[context]:context;
while((match=Expr.match.PSEUDO.exec(selector))){later+=match[0];
selector=selector.replace(Expr.match.PSEUDO,"")
}selector=Expr.relative[selector]?selector+"*":selector;
for(var i=0,l=root.length;
i<l;
i++){Sizzle(selector,root[i],tmpSet)
}return Sizzle.filter(later,tmpSet)
};
Firebug.Selector=Sizzle
}});
FBL.ns(function(){with(FBL){Firebug.Inspector={initialize:function(){offlineFragment=Firebug.browser.document.createDocumentFragment();
createBoxModelInspector();
createOutlineInspector()
},onChromeReady:function(){},startInspecting:function(){Firebug.chrome.selectPanel("HTML");
createInspectorFrame();
var size=Firebug.browser.getWindowScrollSize();
fbInspectFrame.style.width=size.width+"px";
fbInspectFrame.style.height=size.height+"px";
addEvent(fbInspectFrame,"mousemove",Firebug.Inspector.onInspecting);
addEvent(fbInspectFrame,"mousedown",Firebug.Inspector.onInspectingClick)
},stopInspecting:function(){destroyInspectorFrame();
Firebug.chrome.inspectButton.restore();
if(outlineVisible){this.hideOutline()
}removeEvent(fbInspectFrame,"mousemove",Firebug.Inspector.onInspecting);
removeEvent(fbInspectFrame,"mousedown",Firebug.Inspector.onInspectingClick)
},onInspectingClick:function(e){fbInspectFrame.style.display="none";
var targ=Firebug.browser.getElementFromPoint(e.clientX,e.clientY);
fbInspectFrame.style.display="block";
var id=targ.id;
if(id&&/^fbOutline\w$/.test(id)){return
}if(id=="FirebugChrome"){return
}while(targ.nodeType!=1){targ=targ.parentNode
}Firebug.Inspector.stopInspecting()
},onInspecting:function(e){if(new Date().getTime()-lastInspecting>30){fbInspectFrame.style.display="none";
var targ=Firebug.browser.getElementFromPoint(e.clientX,e.clientY);
fbInspectFrame.style.display="block";
var id=targ.id;
if(id&&/^fbOutline\w$/.test(id)){return
}if(id=="FirebugChrome"){return
}while(targ.nodeType!=1){targ=targ.parentNode
}if(targ.nodeName.toLowerCase()=="body"){return
}Firebug.Inspector.drawOutline(targ);
if(targ[cacheID]){FBL.Firebug.HTML.selectTreeNode(""+targ[cacheID])
}lastInspecting=new Date().getTime()
}},drawOutline:function(el){if(!outlineVisible){this.showOutline()
}var box=Firebug.browser.getElementBox(el);
var top=box.top;
var left=box.left;
var height=box.height;
var width=box.width;
var border=2;
var o=outlineElements;
o.fbOutlineT.style.top=top-border+"px";
o.fbOutlineT.style.left=left+"px";
o.fbOutlineT.style.width=width+"px";
o.fbOutlineB.style.top=top+height+"px";
o.fbOutlineB.style.left=left+"px";
o.fbOutlineB.style.width=width+"px";
o.fbOutlineL.style.top=top-border+"px";
o.fbOutlineL.style.left=left-border+"px";
o.fbOutlineL.style.height=height+2*border+"px";
o.fbOutlineR.style.top=top-border+"px";
o.fbOutlineR.style.left=left+width+"px";
o.fbOutlineR.style.height=height+2*border+"px"
},hideOutline:function(){if(!outlineVisible){return
}for(var name in outline){offlineFragment.appendChild(outlineElements[name])
}outlineVisible=false
},showOutline:function(){if(outlineVisible){return
}for(var name in outline){Firebug.browser.document.body.appendChild(outlineElements[name])
}outlineVisible=true
},drawBoxModel:function(el){if(!boxModelVisible){this.showBoxModel()
}var box=Firebug.browser.getElementBox(el);
var top=box.top;
var left=box.left;
var height=box.height;
var width=box.width;
var margin=Firebug.browser.getMeasurementBox(el,"margin");
var padding=Firebug.browser.getMeasurementBox(el,"padding");
boxModelStyle.top=top-margin.top+"px";
boxModelStyle.left=left-margin.left+"px";
boxModelStyle.height=height+margin.top+margin.bottom+"px";
boxModelStyle.width=width+margin.left+margin.right+"px";
boxPaddingStyle.top=margin.top+"px";
boxPaddingStyle.left=margin.left+"px";
boxPaddingStyle.height=height+"px";
boxPaddingStyle.width=width+"px";
boxContentStyle.top=margin.top+padding.top+"px";
boxContentStyle.left=margin.left+padding.left+"px";
boxContentStyle.height=height-padding.top-padding.bottom+"px";
boxContentStyle.width=width-padding.left-padding.right+"px"
},hideBoxModel:function(){if(boxModelVisible){offlineFragment.appendChild(boxModel);
boxModelVisible=false
}},showBoxModel:function(){if(!boxModelVisible){Firebug.browser.document.body.appendChild(boxModel);
boxModelVisible=true
}}};
var offlineFragment=null;
var boxModelVisible=false;
var pixelsPerInch,boxModel,boxModelStyle,boxMargin,boxMarginStyle,boxPadding,boxPaddingStyle,boxContent,boxContentStyle;
var resetStyle="margin:0; padding:0; border:0; position:absolute; overflow:hidden; display:block;";
var offscreenStyle=resetStyle+"top:-1234px; left:-1234px;";
var inspectStyle=resetStyle+"z-index: 2147483500;";
var inspectFrameStyle=resetStyle+"z-index: 2147483550; top:0; left:0; background:url("+Application.location.skinDir+"pixel_transparent.gif);";
var inspectModelStyle=inspectStyle+"opacity:0.8; _filter:alpha(opacity=80);";
var inspectMarginStyle=inspectStyle+"background: #EDFF64; height:100%; width:100%;";
var inspectPaddingStyle=inspectStyle+"background: SlateBlue;";
var inspectContentStyle=inspectStyle+"background: SkyBlue;";
var outlineStyle={fbHorizontalLine:"background: #3875D7; height: 2px;",fbVerticalLine:"background: #3875D7; width: 2px;"};
var lastInspecting=0;
var fbInspectFrame=null;
var outlineVisible=false;
var outlineElements={};
var outline={fbOutlineT:"fbHorizontalLine",fbOutlineL:"fbVerticalLine",fbOutlineB:"fbHorizontalLine",fbOutlineR:"fbVerticalLine"};
var createInspectorFrame=function createInspectorFrame(){fbInspectFrame=Firebug.browser.document.createElement("div");
fbInspectFrame.id="fbInspectFrame";
fbInspectFrame.style.cssText=inspectFrameStyle;
Firebug.browser.document.body.appendChild(fbInspectFrame)
};
var destroyInspectorFrame=function createInspectorFrame(){Firebug.browser.document.body.removeChild(fbInspectFrame)
};
var createOutlineInspector=function createOutlineInspector(){for(var name in outline){var el=outlineElements[name]=Firebug.browser.document.createElement("div");
el.id=name;
el.style.cssText=inspectStyle+outlineStyle[outline[name]];
offlineFragment.appendChild(el)
}};
var createBoxModelInspector=function createBoxModelInspector(){boxModel=Firebug.browser.document.createElement("div");
boxModel.id="fbBoxModel";
boxModelStyle=boxModel.style;
boxModelStyle.cssText=inspectModelStyle;
boxMargin=Firebug.browser.document.createElement("div");
boxMargin.id="fbBoxMargin";
boxMarginStyle=boxMargin.style;
boxMarginStyle.cssText=inspectMarginStyle;
boxModel.appendChild(boxMargin);
boxPadding=Firebug.browser.document.createElement("div");
boxPadding.id="fbBoxPadding";
boxPaddingStyle=boxPadding.style;
boxPaddingStyle.cssText=inspectPaddingStyle;
boxModel.appendChild(boxPadding);
boxContent=Firebug.browser.document.createElement("div");
boxContent.id="fbBoxContent";
boxContentStyle=boxContent.style;
boxContentStyle.cssText=inspectContentStyle;
boxModel.appendChild(boxContent);
offlineFragment.appendChild(boxModel)
}
}});
FBL.ns(function(){with(FBL){var Console=Firebug.Console;
Firebug.CommandLine=function(element){this.element=element;
if(isOpera){fixOperaTabKey(this.element)
}this.onKeyDown=bind(this.onKeyDown,this);
addEvent(this.element,"keydown",this.onKeyDown);
var self=this;
Application.browser.onerror=function(){self.onError.apply(self,arguments)
};
window.onerror=this.onError;
initializeCommandLineAPI()
};
Firebug.CommandLine.prototype={element:null,_buffer:[],_bi:-1,_completing:null,_completePrefix:null,_completeExpr:null,_completeBuffer:null,_ci:null,_completion:{window:["console"],document:["getElementById","getElementsByTagName"]},_stack:function(command){this._buffer.push(command);
this._bi=this._buffer.length
},initialize:function(doc){},destroy:function(){removeEvent(this.element,"keydown",this.onKeyDown);
window.onerror=null;
this.element=null
},execute:function(){var cmd=this.element;
var command=cmd.value;
this._stack(command);
Firebug.Console.writeMessage(["<span>&gt;&gt;&gt;</span> ",escapeHTML(command)],"command");
try{var result=this.evaluate(command);
if(result!=Console.LOG_COMMAND){var html=[];
Firebug.Reps.appendObject(result,html);
Firebug.Console.writeMessage(html,"command")
}}catch(e){Firebug.Console.writeMessage([e.message||e],"error")
}cmd.value=""
},evaluate:function(expr){var api="Firebug.CommandLine.API";
return Firebug.context.evaluate(expr,"window",api,Console.error)
},prevCommand:function(){var cmd=this.element;
var buffer=this._buffer;
if(this._bi>0&&buffer.length>0){cmd.value=buffer[--this._bi]
}},nextCommand:function(){var cmd=this.element;
var buffer=this._buffer;
var limit=buffer.length-1;
var i=this._bi;
if(i<limit){cmd.value=buffer[++this._bi]
}else{if(i==limit){++this._bi;
cmd.value=""
}}},autocomplete:function(reverse){var cmd=this.element;
var command=cmd.value;
var offset=getExpressionOffset(command);
var valBegin=offset?command.substr(0,offset):"";
var val=command.substr(offset);
var buffer,obj,objName,commandBegin,result,prefix;
if(!this._completing){var reObj=/(.*[^_$\w\d\.])?((?:[_$\w][_$\w\d]*\.)*)([_$\w][_$\w\d]*)?$/;
var r=reObj.exec(val);
if(r[1]||r[2]||r[3]){commandBegin=r[1]||"";
objName=r[2]||"";
prefix=r[3]||""
}else{if(val==""){commandBegin=objName=prefix=""
}else{return
}}this._completing=true;
if(objName==""){obj=window
}else{objName=objName.replace(/\.$/,"");
var n=objName.split(".");
var target=window,o;
for(var i=0,ni;
ni=n[i];
i++){if(o=target[ni]){target=o
}else{target=null;
break
}}obj=target
}if(obj){this._completePrefix=prefix;
this._completeExpr=valBegin+commandBegin+(objName?objName+".":"");
this._ci=-1;
buffer=this._completeBuffer=isIE?this._completion[objName||"window"]||[]:[];
for(var p in obj){buffer.push(p)
}}}else{buffer=this._completeBuffer
}if(buffer){prefix=this._completePrefix;
var diff=reverse?-1:1;
for(var i=this._ci+diff,l=buffer.length,bi;
i>=0&&i<l;
i+=diff){bi=buffer[i];
if(bi.indexOf(prefix)==0){this._ci=i;
result=bi;
break
}}}if(result){cmd.value=this._completeExpr+result
}},onError:function(msg,href,lineNo){var html=[];
var lastSlash=href.lastIndexOf("/");
var fileName=lastSlash==-1?href:href.substr(lastSlash+1);
html.push('<span class="errorMessage">',msg,"</span>",'<div class="objectBox-sourceLink">',fileName," (line ",lineNo,")</div>");
Firebug.Console.writeRow(html,"error")
},clear:function(){this.element.value=""
},onKeyDown:function(e){e=e||event;
var code=e.keyCode;
if(code!=9&&code!=16&&code!=17&&code!=18){this._completing=false
}if(code==13){this.execute()
}else{if(code==27){setTimeout(this.clear,0)
}else{if(code==38){this.prevCommand()
}else{if(code==40){this.nextCommand()
}else{if(code==9){this.autocomplete(e.shiftKey)
}else{return
}}}}}cancelEvent(e,true);
return false
}};
var reOpenBracket=/[\[\(\{]/;
var reCloseBracket=/[\]\)\}]/;
function getExpressionOffset(command){var bracketCount=0;
var start=command.length-1;
for(;
start>=0;
--start){var c=command[start];
if((c==","||c==";"||c==" ")&&!bracketCount){break
}if(reOpenBracket.test(c)){if(bracketCount){--bracketCount
}else{break
}}else{if(reCloseBracket.test(c)){++bracketCount
}}}return start+1
}var CommandLineAPI={$:function(id){return Firebug.browser.document.getElementById(id)
},$$:function(selector,context){context=context||Firebug.browser.document;
return Firebug.Selector(selector,context)
},dir:Firebug.Console.dir,dirxml:Firebug.Console.dirxml};
Firebug.CommandLine.API={};
var initializeCommandLineAPI=function initializeCommandLineAPI(){for(var m in CommandLineAPI){if(!Firebug.browser.window[m]){Firebug.CommandLine.API[m]=CommandLineAPI[m]
}}}
}});
FBL.ns(function(){with(FBL){Firebug.HTML=extend(Firebug.Module,{appendTreeNode:function(nodeArray,html){var reTrim=/^\s+|\s+$/g;
if(!nodeArray.length){nodeArray=[nodeArray]
}for(var n=0,node;
node=nodeArray[n];
n++){if(node.nodeType==1){var uid=node[cacheID];
var child=node.childNodes;
var childLength=child.length;
var nodeName=node.nodeName.toLowerCase();
var nodeVisible=node.style.visibility!="hidden"&&node.style.display!="none";
var hasSingleTextChild=childLength==1&&node.firstChild.nodeType==3&&nodeName!="script"&&nodeName!="style";
var nodeControl=!hasSingleTextChild&&childLength>0?('<div class="nodeControl"></div>'):"";
var isIE=false;
if(isIE&&nodeControl){html.push(nodeControl)
}if(typeof uid!="undefined"){html.push('<div class="objectBox-element" ','id="',uid,'">',!isIE&&nodeControl?nodeControl:"","<span ",cacheID,'="',uid,'"  class="nodeBox',nodeVisible?"":" nodeHidden",'">&lt;<span class="nodeTag">',nodeName,"</span>")
}else{html.push('<div class="objectBox-element"><span class="nodeBox">&lt;<span class="nodeTag">',nodeName,"</span>")
}for(var i=0;
i<node.attributes.length;
++i){var attr=node.attributes[i];
if(!attr.specified||attr.nodeName==cacheID){continue
}html.push('&nbsp;<span class="nodeName">',attr.nodeName.toLowerCase(),'</span>=&quot;<span class="nodeValue">',escapeHTML(attr.nodeValue),"</span>&quot;")
}if(hasSingleTextChild){var value=child[0].nodeValue.replace(reTrim,"");
if(value){html.push('&gt;<span class="nodeText">',escapeHTML(value),'</span>&lt;/<span class="nodeTag">',nodeName,"</span>&gt;</span></div>")
}else{html.push("/&gt;</span></div>")
}}else{if(childLength>0){html.push("&gt;</span></div>")
}else{html.push("/&gt;</span></div>")
}}}else{if(node.nodeType==3){if(node.parentNode&&(node.parentNode.nodeName.toLowerCase()=="script"||node.parentNode.nodeName.toLowerCase()=="style")){var value=node.nodeValue.replace(reTrim,"");
if(document.all){var src=value+"\n"
}else{var src="\n"+value+"\n"
}var match=src.match(/\n/g);
var num=match?match.length:0;
var s=[],sl=0;
for(var c=1;
c<num;
c++){s[sl++]='<div line="'+c+'">'+c+"</div>"
}html.push('<div class="nodeGroup"><div class="nodeChildren"><div class="lineNo">',s.join(""),'</div><pre class="nodeCode">',escapeHTML(src),"</pre>","</div></div>")
}else{var value=node.nodeValue.replace(reTrim,"");
if(value){html.push('<div class="nodeText">',escapeHTML(value),"</div>")
}}}}}},appendTreeChildren:function(treeNode){var doc=Firebug.chrome.document;
var uid=treeNode.id;
var parentNode=documentCache[uid];
if(parentNode.childNodes.length==0){return
}var treeNext=treeNode.nextSibling;
var treeParent=treeNode.parentNode;
var isIE=false;
var control=isIE?treeNode.previousSibling:treeNode.firstChild;
control.className="nodeControl nodeMaximized";
var html=[];
var children=doc.createElement("div");
children.className="nodeChildren";
this.appendTreeNode(parentNode.childNodes,html);
children.innerHTML=html.join("");
treeParent.insertBefore(children,treeNext);
var closeElement=doc.createElement("div");
closeElement.className="objectBox-element";
closeElement.innerHTML='&lt;/<span class="nodeTag">'+parentNode.nodeName.toLowerCase()+"&gt;</span>";
treeParent.insertBefore(closeElement,treeNext)
},removeTreeChildren:function(treeNode){var children=treeNode.nextSibling;
var closeTag=children.nextSibling;
var isIE=false;
var control=isIE?treeNode.previousSibling:treeNode.firstChild;
control.className="nodeControl";
children.parentNode.removeChild(children);
closeTag.parentNode.removeChild(closeTag)
},isTreeNodeVisible:function(id){return $(id)
},selectTreeNode:function(id){id=""+id;
var node,stack=[];
while(id&&!this.isTreeNodeVisible(id)){stack.push(id);
var node=documentCache[id].parentNode;
if(node&&typeof node[cacheID]!="undefined"){id=""+node[cacheID]
}else{break
}}stack.push(id);
while(stack.length>0){id=stack.pop();
node=$(id);
if(stack.length>0&&documentCache[id].childNodes.length>0){this.appendTreeChildren(node)
}}selectElement(node);
fbPanel1.scrollTop=Math.round(node.offsetTop-fbPanel1.clientHeight/2)
}});
Firebug.registerModule(Firebug.HTML);
function HTMLPanel(){}HTMLPanel.prototype=extend(Firebug.Panel,{name:"HTML",title:"HTML",options:{hasSidePanel:true,isPreRendered:true},create:function(){Firebug.Panel.create.apply(this,arguments);
this.panelNode.style.padding="4px 3px 1px 15px";
if(Application.isPersistentMode||Firebug.chrome.type!="popup"){this.createUI()
}},createUI:function(){var rootNode=Firebug.browser.document.documentElement;
var html=[];
Firebug.HTML.appendTreeNode(rootNode,html);
var d=this.contentNode;
d.innerHTML=html.join("");
this.panelNode.appendChild(d)
},initialize:function(){Firebug.Panel.initialize.apply(this,arguments);
addEvent(this.panelNode,"click",Firebug.HTML.onTreeClick);
fbPanel1=$("fbPanel1")
},shutdown:function(){removeEvent(this.panelNode,"click",Firebug.HTML.onTreeClick);
fbPanel1=null;
Firebug.Panel.shutdown.apply(this,arguments)
}});
Firebug.registerPanel(HTMLPanel);
var selectedElement=null;
var fbPanel1=null;
var selectElement=function selectElement(e){if(e!=selectedElement){if(selectedElement){selectedElement.className="objectBox-element"
}e.className=e.className+" selectedElement";
if(FBL.isFirefox){e.style.MozBorderRadius="2px"
}else{if(FBL.isSafari){e.style.WebkitBorderRadius="2px"
}}selectedElement=e;
FirebugChrome.selectedElement=e.id
}};
Firebug.HTML.onTreeClick=function(e){e=e||event;
var targ;
if(e.target){targ=e.target
}else{if(e.srcElement){targ=e.srcElement
}}if(targ.nodeType==3){targ=targ.parentNode
}if(targ.className.indexOf("nodeControl")!=-1||targ.className=="nodeTag"){var isIE=false;
if(targ.className=="nodeTag"){var control=isIE?(targ.parentNode.previousSibling||targ):(targ.parentNode.previousSibling||targ);
selectElement(targ.parentNode.parentNode);
if(control.className.indexOf("nodeControl")==-1){return
}}else{control=targ
}FBL.cancelEvent(e);
var treeNode=isIE?control.nextSibling:control.parentNode;
if(control.className.indexOf(" nodeMaximized")!=-1){FBL.Firebug.HTML.removeTreeChildren(treeNode)
}else{FBL.Firebug.HTML.appendTreeChildren(treeNode)
}}else{if(targ.className=="nodeValue"||targ.className=="nodeName"){var input=FBL.Firebug.chrome.document.getElementById("treeInput");
input.style.display="block";
input.style.left=targ.offsetLeft+"px";
input.style.top=FBL.topHeight+targ.offsetTop-FBL.fbPanel1.scrollTop+"px";
input.style.width=targ.offsetWidth+6+"px";
input.value=targ.textContent||targ.innerText;
input.focus()
}}};
var OLD_chromeLoad=function OLD_chromeLoad(doc){Firebug.Inspector.onChromeReady();
var rootNode=document.documentElement;
addEvent(fbConsole,"mousemove",onListMouseMove);
addEvent(fbConsole,"mouseout",onListMouseOut);
addEvent(fbHTML,"click",Firebug.HTML.onTreeClick);
addEvent(fbHTML,"mousemove",onListMouseMove);
addEvent(fbHTML,"mouseout",onListMouseOut)
};
function onListMouseOut(e){e=e||event||window;
var targ;
if(e.target){targ=e.target
}else{if(e.srcElement){targ=e.srcElement
}}if(targ.nodeType==3){targ=targ.parentNode
}if(hasClass(targ,"fbPanel")){FBL.Firebug.Inspector.hideBoxModel();
hoverElement=null
}}var hoverElement=null;
var hoverElementTS=0;
Firebug.HTML.onListMouseMove=function onListMouseMove(e){try{e=e||event||window;
var targ;
if(e.target){targ=e.target
}else{if(e.srcElement){targ=e.srcElement
}}if(targ.nodeType==3){targ=targ.parentNode
}var found=false;
while(targ&&!found){if(!/\snodeBox\s|\sobjectBox-selector\s/.test(" "+targ.className+" ")){targ=targ.parentNode
}else{found=true
}}if(!targ){FBL.Firebug.Inspector.hideBoxModel();
hoverElement=null;
return
}if(typeof targ.attributes[FBL.cacheID]=="undefined"){return
}var uid=targ.attributes[FBL.cacheID];
if(!uid){return
}var el=FBL.documentCache[uid.value];
var nodeName=el.nodeName.toLowerCase();
if(FBL.isIE&&" meta title script link ".indexOf(" "+nodeName+" ")!=-1){return
}if(!/\snodeBox\s|\sobjectBox-selector\s/.test(" "+targ.className+" ")){return
}if(el.id=="FirebugChrome"||" html head body br script link iframe ".indexOf(" "+nodeName+" ")!=-1){FBL.Firebug.Inspector.hideBoxModel();
hoverElement=null;
return
}if((new Date().getTime()-hoverElementTS>40)&&hoverElement!=el){hoverElementTS=new Date().getTime();
hoverElement=el;
FBL.Firebug.Inspector.drawBoxModel(el)
}}catch(E){}}
}});
FBL.ns(function(){with(FBL){var insertSliceSize=18;
var insertInterval=40;
var ignoreVars={__firebug__:1,"eval":1,java:1,sun:1,Packages:1,JavaArray:1,JavaMember:1,JavaObject:1,JavaClass:1,JavaPackage:1,_firebug:1,_FirebugConsole:1,_FirebugCommandLine:1};
var RowTag=TR({"class":"memberRow $member.open $member.type\\Row",$hasChildren:"$member.hasChildren",role:"presentation",level:"$member.level"},TD({"class":"memberLabelCell",style:"padding-left: $member.indent\\px",role:"presentation"},DIV({"class":"memberLabel $member.type\\Label"},SPAN({},"$member.name"))),TD({"class":"memberValueCell",role:"presentation"},TAG("$member.tag",{object:"$member.value"})));
var $STR=function(){};
var WatchRowTag=TR({"class":"watchNewRow",level:0},TD({"class":"watchEditCell",colspan:2},DIV({"class":"watchEditBox a11yFocusNoTab",role:"button",tabindex:"0","aria-label":$STR("press enter to add new watch expression")},$STR("NewWatch"))));
var SizerRow=TR({role:"presentation"},TD({width:"30%"}),TD({width:"70%"}));
Firebug.Rep={};
var DirTablePlate=domplate(Firebug.Rep,{tag:TABLE({"class":"domTable",cellpadding:0,cellspacing:0,onclick:"$onClick",role:"tree"},TBODY({role:"presentation"},SizerRow,FOR("member","$object|memberIterator",RowTag))),watchTag:TABLE({"class":"domTable",cellpadding:0,cellspacing:0,_toggles:"$toggles",_domPanel:"$domPanel",onclick:"$onClick",role:"tree"},TBODY({role:"presentation"},SizerRow,WatchRowTag)),tableTag:TABLE({"class":"domTable",cellpadding:0,cellspacing:0,_toggles:"$toggles",_domPanel:"$domPanel",onclick:"$onClick",role:"tree"},TBODY({role:"presentation"},SizerRow)),rowTag:FOR("member","$members",RowTag),memberIterator:function(object,level){return getMembers(object,level)
},onClick:function(event){if(!isLeftClick(event)){return
}var target=event.target||event.srcElement;
var row=getAncestorByClass(target,"memberRow");
var label=getAncestorByClass(target,"memberLabel");
if(label&&hasClass(row,"hasChildren")){var row=label.parentNode.parentNode;
this.toggleRow(row)
}else{var object=Firebug.getRepObject(target);
if(typeof(object)=="function"){Firebug.chrome.select(object,"script");
cancelEvent(event)
}else{if(event.detail==2&&!object){var panel=row.parentNode.parentNode.domPanel;
if(panel){var rowValue=panel.getRowPropertyValue(row);
if(typeof(rowValue)=="boolean"){panel.setPropertyValue(row,!rowValue)
}else{panel.editProperty(row)
}cancelEvent(event)
}}}}},toggleRow:function(row){var level=parseInt(row.getAttribute("level"));
var toggles=row.parentNode.parentNode.toggles;
if(hasClass(row,"opened")){removeClass(row,"opened");
if(toggles){var path=getPath(row);
for(var i=0;
i<path.length;
++i){if(i==path.length-1){delete toggles[path[i]]
}else{toggles=toggles[path[i]]
}}}var rowTag=this.rowTag;
var tbody=row.parentNode;
setTimeout(function(){for(var firstRow=row.nextSibling;
firstRow;
firstRow=row.nextSibling){if(parseInt(firstRow.getAttribute("level"))<=level){break
}tbody.removeChild(firstRow)
}},row.insertTimeout?row.insertTimeout:0)
}else{setClass(row,"opened");
if(toggles){var path=getPath(row);
for(var i=0;
i<path.length;
++i){var name=path[i];
if(toggles.hasOwnProperty(name)){toggles=toggles[name]
}else{toggles=toggles[name]={}
}}}var value=row.lastChild.firstChild.repObject;
var members=getMembers(value,level+1);
var rowTag=this.rowTag;
var lastRow=row;
var delay=0;
var setSize=members.length;
var rowCount=1;
while(members.length){with({slice:members.splice(0,insertSliceSize),isLast:!members.length}){setTimeout(function(){if(lastRow.parentNode){var result=rowTag.insertRows({members:slice},lastRow);
lastRow=result[1];
rowCount+=insertSliceSize
}if(isLast){delete row.insertTimeout
}},delay)
}delay+=insertInterval
}row.insertTimeout=delay
}}});
var getMembers=function getMembers(object,level){if(!level){level=0
}var ordinals=[],userProps=[],userClasses=[],userFuncs=[],domProps=[],domFuncs=[],domConstants=[];
try{var domMembers=getDOMMembers(object);
if(object.wrappedJSObject){var insecureObject=object.wrappedJSObject
}else{var insecureObject=object
}if(isIE&&typeof object=="function"){addMember("user",userProps,"prototype",object.prototype,level)
}for(var name in insecureObject){if(ignoreVars[name]==1){continue
}var val;
try{val=insecureObject[name]
}catch(exc){if(FBTrace.DBG_ERRORS&&FBTrace.DBG_DOM){FBTrace.sysout("dom.getMembers cannot access "+name,exc)
}}var ordinal=parseInt(name);
if(ordinal||ordinal==0){addMember("ordinal",ordinals,name,val,level)
}else{if(typeof(val)=="function"){if(isClassFunction(val)){addMember("userClass",userClasses,name,val,level)
}else{if(name in domMembers){addMember("domFunction",domFuncs,name,val,level,domMembers[name])
}else{addMember("userFunction",userFuncs,name,val,level)
}}}else{var prefix="";
if(name in domMembers){addMember("dom",domProps,(prefix+name),val,level,domMembers[name])
}else{if(name in domConstantMap){addMember("dom",domConstants,(prefix+name),val,level)
}else{addMember("user",userProps,(prefix+name),val,level)
}}}}}}catch(exc){throw exc
}function sortName(a,b){return a.name>b.name?1:-1
}function sortOrder(a,b){return a.order>b.order?1:-1
}var members=[];
members.push.apply(members,ordinals);
Firebug.showUserProps=true;
Firebug.showUserFuncs=true;
Firebug.showDOMProps=true;
Firebug.showDOMFuncs=true;
Firebug.showDOMConstants=true;
if(Firebug.showUserProps){userProps.sort(sortName);
members.push.apply(members,userProps)
}if(Firebug.showUserFuncs){userClasses.sort(sortName);
members.push.apply(members,userClasses);
userFuncs.sort(sortName);
members.push.apply(members,userFuncs)
}if(Firebug.showDOMProps){domProps.sort(sortName);
members.push.apply(members,domProps)
}if(Firebug.showDOMFuncs){domFuncs.sort(sortName);
members.push.apply(members,domFuncs)
}if(Firebug.showDOMConstants){members.push.apply(members,domConstants)
}return members
};
function expandMembers(members,toggles,offset,level){var expanded=0;
for(var i=offset;
i<members.length;
++i){var member=members[i];
if(member.level>level){break
}if(toggles.hasOwnProperty(member.name)){member.open="opened";
var newMembers=getMembers(member.value,level+1);
var args=[i+1,0];
args.push.apply(args,newMembers);
members.splice.apply(members,args);
if(FBTrace.DBG_DOM){FBTrace.sysout("expandMembers member.name",member.name);
FBTrace.sysout("expandMembers toggles",toggles);
FBTrace.sysout("expandMembers toggles[member.name]",toggles[member.name]);
FBTrace.sysout("dom.expandedMembers level: "+level+" member",member)
}expanded+=newMembers.length;
i+=newMembers.length+expandMembers(members,toggles[member.name],i+1,level+1)
}}return expanded
}function isClassFunction(fn){try{for(var name in fn.prototype){return true
}}catch(exc){}return false
}function hasProperties(ob){try{for(var name in ob){return true
}}catch(exc){}if(typeof ob=="function"){return true
}return false
}FBL.ErrorCopy=function(message){this.message=message
};
function addMember(type,props,name,value,level,order){var rep=Firebug.getRep(value);
var tag=rep.shortTag?rep.shortTag:rep.tag;
var ErrorCopy=function(){};
var valueType=typeof(value);
var hasChildren=hasProperties(value)&&!(value instanceof ErrorCopy)&&(valueType=="function"||(valueType=="object"&&value!=null)||(valueType=="string"&&value.length>Firebug.stringCropLength));
props.push({name:name,value:value,type:type,rowClass:"memberRow-"+type,open:"",order:order,level:level,indent:level*16,hasChildren:hasChildren,tag:tag})
}function getWatchRowIndex(row){var index=-1;
for(;
row&&hasClass(row,"watchRow");
row=row.previousSibling){++index
}return index
}function getRowName(row){return row.firstChild.textContent
}function getRowValue(row){return row.lastChild.firstChild.repObject
}function getRowOwnerObject(row){var parentRow=getParentRow(row);
if(parentRow){return getRowValue(parentRow)
}}function getParentRow(row){var level=parseInt(row.getAttribute("level"))-1;
for(row=row.previousSibling;
row;
row=row.previousSibling){if(parseInt(row.getAttribute("level"))==level){return row
}}}function getPath(row){var name=getRowName(row);
var path=[name];
var level=parseInt(row.getAttribute("level"))-1;
for(row=row.previousSibling;
row;
row=row.previousSibling){if(parseInt(row.getAttribute("level"))==level){var name=getRowName(row);
path.splice(0,0,name);
--level
}}return path
}Firebug.DOM=extend(Firebug.Module,{getPanel:function(){return Firebug.chrome?Firebug.chrome.getPanel("DOM"):null
}});
Firebug.registerModule(Firebug.DOM);
function DOMPanel(){}DOMPanel.prototype=extend(Firebug.Panel,{name:"DOM",title:"DOM",options:{hasToolButtons:true},create:function(){Firebug.Panel.create.apply(this,arguments);
this.panelNode.style.padding="0 1px";
var target=this.contentNode;
var template=DirTablePlate;
var panel={};
var toggles={};
template.tag.replace({domPanel:panel,toggles:toggles,object:window},target)
},initialize:function(){Firebug.Panel.initialize.apply(this,arguments)
}});
Firebug.registerPanel(DOMPanel)
}});
FBL.ns(function(){with(FBL){if(!Application.isTraceMode){return
}Firebug.Trace=extend(Firebug.Module,{getPanel:function(){return Firebug.chrome?Firebug.chrome.getPanel("Trace"):null
},clear:function(){this.getPanel().contentNode.innerHTML=""
}});
Firebug.registerModule(Firebug.Trace);
function TracePanel(){}TracePanel.prototype=extend(Firebug.Panel,{name:"Trace",title:"Trace",options:{hasToolButtons:true},create:function(){Firebug.Panel.create.apply(this,arguments);
this.clearButton=new Firebug.Button({caption:"Clear",title:"Clear FBTrace logs",module:Firebug.Trace,onClick:Firebug.Trace.clear})
},initialize:function(){Firebug.Panel.initialize.apply(this,arguments);
this.clearButton.initialize()
}});
Firebug.registerPanel(TracePanel)
}});
FBL.initialize();