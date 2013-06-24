var self;
module.exports = exports = self = {};

self.magicMarkerName = "@internal-ref";
self.deserializationError = {"@internal-error": "Invalid Deserialization Reference"};

self.stringify = function(obj, replacer){
	var returnStr = JSON.stringify(self.preprocess(obj), replacer);
	self.postprocess(obj);
	return returnStr;
};

self.parse = function(str, reviver){
	return self.postprocess(JSON.parse(str, reviver));
};

self.preprocess = function(obj){
	var visited = [obj];
	var paths = [""];
	var path = "";
	var process = function(lobj, lpath){
		for(var k in lobj){
			var localpath = lpath;
			if(localpath != "")
				localpath += ".";
			localpath += k;
			if(typeof(lobj[k]) == "object"){
				if(visited.indexOf(lobj[k]) >= 0){
					var targetPath = paths[visited.indexOf(lobj[k])];
					lobj[k] = {};
					lobj[k][self.magicMarkerName] = targetPath;
				}else{
					visited.push(lobj[k]);
					paths.push(localpath);
					process(lobj[k], localpath);
				}
			}
		}
	};
	process(obj, path);
	return obj;
};

self.postprocess = function(obj){
	var fetchTargetRef = function(lobj, targetPath){
		if(targetPath.indexOf('.') >= 0){
			var pathFragment = targetPath.substr(0, targetPath.indexOf('.'));
			if(pathFragment in lobj){
				var newPath = targetPath.substr(targetPath.indexOf('.')+1);
				return fetchTargetRef(lobj[pathFragment], newPath);
			}else{
				return self.deserializationError;
			}
		}else{
			if(targetPath == ""){
				return lobj;
			}else if(targetPath in lobj){
				return lobj[targetPath];
			}else{
				return self.deserializationError;
			}
		}
	};
	var process = function(lobj){
		for(var k in lobj){
			if(typeof(lobj[k]) == "object"){
				if(self.magicMarkerName in lobj[k]){
					var targetPath = lobj[k][self.magicMarkerName];
					lobj[k] = fetchTargetRef(obj, targetPath);
				}else{
					process(lobj[k]);
				}
			}
		}
	};
	process(obj);
	return obj;
};
