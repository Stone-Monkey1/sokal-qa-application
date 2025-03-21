(function(){"use strict";var e={9972:function(e,t,s){var o=s(5130),n=s(6768);const l={id:"QA_TOOL"},i={class:"container"};function r(e,t,s,r,a,c){const u=(0,n.g2)("QAHeader"),d=(0,n.g2)("QAToDo"),p=(0,n.g2)("QAForm"),h=(0,n.g2)("QALoading"),g=(0,n.g2)("QAResults");return(0,n.uX)(),(0,n.CE)("div",l,[(0,n.bF)(u,{onToggleTodo:c.toggleToDo},null,8,["onToggleTodo"]),(0,n.bF)(o.eB,{name:"slide"},{default:(0,n.k6)((()=>[a.showToDo?((0,n.uX)(),(0,n.CE)("div",{key:0,class:"to-do-panel",onClick:t[1]||(t[1]=(0,o.D$)((()=>{}),["stop"]))},[(0,n.Lk)("button",{class:"close-btn",onClick:t[0]||(t[0]=(...e)=>c.toggleToDo&&c.toggleToDo(...e))},"✖ Close"),(0,n.bF)(d)])):(0,n.Q3)("",!0)])),_:1}),(0,n.Lk)("div",i,[(0,n.bF)(p,{onRunTests:c.runTests,onTestsStarted:t[2]||(t[2]=e=>a.loading=!0),onTestsCompleted:t[3]||(t[3]=e=>a.loading=!1)},null,8,["onRunTests"]),(0,n.bF)(h,{visible:a.loading},null,8,["visible"]),a.results?((0,n.uX)(),(0,n.Wv)(g,{key:0,results:a.results},null,8,["results"])):(0,n.Q3)("",!0)])])}const a={class:"qa-form"},c={class:"padding-5-percent"},u={class:"flex-column test-checklist"};function d(e,t,s,l,i,r){return(0,n.uX)(),(0,n.CE)("div",a,[t[27]||(t[27]=(0,n.Lk)("div",{class:"padding-2-percent"},[(0,n.Lk)("a",{href:"https://stone-monkey1.github.io/sokal-qa-playground/"},"https://stone-monkey1.github.io/sokal-qa-playground/")],-1)),(0,n.Lk)("div",c,[t[22]||(t[22]=(0,n.Lk)("label",{for:"url"},"Website Homepage URL:",-1)),(0,n.bo)((0,n.Lk)("input",{class:"website-url",type:"text","onUpdate:modelValue":t[0]||(t[0]=e=>i.url=e),placeholder:"https://gosokal.com"},null,512),[[o.Jo,i.url]]),t[23]||(t[23]=(0,n.Lk)("div",{class:"padding-1"},null,-1)),t[24]||(t[24]=(0,n.Lk)("h3",null,"Select Tests:",-1)),t[25]||(t[25]=(0,n.Lk)("div",{class:"padding-quarter"},null,-1)),(0,n.Lk)("div",u,[(0,n.Lk)("label",null,[(0,n.bo)((0,n.Lk)("input",{type:"checkbox",value:"navbarTitleCheckTest","onUpdate:modelValue":t[1]||(t[1]=e=>i.selectedTests=e)},null,512),[[o.lH,i.selectedTests]]),t[12]||(t[12]=(0,n.eW)(" Navbar Title Check "))]),(0,n.Lk)("label",null,[(0,n.bo)((0,n.Lk)("input",{type:"checkbox",value:"navbarH1CheckTest","onUpdate:modelValue":t[2]||(t[2]=e=>i.selectedTests=e)},null,512),[[o.lH,i.selectedTests]]),t[13]||(t[13]=(0,n.eW)(" H1 Check "))]),(0,n.Lk)("label",null,[(0,n.bo)((0,n.Lk)("input",{type:"checkbox",value:"navbarImgAltTagTest","onUpdate:modelValue":t[3]||(t[3]=e=>i.selectedTests=e)},null,512),[[o.lH,i.selectedTests]]),t[14]||(t[14]=(0,n.eW)(" Alt Tags "))]),(0,n.Lk)("label",null,[(0,n.bo)((0,n.Lk)("input",{type:"checkbox",value:"navbarImgResponsiveTest","onUpdate:modelValue":t[4]||(t[4]=e=>i.selectedTests=e)},null,512),[[o.lH,i.selectedTests]]),t[15]||(t[15]=(0,n.eW)(" Img Responsive "))]),(0,n.Lk)("label",null,[(0,n.bo)((0,n.Lk)("input",{type:"checkbox",value:"navbarSpellCheckTest","onUpdate:modelValue":t[5]||(t[5]=e=>i.selectedTests=e)},null,512),[[o.lH,i.selectedTests]]),t[16]||(t[16]=(0,n.eW)(" Spell Check "))]),(0,n.Lk)("label",null,[(0,n.bo)((0,n.Lk)("input",{type:"checkbox",value:"navbarCheckVideo","onUpdate:modelValue":t[6]||(t[6]=e=>i.selectedTests=e)},null,512),[[o.lH,i.selectedTests]]),t[17]||(t[17]=(0,n.eW)(" Check for Videos "))]),(0,n.Lk)("label",null,[(0,n.bo)((0,n.Lk)("input",{type:"checkbox",value:"homepageTabbedSearchFilterTest","onUpdate:modelValue":t[7]||(t[7]=e=>i.selectedTests=e)},null,512),[[o.lH,i.selectedTests]]),t[18]||(t[18]=(0,n.eW)(" Check for 7.09% Excellent Credit tooltip "))]),(0,n.Lk)("label",null,[(0,n.bo)((0,n.Lk)("input",{type:"checkbox",value:"homepageQuickLinksTest","onUpdate:modelValue":t[8]||(t[8]=e=>i.selectedTests=e)},null,512),[[o.lH,i.selectedTests]]),t[19]||(t[19]=(0,n.eW)(" Check Homepage Quick Links "))]),(0,n.Lk)("label",null,[(0,n.bo)((0,n.Lk)("input",{type:"checkbox",value:"homepageVehicleCarouselTest","onUpdate:modelValue":t[9]||(t[9]=e=>i.selectedTests=e)},null,512),[[o.lH,i.selectedTests]]),t[20]||(t[20]=(0,n.eW)(" Vehicle Carousel "))]),(0,n.Lk)("label",null,[(0,n.bo)((0,n.Lk)("input",{type:"checkbox",value:"homepageInteractionBarTest","onUpdate:modelValue":t[10]||(t[10]=e=>i.selectedTests=e)},null,512),[[o.lH,i.selectedTests]]),t[21]||(t[21]=(0,n.eW)(" Interaction Bar "))])]),t[26]||(t[26]=(0,n.Lk)("div",{class:"padding-1"},null,-1)),(0,n.Lk)("button",{onClick:t[11]||(t[11]=(...e)=>r.emitRunTests&&r.emitRunTests(...e))},"Run Tests")])])}var p={data(){return{url:"",selectedTests:[]}},methods:{emitRunTests(){this.$emit("tests-started"),this.$emit("run-tests",{url:this.url,selectedTests:this.selectedTests})}}},h=s(1241);const g=(0,h.A)(p,[["render",d]]);var k=g,v=s(4232);const b={class:"header padding-5-percent background-grey"},f={class:"header-left"},m=["src"],y={class:"header-right"};function T(e,t,l,i,r,a){return(0,n.uX)(),(0,n.CE)("div",b,[(0,n.Lk)("div",f,[(0,n.Lk)("button",{class:"update-btn",onClick:t[0]||(t[0]=(...e)=>a.checkForUpdates&&a.checkForUpdates(...e))}," Check for Updates "),(0,n.Lk)("p",null,(0,v.v_)(r.appVersion),1),(0,n.Lk)("h1",null,[(0,n.Lk)("img",{class:"img-responsive",src:s(6742),alt:"Sokal Logo"},null,8,m),t[2]||(t[2]=(0,n.eW)(" QA Testing Tool "))])]),(0,n.Lk)("div",y,[(0,n.Lk)("button",{class:"todo-toggle-btn",onClick:t[1]||(t[1]=(0,o.D$)((t=>e.$emit("toggle-todo")),["stop"]))},t[3]||(t[3]=[(0,n.Lk)("svg",{xmlns:"http://www.w3.org/2000/svg",width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":"2","stroke-linecap":"round","stroke-linejoin":"round"},[(0,n.Lk)("path",{d:"M16 2h4a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h4"}),(0,n.Lk)("rect",{x:"9",y:"2",width:"6",height:"4",rx:"1"})],-1)]))])])}var C={name:"QAHeader",data(){return{appVersion:"Loading..."}},async created(){if(window.require)try{const{ipcRenderer:e}=window.require("electron");this.appVersion=`v${await e.invoke("get-app-version")}`}catch(e){console.error("Failed to fetch app version:",e)}else console.warn("Electron not detected. Running in browser mode.")},methods:{async checkForUpdates(){if(window.require)try{const{ipcRenderer:e}=window.require("electron");await e.invoke("check-for-updates")}catch(e){console.error("Failed to check for updates:",e)}else console.warn("Electron not detected. Running in browser mode.")}}};const L=(0,h.A)(C,[["render",T]]);var w=L;const A={class:"results"},x={class:"results-buttons flex-row"},E={key:0},O=["onClick"],X=["href"],F={key:1,class:"accordion-header no-toggle"},V=["href"],j={key:2,class:"accordion-content"},H={key:0},Q={key:0},R={class:"flex-li--key"},D={class:"flex-li--value"},U={key:0},_={key:1},I={key:1},S={key:1,class:"no-issues"},W={key:1};function q(e,t,s,o,l,i){return(0,n.uX)(),(0,n.CE)("div",A,[t[2]||(t[2]=(0,n.Lk)("h2",null,"Results:",-1)),(0,n.Lk)("div",x,[(0,n.Lk)("button",{onClick:t[0]||(t[0]=(...e)=>i.copyToClipboard&&i.copyToClipboard(...e)),class:"copy-btn results-btn flex-column"}," Copy JSON "),(0,n.Lk)("button",{onClick:t[1]||(t[1]=(...e)=>i.toggleAllAccordions&&i.toggleAllAccordions(...e)),class:"accordion-open-button results-btn"},(0,v.v_)(i.allAccordionsOpen?"Close All":"Open All"),1)]),Object.keys(s.results).length?((0,n.uX)(),(0,n.CE)("div",E,[((0,n.uX)(!0),(0,n.CE)(n.FK,null,(0,n.pI)(s.results,((e,t)=>((0,n.uX)(),(0,n.CE)("div",{key:t,class:"accordion"},[i.hasIssues(e)?((0,n.uX)(),(0,n.CE)("button",{key:0,onClick:e=>i.toggleAccordion(t),class:"accordion-header"},[(0,n.Lk)("a",{href:t,target:"_blank"},(0,v.v_)(t),9,X),(0,n.Lk)("span",{class:(0,v.C4)(["arrow",{open:l.openAccordions.includes(t)}])},"▼",2)],8,O)):((0,n.uX)(),(0,n.CE)("div",F,[(0,n.Lk)("a",{href:t,target:"_blank"},(0,v.v_)(t),9,V)])),l.openAccordions.includes(t)||!i.hasIssues(e)?((0,n.uX)(),(0,n.CE)("div",j,[Object.keys(e).length?((0,n.uX)(),(0,n.CE)("div",H,[((0,n.uX)(!0),(0,n.CE)(n.FK,null,(0,n.pI)(e,((e,t)=>((0,n.uX)(),(0,n.CE)("div",{key:t,class:"test-result"},[(0,n.Lk)("h4",null,(0,v.v_)(t),1),"object"===typeof e&&null!==e?((0,n.uX)(),(0,n.CE)("ul",Q,[((0,n.uX)(!0),(0,n.CE)(n.FK,null,(0,n.pI)(e,((e,t)=>((0,n.uX)(),(0,n.CE)("li",{class:"flex-li",key:t},[(0,n.Lk)("div",R,["h1TextContentList"===t?((0,n.uX)(),(0,n.CE)("strong",{key:0,class:(0,v.C4)(i.getClassForKey(t))},"H1 Tags:",2)):((0,n.uX)(),(0,n.CE)("strong",{key:1,class:(0,v.C4)(i.getClassForKey(t))},(0,v.v_)(t),3))]),(0,n.Lk)("div",D,[Array.isArray(e)?((0,n.uX)(),(0,n.CE)("ul",U,[((0,n.uX)(!0),(0,n.CE)(n.FK,null,(0,n.pI)(e,((e,t)=>((0,n.uX)(),(0,n.CE)("li",{key:t},(0,v.v_)(e),1)))),128))])):((0,n.uX)(),(0,n.CE)("span",_,(0,v.v_)(e),1))])])))),128))])):((0,n.uX)(),(0,n.CE)("p",I,(0,v.v_)(e),1))])))),128))])):((0,n.uX)(),(0,n.CE)("p",S,"No issues found."))])):(0,n.Q3)("",!0)])))),128))])):((0,n.uX)(),(0,n.CE)("p",W,"No results to display."))])}s(4114),s(8111),s(2489),s(1701),s(3579);var P={props:["results"],data(){return{openAccordions:[]}},computed:{rawJson(){return JSON.stringify(this.results,null,2)},allAccordionsOpen(){return this.openAccordions.length===Object.keys(this.results).length}},methods:{async copyToClipboard(){try{await navigator.clipboard.writeText(this.rawJson),alert("Results copied to clipboard!")}catch(e){console.error("Failed to copy:",e),alert("Failed to copy results.")}},toggleAllAccordions(){this.openAccordions.length===Object.keys(this.results).length?this.openAccordions=[]:this.openAccordions=Object.keys(this.results)},toggleAccordion(e){this.openAccordions.includes(e)?this.openAccordions=this.openAccordions.filter((t=>t!==e)):this.openAccordions.push(e)},hasIssues(e){return Object.values(e).some((e=>"object"===typeof e&&null!==e&&Object.values(e).some((e=>"string"===typeof e?!e.toLowerCase().includes("no issues found"):!!Array.isArray(e)&&e.length>0))))},getClassForKey(e){return e.toLowerCase().includes("results")?"success-msg":e.toLowerCase().includes("warning")?"warning-msg":e.toLowerCase().includes("h1textcontentlist")?"warning-instances-msg":e.toLowerCase().includes("resolution")?"resolution-msg":e.toLowerCase().includes("error")?"error-msg":""}},mounted(){this.openAccordions=Object.entries(this.results).filter((([,e])=>!this.hasIssues(e))).map((([e])=>e))}};const N=(0,h.A)(P,[["render",q]]);var B=N;const K={class:"to-do"};function J(e,t){return(0,n.uX)(),(0,n.CE)("div",K,t[0]||(t[0]=[(0,n.Fv)('<div class="padding-5-percent"><div class="flex-row"><div class="flex-column"><h2>To-Do:</h2><ul><li class="big-deal"> Attempted to add checkboxes for multiple browsers. The vue app was unable to receive the data for some reason. Spent like 5 hohurs debugging and made no progress. Will come back to this later, when I&#39;m feeling particularly masochistic. </li><li> Add a time estimating loading page after pressing &quot;Run Tests&quot; </li><li>Make the UI not look terrible :D</li><li>Need to start working on homepage components</li><li>Bug: Homepage tests still run on every page</li></ul></div><div class="flex-column"><h2>Completed:</h2><ul><li> Fixed Bug: Some tests don&#39;t trigger the frontend function that marks pages as free from error </li><li> Made it so that server.js controlls list of executed and non-executed tests, rather than leaving that to the individual tests. Made the application run exponentially faster. </li><li> Tests need to be sorted based on the pages with errors, not based on the test - Alec </li><li> Test to check if each page in the navigation has a title containing the dealer name - Alec </li><li> Created a test environment - <a href="https://stone-monkey1.github.io/sokal-qa-playground/">Test Site</a> - Alec </li><li> Test to check if each page in the navigation has a h1 - Alec </li><li> Test to check if each page in the navigation has images with non-repeating alt tags - Alec </li><li>Add a button to copy results - Alec</li><li>Need to make some homepage components to test - Chris</li><li> Test to see if an iframe url contains vimeo or youtube in order to test the video on the page. - Alec </li><li> Created diffrent logic for homepage tests and navbar tests, since the homepage test doesn&#39;t need to run on multiple pages, only the one put in the url space - Alec </li></ul></div></div></div>',1)]))}const $={},M=(0,h.A)($,[["render",J]]);var z=M;const G={key:0,class:"qa-loading"};function Y(e,t,s,o,l,i){return s.visible?((0,n.uX)(),(0,n.CE)("div",G,t[0]||(t[0]=[(0,n.Lk)("div",{class:"loader"},null,-1),(0,n.Lk)("p",null,"Running tests... Please wait.",-1)]))):(0,n.Q3)("",!0)}var Z={name:"QALoading",props:{visible:{type:Boolean,required:!0}}};const ee=(0,h.A)(Z,[["render",Y],["__scopeId","data-v-efcfd9c0"]]);var te=ee,se={components:{QAForm:k,QAHeader:w,QAResults:B,QAToDo:z,QALoading:te},data(){return{results:null,showToDo:!1,loading:!1}},methods:{async runTests({url:e,selectedTests:t}){const s="http://127.0.0.1:3000/run-tests";try{const o=await fetch(s,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({url:e,selectedTests:t})});this.results=await o.json()}catch(o){console.error("❌ Error running tests:",o),this.results={error:"Failed to fetch results"}}finally{this.loading=!1}},toggleToDo(e){e&&e.stopPropagation(),console.log("To-Do Panel Visibility PRE:",this.showToDo),this.showToDo=!this.showToDo,console.log("To-Do Panel Visibility POST:",this.showToDo)}}};const oe=(0,h.A)(se,[["render",r]]);var ne=oe;s(323);(0,o.Ef)(ne).mount("#app")},6742:function(e,t,s){e.exports=s.p+"img/sokal-logo.93fe549b.png"}},t={};function s(o){var n=t[o];if(void 0!==n)return n.exports;var l=t[o]={exports:{}};return e[o].call(l.exports,l,l.exports,s),l.exports}s.m=e,function(){var e=[];s.O=function(t,o,n,l){if(!o){var i=1/0;for(u=0;u<e.length;u++){o=e[u][0],n=e[u][1],l=e[u][2];for(var r=!0,a=0;a<o.length;a++)(!1&l||i>=l)&&Object.keys(s.O).every((function(e){return s.O[e](o[a])}))?o.splice(a--,1):(r=!1,l<i&&(i=l));if(r){e.splice(u--,1);var c=n();void 0!==c&&(t=c)}}return t}l=l||0;for(var u=e.length;u>0&&e[u-1][2]>l;u--)e[u]=e[u-1];e[u]=[o,n,l]}}(),function(){s.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return s.d(t,{a:t}),t}}(),function(){s.d=function(e,t){for(var o in t)s.o(t,o)&&!s.o(e,o)&&Object.defineProperty(e,o,{enumerable:!0,get:t[o]})}}(),function(){s.g=function(){if("object"===typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"===typeof window)return window}}()}(),function(){s.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)}}(),function(){s.p=""}(),function(){var e={524:0};s.O.j=function(t){return 0===e[t]};var t=function(t,o){var n,l,i=o[0],r=o[1],a=o[2],c=0;if(i.some((function(t){return 0!==e[t]}))){for(n in r)s.o(r,n)&&(s.m[n]=r[n]);if(a)var u=a(s)}for(t&&t(o);c<i.length;c++)l=i[c],s.o(e,l)&&e[l]&&e[l][0](),e[l]=0;return s.O(u)},o=self["webpackChunkfrontend"]=self["webpackChunkfrontend"]||[];o.forEach(t.bind(null,0)),o.push=t.bind(null,o.push.bind(o))}();var o=s.O(void 0,[504],(function(){return s(9972)}));o=s.O(o)})();
//# sourceMappingURL=app.41eb05ff.js.map