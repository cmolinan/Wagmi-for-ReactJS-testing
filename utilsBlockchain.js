import { ethers } from "ethers";

const decodeEventData = (resultsReceipt, eventName, abi) => {

  //Obtain the signature (a hash) of a event
  const getEventSignature = (eventName, abi) => {
    const eventAbi = abi.find(item => item?.name === eventName && item?.type === 'event');
    const paramTypes = eventAbi?.inputs?.map(input => input?.type);
    const eventWithTypes= eventName + "("+ paramTypes.join(',') +  ")"
    return ethers.id(eventWithTypes);
  }
  
  const event = resultsReceipt.data.logs.find(log => 
    log.topics[0] === getEventSignature(eventName, abi));

  if (event) {
    const contract = new ethers.Interface(abi);
    const decodedEventFieldNames = contract.getEvent(eventName).inputs;
    const decodedEventValues = contract.decodeEventLog(eventName, event.data, event.topics);
    
    const jsonObject = {};
    
    // Fill field names and values
    decodedEventFieldNames.forEach((field, index) => {
      jsonObject[field.name] = decodedEventValues[field.name];
    });

    return jsonObject; // Returns JSON object
  }
  return null;
};

export { decodeEventData }
