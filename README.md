JSON-Circular
=============

Simple Node.js library to allow for serialization and deserialization (JSON or otherwise) of JS objects containing circular or internal references


A simple example:
```JavaScript
var JsonCircular = require('json-circular');
var demoObj = {"data": []};
demoObj.parent = demoObj;
demoObj.data.push(demoObj);
var json = JsonCircular.stringify(demoObj);
var demoObj2 = JsonCircular.parse(json);
```

If JSON is not the desired object serialisation method, the library can be used to prepare objects for serialisation, and restore the object after deserialisation.
Warning: the library will modify the original object in preparation for serialisation, though it can be restored by running the post-processor on the object when serializaztion is complete:
```JavaScript
var JsonCircular = require('json-circular');
var demoObj = {"data": []};
demoObj.parent = demoObj;
demoObj.data.push(demoObj);

//This will modify demoObj
JsonCircular.preprocess(demoObj);

var serializedStr = MyCustomSerializationFunction(demoObj);

//This will restore demoObj to it's original state
JsonCircular.postprocess(demoObj);

//For de-serialization
var demoObj2 = MyCustomDeserializationFunction(serializedStr);
JsonCircular.postprocess(demoObj2);
```

The preprocess and postprocess methods return the object that is passed in, so can be stacked thusly:
```JavaScript
var demoObj2 = JsonCircular.postprocess(MyCustomDeserializationFunction(demoObj2));
```

###Configuration
The library has two configuration options, exposed as fields in the JsonCircular object.
 - magicMarkerName - the name of the key used to indicate a magic internal reference marker, this should never appear in an object to be serialized. Note: this MUST be the same for both serialization and deserialization, whatever it is set to. Default: @internal-ref
 - deserializationError - the indicator used when an internal reference can't be resolved during deserialization. This should never happen, but just in case. Default: {"@internal-error": "Invalid Deserialization Reference"}

