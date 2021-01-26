// This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
// Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
// session persistence, api calls, and more.
const Alexa = require('ask-sdk-core');
var http = require('http');
var https = require('https');
/////////////////////////////////////////////////////////////////////////////////////////////////////////
const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
             return handlerInput.responseBuilder
            .speak("Hello Sailors!")
            .reprompt("what's up move with plan or logs !")
            .getResponse()
    }
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function httpGet(options) {
  return new Promise(((resolve, reject) => {
    const request = http.request(options, (response) => {
      response.setEncoding('utf8');
      let returnData = '';
      if (response.statusCode < 200 || response.statusCode >= 300) {
        return reject(new Error(`${response.statusCode}: ${response.req.getHeader('host')} ${response.req.path}`));
      }
      response.on('data', (chunk) => {
        returnData += chunk;
      });
      response.on('end', () => {
          console.log(returnData);
          if(returnData === '4')
          { 
           resolve("logged !");
          }
          else if(returnData === '1')
          {
            resolve("Plan added successfully!");

          }
           else if(returnData === '2')
          {
            resolve("sorry there is problem in taking your plan please try again !");

          }
             else if(returnData === '3')
          {
            resolve("I already have that plan");

          }
          else if(returnData === '5')
          {
            resolve("there is problem logging!")
          }
          else if(returnData === '6')
          {
            resolve("there is no plan for this log")
          }
          else if(returnData === '7')
          {
            resolve("no plan found for this ID")
          }
          else if(returnData === '8')
          {
            resolve("please repeat log with valid activity !")
          }
          else if(returnData === '9')
          {
            resolve("problem in network please try again")
          }
          else if(returnData === '45')
          {
              resolve("can't reach user")
          }
          else if(returnData === '47')
          {
              resolve("I can't reach your server please check your system and repeat your log!")
          }
          else if(returnData === '17')
          {
              resolve("plan added sucessfully")
          }
          else if(returnData === "metrics"){
              resolve("please repeat log with valid activity")
          }
          else{
                var ret =returnData.split("-");
               if(ret[0]==="metrics")
               {
                   resolve("sorry i cant understand "+ret[1]+" please repeat metric with valid one !")
               }
               else if(ret[0]==="unit")
               {
                   resolve("sorry i cant understand "+ret[1]+" please repeat unit with valid one !")
               }
               else if(ret[0]==="values")
               {
                resolve("sorry i cant understand "+ret[1]+" please repeat value with valid one !")
               }
               else{
                    resolve("there is problem in network please tryagain!");
               }
          }
      });
      response.on('error', (error) => {
        reject(error);
      });
    });
    request.on('error', function (error) {
      reject(error);
    });
    request.end();
  }));
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function workerstatus(options,postData) {
  return new Promise(((resolve, reject) => {
    const request = http.request(options, (response) => {
      response.setEncoding('utf8');
      let returnData = '';
      if (response.statusCode < 200 || response.statusCode >= 300) {
        return reject(new Error(`${response.statusCode}: ${response.req.getHeader('host')} ${response.req.path}`));
      }
      response.on('data', (chunk) => {
        returnData += chunk;
      });
      response.on('end', () => {
          console.log(returnData);
           var json=JSON.parse(returnData);
           console.log(json);
                if(json['response']==='11')
           {
                 console.log(json);
                 resolve("There is no report for give id "+'<break time="1s"/>' +" please give an valid one ");
           }
           else{
           let completedwork='';
           let incompletework = '';
           let progess='';
           let done = '';
           let undone = '';
           progess = "you have completed "+json['report'][0]['progress']+"% of work."+'<break time="1s"/>'
		   done=json['report'][0]['done']
		   undone=json['report'][0]['undone']
		   console.log(progess)
		   console.log(done)
		   console.log(undone)
		 for (var i = 0; i < done.length; i++) {
		     completedwork += done[i]+'<break time="1s"/>'+'\n';
		 }
			 for ( i = 0; i < undone.length; i++) {
			     
			     incompletework += undone[i]+'<break time="1s"/>'+'\n';
			 }
			 if(incompletework === "")
			 {
			     incompletework =" are nothing !"
			 }
          
         resolve("Your current status is--"+progess+" Completed works are "+completedwork+" Remaining tasks are "+incompletework);
      }
      });

      response.on('error', (error) => {
        reject(error);
      });
    });
    request.write(postData)
    request.end();
  }));
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const plan = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'plan';
    },
    handle(handlerInput) {
        const metrics = handlerInput.requestEnvelope.request.intent.slots.metrics.value;
        const metric = metrics.replace(/\s/g, '');
        const value = handlerInput.requestEnvelope.request.intent.slots.counter.value;
        const plans = handlerInput.requestEnvelope.request.intent.slots.plans.value;
        const unit = handlerInput.requestEnvelope.request.intent.slots.unit.value;
        const userid = handlerInput.requestEnvelope.context.System.user.userId;
       var tag = handlerInput.requestEnvelope.request.intent.slots.any.value;
        var options;
        if(tag !== undefined)
        {
        tag = tag.replace(/\s/g, '');
        console.log('You just triggered '+metric+unit+value+plans+tag);
         if(metric  !== undefined && unit !== undefined && value !== undefined && tag !== undefined)
        {
            console.log("muv");
            options = {
                host: '167.71.157.72',
                port: 80,
                path: '/mvu?metric='+metric+"&value="+value+"&unit="+unit+"&userid="+userid+"&workerid="+tag+"&type=plan",
                method: 'GET'
                
            };
            return new Promise((resolve, reject) => {
                httpGet(options).then((response) => {
                    resolve(handlerInput.responseBuilder.speak(response).reprompt("you can continue by telling plans or start logging").getResponse());
                }).catch((error) => {
        resolve(handlerInput.responseBuilder.speak('There is an problem in network please try again with your plan ').reprompt("you can continue by telling plans or start logging").getResponse());
      });
    });
        }
        else if(metric !== undefined && value !== undefined && tag !== undefined && unit === undefined)
        {
            console.log("mv");
            options = {
                host: '167.71.157.72',
                port: 80,
                path: '/mv?metric='+metric+"&value="+value+"&userid="+userid+"&workerid="+tag+"&type=plan",
                method: 'GET'
    };
    return new Promise((resolve, reject) => {
        httpGet(options).then((response) => {
       resolve(handlerInput.responseBuilder.speak(response).reprompt("you can proceed with your logs").getResponse());
     }).catch((error) => {
        resolve(handlerInput.responseBuilder.speak('There is an  problem in network please try again with your plan ').reprompt("proceed with your logs").getResponse());
      });
    });
        }
        else if (metric !== undefined && tag !== undefined ){
     options = {
      host: '167.71.157.72',
      port: 80,
      path: '/m?metric='+metric+"&userid="+userid+"&workerid="+tag+"&type=plan",
      method: 'GET'
    };
    return new Promise((resolve, reject) => {
        httpGet(options).then((response) => {
       resolve(handlerInput.responseBuilder.speak(response).reprompt("you can proceed with your logs").getResponse());
     }).catch((error) => {
        resolve(handlerInput.responseBuilder.speak('There is an problem in network please try again with your plan').reprompt("proceed with your logs").getResponse());
      });
    });
        }
        else{
            return handlerInput.responseBuilder
            .speak("provide a valid plan")
            .reprompt("please provide tag to proceed")
            .getResponse()
        }
        }
        else{
            return handlerInput.responseBuilder
            .speak("please say the last 4 number of the license plate with your plan")
            .reprompt("please say the last 4 number of the license plate with your plan")
            .getResponse()
        }
    },
};
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const log={
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'log';
    },
    handle(handlerInput) {
        const metrics = handlerInput.requestEnvelope.request.intent.slots.metrics.value;
        const metric = metrics.replace(/\s/g, '');
        const value = handlerInput.requestEnvelope.request.intent.slots.counters.value;
        var tag = handlerInput.requestEnvelope.request.intent.slots.any.value;
        const unit = handlerInput.requestEnvelope.request.intent.slots.unit.value;
        const userid = handlerInput.requestEnvelope.context.System.user.userId;
        var options;
        if(tag !== undefined)
        {
        tag = tag.replace(/\s/g, '');
        console.log(`You just triggered ${metric}'+'${unit}'+'${value}`);
         if(metric !== undefined && tag !== undefined && unit === 'level' && value !== undefined)
        {
            if(parseInt(value) < 10)
            {
     options = {
      host: '167.71.157.72',
      port: 80,
      path: '/mvu?metric='+metric+"&unit="+unit+"&value="+value+"&userid="+userid+"&workerid="+tag+"&type=log",
      method: 'GET'
    };
    return new Promise((resolve, reject) => {
        httpGet(options).then((response) => {
       resolve(handlerInput.responseBuilder.speak(response).reprompt("you can proceed with your logs").getResponse());
     }).catch((error) => {
        resolve(handlerInput.responseBuilder.speak('There problem in network please try again with your log').reprompt("proceed with your logs").getResponse());
      });
    });
            }
            else
            {
             return handlerInput.responseBuilder
            .speak("please provide level in range of 1 to 10")
            .reprompt("please provide level in range of 1 to 10")
            .getResponse();
                
            }
        }
        else if(metric  !== undefined && unit !== undefined && value !== undefined && tag !== undefined )
        {
            console.log("muv");
            options = {
                host: '167.71.157.72',
                port: 80,
                path: '/mvu?metric='+metric+"&value="+value+"&unit="+unit+"&userid="+userid+"&workerid="+tag+"&type=log",
                method: 'GET'
                
            };
            return new Promise((resolve, reject) => {
                httpGet(options).then((response) => {
                    resolve(handlerInput.responseBuilder.speak(response).reprompt("you can proceed with your logs").getResponse());
                }).catch((error) => {
        resolve(handlerInput.responseBuilder.speak('There problem in network please try again with your log ').reprompt("proceed with your logs").getResponse());
      });
    });
        }
        else if(metric !== undefined && value !== undefined && tag !== undefined && unit === undefined)
        {
            console.log("mv");
            options = {
                host: '167.71.157.72',
                port: 80,
                path: '/mv?metric='+metric+"&value="+value+"&userid="+userid+"&workerid="+tag+"&type=log",
                method: 'GET'
    };
    return new Promise((resolve, reject) => {
        httpGet(options).then((response) => {
       resolve(handlerInput.responseBuilder.speak(response).reprompt("you can proceed with your logs").getResponse());
     }).catch((error) => {
        resolve(handlerInput.responseBuilder.speak('There problem in network please try again with your log').reprompt("proceed with your logs").getResponse());
      });
    });
        }

        else if(metric !== undefined && tag !== undefined && unit === undefined && value === undefined)
        {
            options = {
      host: '167.71.157.72',
      port: 80,
      path: '/m?metric='+metric+"&userid="+userid+"&workerid="+tag+"&type=log",
      method: 'GET'
    };
    return new Promise((resolve, reject) => {
        httpGet(options).then((response) => {
       resolve(handlerInput.responseBuilder.speak(response).reprompt("you can proceed with your logs").getResponse());
     }).catch((error) => {
        resolve(handlerInput.responseBuilder.speak('There problem in network please try again with your log').reprompt("proceed with your logs").getResponse());
      });
    });
        }
        else{
            return handlerInput.responseBuilder
            .speak("provide a valid log")
            .reprompt("you can proceed with your log")
            .getResponse();
        }
        }
        else{
             return handlerInput.responseBuilder
            .speak("please say the last 4 number of the license plate with your log")
            .reprompt("please say the last 4 number of the license plate with your log")
            .getResponse();
        }
    },
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const status = {
        canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'status';
    },
    handle(handlerInput) {
        let speakOutput;
       const status = handlerInput.requestEnvelope.request.intent.slots.statuses.value;
       const userid = handlerInput.requestEnvelope.context.System.user.userId;
       const  tag= handlerInput.requestEnvelope.request.intent.slots.tag.value;
       if(tag !== undefined)
       {
             var postData = JSON.stringify({
               id : tag,
               type : "Status"
           })
           var options = {
               hostname: "139.59.77.161",
               path: "/services/get",
               port : 80,
               method: "POST",
               headers: {
                   'Content-Type':'application/json'
               }
           }
        return new Promise((resolve, reject) => {
        workerstatus(options,postData).then((response) => {
       resolve(handlerInput.responseBuilder.speak(response).reprompt("you can proceed with your logs").getResponse());
     }).catch((error) => {
        resolve(handlerInput.responseBuilder.speak('problem in server connection ').reprompt("proceed with your logs").getResponse());
      });
    });
       }
       else{
             return handlerInput.responseBuilder
            .speak("please say the last 4 number of the license plate ")
            .reprompt("please say the last 4 number of the license plate")
            .getResponse()
       }
    }
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'You can say hello to me! How can I help?';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speakOutput = 'Goodbye!';
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse();
    }
};

// The intent reflector is used for interaction model testing and debugging.
// It will simply repeat the intent the user said. You can create custom handlers
// for your intents by defining them above, then also adding them to the request
// handler chain below.
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `You just triggered ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};

// Generic error handling to capture any syntax or routing errors. If you receive an error
// stating the request handler chain is not found, you have not implemented a handler for
// the intent being invoked or included it in the skill builder below.
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        console.log(`~~~~ Error handled: ${error.stack}`);
        const speakOutput = `Sorry, I had trouble doing what you asked. Please try again.`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

// The SkillBuilder acts as the entry point for your skill, routing all request and response
// payloads to the handlers above. Make sure any new handlers or interceptors you've
// defined are included below. The order matters - they're processed top to bottom.
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        plan,
        log,
        status,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler, // make sure IntentReflectorHandler is last so it doesn't override your custom intent handlers
    )
    .addErrorHandlers(
        ErrorHandler,
    )
    .lambda();
