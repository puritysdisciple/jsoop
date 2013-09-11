(function(){var b=Object.prototype.toString,a={};a.GLOBAL=Function("return this")();a.STRING=1;a.ARRAY=2;a.NUMBER=3;a.OBJECT=4;a.ELEMENT=5;a.BOOL=6;a.FUNCTION=7;a.is=function(d,c){if(a.isString(c)){return a.instanceOf(d,c)}switch(c){case a.BOOL:return a.isBool(d);case a.STRING:return a.isString(d);case a.ARRAY:return a.isArray(d);case a.NUMBER:return a.isNumber(d);case a.OBJECT:return a.isObject(d);case a.ELEMENT:return a.isElement(d);case a.FUNCTION:return a.isFunction(d);default:return false}};a.isString=function(c){return typeof c==="string"};a.isArray=function(c){return b.call(c)==="[object Array]"};a.isBool=function(c){return typeof c==="boolean"};a.isNumber=function(c){return typeof c==="number"};a.isObject=function(c){return c instanceof Object&&c.constructor===Object};a.isElement=function(c){return c?c.nodeType===1:false};a.isPrimative=function(d){var c=typeof d;return c==="string"||c==="number"||c==="boolean"};a.isFunction=function(c){return b.call(c)==="[object Function]"};a.instanceOf=function(d,c){if(a.isString(c)){c=a.objectQuery(c)}return d instanceof c};a.iterate=function(e,d){if(!a.isObject(e)){return false}var c;for(c in e){if(e.hasOwnProperty(c)){if(d(e[c],c,e)===false){return false}}}return true};a.each=function(c,e){if(!a.isArray(c)){return e(c,0,[c])}var d,f;for(d=0,f=c.length;d<f;d=d+1){if(e(c[d],d,c)===false){return false}}return true};a.apply=function(e,d){var c;for(c in d){if(d.hasOwnProperty(c)){e[c]=d[c]}}};a.applyIf=function(e,d){var c;for(c in d){if(d.hasOwnProperty(c)){if(!e.hasOwnProperty(c)){e[c]=d[c]}}}};a.namespace=function(g){var f=g.split("."),e=a.GLOBAL,c,d;for(c=0,d=f.length;c<d;c=c+1){if(e[f[c]]===undefined){e[f[c]]={}}e=e[f[c]]}return e};a.objectQuery=function(g,c){var f=g.split("."),d,e;c=c||a.GLOBAL;for(d=0,e=f.length;d<e;d=d+1){if(c[f[d]]===undefined){return undefined}c=c[f[d]]}return c};a.emptyFn=function(){};a.GLOBAL.JSoop=a}());(function(){JSoop.error=function(b){var a=arguments,c=this.error.caller;if(JSoop.isString(b)){b={level:"error",msg:b,stack:true}}if(c){if(c.$name){b.sourceMethod=c.$name}if(c.$owner){b.sourceClass=c.$owner.$className}}if(JSoop.throwErrors!==false){JSoop.log(b)}throw b.msg}}());(function(){var b=JSoop.Base=function(){},c=function(){},a=Object.create||function(e){var d;c.prototype=e;d=new c();c.prototype=null;return d};b.prototype={$className:"JSoop.Base",$class:b,$isClass:true,initConfig:function(d){var e=this;if(e.defaults){JSoop.applyIf(d||{},JSoop.clone(e.defaults))}JSoop.apply(e,d)},constructor:function(d){var e=this;e.initConfig(d||{});e.init();return e},init:JSoop.emptyFn,addMember:function(d,f){var e=this;if(JSoop.isFunction(f)){e.prototype.addMethod.call(e,d,f)}else{e.prototype.addProperty.call(e,d,f)}},addMethod:function(d,f){var e=this;f.$owner=e;f.$name=d;e.prototype[d]=f},addProperty:function(d,e){this.prototype[d]=e},alias:function(g,e){var f=this,d=f.prototype;if(JSoop.isString(e)){e={name:e}}JSoop.applyIf(e,{root:d});if(JSoop.isString(e.root)){e.root=JSoop.objectQuery(e.root)}e.root[e.name]=d[g]},extend:function(e){if(JSoop.isString(e)){e=JSoop.objectQuery(e)}var d=this;d.prototype=a(e.prototype);d.superClass=e}}}());(function(){JSoop.Base.prototype.callParent=function(c){var e=this,b=arguments,g=e.callParent.caller,a,f,d;if(g!==null&&!g.$owner){if(!g.caller){JSoop.error("Unable to locate method for callParent to execute.")}g=g.caller}if(!g.$owner){JSoop.error("Unable to resolve method for callParent. Make sure all methods are added using JSoop.define.")}a=g.$name;f=g.$owner.superClass;d=f;do{if(d.prototype.hasOwnProperty(a)){break}d=d.superClass}while(d);if(!d){JSoop.error('No parent method "'+a+'" was found in '+f.prototype.$className+".")}return f.prototype[a].apply(this,c||[])}}());(function(){var c=function(){function f(){return this.constructor.apply(this,arguments)||null}return f},d={},b={},e=JSoop.Base.prototype,a=JSoop.ClassManager={};JSoop.apply(a,{processors:{},create:function(i,g,l){if(b[i]){return}JSoop.applyIf(g,{extend:"JSoop.Base"});var j=this,k=c(),f=[],h;e.extend.call(k,g.extend);k.prototype.$className=i;for(h in g){if(g.hasOwnProperty(h)){if(!a.processors.hasOwnProperty(h)){e.addMember.call(k,h,g[h])}else{f.push(h)}}}g.onCreate=l||JSoop.emptyFn;j.initProcessors(f,g);j.process.call(a,i,k,g,a.process)},initProcessors:function(f,g){JSoop.each(f,function(i,h){f[h]=a.processors[i]});g.processors=f},process:function(i,f,g,k){var j=this,h=g.processors.shift();if(!h){j.set(i,f);g.onCreate(f);return}if(h.call(a,i,f,g,k)!==false){k.call(a,i,f,g,k)}},set:function(h,f){b[h]=f;var g=h.split(".");h=g.pop();if(g.length>0){g=JSoop.namespace(g.join("."))}else{g=JSoop.GLOBAL}g[h]=f},getInstantiator:function(j){var h=this,f,g;h.instantiators=h.instantiators||[];if(j>3){}if(!h.instantiators[j]){f=[];for(g=0;g<j;g=g+1){f.push("a["+g+"]")}h.instantiators[j]=new Function("c","a","return new c("+f.join(",")+");")}return h.instantiators[j]},instantiate:function(){var i=this,g=Array.prototype.slice.call(arguments,0),h=g.shift(),f=b[h];return i.getInstantiator(g.length)(f,g)}});JSoop.apply(a.processors,{extend:function(){},aliases:function(i,f,g,j){var h;if(!g.aliases){g.aliases={}}for(h in g.aliases){if(g.aliases.hasOwnProperty(h)){e.alias.call(f,h,g.aliases[h])}}},mixins:function(h,f,g,i){if(!g.mixins){g.mixins=[]}JSoop.each(g.mixins,function(j){if(JSoop.isString(j)){j=JSoop.objectQuery(j)}var k;for(k in j.prototype){if(j.prototype.hasOwnProperty(k)){f.prototype[k]=j.prototype[k]}}})},singleton:function(h,f,g,i){if(!g.singleton){return true}i.call(a,h,new f(),g,i);return false},statics:function(h,f,g,i){if(!g.statics){g.statics={}}JSoop.iterate(g.statics,function(k,j){f[j]=k})}});JSoop.define=function(){a.create.apply(a,arguments)};JSoop.create=function(){return a.instantiate.apply(a,arguments)}}());