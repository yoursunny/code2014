/* ***** BEGIN LICENSE BLOCK *****
 * Version: NPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Netscape Public License
 * Version 1.1 (the "License"); you may not use this file except in
 * compliance with the License. You may obtain a copy of the License at
 * http://www.mozilla.org/NPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is JavaScript for Wireless Markup Language emulation
 *
 * Contributor(s):
 *      Raoul Nakhmanson-Kulish <manko@zhurnal.ru>
 *      Matthew Wilson <matthew@mjwilson.demon.co.uk>
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or 
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the NPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the NPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */

/**
 * Extract a value from the document. Expects to find the value in either
 * an "input" or "select" element.
 * @param val Element ID to look for in document
 * @param mode "href" or "value". If mode is "href", URL-escapes the values,
 * and separates multiple select values by "name=". If mode is "value",
 * performs no URL-escaping, and separates * multiple select values by ",".
 * @param name Parameter name used in constructing multiple select values
 * when the mode is "href". Unused otherwise.
 */
function nsWMLgetValue(val,mode,name) {
    var valSrcElement = self.document.getElementById("__wmlbrowser_" + val);
    if (valSrcElement) {
        switch(valSrcElement.nodeName.toLowerCase()) {
            case "input":
                if (mode == "href") {
                    return encodeURIComponent(valSrcElement.value);
                } else {
                    return valSrcElement.value;
                }
            case "select":
                var retVal = "";
                for (var i = 0; i < valSrcElement.options.length; i++) {
                    if (valSrcElement.options[i].selected) {
                        if (retVal!="") {
                            retVal+= (mode == "value") ? "," : ( "&" + name + "=" ) ;
                        }
                        if (mode == "href") {
                            retVal += encodeURIComponent(valSrcElement.options[i].value);
                        } else {
                            retVal += valSrcElement.options[i].value;
                        }
                    }
                }
                return retVal;
        }
    } else return "";
}

/**
 * Convert a value according to the allowed escapings noesc (short form 
 * n), escape (e), and unesc (u).
 */
function nsWMLescape (str, escaping) {
    if (escaping.toLowerCase() == ":escape" || escaping.toLowerCase() == ":e") {
        return encodeURIComponent(str);
    } else if (escaping.toLowerCase() == ":unesc" || escaping.toLowerCase() == ":u") {
        return decodeURIComponent(str);
    } else {
        // noesc or mis-understood escaping
        return str;
    }
}

function nsWMLreplaceValues(str,mode) {
    mode = (mode) ? mode : "href";

    // Match either:
    // an optional = character (only used when mode=href)
    // $*( followed by a variable name optionally followed by an escaping option and then )
    // or
    // $ followed by repeated alpha-numeric characters
    var matcher = /(=?)(?:(\$)?\$\((.*?)(:noesc|:n|:escape|:e|:unesc|:u)?\))|(\$)?\$([\w\d]+)/ig;
    str = str.replace
        (matcher,
         function (lastMatch, s1, s2, s3, s4, s5, s6) {

             // Skip this match if it is has $$
             if (s2 == "$" || s5 == "$") {
                 return lastMatch;
             } 

             // s1 is the opening equals sign, if it is present
             var optionalEquals = s1;
             // valName is the name of part of $(name) or $(name:noesc) or $name
             var valName     = (s3 == "") ? s6 : s3;
             // valEscaping is the noesc part of $(name:noesc)
             var valEscaping = s4;
             // If we are constructing a URL of the form
             // http://domain/path/file?parameter=$value, then extract the
             // parameter name ("parameter" in the example above), so that it can
             // be used to build up the URL if there is a multiple select element
             var valFormName = valName;
             if (mode == "href" && optionalEquals == "=") {
                 var allowedNameChars = /(\w|\.|-|%[\dA-Fa-f]{2})+$/;
                 var namesArray = allowedNameChars.exec(RegExp.leftContext);
                 if (namesArray.length) valFormName = namesArray[0];
             };
            var valValue = (valName != "") ? nsWMLgetValue(valName,mode,valFormName) : "";
            valValue = nsWMLescape (valValue, valEscaping);

            return (optionalEquals + valValue);
         } );

    // Replace $$ with $
    matcher = /\$\$/;
    while (str.match (matcher)) {
        str = str.replace (matcher, "$");
    }

    return str;
}

function nsWMLcheckSelect(selectElement) {
    var inputIvalueElement = selectElement.nextSibling;
    while (inputIvalueElement && inputIvalueElement.nodeType != 1) {
        inputIvalueElement = inputIvalueElement.nextSibling
    }
    if (inputIvalueElement &&
                inputIvalueElement.nodeName.toLowerCase() == "input" &&
                inputIvalueElement.className == "ivalue") {
        var iValue = "";
        for (var i = 0; i < selectElement.options.length; i++) {
            if (selectElement.options[i].selected) {
                if (iValue != "") iValue += ",";
                iValue += i
            }
        }
        inputIvalueElement.value = iValue
    }
}

function nsWMLDisableSelectedCard () {
    /* TODO Get all div elements which are child of body, not just
    all div elements */
    var cards = document.getElementsByTagName ("div");
    for (var ix=0; ix<cards.length; ix++) {
        var card = cards.item(ix);
        if (card.getAttribute ("class") == "card selectedcard") {
            card.setAttribute ("class", "card");
        }
    }
}

function nsWMLSelectCard (id) {
    try {
        document.getElementById (id).setAttribute ("class", "card selectedcard");
    } catch (e) {
        // no action
    }
}

/**
 * Called before a link is loaded.
 * Processes any variables in the link URL.
 * Disables any selected cards in the current document.
 * If the link is local, enables the destination card.
 */
function nsWMLcheckLink(linkElement) {
    // About to load a new link, so disable any selected cards
    nsWMLDisableSelectedCard();

    /* TODO create and use 'originalHref' to avoid memory problems.
    Not before there's a testcase though. */
    linkElement.href = nsWMLreplaceValues(linkElement.href, "href");

    // Check for local link (within document).
    // TODO check all the possible ways to express this
    var current = document.location.href;
    // Replace fragment ids
    current = current.replace (/#.*/, "");

    var target = current + "#";
    // Make the target card selected (if it exists)
    // TODO what happens if the link is to the same page but doesn't have a fragid?
    if (linkElement.href.substring(0,target.length) == target) {
        var id = linkElement.href.substring(1+linkElement.href.lastIndexOf("#"));
        nsWMLSelectCard (id);
    }

    return true;
}

function nsWMLresetForms() {
    var inputsArray=document.getElementsByTagName("input");
    for (var i = 0; i < inputsArray.length; i++) {
        inputsArray[i].value = inputsArray[i].defaultValue;
    }
    var selectsArray=document.getElementsByTagName("select");
    for (var i = 0; i < selectsArray.length; i++) with (selectsArray[i]) {
        for (var j = 0; j < options.length; j++) {
            options[j].selected = options[j].defaultSelected;
        }
    }
}

/**
 * Called before form submission.
 * Manipulate the form's action (target URL) to replace any variables
 * with their values.
 * Iterate over all form fields, replacing any variables with their values.
 * For a GET form only, construct the URL of the target by appending all
 * form field values. (It would be nice if this weren't necessary, but
 * HTML and WML form submission behave differently when the 'action' is
 * a URL of the form url?foo=bar. WML form submission should include the foo
 * value, HTML form submission does not.)
 */
function nsWMLcheckForm(formElement) {
    var methodIsPost =
          (formElement.getAttribute("method") != undefined &&
           formElement.getAttribute("method").toLowerCase() == "post");

    // Start with a fresh copy of the form's "action", by fetching it from
    // "origaction". (Otherwise, after submitting a form and then going back,
    // the originally-submitted form values would still be present.)
    formElement.setAttribute ("action", nsWMLreplaceValues(formElement.getAttribute("origaction"), "href"));
    try {
        var action = formElement.getAttribute ("action");
        for (var i = 0; i < formElement.elements.length; i++) {
            if (formElement.elements[i].type == "hidden" && formElement.elements[i].name) {
                formElement.elements[i].name  = nsWMLreplaceValues(formElement.elements[i].name,"value");
                formElement.elements[i].value = nsWMLreplaceValues(formElement.elements[i].getAttribute("origvalue"),"value");
                if (!methodIsPost) {
                    if (action.indexOf("?") < 0) {
                        action += "?";
                    } else {
                        action += "&";
                    }
                    action += encodeURIComponent(formElement.elements[i].name) + "=" + encodeURIComponent(formElement.elements[i].value);
                }
            }
        }
    } catch (e) {
        window.alert ("Problem in wmlbrowser extension processing: " + e);
    }
    // For a GET form, we simply change our location, bypassing HTML form submission
    if (!methodIsPost) {
        location.href=action;
    }
    return methodIsPost;
}

// TODO multiple onevents, one timer per card
var onevents = {} ;
var wmlTimer;
function nsWMLStartTimer (timerValue) {
    // Timer values are specified in tenths of a second; parameters to
    // setTimeout are specified in ms
    wmlTimer = window.setTimeout (nsWMLTimerExpired, timerValue * 100);
}

function nsWMLTimerExpired () {
    if (onevents.go != undefined) {
        var form = document.getElementById (onevents.go);
        var shouldSubmit = nsWMLcheckForm (form);
        if (shouldSubmit) {
            form.submit();
        } 
    }
}

function nsWMLRegisterTimer (action, target) {
    onevents[action] = target;
}

function nsWMLOnLoad () {
    var href = document.location.href;
    var card = undefined;
    if (href.indexOf ("#") > 0) {
        var fragment = href.substring (1+href.indexOf("#"));
        card = document.getElementById (fragment);
    } else {
        // First card in form
        var card = document.getElementsByTagName ("div").item(0);
    }
    if (card != undefined) {
        card.setAttribute ("class", "card selectedcard");
/*
        try {
            card.onload ();
        } catch (e) {
            //window.alert(e);
        }
*/
    }
}
